var XMLWriter = require('../'),
	fs = require('fs');

exports['t01'] = function (test) {
	var filename = '/tmp/foo.xml';
	var ws = fs.createWriteStream(filename);
	ws.on('close', function() {
			test.equal(fs.readFileSync(filename, 'UTF-8'), '<?xml version="1.0" encoding="UTF-8"?>\n<foo>à l\'école !</foo>');
			test.done();
	});
	this.xw = new XMLWriter(false, function(s, e) { 
			ws.write(s, e);
	});
	this.xw.startDocument('1.0', 'UTF-8').startElement('foo').text('à l\'école !').endElement().endDocument();
	ws.end();
};
