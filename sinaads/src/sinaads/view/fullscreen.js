(function (core, view) {
    view.register('fullscreen', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering fullscreen');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/FullscreenMedia.js';

        window.sinaadsROC.fullscreen = config.sinaads_ad_pdps;

        content = content[0];

        window.sinaadsFullscreenClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsFullscreenViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        element.style.cssText = 'position:absolute;top:-9999px';

        window.sinaadsFullscreenMonitor = content.origin_monitor || [];

        switch (content.type[0]) {
            case 'js' :
                //富媒体供应商提供的js
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            case 'html' :
                core.dom.fill(element, content.src[0]);
                break;
            //case 'postmessage' :
                //if(core.browser.ie <= 7){
                //    window.sinaadsROC.done(config.sinaads_ad_pdps);
                //    return;
                //}
                //else {
                //    var sinaads_ad_type = 'fullscreen';
                //    var data = '{"sinaads_ad_pdps":"' + config.sinaads_ad_pdps + '","sinaads_ad_type":"' + sinaads_ad_type + '","sinaads_page_url":"' + config.sinaads_page_url + '","sinaads_ad_width":"' + config.sinaads_ad_width + '","sinaads_ad_height":"' + config.sinaads_ad_height + '","sinaads_uid":"' + config.sinaads_uid + '","ad_id":"' + content.ad_id + '"}';
                //    var ifram = document.createElement("iframe");
                //    ifram.width = "0";
                //    ifram.height = "0";
                //    ifram.src = content.src[0];
                //    ifram.name = data;
                //    element.appendChild(ifram);
                //}

                //if(core.browser.ie <= 7) {
                //    var PID = /[^?|#]+$/.exec(content.src[0]);
                //    var PID_VAL = PID[0].slice(4);
                //    var num = 0;
                //    var timer = function(str){
                //        if(typeof window.navigator[str] !== "undefined"){
                //            clearTimeout(timer);
                //            var dataStr = window.navigator[str];
                //            var data = eval("("+ dataStr +")");
                //            var src = data.content.src[0],
                //                regex1 = /[^?|#]+/,
                //                regex2 = /[^\.]+$/,
                //                resultSRC = regex1.exec(src),
                //                srcType = regex2.exec(resultSRC);
                //            switch (srcType[0]) {
                //                case 'swf':
                //                    srcType = 'flash';
                //                    break;
                //                case 'png':
                //                case 'jpg':
                //                case 'gif':
                //                case 'bmp':
                //                    srcType = 'image';
                //                    break;
                //            }
                //            if(srcType === "image" || srcType === "flash"){
                //                _message(data);
                //            }
                //        }
                //        else{
                //            setTimeout(function(){
                //                num+=1;
                //                if(num >= 8){
                //                    clearTimeout(timer);
                //                    window.sinaadsROC.done(config.sinaads_ad_pdps);
                //                    return;
                //                }else{
                //                    timer(PID_VAL);
                //                }
                //            },1000);
                //        }
                //    };
                //    timer(PID_VAL);
                //}
                //break;
            default :
                //是全屏广告，隐藏掉改区块
                var FullScreenMediaData = {
                    pdps        : config.sinaads_ad_pdps,
                    type        : content.type[0] || '',
                    src         : content.src[0] || '',
                    link        : content.link[0] || '',
                    monitor     : content.origin_monitor || [],
                    pv          : content.pv || [],
                    width       : width,
                    height      : height,
                    hasClose    : config.sinaads_fullscreen_close || ('flash' === content.type[0] ? 1 : 0)
                };
                if (core.FullscreenMedia) {
                    new core.FullscreenMedia(FullScreenMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.FullscreenMedia(FullScreenMediaData);
                    });
                }
                break;
        }
    });
})(core, viewModule);