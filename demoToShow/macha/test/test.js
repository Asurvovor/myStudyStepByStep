
/**
 * describe(moduleName, function) 可嵌套，moduleName可任取，尽量语义化
 * it(info, function) info是测试不通过时的输出语句 
 * assert.equal(exp1, exp2)  断言语句，exp1 == exp2? 
 */

var assert = require('assert');
describe('Array', function() {  
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(5));
    });
  });
});