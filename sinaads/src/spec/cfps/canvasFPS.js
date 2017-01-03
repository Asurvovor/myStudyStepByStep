// window.onload = function() {
//     var canvas = document.getElementById('myCanvas');
//     var c = canvas.getContext('2d');
//     var fpsArray = [];
//     var fpsCount = 0;
//     var stopAt = 10;
//     var fps = 0;
//     var startTime = 0;
//     var date = new Date();
//     startTime = Math.round(date.getTime() / 1000);
//     c.font = '20px _sans';
//     draw(startTime);
//     function draw(timeStamp) {
//         var date = new Date();
//         ts = Math.round(date.getTime() / 1000);
//         if (timeStamp !== ts) {
//             fps = fpsCount;
//             fpsCount = 0;
//             fpsArray.push(fps);
//         } else {
//             fpsCount++;
//         }
//         c.fillStyle = '#000000';
//         c.fillRect(0, 0, canvas.width, canvas.height);
//         c.fillStyle = '#FFFFFF';
//         c.fillText("TS: " + timeStamp, 10, 20);
//         c.fillText("FPS: " + fps, 10, 40);
//         if (timeStamp <= (startTime + stopAt)) {
//             setTimeout(function() {
//                 draw(ts);
//             },
//             1);
//         } else {
//             showResults(c, canvas);
//         }
//     }
//     // function showResults() {
//     //     var mean = 0;
//     //     var sum = 0;
//     //     c.fillStyle = '#FFFFFF';
//     //     c.fillRect(0, 0, canvas.width, canvas.height);
//     //     // sort the samples
//     //     for (var i = 0; i < fpsArray.length; i++) {
//     //         for (var j = fpsArray.length - 1; j > i; j--) {
//     //             if (fpsArray[j - 1] > fpsArray[j]) {
//     //                 fpsArray[j - 1] = fpsArray[j];
//     //             }
//     //         }
//     //     }
//     //     // discard the first value, which is usually very low
//     //     fpsArray = fpsArray.slice(1, fpsArray.length);
//     //     for (var i = 0; i < fpsArray.length; i++) {
//     //         sum = sum + fpsArray[i];
//     //     }
//     //     mean = sum / fpsArray.length;
//     //     c.fillStyle = '#000000';
//     //     c.fillText("MIN: " + fpsArray[0], 10, 20);
//     //     c.fillText("MAX: " + fpsArray[fpsArray.length - 1], 10, 40);
//     //     c.fillText("MEAN: " + (Math.round(mean * 10) / 10), 10, 60);
//     // }
// }
function CanvasMovie(options) {
    options = options || {};

    this.fps = 0;
    this.fpsCount = 0;

    var canvas = document.createElement('canvas');
    this.width = canvas.width = options.width || 1;
    this.height = canvas.height = options.height || 1;
    document.body.appendChild(canvas);
    
    this.ctx = canvas.getContext('2d');
    this.draw(Math.round((+new Date()) / 1000));
}

CanvasMovie.prototype = {
    getFPS: function () {
        return this.fps;
    },
    draw: function (timeStamp) {
        var me = this;
        var ts = Math.round((+new Date()) / 1000);
        if (timeStamp !== ts) {
            this.fps = this.fpsCount;
            this.fpsCount = 0;
        } else {
            this.fpsCount++;
        }
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillText("FPS: " + this.fps, 10, 40);
        setTimeout(function() {
            me.draw(ts);
        }, 1);
    }
}


