(function (core, view) {
    view.register('couplet', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering couplet.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/CoupletMedia.js';

        window.sinaadsROC.couplet = config.sinaads_ad_pdps;

        content = content[0]; //只用第一个内容

        window.sinaadsCoupletClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsCoupletViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        //是跨栏，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        //这里认为如果couplet类型给的是素材的话，那么素材必须大于1个，否则为html类型
        if (content.src.length === 1 && (content.type[0] === 'js' || content.type[0] === 'html' || content.type[0] === 'postmessage')) {
            switch (content.type[0]) {
                case 'js' :
                    core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                    break;
                case 'html' :
                    core.dom.fill(element, content.src[0]);
                    break;
                case 'postmessage' :
                    if (core.browser.ie <= 7) {
                        window.sinaadsROC.done(config.sinaads_ad_pdps);
                        return;
                    }
                    else {
                        var sinaads_ad_type = 'couplet';
                        var data = {
                            "sinaads_ad_pdps": config.sinaads_ad_pdps,
                            "sinaads_ad_type": sinaads_ad_type,
                            "sinaads_page_url": config.sinaads_page_url,
                            "sinaads_couple_top": config.sinaads_couple_top,
                            "sinaads_ad_width": config.sinaads_ad_width,
                            "sinaads_ad_height": config.sinaads_ad_height,
                            "sinaads_uid": config.sinaads_uid,
                            "ad_id": content.ad_id
                        };
                        var Data = core.json.stringify(data);
                        var ifram = document.createElement("iframe");
                        ifram.width = "0";
                        ifram.height = "0";
                        //如果content.src[0]未加载成功也应考虑sinaadsROC.done问题
                        ifram.src = content.src[0];
                        ifram.name = Data;
                        element.appendChild(ifram);
                    }
                    break;
                default :
                    break;
            }
        } else {
            //注入跨栏数据
            var CoupletMediaData = {
                pdps: config.sinaads_ad_pdps,
                src: content.src,
                type: content.type,
                link: content.link,
                mainWidth: config.sinaads_ad_main_width,
                mainHeight: config.sinaads_ad_main_height,
                top: config.sinaads_couple_top || 0,
                monitor: content.origin_monitor || [],
                pv: content.pv || [],
                sideWidth: config.sinaads_ad_side_width,
                sideHeight: config.sinaads_ad_side_height
            };
            if (core.CoupletMediaData) {
                new core.CoupletMedia(CoupletMediaData);
            } else {
                core.sio.loadScript(RESOURCE_URL, function () {
                    new core.CoupletMedia(CoupletMediaData);
                });
            }
        }
    });


    view.register('coupletExt', function (element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/CoupletExtMedia.js';

        window.sinaadsCoupletExtClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsCoupletExtViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        content = content[0]; //只用第一个内容
        //是对联，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        //注入跨栏数据
        var CoupletExtMediaData = {
            src: content.src,
            type: content.type,
            link: content.link,
            width: width,
            height: height,
            offsettop: config.sinaads_coupletext_offsettop || 100,
            expandpos: config.sinaads_coupletext_expandpos || 1200,
            smallsize: config.sinaads_coupletext_smallsize,
            bigsize: config.sinaads_coupletext_bigsize,
            monitor: content.origin_monitor || [],
            pv: content.pv || []
        };
        if (core.CoupletExtMediaData) {
            new core.CoupletExtMedia(CoupletExtMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.CoupletExtMedia(CoupletExtMediaData);
            });
        }
    });
})(core, viewModule);