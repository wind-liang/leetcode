/*********************************************************************
 *
 *  mj-page-svg.js
 *
 *  Implements an API to MathJax in node.js so that MathJax can be
 *  used server-side to generate SVG, MathML, or images (the latter
 *  requires an external library, batik, to do the svg to png
 *  conversion).  This API accepts HTML snippets that have their
 *  math content converted to SVG's.
 *
 * ----------------------------------------------------------------------
 *
 *  Copyright (c) 2014 The MathJax Consortium
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var fmt = require('util').format;
var jsdom = require('jsdom').jsdom;
var execFile = require('child_process').execFile;
var speech = require('speech-rule-engine');
var os = require('os');

require('./patch/jsdom.js').patch(jsdom);  //  Fix some bugs in jsdom

var displayMessages = false;      // don't log Message.Set() calls
var displayErrors = true;         // show error messages on the console
var undefinedChar = false;        // unknown characters are not saved in the error array
var extensions = '';              // no additional extensions used
var fontURL = 'https://cdn.mathjax.org/mathjax/latest/fonts/HTML-CSS';  // location of web fonts for CHTML

var defaults = {
  ex: 6,                          // ex-size in pixels
  width: 100,                     // width of container (in ex) for linebreaking and tags
  useFontCache: true,             // use <defs> and <use> in svg output?
  useGlobalCache: true,           // use common <defs> for all equations?
  linebreaks: false,              // do linebreaking?
  equationNumbers: "none",        // or "AMS" or "all"
  singleDollars: true,            // allow single-dollar delimiter for inline TeX?

  html: "",                       // the HTML snippet to process

  xmlns: "mml",                   // the namespace to use for MathML
  inputs: ["AsciiMath","TeX","MathML"],  // the inputs formats to support
  renderer: "SVG",                // the output format
                                  //    ("SVG", "NativeMML", "IMG", "PNG", or "None")
  dpi: 144,                       // dpi for png image

  addPreview: false,              // turn turn into a MathJax preview, and keep the jax
  removeJax: true,                // remove MathJax <script> tags?

  speakText: false,               // add spoken annotations to svg output?
  speakRuleset: "mathspeak",      // set speech ruleset (default (chromevox rules), mathspeak)
  speakStyle: "default",          // set speech style (mathspeak:  default, brief, sbrief)

  timeout: 60 * 1000,             // 60 second timeout before restarting MathJax
};

//
//  The MathJax server states
//
var STATE = {
  STOPPED: 1,          // no DOM or MathJax available
  STARTED: 2,          // DOM loaded, MathJax starting up
  READY:   3,          // MathJax initialized and ready to process math
  BUSY:    4           // MathJax currently processing math
};

//
// The MathJaxPath is normaized against file:/// so that Windows paths are correct
//
var MathJaxPath = url.resolve("file:///","file:"+require.resolve('mathjax/unpacked/MathJax'));
var BatikRasterizerPath = path.resolve(__dirname,'..','batik/batik-rasterizer.jar');
var MathJaxConfig;                 // configuration for when starting MathJax
var MathJax;                       // filled in once MathJax is loaded
var serverState = STATE.STOPPED;   // nothing loaded yet
var timer;                         // used to reset MathJax if it runs too long

var tmpfile = os.tmpdir() + "/mj-single-svg" +  process.pid;  // file name prefix to use for temp files

var document, window, content, html; // the DOM elements

var queue = [];       // queue of typesetting requests of the form [data,callback]
var data, callback;   // the current queue item
var errors = [];      // errors collected durring the typesetting

var SELECTOR = {
  TeX: ["math/tex","math/tex; mode=display"],
  MathML: ["math/mml"],
  AsciiMath: ["math/asciimath"]
};

var SVGSTYLES;           // filled in when SVG is loaded
var CHTMLSTYLES;         // filled in when CommonHTML is loaded

/********************************************************************/

//
//  Create the DOM window and set up the console wtihin it
//  Add an error handler to trap unexpected errors (requires
//    modifying jsdom)
//  Add a <div> where we can put the math to be typeset
//    and typeset math in the three formats we use (to force
//    the jax to be loaded completely)
//
function GetWindow() {
  document = jsdom();
  html = document.firstChild;
  window = document.defaultView;
  window.console = console;
  window.addEventListener("error",function (event) {
    AddError("Error: "+event.message+"\n   stack: "+event.error.stack);
  });
  content = document.body.appendChild(document.createElement("div"));
  content.id = "MathJax_Content";
  content.innerHTML = "$x$ `x` <math><mi>x</mi></math>";
  //
  //  Node's url.resolve() has a problem with resolving a file:// URL when
  //  the base URL is "about:blank", so force it to be something else (HACK)
  //  since jsdom 3.x sets the base to "about:blank".
  //
  if (document._URL === "about:blank") document._URL = "file:///blank.html";
}

//
//  Set up a Mathjax configuration within the window
//
function ConfigureMathJax() {
  window.MathJax = {
    //
    //  Load all input jax and preprocessors
    //  Load AMS extensions and the autoload extension for TeX
    //  Allow $...$ delimiters and don't create previews for any preprocessor,
    //  Create stand-alone SVG elements with font caches by default
    //    (users can override that)
    //
    jax: ["input/TeX", "input/MathML", "input/AsciiMath", "output/SVG", "output/NativeMML", "output/CommonHTML"],
    extensions: ["tex2jax.js","mml2jax.js","asciimath2jax.js","toMathML.js"],
    TeX: {extensions: window.Array("AMSmath.js","AMSsymbols.js","autoload-all.js")},
    tex2jax: {inlineMath: [['$','$'],['\\(','\\)']], preview:"none"},
    mml2jax: {preview:"none"},
    asciimath2jax: {preview:"none"},
    SVG: {useFontCache: true, useGlobalCache: false, EqnChunk: 1000000, EqnDelay: 0},
    CommonHTML: {EqnChunk: 1000000, EqnDelay: 0, undefinedFamily:"monospace"},

    //
    //  This gets run before MathJax queues any actions
    //
    AuthorInit: function () {
      MathJax = window.MathJax;

      delete MathJax.Hub.config.styles;               // don't need any styles
      MathJax.Hub.Startup.MenuZoom = function () {};  // don't load menu or zoom code
      MathJax.Extension.MathEvents = {
        Event:{}, Touch:{}, Hover:{}                  // fake structure to avoid errors
      };
      MathJax.Ajax.loaded[MathJax.Ajax.fileURL("[MathJax]/extensions/MathEvents.js")] = true;

      //
      //  When creating stylesheets, no need to wait for them
      //  to become active, so just do the callback
      //
      MathJax.Ajax.timer.create = function (callback,node) {
        callback = MathJax.Callback(callback);
        callback(this.STATUS.OK);
        return callback;
      };

      //
      //  Use the console for messages, if we are requesting them
      //
      MathJax.Message.Set = function (text,n,delay) {
        if (displayMessages && n !== 0) {
          if (text instanceof window.Array)
            {text = MathJax.Localization._.apply(MathJax.Localization,text)}
          console.error(text);
        }
      };
      MathJax.Message.Clear = function () {};
      MathJax.Message.Remove = function () {};
      MathJax.Message.Init = function () {};

      //
      //  Trap Math Processing Errors
      //
      MathJax.Hub.Register.MessageHook("Math Processing Error",function (message) {
        AddError("Math Processing Error",message[2].message);
      });
      MathJax.Hub.Register.MessageHook("SVG Jax - unknown char",function (message) {
        AddError("Unknown character","U+"+message[1].toString(16).toUpperCase()+
                    " in "+(message[2].fonts||["unknown"]).join(","),!undefinedChar);
      });
      MathJax.Hub.Register.MessageHook("MathML Jax - unknown node type",function (message) {
        AddError("MathML unknown node type",message[1]);
      });
      MathJax.Hub.Register.MessageHook("MathML Jax - parse error",function (message) {
        AddError("MathML",message[1]);
      });
      MathJax.Hub.Register.MessageHook("AsciiMath Jax - parse error",function (message) {
        AddError("AsciiMath parse error",message[1]);
      });
      MathJax.Hub.Register.MessageHook("TeX Jax - parse error",function (message) {
        AddError("TeX parse error",message[1]);
      });
      MathJax.Hub.Register.MessageHook("file load error",function (message) {
        AddError("File load error",message[1]);
      });

      //
      //  Set the delays to 0 (we don't need to update the screen)
      //
      MathJax.Hub.processSectionDelay = 0;
      MathJax.Hub.processUpdateTime = 10000000;  // don't interrupt processing of output
      MathJax.Hub.processUpdateDelay = 0;

      //
      //  Adjust the SVG output jax
      //
      MathJax.Hub.Register.StartupHook("SVG Jax Config",function () {
        var SVG = MathJax.OutputJax.SVG, HTML = MathJax.HTML;

        //
        //  Don't need these styles
        //
        SVGSTYLES = SVG.config.styles;
        delete SVGSTYLES["#MathJax_SVG_Tooltip"];
        delete SVGSTYLES[".MathJax_SVG_Processing"];
        delete SVGSTYLES[".MathJax_SVG_Processed"];
        delete SVGSTYLES[".MathJax_SVG_ExBox"];
        SVGSTYLES = MathJax.Ajax.StyleString(SVGSTYLES);
        delete SVG.config.styles

        SVG.Augment({
          //
          //  Set up the default ex-size and width
          //
          InitializeSVG: function () {
            this.defaultEx    = 6;
            this.defaultWidth = 100;
          },
          //
          //  Adjust preTranslate() to not try to find the ex-size or
          //  the container widths.
          //
          preTranslate: function (state) {
            var scripts = state.jax[this.id], i, m = scripts.length,
                script, prev, span, div, jax, ex, em,
                maxwidth = 100000, relwidth = false, cwidth,
                linebreak = this.config.linebreaks.automatic,
                width = this.config.linebreaks.width;
            //
            //  Loop through the scripts
            //
            for (i = 0; i < m; i++) {
              script = scripts[i]; if (!script.parentNode) continue;
              //
              //  Remove any existing output
              //
              prev = script.previousSibling;
              if (prev && String(prev.className).match(/^MathJax(_SVG)?(_Display)?( MathJax(_SVG)?_Processing)?$/))
                {prev.parentNode.removeChild(prev)}
              //
              //  Add the span, and a div if in display mode,
              //  then set the role and mark it as being processed
              //
              jax = script.MathJax.elementJax; if (!jax) continue;
              jax.SVG = {display: (jax.root.Get("display") === "block")}
              span = div = HTML.Element("span",{
                style: {"font-size": this.config.scale+"%", display:"inline-block"},
                className:"MathJax_SVG", id:jax.inputID+"-Frame", isMathJax:true, jaxID:this.id
              });
              if (jax.SVG.display) {
                div = HTML.Element("div",{className:"MathJax_SVG_Display"});
                div.appendChild(span);
              }
              div.className += " MathJax_SVG_Processing";
              script.parentNode.insertBefore(div,script);
              //
              //  Set SVG data for jax
              //
              jax.SVG.ex = ex = (data||defaults).ex;
              jax.SVG.em = em = ex / SVG.TeX.x_height * 1000; // scale ex to x_height
              jax.SVG.cwidth = width / em * 1000;
              jax.SVG.lineWidth = (linebreak ? width / em *1000 : SVG.BIGDIMEN);
            }
            //
            //  Set state variables used for displaying equations in chunks
            //
            state.SVGeqn = state.SVGlast = 0; state.SVGi = -1;
            state.SVGchunk = this.config.EqnChunk;
            state.SVGdelay = false;
          }
        });

        //
        //  TEXT boxes use getBBox, which isn't implemented, so
        //  use a monspace font and fake the size.  Since these
        //  are used only for error messages and undefined characters,
        //  this should be good enough for now.
        //
        SVG.BBOX.TEXT.Augment({
          Init: function (scale,text,def) {
            if (!def) {def = {}}; def.stroke = "none";
            if (def["font-style"] === "") delete def["font-style"];
            if (def["font-weight"] === "") delete def["font-weight"];
            this.SUPER(arguments).Init.call(this,def);
            SVG.addText(this.element,text);
            var bbox = {width: text.length * 8.5, height: 18, y: -12};
            scale *= 1000/SVG.em;
            this.element.setAttribute("font-family","monospace");
            this.element.setAttribute("transform","scale("+scale+") matrix(1 0 0 -1 0 0)");
            this.w = this.r = bbox.width*scale; this.l = 0;
            this.h = this.H = -bbox.y*scale;
            this.d = this.D = (bbox.height + bbox.y)*scale;
          }
        });

      });

      //
      //  Adjust the CommonHTML output jax
      //
      MathJax.Hub.Register.StartupHook("CommonHTML Jax Config",function () {
        var CHTML = MathJax.OutputJax.CommonHTML, HTML = MathJax.HTML;

        //
        //  Don't need these styles
        //
        var STYLES = CHTML.config.styles;
        delete STYLES["#MathJax_CHTML_Tooltip"];
        delete STYLES[".MJXc-processing"];
        delete STYLES[".MJXc-processed"];
        delete STYLES[".mjx-chartest"];
        delete STYLES[".mjx-chartest .mjx-char"];
        delete STYLES[".mjx-chartest .mjx-box"];
        delete STYLES[".mjx-test"];
        delete STYLES[".mjx-ex-boxtest"];

        CHTML.Augment({
          webfontDir: fontURL,
          //
          //  Set up the default ex-size and width
          //
          getDefaultExEm: function () {
            var styles = document.head.getElementsByTagName("style");
            CHTMLSTYLES = styles[styles.length-1].innerHTML;
            this.pxPerInch    = 96;
            this.defaultEx    = 6;
            this.defaultEm    = 6 / CHTML.TEX.x_height * 1000;
            this.defaultWidth = 100;
          },
          //
          //  Adjust preTranslate() to not try to find the ex-size or
          //  the container widths.
          //
          preTranslate: function (state) {
            var scripts = state.jax[this.id], i, m = scripts.length,
                script, prev, node, jax, ex, em,
                maxwidth = 100000, relwidth = false, cwidth = 0,
                linebreak = this.config.linebreaks.automatic,
                width = this.config.linebreaks.width;
            //
            //  Loop through the scripts
            //
            for (i = 0; i < m; i++) {
              script = scripts[i]; if (!script.parentNode) continue;
              //
              //  Remove any existing output
              //
              prev = script.previousSibling;
              if (prev && prev.className && String(prev.className).substr(0,9) === "mjx-chtml")
                prev.parentNode.removeChild(prev);
              //
              //  Add the node for the math and mark it as being processed
              //
              jax = script.MathJax.elementJax; if (!jax) continue;
              jax.CHTML = {display: (jax.root.Get("display") === "block")}
              node = CHTML.Element("mjx-chtml",{
                id:jax.inputID+"-Frame", isMathJax:true, jaxID:this.id
              });
              if (jax.CHTML.display) {
                //
                // Zoom box requires an outer container to get the positioning right.
                //
                var NODE = CHTML.Element("mjx-chtml",{className:"MJXc-display",isMathJax:false});
                NODE.appendChild(node); node = NODE;
              }
              //
              //  Mark math for screen readers
              //    (screen readers don't know about role="math" yet, so use "textbox" instead)
              //
              node.className += " MJXc-processing";
              script.parentNode.insertBefore(node,script);
              //
              //  Set CHTML data for jax
              //
              jax.CHTML.ex = ex = (data||defaults).ex;
              jax.CHTML.em = em = ex / CHTML.TEX.x_height; // scale ex to x_height
              jax.CHTML.cwidth = width / em;
              jax.CHTML.lineWidth = (linebreak ? width / em : CHTML.BIGDIMEN);
              jax.CHTML.scale = 1; jax.CHTML.fontsize = "100%";
            }
            //
            //  Set state variables used for displaying equations in chunks
            //
            state.CHTMLeqn = state.CHTMLlast = 0; state.CHTMLi = -1;
            state.CHTMLchunk = this.config.EqnChunk;
            state.CHTMLdelay = false;
          },

          //
          //  We are using a monospaced font, so fake the size
          //
          getHDW: function (c,name,styles) {
            return {h:.8, d:.2, w:c.length*.5};
          }

        });

      });

      //
      //  A dummy output jax that does nothing (no output).
      //
      MathJax.OutputJax.None = MathJax.OutputJax({
        id: "None",
        version: "1.0",
        directory: MathJax.OutputJax.directory+"/None",
        preProcess: function () {},
        Process: function () {},
        postProcess: function () {}
      });
      MathJax.Ajax.loaded[MathJax.Ajax.fileURL(MathJax.OutputJax.directory+"/None/config.js")] = 1;
      MathJax.Ajax.loaded[MathJax.Ajax.fileURL(MathJax.OutputJax.directory+"/None/jax.js")] = 1;

      //
      //  Start the typesetting queue when MathJax is ready
      //
      MathJax.Hub.Register.StartupHook("End",function () {
        MathJax.OutputJax.None.Register("jax/mml");
	if (!MathJax.Hub.config.menuSettings.semantics) {
	  MathJax.Hub.Register.StartupHook("TeX Jax Ready", function () {
	    MathJax.InputJax.TeX.annotationEncoding = null;
	  });
	  MathJax.Hub.Register.StartupHook("AsciiMath Jax Ready", function () {
	    MathJax.InputJax.AsciiMath.annotationEncoding = null;
	  });
	}
        serverState = STATE.READY;
        MathJax.Hub.Queue(StartQueue);
      });

    }
  };

  if (extensions) {
    //
    // Parse added extensions list and add to standard ones
    //
    var extensionList = extensions.split(/s*,\s*/);
    for (var i = 0; i < extensionList.length; i++) {
      var matches = extensionList[i].match(/^(.*?)(\.js)?$/);
      window.MathJax.extensions.push(matches[1] + '.js');
    }
  }

  //
  //  Turn arrays into jsdom window arrays
  //  (so "instanceof Array" will identify them properly)
  //
  var adjustArrays = function (obj) {
    for (var id in obj) {if (obj.hasOwnProperty(id)) {
      if (obj[id] instanceof Array) {
        var A = window.Array();
        obj[id] = A.concat.apply(A,obj[id]);
      } else if (typeof obj[id] === "object") {
        adjustArrays(obj[id]);
      }
    }}
  }
  if (MathJaxConfig) {
    adjustArrays(MathJaxConfig);
    Insert(window.MathJax,MathJaxConfig);
    if (MathJaxConfig.AuthorInit) MathJaxConfig.AuthorInit();
  }
}

//
//  Insert one objects into another
//
function Insert(dst,src) {
  for (var id in src) {if (src.hasOwnProperty(id)) {
    // allow for concatenation of arrays?
    if (typeof src[id] === 'object' && !(src[id] instanceof Array) &&
       (typeof dst[id] === 'object' || typeof dst[id] === 'function'))
         {Insert(dst[id],src[id])} else {dst[id] = src[id]}
  }}
  return dst;
}


//
//  Load MathJax into the DOM
//
function StartMathJax() {
  serverState = STATE.STARTED;
  var script = document.createElement("script");
  script.src = MathJaxPath;
  script.onerror = function () {AddError("Can't load MathJax.js from "+MathJaxPath)}
  document.head.appendChild(script);
}

/********************************************************************/

//
//  Return an error value (and report it to console)
//
function ReportError(message,currentCallback) {
  AddError(message);
  (currentCallback||callback)({errors: errors});
}

//
//  Add an error to the error list and display it on the console
//
function AddError(prefix,message,nopush) {
  if (message != null) {
    if (MathJax && MathJax.ElementJax) {
      var n = MathJax.ElementJax.ID + 1;
      if (prefix !== "") {prefix += " ("+n+"): "}
    }
    message = prefix+message;
  } else {
    message = prefix;
  }
  if (displayErrors) console.error(message);
  if (!nopush) errors.push(message);
}


/********************************************************************/

//
//  Start typesetting the queued expressions
//
function StartQueue() {
  data = callback = null;       //  clear existing equation, if any
  errors = [];                  //  clear any errors
  if (!queue.length) return     //  return if nothing to do

  serverState = STATE.BUSY;
  var result = {}, $$ = window.Array, HUB = MathJax.Hub;

  //
  //  Get the math data and callback and set the content
  //
  var item = queue.shift();
  data = item[0]; callback = item[1];
  content.innerHTML = data.html;  //  %%% disable <script> tags?
  html.setAttribute("xmlns:"+data.xmlns,"http://www.w3.org/1998/Math/MathML");

  //
  //  Initialize speech engine
  //
  if (data.speakText)
    speech.setupEngine({semantics:true, domain:data.speakRuleset, style:data.speakStyle});

  //
  //  Set up MathJax
  //
  ConfigureTypeset();

  //
  //  Set up a timeout timer to restart MathJax if it runs too long,
  //  Then push the functions to set the renderer, perform the typesetting,
  //  and process the results.
  //
  timer = setTimeout(RestartMathJax,data.timeout);
  HUB.Queue(
    $$(SetRenderer,data.renderer),
    $$("Typeset",HUB),
    $$(TypesetDone),
    $$(AdjustSVG),
    $$(AdjustHTML),
    $$(AdjustMML),
    $$(MakeIMG),
    $$(MakePNG),
    $$(MakePreviews),
    $$(RemoveScripts),
    $$(ReturnResults,result)
  );
}

//
//  Set the SVG, CHTML, and TeX parameters
//  according to the requested data
//
function ConfigureTypeset() {
  var CHTML = MathJax.OutputJax.CommonHTML,
      SVG = MathJax.OutputJax.SVG,
      TEX = MathJax.InputJax.TeX,
      MML = MathJax.ElementJax.mml,
      HUB = MathJax.Hub,
      EXT = MathJax.Extension,
      $$ = window.Array;

  //
  //  Configure SVG and TeX
  //
  SVG.defaultEx = CHTML.defaultEx = data.ex;
  SVG.defaultWidth = CHTMLdefaultWidth = data.width * data.ex;
  SVG.config.linebreaks.automatic = CHTML.config.linebreaks.automatic = data.linebreaks;
  SVG.config.linebreaks.width = CHTML.config.linebreaks.width = data.width * data.ex;
  SVG.config.useFontCache = data.useFontCache;
  SVG.config.useGlobalCache = data.useGlobalCache &&
    data.renderer !== "IMG" && data.renderer !== "PNG";
  TEX.config.equationNumbers.autoNumber = data.equationNumbers;

  //
  //  Set the TeX delimiters
  //
  var delimiters = $$($$('$','$'),$$('\\(','\\)'));
  if (!data.singleDollars) {delimiters.shift()}
  HUB.Config({tex2jax: {inlineMath: delimiters}});

  //
  //  Reset the MathJax counters for things
  //
  SVG.resetGlyphs(true);
  if (TEX.resetEquationNUmbers) TEX.resetEquationNumbers();
  MML.SUPER.ID = 0;

  //
  //  Register the preprocessors and get the jax selector
  //
  var INPUT = {
    TeX: [$$("PreProcess",EXT.tex2jax)],
    AsciiMath: [$$("PreProcess",EXT.asciimath2jax)],
    MathML: [$$("PreProcess",EXT.mml2jax),5]
  };
  HUB.preProcessors.hooks = [];
  for (var i = 0, m = data.inputs.length; i < m; i++) {
    if (INPUT[data.inputs[i]]) HUB.Register.PreProcessor.apply(null,INPUT[data.inputs[i]]);
  }
}

/********************************************************************/

//
//  Set the MathJax renderer
//
function SetRenderer(renderer) {
  if (renderer === "IMG" || renderer === "PNG") renderer = "SVG";
  return MathJax.Hub.setRenderer(renderer);
}

//
//  Clear the timeout and clean up
//
function TypesetDone() {
  if (timer) {clearTimeout(timer); timer = null}
  if (data.renderer === "None") {content.innerHTML = "<p></p>"}
  html.removeAttribute("xmlns:"+data.xmlns);
}

//
//  Clean up the SVG for use in a page without MathJax.
//
function AdjustSVG() {
  var nodes, i, callback;
  if (data.renderer === "SVG" || data.renderer === "IMG" || data.renderer === "PNG") {
    //
    //  Fix missing xlink namespace on href's
    //
    nodes = document.querySelectorAll(".MathJax_SVG use[href]");
    for (i = nodes.length-1; i >= 0; i--) {
      nodes[i].setAttribute("xlink:href",nodes[i].getAttribute("href"));
      nodes[i].removeAttribute("href");
    }
    //
    //  Add speech text, if needed
    //
    if (data.speakText) {callback = GetSpeech()}
  }
  if (data.renderer === "SVG") {
    //
    //  Copy global SVG glyph defs into content
    //
    if (data.useGlobalCache) {
      var defs = document.getElementById("MathJax_SVG_glyphs").parentNode.cloneNode(true);
      defs.style.display = "none";
      content.insertBefore(defs,content.firstChild);
    }
    //
    //  Add styles
    //
    var styles = document.createElement("style");
    styles.innerHTML = SVGSTYLES;
    styles.id="MathJax_SVG_styles";
    content.insertBefore(styles,content.firstChild);
  }
  return callback;
}

//
//  Clean up the HTML for use in a page without MathJax.
//
function AdjustHTML() {
  var nodes, i, callback;
  if (data.renderer === "CommonHTML") {
    //
    //  Add styles
    //
    var styles = document.createElement("style");
    styles.innerHTML = CHTMLSTYLES;
    styles.id="MathJax_CHTML_styles";
    content.insertBefore(styles,content.firstChild);
  }
  return callback;
}

//
//  Add the speech text and mark the SVG appropriately
//
function GetSpeech() {
  var nodes = document.querySelectorAll(".MathJax_SVG svg"), queue;
  var SPEAK = function (svg) {
    var jax = MathJax.Hub.getJaxFor(svg), id = jax.inputID, mml;
    try {mml = jax.root.toMathML('',jax)} catch(err) {
      if (!err.restart) {throw err;} // an actual error
      if (!queue) {queue = MathJax.Callback.Queue()}
      return queue.Push(err.restart,window.Array(SPEAK,svg));
    }
    jax.speech = speech.processExpression(mml);
    svg.setAttribute("role","math");
    svg.setAttribute("aria-labelledby",id+"-Title "+id+"-Desc");
    for (var i = 0, m = svg.childNodes.length; i < m; i++)
      svg.childNodes[i].setAttribute("aria-hidden",true);
    var node = MathJax.HTML.Element("desc",{id:id+"-Desc"},[jax.speech]);
    svg.insertBefore(node,svg.firstChild);
    node = MathJax.HTML.Element("title",{id:id+"-Title"},["Equation"]);
    svg.insertBefore(node,svg.firstChild);
  }
  for (var i = nodes.length-1; i >= 0; i--) SPEAK(nodes[i]);
  if (queue) return queue.Push(function () {}); // wait for all the queue entries to finish
}

//
//  Clean up the MathML for use in a page without MathJax.
//
function AdjustMML() {
  if (data.renderer === "NativeMML") {
    var nodes = document.getElementsByClassName("MathJax_MathML");
    for (var i = nodes.length-1; i >= 0; i--) {
      var math = nodes[i].getElementsByTagName("math")[0]
      nodes[i].parentNode.replaceChild(math,nodes[i]);
      var alttext = speech.processExpression(math.outerHTML.replace(/&nbsp;/g,"\u00A0"));
      if (data.speakText) math.setAttribute("alttext",alttext);
    }
  }
}

//
//  Create IMG node and the associated data URL for the svg image
//
function MakeIMG() {
  if (data.renderer === "IMG") {
    var nodes = document.getElementsByClassName("MathJax_SVG");
    for (var i = nodes.length-1; i >= 0; i--) {
      var svg = nodes[i].getElementsByTagName("svg")[0];
      var w = svg.getAttribute("width"), h = svg.getAttribute("height");
      var css = svg.style.cssText+" width:"+w+"; height:"+h;
      svg.style.cssText = ""; // this will be handled by the <img> tag instead
      svg.setAttribute("xmlns","http://www.w3.org/2000/svg");
      svg = svg.outerHTML.replace(/><([^/])/g,">\n<$1").replace(/(<\/[a-z]*>)(?=<\/)/g,"$1\n");
      svg = new Buffer(svg).toString("base64");  // encode svg as base64
      var img = MathJax.HTML.Element("img",{
       src:"data:image/svg+xml;base64,"+svg, style:{cssText:css},
        className: "MathJax_SVG_IMG",
      });
      if (data.speakText) img.setAttribute("alt",MathJax.Hub.getJaxFor(nodes[i]).speech);
      nodes[i].parentNode.replaceChild(img,nodes[i]);
    }
  }
}

//
//  Make PNG images and attach them to IMG tags
//
function MakePNG() {
  if (data.renderer === "PNG") {
    var synch = MathJax.Callback(function () {});  // for synchronization with MathJax
    var batikCommands = ['-jar', BatikRasterizerPath, '-dpi', data.dpi, tmpfile + '.svg'];
    var tmpSVG = tmpfile+".svg", tmpPNG = tmpfile+".png";
    var nodes = document.getElementsByClassName("MathJax_SVG");
    var check = function (err) {if (err) {AddError(err.message); return true}}
    var PNG = function (i) {
      if (i < 0) return synch(); // signal everything is done
      var svg = nodes[i].getElementsByTagName("svg")[0];
      var w = svg.getAttribute("width"), h = svg.getAttribute("height");
      var css = svg.style.cssText+" width:"+w+"; height:"+h;
      svg.style.cssText = ""; // this will be handled by the <img> tag instead
      svg.setAttribute("xmlns","http://www.w3.org/2000/svg");
      svg = [
        '<?xml version="1.0" standalone="no"?>',
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
        svg.outerHTML
      ].join("\n");
      fs.writeFile(tmpSVG,svg,function (err) {
        if (check(err)) return PNG(i-1);
        execFile('java', batikCommands, function (err,stdout,stderr) {
          if (check(err)) {fs.unlinkSync(tmpSVG); return PNG(i-1)}
          fs.readFile(tmpPNG,null,function (err,buffer) {
            if (!check(err)) {
              var img = MathJax.HTML.Element("img",{
                src:"data:image/png;base64,"+buffer.toString('base64'),
                style:{cssText:css}, className: "MathJax_PNG_IMG",
              });
              if (data.speakText) img.setAttribute("alt",MathJax.Hub.getJaxFor(nodes[i]).speech);
              nodes[i].parentNode.replaceChild(img,nodes[i]);
            }
            fs.unlinkSync(tmpSVG); fs.unlinkSync(tmpPNG);
            PNG(i-1);
          });
        });
      });
    }
    PNG(nodes.length-1);
  }
  return synch;
}

//
//  Move the MathJax output to a MathJax_Preview node preceeding the
//  node's script element, and remove any previous preview.
//  Remove the ID's so that they dont' confuse MathJax when it
//  re-processes the math on the page.
//
function MakePreviews() {
  if (data.addPreview) {
    var jax = MathJax.Hub.getAllJax();
    for (var i = jax.length-1; i >= 0; i--) {
      var script = jax[i].SourceElement(); script.removeAttribute("id");
      var frame = script.previousSibling;
      frame.removeAttribute("id"); frame.firstChild.removeAttribute("id");
      var type = (frame.nodeName.toLowerCase() === "div" ||
                  frame.getAttribute("display") === "block" ? "div" : "span");
      var preview = MathJax.HTML.Element(type,{className:"MathJax_Preview"});
      preview.appendChild(frame);
      if (script.previousSibling && script.previousSibling.className === "MathJax_Preview")
        script.parentNode.removeChild(script.previousSibling);
      script.parentNode.insertBefore(preview,script);
    }
  }
}

//
//  Remove the MathJax <script> tags
//
function RemoveScripts() {
  if (data.removeJax && !data.addPreview) {
    var HUB = MathJax.Hub, jax = HUB.getAllJax();
    for (var i = jax.length-1; i >= 0; i--) {
      var node = jax[i].SourceElement();
      node.parentNode.removeChild(node);
    }
  }
}

//
//  Get the resulting HTML and return it
//
function ReturnResults(result) {
  result.html = content.innerHTML;
  if (errors.length) {result.errors = errors}
  callback(result);
  serverState = STATE.READY;
  StartQueue();
}

/********************************************************************/

//
//  If MathJax times out, discard the DOM
//  and load a new one (get a fresh MathJax)
//
function RestartMathJax() {
  if (timer) {
    MathJax.Hub.queue.queue = [];  // clear MathJax queue, so pending operations won't fire
    MathJax = timer = window = document = html = content = null;
    ReportError("Timeout waiting for MathJax:  restarting");
    serverState = STATE.STOPPED;
  }
  GetWindow();
  ConfigureMathJax();
  StartMathJax();
}

/********************************************************************/

//
//  The API call to typeset a page
//
//     %%% check data for correctness
//
exports.typeset = function (data,callback) {
  if (!callback || typeof(callback) !== "function") {
    if (displayErrors) console.error("Missing callback");
    return;
  }
  var options = {};
  for (var id in defaults) {if (defaults.hasOwnProperty(id)) {
    options[id] = (data.hasOwnProperty(id) ? data[id]: defaults[id]);
  }}
  queue.push([options,callback]);
  if (serverState == STATE.STOPPED) {RestartMathJax()}
  if (serverState == STATE.READY) StartQueue();
}

//
//  Manually start MathJax (this is done automatically
//  when the first typeset() call is made)
//
exports.start = function () {RestartMathJax()}

//
//  Configure MathJax and the API
//  You can pass additional configuration options to MathJax using the
//    MathJax property, and can set displayErrors and displayMessages
//    that control the display of error messages, and extensions to add
//    additional MathJax extensions to the base or to sub-categories.
//
//  E.g.
//     mjAPI.config({
//       MathJax: {SVG: {font: "STIX-Web"}},
//       displayErrors: false
//       extensions: 'Safe,TeX/noUndefined'
//     });
//
exports.config = function (config) {
  if (config.displayMessages != null)    {displayMessages = config.displayMessages}
  if (config.displayErrors != null)      {displayErrors   = config.displayErrors}
  if (config.undefinedCharError != null) {undefinedChar   = config.undefinedCharError}
  if (config.extensions != null)         {extensions      = config.extensions}
  if (config.fontURL != null)            {fontURL         = config.fontURL}
  if (config.MathJax) {MathJaxConfig = config.MathJax}
}
