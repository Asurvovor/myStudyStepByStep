var expect = require('chai').expect;
describe('Array', function() {  
  it('#indexOf()', function() {
  	expect([1,2,3].indexOf(4)).to.be.equal(-1);
  });
});