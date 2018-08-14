# XMLWriter for NodeJS

[![Build Status](https://secure.travis-ci.org/touv/node-xml-writer.png?branch=master)](http://travis-ci.org/touv/node-xml-writer)

It's native and full javascript implementation of the classic XMLWriter class.
The API is complete, flexible and tolerant.
XML is still valid.

## Contributors

  * [Nicolas Thouvenin](https://github.com/touv)
  * [Anton Zem](https://github.com/AlgoTrader)
  * [Chip Lee](https://github.com/chipincode)
  * [Peecky](https://github.com/peecky)
  * [Julian Scheid](https://github.com/jscheid)
  * [Guillaume Plique](https://github.com/Yomguithereal)

# Installation

With [npm](http://npmjs.org) do:

    $ npm install xml-writer


# Examples

## Basic
```javascript
	var XMLWriter = require('xml-writer');
	xw = new XMLWriter;
	xw.startDocument();
	xw.startElement('root');
	xw.writeAttribute('foo', 'value');
	xw.text('Some content');
	xw.endDocument();

	console.log(xw.toString());
```
Output:

	<?xml version="1.0"?>
	<root foo="value">Some content</root>

Tip: If you want your XML **indented** use `new XMLWriter(true)` or `new XMLWriter('\t')`, for instance, if you want to use a custom string for indentation.

## Chaining
```javascript
	var XMLWriter = require('xml-writer');
	xw = new XMLWriter;
	xw.startDocument().startElement('root').writeAttribute('foo', 'value').writeElement('tag', 'Some content');

	console.log(xw.toString());
```
Output:

	<?xml version="1.0"?>
	<root foo="value"><tag>Some content</tag></root>

## Tolerant
```javascript
	var XMLWriter = require('xml-writer');
	xw = new XMLWriter;
	xw.startElement('root').writeAttribute('foo', 'value').text('Some content');

	console.log(xw.toString());
```
Output:

	<root foo="value">Some content</root>


## Extensible
```javascript
	var XMLWriter = require('xml-writer'),
               fs = require('fs');
	var ws = fs.createWriteStream('/tmp/foo.xml');
	ws.on('close', function() {
			console.log(fs.readFileSync('/tmp/foo.xml', 'UTF-8'));
	});
	xw = new XMLWriter(false, function(string, encoding) {
			ws.write(string, encoding);
	});
	xw.startDocument('1.0', 'UTF-8').startElement(function() {
		return 'root';
	}).text(function() {
		return 'Some content';
	});
	ws.end();
```

Output:

	<?xml version="1.0" encoding="UTF-8"?>
	<root>Some content</root>


# Tests

Use [nodeunit](https://github.com/caolan/nodeunit) to run the tests.

    $ npm install nodeunit
    $ nodeunit test

# API Documentation

## Generic

### constructor XMLWriter(Boolean|String indent, Function writer(string, encoding))
Create an new writer

### text(String content)
Write text

### writeRaw
Write a raw XML text

## Document
### startDocument(String version = '1.0', String encoding = NULL, Boolean standalone = false)
Create document tag

### endDocument()
End current document

## Element

### writeElement(String name, String content)
Write full element tag

### writeElementNS
Write full namespaced element tag

### startElementNS
Create start namespaced element tag

### startElement(String name)
Create start element tag

### endElement()
End current element

## Attributes

### writeAttribute(String name, String value)
Write full attribute

### writeAttributeNS
Write full namespaced attribute

### startAttributeNS
Create start namespaced attribute

### startAttribute(String name)
Create start attribute

### endAttribute()
End attribute

## Processing Instruction

### writePI(String name, String content)
Writes a PI

### startPI(String name)
Create start PI tag

### endPI()
End current PI

## DocType

### writeDocType(String name, String pubid, String sysid, String subset)
Write a DocType

### startDocType(String name, String pubid, String sysid, String subset)
Create start DocType tag

### endDocType()
End current DocType

## CData

### writeCData(String content)
Write full CDATA tag

### startCData()
Create start CDATA tag

### endCData()
End current CDATA

## Comment

### writeComment(String content)
Write full comment tag

### startComment()
Create start comment

### endComment()
Create end comment

# Also

* https://github.com/minchenkov/simple-xml-writer
* https://github.com/wezm/node-genx

# License

[MIT/X11](./LICENSE)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/touv/node-xml-writer/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

