// test.js

// var assert = require('assert');
// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal(-1, [1,2,3].indexOf(4));
//     });
//   });
// });

// var expect = chai.expect;

// describe('加法函数的测试', function() {
//   it('1 加 1 应该等于 2', function() {
//     expect(add(1, 1)).to.be.equal(2);
//   });

//   it('任何数加0等于自身', function() {
//     expect(add(1, 0)).to.be.equal(1);
//     expect(add(0, 0)).to.be.equal(0);
//   });
// });

var expect = chai.expect;

describe('Array', function() {
  it('#indexOf()', function() {
    expect([1,2,3].indexOf(4)).to.be.equal(-1);
  });

  it('indexOf()2', function() {
    expect([1,2,3].indexOf(1)).to.be.equal(-1);
  });
});