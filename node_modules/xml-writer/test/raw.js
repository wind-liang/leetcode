var XMLWriter = require('../'),
	fs = require('fs');

exports['t01'] = function (test) {
  this.xw = new XMLWriter( );
  this.xw.startDocument('1.0', 'UTF-8');
  this.xw.startElement('foo');
  this.xw.writeRaw('<one>1</one>');
  this.xw.startElement('two').text('2').endElement();
  this.xw.endElement();
  this.xw.endDocument();

  test.equal(this.xw.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n<foo><one>1</one><two>2</two></foo>');
  test.done();
};

exports['t02'] = function (test) {
  var xw2 = new XMLWriter( );
  xw2.startElement('one');
  xw2.text('1');
  xw2.endElement();

	this.xw = new XMLWriter( );
  this.xw.startDocument('1.0', 'UTF-8');
  this.xw.startElement('foo');
  this.xw.writeRaw(xw2);
  this.xw.startElement('two').text('2').endElement();
  this.xw.endElement();
  this.xw.endDocument();

  test.equal(this.xw.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n<foo><one>1</one><two>2</two></foo>');
  test.done();
};


exports['t03'] = function (test) {
  function fragment() {
    var xw2 = new XMLWriter( );
    xw2.startElement('one');
    xw2.text('1');
    xw2.endElement();
    return xw2.toString();
  }
	this.xw = new XMLWriter( );
  this.xw.startDocument('1.0', 'UTF-8');
  this.xw.startElement('foo');
  this.xw.writeRaw(fragment());
  this.xw.startElement('two').text('2').endElement();
  this.xw.endElement();
  this.xw.endDocument();

  test.equal(this.xw.toString(), '<?xml version="1.0" encoding="UTF-8"?>\n<foo><one>1</one><two>2</two></foo>');
  test.done();
};
