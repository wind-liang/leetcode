
var XMLWriter = require('../');
exports['setUp'] = function (callback) {
	this.xw = new XMLWriter;
	callback();
};
exports['t01'] = function (test) {
	this.xw.startPI('php');
	this.xw.endPI();
	test.equal(this.xw.toString(), '<?php?>');
	test.done();

};
exports['t02'] = function (test) {
	this.xw.startPI('php');
	this.xw.text(' echo');
	this.xw.text(' __FILE__; ');
	this.xw.endPI();
	test.equal(this.xw.toString(), '<?php echo __FILE__; ?>');
    test.done();
};
exports['t03'] = function (test) {
	this.xw.startPI('xml-stylesheet');
	this.xw.startAttribute('type');
	this.xw.text('text/xml');
	this.xw.endAttribute();
	this.xw.startAttribute('href');
	this.xw.text('style.xsl');
	this.xw.endAttribute();
	this.xw.endPI();
	test.equal(this.xw.toString(), '<?xml-stylesheet type="text/xml" href="style.xsl"?>');
	test.done();
};
exports['t04'] = function (test) {
    test.done();
};
exports['t05'] = function (test) {
	this.xw.writePI('php', ' var_dump(__FILE__); ');
	test.equal(this.xw.toString(), '<?php var_dump(__FILE__); ?>');
	test.done();
};
