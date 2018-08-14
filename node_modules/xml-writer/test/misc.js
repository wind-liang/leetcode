var XMLWriter = require('../');
exports['setUp'] = function (callback) {
	this.xw = new XMLWriter();
	callback();
};
exports['t01'] = function (test) {
	this.xw.startElement(function() {return 'toto'}).text(function() {return 'titi'});
	test.equal(this.xw.toString(), '<toto>titi</toto>');
    test.done();
};
exports['t02'] = function (test) {
	test.throws(function(){this.xw.startElement('<>')});
    test.done();
};
exports['t03'] = function (test) {
	this.xw.startElement('foo').text('<toto>');
	test.equal(this.xw.toString(), '<foo>&lt;toto&gt;</foo>');
  test.done();
};
  exports['t03b'] = function (test) {
	this.xw.startElement('foo').text('un & deux & troie');
	test.equal(this.xw.toString(), '<foo>un &amp; deux &amp; troie</foo>');
  test.done();
};

exports['t04'] = function (test) {
	this.xw.startElement('foo').writeAttribute('toto','"');
	test.equal(this.xw.toString(), '<foo toto="&quot;"/>');
    test.done();
};
exports['t05'] = function (test) {
	this.xw.startElement('foo').writeAttribute('toto','&');
	test.equal(this.xw.toString(), '<foo toto="&amp;"/>');
    test.done();
};
exports['t06'] = function (test) {
	this.xw.startElement('foo').writeAttribute('toto','&');
	test.equal(this.xw.toString(), '<foo toto="&amp;"/>');
    test.done();
};
exports['t07'] = function (test) {
	this.xw.startElement('foo').writeAttribute('toto','"&');
	test.equal(this.xw.toString(), '<foo toto="&quot;&amp;"/>');
    test.done();
};
exports['t08'] = function (test) {
	this.xw.startElement('foo').text('<to&to>');
	test.equal(this.xw.toString(), '<foo>&lt;to&amp;to&gt;</foo>');
    test.done();
};






