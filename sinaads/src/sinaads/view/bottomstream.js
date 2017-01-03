(function (core, view) {
        view.register('bottomstream', function (element, width, height, content, config) {
            core.debug('sinaads:Rendering bottomstream.');
            var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/BottomStreamMedia.js';

            window.sinaadsROC.bottomstream = config.sinaads_ad_pdps;
            
            content = content[0];
            //流媒体，隐藏掉该区块
            element.style.cssText = 'position:absolute;top:-9999px';

            //暴露个变量供第三方使用监测链接
            //WTF，如果多个video就shi了
            window.sinaadsBottomStreamMonitor = content.origin_monitor || [];
            window.sinaadsBottomStreamClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
            window.sinaadsBottomStreamViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

            if (content.src.length === 1) {
                //生成一个用于渲染容器到页面中
                var bottomStreamContainer = document.createElement('div');
                bottomStreamContainer.id = 'BottomSteamMediaWrap';
                document.body.insertBefore(bottomStreamContainer, document.body.firstChild);

                switch (content.type[0]) {
                    case 'js' :
                        //富媒体供应商提供的js
                        core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                        break;
                    case 'html' :
                        core.dom.fill(element, content.src[0]);
                        break;
                    default :
                        break;
                }
            } else {
                //这里认为如果给的是素材的话，那么素材必须大于1个，否则为js类型
                //注入流媒体数据
                var BottomStreamMediaData = {
                    main : {
                        type    : content.type[0] || 'flash',
                        src     : content.src[0] || '',
                        link    : content.link[0] || '',
                        width   : width,
                        height  : height,
                        top     : config.sinaads_top || 0
                    },
                    middle : {
                        src     : content.src[1] || '',
                        type    : content.type[1] || 'flash',
                        link    : content.link[1] || content.link[0] || '',
                        width   : width
                    },
                    mini : {
                        src     : content.src[2] || '',
                        type    : content.type[2] || 'flash',
                        link    : content.link[2] || content.link[0] || ''
                    },
                    pdps: config.sinaads_ad_pdps,
                    monitor : content.monitor
                };
                if (core.BottomStreamMedia) {
                    new core.BottomStreamMedia(BottomStreamMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.BottomStreamMedia(BottomStreamMediaData);
                    });
                }
            }
        });
})(core, viewModule);