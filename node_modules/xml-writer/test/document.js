var XMLWriter = require('../');
exports['setUp'] = function (callback) {
	this.xw = new XMLWriter;
	callback();
};
exports['t01'] = function (test) {
	this.xw.startDocument();
	test.equal(this.xw.toString(), '<?xml version="1.0"?>\n');
    test.done();
};
exports['t02'] = function (test) {
	this.xw.startDocument('1.0', 'utf-8');
	test.equal(this.xw.toString(), '<?xml version="1.0" encoding="utf-8"?>\n');
	test.done();
};
exports['t03'] = function (test) {
	this.xw.startDocument('1.0', 'utf-8', true);
	test.equal(this.xw.toString(), '<?xml version="1.0" encoding="utf-8" standalone="yes"?>\n');
	test.done();
};
exports['t04'] = function (test) {
	this.xw.startDocument();
	this.xw.endDocument();
	test.equal(this.xw.toString(), '<?xml version="1.0"?>\n');
    test.done();
};
