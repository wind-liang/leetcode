'use strict';
var XMLMapping = require('../');

exports['t01'] = function (test) {
  var options = { 
    nested : true, 
    throwErrors: true,
    parserInfos: true
  };
  var input = '<root><a>1</a><b>2</b><a>3</a></root>';
  var expected  = { 
    root: 
    { '$o': 1,
      '$y': 1,
      '$x': 1,
      '$n': 'root',
      a: [ { '$o': 2,
        '$y': 1,
        '$x': 7,
        '$n': 'a',
        '$t': '1' },
      { '$o': 4,
        '$y': 1,
        '$x': 23,
        '$n': 'a',
        '$t': '3' } ],
      b: { '$o': 3,
        '$y': 1,
        '$x': 15,
        '$n': 'b',
        '$t': '2' 
      } 
    } 
  };
  var actual = XMLMapping.load(input, options);
  test.deepEqual(actual, expected);
  test.done();
};

