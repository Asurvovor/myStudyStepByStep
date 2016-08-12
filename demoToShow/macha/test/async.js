var expect = require('chai').expect;
describe('异步', function() {
	it('测试应该5000毫秒后结束', function(done) {
		var f = function() {
            expect(false).to.be.not.ok;
            done(); // 通知Mocha测试结束
        };
        setTimeout(f, 4000);
    });
    it('测试应该1000毫秒后结束', function(done) {
		var f1 = function() {
            expect(true).to.be.ok;
            done(); // 通知Mocha测试结束
        };
        setTimeout(f1, 1000);
    });
});