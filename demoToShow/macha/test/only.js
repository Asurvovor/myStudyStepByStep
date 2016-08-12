// describe('Array', function() {
  
//   describe.only('#concat()', function () {
//     it('should return a new Array', function () {
//       // this test will not be run
//     });
//     it('xxx',function(){})
//   });

//   describe.only('#indexOf()', function() {
//     it('should return -1 unless present', function() {
//       // this test will be run
//     });
//     it('should return the index when present', function() {
//       // this test will be run
//     });
//   });

//   describe('#slice()', function () {
//     it('should return a new Array', function () {
//       // this test will not be run
//     });
//   });
// });

describe('Array', function() {
  describe.only('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // this test will be run
    });

    it('should return the index when present', function() {
      // this test will not be run
    });
  });
});