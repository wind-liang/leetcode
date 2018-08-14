var XMLWriter = require('../');
exports['setUp'] = function (callback) {
	this.xw = new XMLWriter;
	callback();
};
exports['t01'] = function (test) {
	this.xw.startAttribute('key');
	this.xw.text('value');
	this.xw.endAttribute();
	test.equal(this.xw.toString(), '');
    test.done();
};
exports['t02'] = function (test) {
	this.xw.startElement('tag');
	this.xw.startAttribute('key');
	this.xw.text('value');
	this.xw.endAttribute();
	test.equal(this.xw.toString(), '<tag key="value"/>');
	test.done();
};
exports['t03'] = function (test) {
	this.xw.startElement('tag');
	this.xw.startAttribute('key1');
	this.xw.text('value');
	this.xw.endAttribute();
	this.xw.startAttribute('key2');
	this.xw.text('value');
	this.xw.endAttribute();
	test.equal(this.xw.toString(), '<tag key1="value" key2="value"/>');
	test.done();
};
exports['t04'] = function (test) {
	this.xw.startElement('tag');
	this.xw.startAttribute('key1');
	this.xw.startAttribute('key2');
	this.xw.text('value');
	this.xw.endAttribute();
	test.equal(this.xw.toString(), '<tag key1="value"/>');
    test.done();
};
exports['t05'] = function (test) {
	this.xw.startElement('tag');
	this.xw.startAttribute('key1');
	this.xw.startElement('tag');
	this.xw.text('value');
	test.equal(this.xw.toString(), '<tag key1=""><tag>value</tag></tag>');
    test.done();
};
exports['t06a'] = function (test) {
	this.xw.startElement('tag').writeAttribute('key', 'value').endElement();
	test.equal(this.xw.toString(), '<tag key="value"/>');
    test.done();
};
exports['t06b'] = function (test) {
	this.xw.startElement('tag').writeAttribute('key', '"< & >"').endElement();
	test.equal(this.xw.toString(), '<tag key="&quot;&lt; &amp; >&quot;"/>');
    test.done();
};
exports['t07'] = function (test) {
  this.xw.startElement('tag');
  this.xw.writeAttribute('key1', false);
  this.xw.writeAttribute('key2', null);
  this.xw.writeAttribute('key3', undefined);
  test.equal(this.xw.toString(), '<tag/>');
  test.done();
};
exports['t08'] = function (test) {
  this.xw.startElement('tag');
  this.xw.writeAttribute('key1', '\t\n\r');
  test.equal(this.xw.toString(), '<tag key1="&#x9;&#xA;&#xD;"/>');
  test.done();
};
