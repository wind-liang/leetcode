var XMLMapping = require('../');

exports['t01'] = function (test) {
  input = '<key>aaa</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa'} });
  test.done();
};
exports['t02'] = function (test) {
  input = '<key>aaa<em>bbb</em>ccc</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa<em>bbb</em>ccc',  em: { '$t': 'bbb' }} });
  test.done();
};
exports['t03'] = function (test) {
  input = '<key><em>bbb</em>ccc</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : '<em>bbb</em>ccc',  em: { '$t': 'bbb' } } });
  test.done();
};
exports['t04'] = function (test) {
  input = '<key>aaa<em>bbb</em></key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa<em>bbb</em>', em: { '$t': 'bbb' }} });
  test.done();
};
exports['t05'] = function (test) {
  input = '<key><em>bbb</em></key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { em : { $t : 'bbb'} } });
  test.done();
};
exports['t06'] = function (test) {
  input = '<key>aaa<br/>ccc</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa<br/>ccc', br: { } } });
  test.done();
};
exports['t07'] = function (test) {
  input = '<key><br/>ccc</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : '<br/>ccc', br: { } } });
  test.done();
};
exports['t08'] = function (test) {
  input = '<key>aaa<br/></key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa<br/>', br: { } } });
  test.done();
};
exports['t09'] = function (test) {
  input = '<key><br/></key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { br : { } } });
  test.done();
};
exports['t11'] = function (test) {
  input = '<key>aaa</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa'} });
  test.done();
};
exports['t12'] = function (test) {
  input = '<key>aaa<em attr="xxx">bbb</em>ccc</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa<em attr="xxx">bbb</em>ccc',  em: { '$t': 'bbb', attr: 'xxx' }} });
  test.done();
};
exports['t13'] = function (test) {
  input = '<key><em attr="xxx">bbb</em>ccc</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : '<em attr="xxx">bbb</em>ccc',  em: { '$t': 'bbb', attr: 'xxx'  } } });
  test.done();
};
exports['t14'] = function (test) {
  input = '<key>aaa<em attr="xxx">bbb</em></key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa<em attr="xxx">bbb</em>', em: { '$t': 'bbb', attr: 'xxx'  }} });
  test.done();
};
exports['t15'] = function (test) {
  input = '<key><em attr="xxx">bbb</em></key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { em : { $t : 'bbb', attr: 'xxx' } } });
  test.done();
};
exports['t16'] = function (test) {
  input = '<key>aaa<br attr="xxx"/>ccc</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa<br attr="xxx"/>ccc', br: { attr: 'xxx'  } } });
  test.done();
};
exports['t17'] = function (test) {
  input = '<key><br attr="xxx"/>ccc</key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : '<br attr="xxx"/>ccc', br: { attr: 'xxx' } } });
  test.done();
};
exports['t18'] = function (test) {
  input = '<key>aaa<br attr="xxx"/></key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { $t : 'aaa<br attr="xxx"/>', br: { attr: 'xxx' } } });
  test.done();
};
exports['t19'] = function (test) {
  input = '<key><br attr="xxx"/></key>';
	test.deepEqual(XMLMapping.load(input, {nested : true, throwErrors: true}), { key : { br : { attr: 'xxx' } } });
  test.done();
};




