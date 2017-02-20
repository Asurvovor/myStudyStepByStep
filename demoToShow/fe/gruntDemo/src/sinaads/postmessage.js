//监听postmessage数据
core.event.on(window, "message", function (e) {
    switch (e.origin) {
        case "http://g.alicdn.com":
            var data = core.json.parse(e.data);
            if (Number(data.overtime_state) === 1 || data.content.src.length === 0) {
                window.sinaadsROC.done(data.sinaads_ad_pdps);
                return;
            }
            else {
                _message(data);
                //加强验证素材后缀名这块,看能不能正则一次搞定(要是实现了就可以吹牛逼了)
                //var src = data.content.src[0],
                //    regex1 = /[^?|#]+/,
                //    regex2 = /[^\.]+$/,
                //    resultSRC = regex1.exec(src),
                //    srcType = regex2.exec(resultSRC);
                //switch (srcType[0]) {
                //    case 'swf':
                //        srcType = 'flash';
                //        break;
                //    case 'png':
                //    case 'jpg':
                //    case 'gif':
                //    case 'bmp':
                //        srcType = 'image';
                //        break;
                //}
                //if (srcType === "image" || srcType === "flash") {
                //    _message(data);
                //}
            }
            break;
    }
});