(function (core, view) {
    /**
     * 创建常规广告的曝光请求html
     * @param  {[type]} element [description]
     * @param  {[type]} config  [description]
     * @return {[type]}         [description]
     */
    view.register('embed', function (element, width, height, content, config) {
        //暂时让embed只支持一个广告
        content = core.array.ensureArray(content);
        content = content[0];

        var uid         = config.sinaads_uid,
            type        = content.type || '',
            link        = content.link || '',
            src         = content.src || '',
            pdps        = config.sinaads_ad_pdps,
            tpl         = config.sinaads_ad_tpl || '',
            adContent;

        //如果是ios设备且类型为flash 退出，不渲染广告，但这里有曝光已经发送
        // if (core.browser.iphone && core.browser.ipad && 'flash' === type) {
        //     //保证嵌入式广告的顺序也可以被控制
        //     try {
        //         window.sinaadsROC.done(pdps);
        //     } catch (e) {}
        //     return;
        // }
        /**
         * 自适应宽度, 针对图片和flash
         */
        if (config.sinaads_ad_fullview && (type[0] === 'flash' || type[0] === 'image')) {
            width = '100%';
            height = 'auto';
        } else {
            width += 'px';
            height += 'px';
        }

        element.style.cssText += ';display:block;overflow:hidden;text-decoration:none;';
        element.innerHTML = '<ins style="text-decoration:none;margin:0px auto;width:' + width + ';display:block;position:relative;overflow:hidden;"></ins>';

        var ad_logo_update_IAB =  document.createElement('div');
        ad_logo_update_IAB.style.cssText = 'width:26px;height:13px;position:absolute;right:1px;bottom:1px;z-index:99;background:url("//d2.sina.com.cn/litong/zhitou/sinaads/release/ad_logo_update_IAB.gif") no-repeat';
        element = element.getElementsByTagName('ins')[0];


        adContent = src ? core.ad.createHTML(type, src, width, height, link, content.origin_monitor, content.pv, core.isFunction(tpl) ? tpl(0, content) : tpl) : ''; //广告内容， 如果没有src，则不渲染 
        /**添加fuyi 标签icon*/
        //从adid中解析出广告相关信息
        function adInfoFromAdId(adid) {
            var info = {};
            adid = (adid || '').split('_');
            //type
            switch (adid[0].toLowerCase()) {
                case "sina" :
                    info.type = "sina";
                    info.id = adid[1] || '';
                    break;
                case "dsp" :
                    if (17 === parseInt(adid[1], 10)) {
                        info.type = "ea";
                    } else {
                        info.type = adid[1] || '';
                    }
                    info.id = adid[2] || '';
                    break;
                case "bottom":
                    info.type = "bottom";
                    info.id = adid[1] || '';
                    break;
                default:
                    info.type = "unknow";
                    info.id = adid[1] || '';
                    break;
            }
            return info;
        }

        //类型为ea,且在icon白名单中
        if ('ea' === adInfoFromAdId(content.ad_id).type && FUYI_WHITE_PDPS[pdps]) {
            element.style.position = "relative";
            adContent += '<a target="_blank" href="' + FUYI_GX_URL + '" style="position:absolute;left:0;top:0;z-index:20;">' +
                            '<img src="' + FUYI_GX_ICON + '" width="18" height="18" border="0">' +
                        '</a>';
        }
        /** end */
        //增加广告标签，9.1新广告法要求
        //过滤不要加的广告
        function isDenied(pdps, src) {
            //黑名单里面的不加
            if (AD_LOGO_BLACK_PDPS[pdps]) {
                return true;
            }
            //是京东包版
            if (src[0].indexOf('x.jd.com') !== -1) {
                return true;
            }
            if (!AD_LOGO_WHITE_PDPS[pdps]) {
                return true;
            }
            return false;
        }
        if (!isDenied(pdps, src)) {
            var logo_position = AD_LOGO_WHITE_PDPS[pdps];
            var logo_position_css_map = {
                'lb': 'left:0;bottom:0',
                'lt': 'left:0;top:0',
                'rt': 'right:0;top:0',
                'rb': 'right:0;bottom:0'
            };
            adContent += '<a target="_blank" href="' + AD_ICON_URL + '" style="position:absolute;' + logo_position_css_map[logo_position] + ';z-index:20;">' +
                        '<img src="' + GET_AD_ICON(logo_position) + '" width="30" height="16" border="0">' +
                    '</a>';
        }

        if (tpl) {
            element.innerHTML  = adContent; //广告内容， 如果没有src，则不渲染
            //var clearDiv = document.createElement("div");
            //clearDiv.style.cssText = 'clear:both';
            //element.appendChild(clearDiv);
            element.appendChild(ad_logo_update_IAB);
        } else {
            switch (type[0]) {
                case 'text' :
                case 'image' :
                case 'url' :
                case 'adbox' :
                case 'flash' :
                    core.swf.hackAutoPlay(element, adContent);
                    break;
                default :
                    //创建广告渲染的沙箱环境，并传递部分广告参数到沙箱中
                    core.sandbox.create(element, width, height, adContent, {
                        sinaads_uid             : uid,
                        sinaads_ad_pdps         : pdps,
                        sinaads_ad_width        : width,
                        sinaads_ad_height       : height
                    });
                    break;
            }
        }

        if(type[0] === "image" || type[0] === "flash"){
            element.appendChild(ad_logo_update_IAB);
        }
        else if(src[0].indexOf('//d3.sina.com.cn/litong/zhitou/sinaads/release/picshow_new.swf') >= 0){
            //用来判断翻牌广告添加广告标识
            element.appendChild(ad_logo_update_IAB);
        }

        //保证嵌入式广告的顺序也可以被控制
        //try {
        //    window.sinaadsROC.done(pdps);
        //} catch (e) {}
    });
})(core, viewModule);
