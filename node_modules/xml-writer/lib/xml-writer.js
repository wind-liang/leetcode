
function isFalse(s) {
  return typeof s !== 'number' && !s;
}

function strval(s) {
  if (typeof s == 'string') {
    return s;
  }
  else if (typeof s == 'number') {
    return s+'';
  }
  else if (typeof s == 'function') {
    return s();
  }
  else if (s instanceof XMLWriter) {
    return s.toString();
  }
  else throw Error('Bad Parameter');
}

function XMLWriter(indent, callback) {

    if (!(this instanceof XMLWriter)) {
        return new XMLWriter();
    }

    this.name_regex = /[_:A-Za-z][-._:A-Za-z0-9]*/;
    this.indent = indent ? true : false;
    this.indentString = this.indent && typeof indent === 'string' ? indent : '    ';
    this.output = '';
    this.stack = [];
    this.tags = 0;
    this.attributes = 0;
    this.attribute = 0;
    this.texts = 0;
    this.comment = 0;
    this.dtd = 0;
    this.root = '';
    this.pi = 0;
    this.cdata = 0;
    this.started_write = false;
    this.writer;
    this.writer_encoding = 'UTF-8';

    if (typeof callback == 'function') {
        this.writer = callback;
    } else {
        this.writer = function (s, e) {
            this.output += s;
        }
    }
}

XMLWriter.prototype = {
    toString : function () {
        this.flush();
        return this.output;
    },

    indenter : function () {
      if (this.indent) {
        this.write('\n');
        for (var i = 1; i < this.tags; i++) {
          this.write(this.indentString);
        }
      }
    },

    write : function () {
        for (var i = 0; i < arguments.length; i++) {
            this.writer(arguments[i], this.writer_encoding);
        }
    },


    flush : function () {
        for (var i = this.tags; i > 0; i--) {
            this.endElement();
        }
        this.tags = 0;
    },

    startDocument : function (version, encoding, standalone) {
        if (this.tags || this.attributes) return this;

        this.startPI('xml');
        this.startAttribute('version');
        this.text(typeof version == "string" ? version : "1.0");
        this.endAttribute();
        if (typeof encoding == "string") {
            this.startAttribute('encoding');
            this.text(encoding);
            this.endAttribute();
            this.writer_encoding = encoding;
        }
        if (standalone) {
            this.startAttribute('standalone');
            this.text("yes");
            this.endAttribute();
        }
        this.endPI();
        if (!this.indent) {
          this.write('\n');
        }
        return this;
    },

    endDocument : function () {
        if (this.attributes) this.endAttributes();
        return this;
    },

    writeElement : function (name, content) {
        return this.startElement(name).text(content).endElement();
    },

    writeElementNS : function (prefix, name, uri, content) {
        if (!content) {
            content = uri;
        }
        return this.startElementNS(prefix, name, uri).text(content).endElement();
    },

    startElement : function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (this.tags === 0 && this.root && this.root !== name) throw Error('Invalid Parameter');
        if (this.attributes) this.endAttributes();
        ++this.tags;
        this.texts = 0;
        if (this.stack.length > 0)
          this.stack[this.stack.length-1].containsTag = true;

        this.stack.push({
            name: name,
            tags: this.tags
        });
        if (this.started_write) this.indenter();
        this.write('<', name);
        this.startAttributes();
        this.started_write = true;
        return this;
    },
    startElementNS : function (prefix, name, uri) {
        prefix = strval(prefix);
        name = strval(name);

        if (!prefix.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (this.attributes) this.endAttributes();
        ++this.tags;
        this.texts = 0;
        if (this.stack.length > 0)
          this.stack[this.stack.length-1].containsTag = true;

        this.stack.push({
            name: prefix + ':' + name,
            tags: this.tags
        });
        if (this.started_write) this.indenter();
        this.write('<', prefix + ':' + name);
        this.startAttributes();
        this.started_write = true;
        return this;
    },

    endElement : function () {
        if (!this.tags) return this;
        var t = this.stack.pop();
        if (this.attributes > 0) {
            if (this.attribute) {
                if (this.texts) this.endAttribute();
                this.endAttribute();
            }
            this.write('/');
            this.endAttributes();
        } else {
            if (t.containsTag) this.indenter();
            this.write('</', t.name, '>');
        }
        --this.tags;
        this.texts = 0;
        return this;
    },

    writeAttribute : function (name, content) {
        if (typeof content == 'function') {
          content = content();
        }
        if (isFalse(content)) {
           return this;
        }
        return this.startAttribute(name).text(content).endAttribute();
    },
    writeAttributeNS : function (prefix, name, uri, content) {
        if (!content) {
            content = uri;
        }
        if (typeof content == 'function') {
          content = content();
        }
        if (isFalse(content)) {
          return this;
        }
        return this.startAttributeNS(prefix, name, uri).text(content).endAttribute();
    },

    startAttributes : function () {
        this.attributes = 1;
        return this;
    },

    endAttributes : function () {
        if (!this.attributes) return this;
        if (this.attribute) this.endAttribute();
        this.attributes = 0;
        this.attribute = 0;
        this.texts = 0;
        this.write('>');
        return this;
    },

    startAttribute : function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!this.attributes && !this.pi) return this;
        if (this.attribute) return this;
        this.attribute = 1;
        this.write(' ', name, '="');
        return this;
    },
    startAttributeNS : function (prefix, name, uri) {
        prefix = strval(prefix);
        name = strval(name);

        if (!prefix.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (!this.attributes && !this.pi) return this;
        if (this.attribute) return this;
        this.attribute = 1;
        this.write(' ', prefix + ':' + name, '="');
        return this;
    },
    endAttribute : function () {
        if (!this.attribute) return this;
        this.attribute = 0;
        this.texts = 0;
        this.write('"');
        return this;
    },

    text : function (content) {
        content = strval(content);
        if (!this.tags && !this.comment && !this.pi && !this.cdata) return this;
        if (this.attributes && this.attribute) {
            ++this.texts;
            this.write(content
                       .replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/"/g, '&quot;')
                       .replace(/\t/g, '&#x9;')
                       .replace(/\n/g, '&#xA;')
                       .replace(/\r/g, '&#xD;')
                      );
            return this;
        } else if (this.attributes && !this.attribute) {
            this.endAttributes();
        }
        if (this.comment || this.cdata) {
            this.write(content);
        }
        else {
          this.write(content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        }
        ++this.texts;
        this.started_write = true;
        return this;
    },

    writeComment : function (content) {
        return this.startComment().text(content).endComment();
    },

    startComment : function () {
        if (this.comment) return this;
        if (this.attributes) this.endAttributes();
        this.indenter();
        this.write('<!--');
        this.comment = 1;
        this.started_write = true;
        return this;
    },

    endComment : function () {
        if (!this.comment) return this;
        this.write('-->');
        this.comment = 0;
        return this;
    },

    writeDocType : function (name, pubid, sysid, subset) {
        return this.startDocType(name, pubid, sysid, subset).endDocType()
    },

    startDocType : function (name, pubid, sysid, subset) {
        if (this.dtd || this.tags) return this;

        name = strval(name);
        pubid = pubid ? strval(pubid) : pubid;
        sysid = sysid ? strval(sysid) : sysid;
        subset = subset ? strval(subset) : subset;

        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (pubid && !pubid.match(/^[\w\-][\w\s\-\/\+\:\.]*/)) throw Error('Invalid Parameter');
        if (sysid && !sysid.match(/^[\w\.][\w\-\/\\\:\.]*/)) throw Error('Invalid Parameter');
        if (subset && !subset.match(/[\w\s\<\>\+\.\!\#\-\?\*\,\(\)\|]*/)) throw Error('Invalid Parameter');

        pubid = pubid ? ' PUBLIC "' + pubid + '"' : (sysid) ? ' SYSTEM' : '';
        sysid = sysid ? ' "' + sysid + '"' : '';
        subset = subset ? ' [' + subset + ']': '';

        if (this.started_write) this.indenter();
        this.write('<!DOCTYPE ', name, pubid, sysid, subset);
        this.root = name;
        this.dtd = 1;
        this.started_write = true;
        return this;
    },

    endDocType : function () {
        if (!this.dtd) return this;
        this.write('>');
        return this;
    },

    writePI : function (name, content) {
        return this.startPI(name).text(content).endPI()
    },

    startPI : function (name) {
        name = strval(name);
        if (!name.match(this.name_regex)) throw Error('Invalid Parameter');
        if (this.pi) return this;
        if (this.attributes) this.endAttributes();
        if (this.started_write) this.indenter();
        this.write('<?', name);
        this.pi = 1;
        this.started_write = true;
        return this;
    },

    endPI : function () {
        if (!this.pi) return this;
        this.write('?>');
        this.pi = 0;
        return this;
    },

    writeCData : function (content) {
        return this.startCData().text(content).endCData();
    },

    startCData : function () {
        if (this.cdata) return this;
        if (this.attributes) this.endAttributes();
        this.indenter();
        this.write('<![CDATA[');
        this.cdata = 1;
        this.started_write = true;
        return this;
    },

    endCData : function () {
        if (!this.cdata) return this;
        this.write(']]>');
        this.cdata = 0;
        return this;
    },

    writeRaw : function(content) {
        content = strval(content);
        if (!this.tags && !this.comment && !this.pi && !this.cdata) return this;
        if (this.attributes && this.attribute) {
            ++this.texts;
            this.write(content.replace('&', '&amp;').replace('"', '&quot;'));
            return this;
        } else if (this.attributes && !this.attribute) {
            this.endAttributes();
        }
        ++this.texts;
        this.write(content);
        this.started_write = true;
        return this;
    }

}

module.exports = XMLWriter;
