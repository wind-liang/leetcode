/*********************************************************************
 *
 *  mj-single-svg.js
 *
 *  Implements an API to MathJax in node.js so that MathJax can be
 *  used server-side to generate SVG, MathML, or images (the latter
 *  requires an external library, batik, to do the svg to png
 *  conversion).  This API converts single math expressions to SVG,
 *  will giving control over the input format, the font caching, and
 *  a number of other features.
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
  useGlobalCache: false,          // use common <defs> for all equations?
  linebreaks: false,              // do linebreaking?
  equationNumbers: "none",        // or "AMS" or "all"

  math: "",                       // the math to typeset
  format: "TeX",                  // the input format (TeX, inline-TeX, AsciiMath, or MathML)
  xmlns: "mml",                   // the namespace to use for MathML

  html: false,                    // return HTML output?
  css: false,                     // return CSS for HTML output?
  mml: false,                     // return mml output?
  svg: false,                     // return svg output?
  img: false,                     // return img tag for remote image?
  png: false,                     // return png image (as data: URL)?
  dpi: 144,                       // dpi for png image

  speakText: false,               // add spoken annotations to svg output?
  speakRuleset: "mathspeak",      // set speech ruleset (default (chromevox rules), mathspeak)
  speakStyle: "default",          // set speech style (mathspeak:  default, brief, sbrief)

  timeout: 10 * 1000,             // 10 second timeout before restarting MathJax
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
var MathJaxConfig;                   // configuration for when starting MathJax
var MathJax;                         // filled in once MathJax is loaded
var serverState = STATE.STOPPED;     // nothing loaded yet
var timer;                           // used to reset MathJax if it runs too long
var tmpfile = os.tmpdir() + "/mj-single-svg" +  process.pid;  // file name prefix to use for temp files

var document, window, content, html; // the DOM elements

var queue = [];       // queue of typesetting requests of the form [data,callback]
var data, callback;   // the current queue item
var errors = [];      // errors collected durring the typesetting
var ID = 0;           // id for this SVG element

//
//  The delimiters used for each of the input formats
//
var delimiters = {
  TeX: ["$$","$$"],
  "inline-TeX": ["$","$"],
  AsciiMath: ["`","`"],
  MathML: ["",""]
};

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
  window.addEventListener("error",function (event) {AddError("Error: "+event.error.stack)});
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
    jax: ["input/TeX", "input/MathML", "input/AsciiMath", "output/SVG", "output/CommonHTML"],
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
        Event:{}, Touch:{}, Hover:{}                  // fake structure to avid errors
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
        AddError("Math Processing Error: "+message[2].message);
      });
      MathJax.Hub.Register.MessageHook("SVG Jax - unknown char",function (message) {
        AddError("SVG - Unknown character: U+"+message[1].toString(16).toUpperCase()+
                    " in "+(message[2].fonts||["unknown"]).join(","),!undefinedChar);
      });
      MathJax.Hub.Register.MessageHook("MathML Jax - unknown node type",function (message) {
        AddError("MathML - Unknown node type: "+message[1]);
      });
      MathJax.Hub.Register.MessageHook("MathML Jax - parse error",function (message) {
        AddError("MathML - "+message[1]);
      });
      MathJax.Hub.Register.MessageHook("AsciiMath Jax - parse error",function (message) {
        AddError("AsciiMath parse error: "+message[1]);
      });
      MathJax.Hub.Register.MessageHook("TeX Jax - parse error",function (message) {
        AddError("TeX parse error: "+message[1]);
      });
      MathJax.Hub.Register.MessageHook("file load error",function (message) {
        AddError("File load error: "+message[1]);
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
        //  Don't need the styles
        //
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
              jax.SVG.lineWidth = (linebreak ? width / em * 1000 : SVG.BIGDIMEN);
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
      //  Start the typesetting queue when MathJax is ready
      //    (reseting the counters so that the initial math doesn't affect them)
      //
      MathJax.Hub.Register.StartupHook("End",function () {
        MathJax.OutputJax.SVG.resetGlyphs(true);
        MathJax.ElementJax.mml.ID = 0;
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
function AddError(message,nopush) {
  if (displayErrors) console.error(message);
  if (!nopush) errors.push(message);
}


/********************************************************************/

//
//  Creates the MathML output (taking MathJax resets
//  into account)
//
function GetMML(result) {
  if (!data.mml && !data.speakText) return;
  var jax = MathJax.Hub.getAllJax()[0];
  try {result.mml = jax.root.toMathML('',jax)} catch(err) {
    if (!err.restart) {throw err;} // an actual error
    return MathJax.Callback.After(window.Array(GetMML,result),err.restart);
  }
}

//
//  Creates the speech string and updates the MathML to include it, if needed
//
function GetSpeech(result) {
  if (!data.speakText) return;
  speech.setupEngine({semantics: true, domain: data.speakRuleset, style: data.speakStyle});
  result.speakText = speech.processExpression(result.mml);
  if (data.mml) {
    var jax = MathJax.Hub.getAllJax()[0];
    jax.root.alttext = result.speakText;
    if (jax.root.attrNames) {jax.root.attrNames.push("alttext")}
    result.mml = jax.root.toMathML('',jax);
  } else {
    delete result.mml;
  }
}

//
//  Create HTML and CSS output, if requested
//
function GetHTML(result) {
  if (!data.html) return;
  var jax = MathJax.Hub.getAllJax()[0]; if (!jax) return;
  var script = jax.SourceElement(), html = script.previousSibling;
  result.html = html.outerHTML;
  if (data.css) result.css = CHTMLSTYLES;
}

//
//  Create SVG output and IMG output, if requested
//
function GetSVG(result) {
  if (!data.svg && !data.png && !data.img) return;
  var jax = MathJax.Hub.getAllJax()[0]; if (!jax) return;
  var script = jax.SourceElement(),
      svg = script.previousSibling.getElementsByTagName("svg")[0];
  svg.setAttribute("xmlns","http://www.w3.org/2000/svg");

  //
  //  Add the speech text and mark the SVG appropriately
  //
  if (data.speakText) {
    ID++; var id = "MathJax-SVG-"+ID;
    svg.setAttribute("role","math");
    svg.setAttribute("aria-labelledby",id+"-Title "+id+"-Desc");
    for (var i=0, m=svg.childNodes.length; i < m; i++)
      svg.childNodes[i].setAttribute("aria-hidden",true);
    var node = MathJax.HTML.Element("desc",{id:id+"-Desc"},[result.speakText]);
    svg.insertBefore(node,svg.firstChild);
    node = MathJax.HTML.Element("title",{id:id+"-Title"},["Equation"]);
    svg.insertBefore(node,svg.firstChild);
  }

  //
  //  SVG data is modified to add linebreaks for readability,
  //  and to put back the xlink namespace that is removed in HTML5
  //
  var svgdata = svg.outerHTML.replace(/><([^/])/g,">\n<$1")
                             .replace(/(<\/[a-z]*>)(?=<\/)/g,"$1\n")
                             .replace(/(<use [^>]*)(href=)/g,' $1xlink:$2');
  //
  //  The file version includes the xml and DOCTYPE comments
  //
  var svgfile = [
    '<?xml version="1.0" standalone="no"?>',
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
    svgdata
  ].join("\n");

  //
  //  Add the requested data to the results
  //
  if (data.svg) result.svg = svgdata;
  if (data.png) result.svgfile = svgfile;
  if (data.img) {
    if (data.svg) result.svg = svgfile;
    result.img = [
      '<img src="file.svg" style="',
      svg.style.cssText,
      " width:",svg.getAttribute("width"),"; height:",svg.getAttribute("height"),
      ';"',
      (data.speakText ? ' alt="'+result.speakText+'"' : ""),
      ' />'
    ].join("");
  }
}

//
//  Create the PNG file asynchronously, reporting errors.
//
function GetPNG(result) {
  var svgfile = result.svgfile; delete result.svgfile;
  if (data.png) {
    var batikCommands = ['-jar', BatikRasterizerPath, '-dpi', data.dpi, tmpfile + '.svg'];
    var synch = MathJax.Callback(function () {}); // for synchronization with MathJax
    var check = function (err) {if (err) {AddError(err.message); synch(); return true}}
    var tmpSVG = tmpfile+".svg", tmpPNG = tmpfile+".png";
    fs.writeFile(tmpSVG,svgfile,function (err) {
      if (check(err)) return;
      execFile('java', batikCommands, function (err,stdout,stderr) {
        if (check(err)) {fs.unlinkSync(tmpSVG); return}
        fs.readFile(tmpPNG,null,function (err,buffer) {
          result.png = "data:image/png;base64,"+(buffer||"").toString('base64');
          fs.unlinkSync(tmpSVG); fs.unlinkSync(tmpPNG);
          check(err); synch();
        });
      });
    });
    return synch;  // This keeps the queue from continuing until the readFile() is complete
  }
}

/********************************************************************/

//
//  Start typesetting the queued expressions
//
function StartQueue() {
  data = callback = null;       //  clear existing equation, if any
  errors = [];                  //  clear any errors
  if (!queue.length) return;    //  return if nothing to do

  serverState = STATE.BUSY;
  var result = {}, $$ = window.Array;

  //
  //  Get the math data and callback
  //  and set the content with the proper delimiters
  //
  var item = queue.shift();
  data = item[0]; callback = item[1];
  var delim = delimiters[data.format];
  var math = data.math;
  if (data.format !== "MathML")
    math = math.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  content.innerHTML = delim[0]+math+delim[1];
  html.setAttribute("xmlns:"+data.xmlns,"http://www.w3.org/1998/Math/MathML");

  //
  //  Set the SVG and TeX parameters
  //  according to the requested data
  //
  var CHTML = MathJax.OutputJax.CommonHTML,
      SVG = MathJax.OutputJax.SVG,
      TEX = MathJax.InputJax.TeX,
      HUB = MathJax.Hub;

  SVG.defaultEx = CHTML.defaultEx = data.ex;
  SVG.defaultWidth = CHTMLdefaultWidth = data.width * data.ex;
  SVG.config.linebreaks.automatic = CHTML.config.linebreaks.automatic = data.linebreaks;
  SVG.config.linebreaks.width = CHTML.config.linebreaks.width = data.width * data.ex;
  SVG.config.useFontCache = data.useFontCache;
  SVG.config.useGlobalCache = data.useGlobalCache;
  TEX.config.equationNumbers.autoNumber = data.equationNumbers;

  //
  // Set the state from data.state or clear it
  //
  GetState(data.state);

  var renderer = (data.html ? "CommonHTML" : "SVG");

  //
  //  Set up a timeout timer to restart MathJax if it runs too long,
  //  Then push the Typeset call, the MathML, speech, SVG, and PNG calls,
  //  and our TypesetDone routine
  //
  timer = setTimeout(RestartMathJax,data.timeout);
  HUB.Queue(
    $$(SetRenderer,renderer),
    $$("Typeset",HUB),
    $$(TypesetDone,result),
    $$(GetMML,result),
    $$(GetSpeech,result),
    $$(GetHTML,result),
    $$(RerenderSVG,result),
    $$(GetSVG,result),
    $$(GetPNG,result),
    $$(ReturnResult,result)
  );
}

//
//  Update the MathJax values from the state,
//  or clear them if there is no state.
//
function GetState(state) {
  var SVG = MathJax.OutputJax.SVG,
      TEX = MathJax.InputJax.TeX,
      MML = MathJax.ElementJax.mml,
      AMS = MathJax.Extension["TeX/AMSmath"],
      HUB = MathJax.Hub, HTML = MathJax.HTML,
      GLYPH = SVG.BBOX.GLYPH;

  if (state && state.AMS) {
    AMS.startNumber = state.AMS.startNumber;
    AMS.labels = state.AMS.labels;
    AMS.IDs = state.AMS.IDs;
    MML.SUPER.ID = state.mmlID;
    GLYPH.glyphs = state.glyphs;
    GLYPH.defs = state.defs;
    GLYPH.n = state.n;
    ID = state.ID;
  } else {
    if (state) {state.AMS = {}}
    SVG.resetGlyphs(true);
    if (data.useGlobalCache) {
      state.glyphs = {};
      state.defs = HTML.Element("defs");
      state.n = 0;
    }
    if (TEX.resetEquationNumbers) TEX.resetEquationNumbers();
    MML.SUPER.ID = ID = 0;
  }
}

//
//  When the expression is typeset,
//    clear the timeout timer, if any,
//    and update the MathJax state,
//
function TypesetDone(result) {
  if (timer) {clearTimeout(timer); timer = null}
  html.removeAttribute("xmlns:"+data.xmlns);
  var state = data.state;
  if (state) {
    var AMS = MathJax.Extension["TeX/AMSmath"];
    var GLYPH = MathJax.OutputJax.SVG.BBOX.GLYPH;
    state.AMS.startNumber = AMS.startNumber;
    state.AMS.labels = AMS.labels;
    state.AMS.IDs = AMS.IDs;
    state.mmlID = MathJax.ElementJax.mml.SUPER.ID;
    state.glyphs = GLYPH.glyphs;
    state.defs = GLYPH.defs;
    state.n = GLYPH.n;
    state.ID = ID;
  }
}

//
//  Return the result object, and
//  do the next queued expression
//
function ReturnResult(result) {
  if (errors.length) {result.errors = errors}
  callback(result);
  serverState = STATE.READY;
  StartQueue();
}

//
//  Set the MathJax renderer
//
function SetRenderer(renderer) {
  return MathJax.Hub.setRenderer(renderer);
}

function RerenderSVG(result) {
  if (data.html && (data.svg || data.png || data.img)) {
    timer = setTimeout(RestartMathJax,data.timeout);
    var queue = MathJax.Callback.Queue(), $$ = window.Array;
    return queue.Push(
      $$(SetRenderer,"SVG"),
      $$("Rerender",MathJax.Hub),
      $$(TypesetDone,result)
    );
  }
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
//  The API call to typeset an equation
//
//     %%% cache results?
//     %%% check types and values of parameters
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
  if (data.state) {options.state = data.state}
  if (!delimiters[options.format]) {ReportError("Unknown format: "+options.format,callback); return}
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
//       displayErrors: false,
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
