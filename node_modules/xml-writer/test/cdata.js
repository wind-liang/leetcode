
var XMLWriter = require('../');
exports['setUp'] = function (callback) {
	this.xw = new XMLWriter;
	callback();
};
exports['t01'] = function (test) {
	this.xw.startCData();
	this.xw.text('fake');
	this.xw.endCData();
	test.equal(this.xw.toString(), '<![CDATA[fake]]>');
    test.done();
};
exports['t02'] = function (test) {
	this.xw.startElement('tag');
	this.xw.startCData();
	this.xw.text('fake');
	this.xw.endCData();
	this.xw.text('value');
	test.equal(this.xw.toString(), '<tag><![CDATA[fake]]>value</tag>');
	test.done();
};
exports['t03'] = function (test) {
	this.xw.startElement('tag');
	this.xw.startCData();
	this.xw.startCData();
	this.xw.text('fake');
	this.xw.endCData();
	this.xw.text('value');
	this.xw.endCData();
	this.xw.startCData();
	this.xw.text('fake');
	this.xw.endCData();

	test.equal(this.xw.toString(), '<tag><![CDATA[fake]]>value<![CDATA[fake]]></tag>');
	test.done();
};
exports['t04'] = function (test) {
	this.xw.startElement('tag');
	this.xw.startCData();
	this.xw.startElement('tag');
	this.xw.text('value');
	this.xw.endElement();
	this.xw.endCData();
	this.xw.endElement();
	test.equal(this.xw.toString(), '<tag><![CDATA[<tag>value</tag>]]></tag>');

    test.done();
};
exports['t05'] = function (test) {
    test.done();
};
exports['t06'] = function (test) {
	this.xw.writeCData('value');
	test.equal(this.xw.toString(), '<![CDATA[value]]>');
    test.done();
};
