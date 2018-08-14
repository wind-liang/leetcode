var XMLMapping = require('../');
var input;
exports['t00'] = function (test) {
	input = '<row/>';
	test.deepEqual(XMLMapping.load(input), {});
	input = 'string';
	test.equal(XMLMapping.load(input), 'string');
	input = 1234;
	test.equal(XMLMapping.load(input), 1234);
	test.done();
};
exports['t01'] = function (test) {
	input = '<key/>';
	test.deepEqual(XMLMapping.load(input), { key : {} });
	input = '<key key1="value"/>';
	test.deepEqual(XMLMapping.load(input), { key : { key1: 'value' } });
	input = '<key key1="value1" key2="value2"/>';
	test.deepEqual(XMLMapping.load(input), { key : { key1: 'value1', key2: 'value2' } });
	test.done();
};
exports['t02'] = function (test) {
	input = '<row><key1/><key2/></row>';
	test.deepEqual(XMLMapping.load(input), { key1 : {}, key2 : {} });
	input = '<row><key1 key="value"/><key2 key="value"/></row>';
	test.deepEqual(XMLMapping.load(input), { key1 : { key: 'value' }, key2 : { key: 'value' } });
	input = '<row><key1 keyA="value1" keyB="value2"/><key2 keyA="value1" keyB="value2"/></row>';
	test.deepEqual(XMLMapping.load(input), { key1 : { keyA: 'value1', keyB: 'value2' }, key2 : { keyA: 'value1', keyB: 'value2' } });
	input = '<row><key1 keyA="value1" keyB="value2" keyC="value3"/><key2 keyA="value1" keyB="value2" keyC="value3"/></row>';
	test.deepEqual(XMLMapping.load(input), { key1 : { keyA: 'value1', keyB: 'value2', keyC: 'value3' }, key2 : { keyA: 'value1', keyB: 'value2', keyC: 'value3' } });
	test.done();
};

exports['t03a'] = function (test) {
	input = '<key/>';
	test.deepEqual(XMLMapping.load(input), { key : [] });
	test.done();
}
exports['t03b'] = function (test) {
	input = '<key/><key/>';
	test.deepEqual(XMLMapping.load(input), { key : [{},{}] });
	input = '<key/><key/><key/>';
	test.deepEqual(XMLMapping.load(input), { key : [{},{},{}] });
	test.done();
}
exports['t03c'] = function (test) {
	input = '<key>value1</key><key>value2</key>';
	test.deepEqual(XMLMapping.load(input), { key : [{ $t : 'value1'}, { $t : 'value2'}] });
	input = '<key>value1</key><key>value2</key><key>value3</key>';
	test.deepEqual(XMLMapping.load(input), { key : [{ $t : 'value1'}, { $t : 'value2'}, { $t : 'value3'}] });
	test.done();
};
exports['t03d'] = function (test) {
	input = '<key><!--value1--></key>';
	test.deepEqual(XMLMapping.load(input), { key : { $c : 'value1'} });
	input = '<key><!--value1--><!--value2--></key>';
	test.deepEqual(XMLMapping.load(input), { key : { $c : ['value1','value2'] } });
	input = '<key><!--value1--></key><key><!--value2--></key>';
	test.deepEqual(XMLMapping.load(input), { key : [{ $c : 'value1'}, { $c : 'value2'}] });
	input = '<key><!--value1--></key><key><!--value2--></key><key><!--value3--></key>';
	test.deepEqual(XMLMapping.load(input), { key : [{ $c : 'value1'}, { $c : 'value2'}, { $c : 'value3'}] });
	test.done();
};
exports['t03e'] = function (test) {
	input = '<key><![CDATA[value1]]></key>';
	test.deepEqual(XMLMapping.load(input), { key : { $cd : 'value1'} });
	input = '<key><![CDATA[value1]]><![CDATA[value2]]></key>';
	test.deepEqual(XMLMapping.load(input), { key : { $cd : ['value1', 'value2']} });
	input = '<key1><key2><![CDATA[value1]]></key2><key3><![CDATA[value2]]></key3></key1>';
	test.deepEqual(XMLMapping.load(input), { key1 : { key2 : { $cd : 'value1'}, key3 : { $cd : 'value2'} } });
	input = '<key><![CDATA[value1]]></key><key><![CDATA[value2]]></key><key><![CDATA[value3]]></key>';
	test.deepEqual(XMLMapping.load(input), { key : [{ $cd : 'value1'}, { $cd : 'value2'}, { $cd : 'value3'}] });
	test.done();
};
exports['t04'] = function (test) {
	input = '<?xml version="1.0" encoding="UTF-8"?>\n<key1 key2="value1"><key3>value2</key3></key1>';
	test.deepEqual(XMLMapping.load(input), { key1 : { key2 : 'value1', key3 : { $t : 'value2'} } });
	input = '<key1 key2="value1"><key3>value2</key3></key1>';
	test.deepEqual(XMLMapping.load(input), { key1 : { key2 : 'value1', key3 : { $t : 'value2'} } });
	input = '<key1 key2="value1"><key3><key4>value2</key4></key3></key1>';
	test.deepEqual(XMLMapping.load(input), { key1 : { key2 : 'value1', key3 : { key4 : { $t : 'value2'} } } });
	input = '<key1 key2="value1"><key3><key4><key5>value2</key5></key4></key3></key1>';
	test.deepEqual(XMLMapping.load(input), { key1 : { key2 : 'value1', key3 : { key4 : { key5 : { $t : 'value2'} } } } });
	input = '<key1><key2 key3="value"><key4 key5="value" key6="value"><key7 key8="value" key9="value" key10="value">value</key7></key4></key2></key1>';
	test.deepEqual(XMLMapping.load(input), { key1 : { key2 : { key3 : 'value', key4 : { key5 : 'value', key6 : 'value', key7 : { key8 : 'value', key9 : 'value', key10 : 'value', $t : 'value' } } } } });
	test.done();
};
exports['t05'] = function (test) {
  input = '<key1><key2>value1</key2><key3>value2</key3></key1>';
  test.deepEqual(XMLMapping.load(input), { key1 : {  key2 : { $t : 'value1'}, key3 : { $t : 'value2'} } });
  input = '<key1 key2="value1"><key3>value2</key3><key4>value3</key4></key1>';
  test.deepEqual(XMLMapping.load(input), { key1 : { key2 : 'value1', key3 : { $t : 'value2'} , key4 : { $t : 'value3'} } });
  test.done();
};

exports['t06a'] = function (test) {
  input = {};
  var caughtError = false;
  try {
    XMLMapping.load(input);
  } catch (err) {
    caughtError = true;
  }
  test.equal(caughtError, false);
  try {
    XMLMapping.load(input, {throwErrors: true});
  } catch (err) {
    caughtError = true;
  }
  test.equal(caughtError, true);
  test.done();
};

exports['t06b'] = function (test) {
  input = '<key1><key2>value1</key2><key3>value2</key3><partialTag';
  var caughtError = false;
  try {
    XMLMapping.load(input);
  } catch (err) {
    caughtError = true;
  }
  test.equal(caughtError, false);
  try {
    XMLMapping.load(input, {throwErrors: true});
  } catch (err) {
    caughtError = true;
  }
  test.equal(caughtError, true);
  test.done();
};

exports['t06c'] = function (test) {
  input = '<key1><key2>value1</key2><key3>value2</key3>';
  var caughtError = false;
  try {
    XMLMapping.load(input);
  } catch (err) {
    caughtError = true;
  }
  test.equal(caughtError, false);
  try {
    XMLMapping.load(input, {throwErrors: true});
  } catch (err) {
    caughtError = true;
  }
  test.equal(caughtError, true);
  test.done();
};

exports['t07'] = function (test) {
	input = '<key1>value1</key1><key2><key3>value3</key3></key2>';
	var options = {
		arrays: [
			'/key1',
			'/key2/key3'
		]
	};

	var expectedOutput = {
		// key1 is array because of /key1
		key1: [{
			$t: 'value1'
		}],
		// key2 is not an array
		key2: {
			// key3 is an array because of /key2/key3
			key3: [{
				$t: 'value3'
			}]
		}
	};
	test.deepEqual(XMLMapping.load(input, options), expectedOutput);
	test.done();
};

exports['t08a'] = function (test) {
  input = '<!-- comment --><key1><key2 attr="value1"/><key3 attr="value2"/></key1>';
  test.deepEqual(XMLMapping.load(input), { '$c': 'comment', key1 : {  key2 : { attr : 'value1'}, key3 : { attr : 'value2'} } });
  test.done();
};
exports['t08b'] = function (test) {
  input = '<!-- comment --><key1><key2 attr="value1"/><key3 attr="value2"/></key1>';
  test.deepEqual(XMLMapping.load(input, {comments: false}), { key1 : {  key2 : { attr : 'value1'}, key3 : { attr : 'value2'} } });
  test.done();
};

exports['t09'] = function (test) {
  input = '<!-- comment --><key1><key2><![CDATA[value1]]></key2><key3>value2</key3></key1>';
  test.deepEqual(XMLMapping.load(input, {longTag: true}), { '$comment' : 'comment', key1 : {  key2 : { '$cdata' : 'value1'}, key3 : { '$text' : 'value2'} } });
  test.done();
};
exports['t09b'] = function (test) {
  input = '<!-- comment --><key1><key2><![CDATA[value1]]></key2><key3>value2</key3></key1>';
  test.deepEqual(XMLMapping.load(input, {specialChar: '@' }), { '@c' : 'comment', key1 : {  key2 : { '@cd' : 'value1'}, key3 : { '@t' : 'value2'} } });
  test.done();
};
exports['t09t'] = function (test) {
  input = '<!-- comment --><key1><key2><![CDATA[value1]]></key2><key3>value2</key3></key1>';
  test.deepEqual(XMLMapping.load(input, {specialChar: '@', longTag: true }), { '@comment' : 'comment', key1 : {  key2 : { '@cdata' : 'value1'}, key3 : { '@text' : 'value2'} } });
  test.done();
};






/* */
