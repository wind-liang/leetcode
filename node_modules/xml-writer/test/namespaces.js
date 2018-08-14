var XMLWriter = require('../');
exports['setUp'] = function (callback) {
	this.xw = new XMLWriter();
	callback();
};
exports['t01'] = function (test) {
	this.xw.startElement('t:foo');
	test.equal(this.xw.toString(), '<t:foo/>');
    test.done();
};
exports['t03'] = function (test) {
	this.xw.startElement('foo:tag');
	this.xw.text('fake');
	test.equal(this.xw.toString(), '<foo:tag>fake</foo:tag>');
	test.done();
};
exports['t04'] = function (test) {
	this.xw.startElement('foo:tag');
	this.xw.writeAttribute('foo:att', 'value');
	this.xw.writeAttribute('att', 'value');
	this.xw.text('fake');
	this.xw.endElement();
	test.equal(this.xw.toString(), '<foo:tag foo:att="value" att="value">fake</foo:tag>');
    test.done();
};
exports['t05'] = function (test) {
	this.xw.startDocument('1.0');
	this.xw.startElement('rdf:RDF').writeAttribute('xmlns:rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#').writeAttribute('xmlns:cd', 'http://www.recshop.fake/cd#');
	this.xw.startElement('rdf:Description').writeAttribute('rdf:about', 'http://www.recshop.fake/cd/Empire Burlesque');
	this.xw.writeElement('cd:artist', 'Bob Dylan');
	this.xw.writeElement('cd:country', 'USA');
	this.xw.writeElement('cd:company', 'Columbia');
	this.xw.writeElement('cd:price', '10.90');
	this.xw.writeElement('cd:year', '1985');
	this.xw.endElement();
	this.xw.endElement();
	this.xw.endDocument();
	test.equal(this.xw.toString(), '<?xml version="1.0"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:cd="http://www.recshop.fake/cd#"><rdf:Description rdf:about="http://www.recshop.fake/cd/Empire Burlesque"><cd:artist>Bob Dylan</cd:artist><cd:country>USA</cd:country><cd:company>Columbia</cd:company><cd:price>10.90</cd:price><cd:year>1985</cd:year></rdf:Description></rdf:RDF>');
	test.done();
};
// With NS functions
exports['t06'] = function (test) {
	this.xw.startElementNS('t','foo');
	test.equal(this.xw.toString(), '<t:foo/>');
    test.done();
};

exports['t07'] = function (test) {
	this.xw.startElementNS('foo','tag');
	this.xw.text('fake');
	test.equal(this.xw.toString(), '<foo:tag>fake</foo:tag>');
	test.done();
};
exports['t08'] = function (test) {
	this.xw.startElementNS('foo','tag');
	this.xw.writeAttributeNS('foo','att',null,'value');
	this.xw.writeAttribute('att', 'value');
	this.xw.text('fake');
	this.xw.endElement();
	test.equal(this.xw.toString(), '<foo:tag foo:att="value" att="value">fake</foo:tag>');
    test.done();
};
exports['t09'] = function (test) {
	this.xw.startDocument('1.0');
	this.xw.startElementNS('rdf','RDF').writeAttributeNS('xmlns','rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#').writeAttributeNS('xmlns','cd', 'http://www.recshop.fake/cd#');
	this.xw.startElementNS('rdf','Description').writeAttributeNS('rdf','about', 'http://www.recshop.fake/cd/Empire Burlesque');
	this.xw.writeElementNS('cd','artist', null, 'Bob Dylan');
	this.xw.writeElementNS('cd','country',null, 'USA');
	this.xw.writeElementNS('cd','company', null, 'Columbia');
	this.xw.writeElementNS('cd','price', null, '10.90');
	this.xw.writeElementNS('cd','year', null,'1985');
	this.xw.endElement();
	this.xw.endElement();
	this.xw.endDocument();
	test.equal(this.xw.toString(), '<?xml version="1.0"?>\n<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:cd="http://www.recshop.fake/cd#"><rdf:Description rdf:about="http://www.recshop.fake/cd/Empire Burlesque"><cd:artist>Bob Dylan</cd:artist><cd:country>USA</cd:country><cd:company>Columbia</cd:company><cd:price>10.90</cd:price><cd:year>1985</cd:year></rdf:Description></rdf:RDF>');
	test.done();
};