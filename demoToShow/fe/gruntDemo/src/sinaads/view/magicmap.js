(function (core, view) {
    view.register('magicmap', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering magicmap.');

        window.sinaadsROC.magicmap = config.sinaads_ad_pdps;

        content = content[0];

        //暴露个变量供第三方使用监测链接
        window.sinaadsMagicMapMonitor = content.origin_monitor || [];
        
        window.sinaadsMagicMapClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsMagicMapViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        if (content.src.length === 1) {
            switch (content.type[0]) {
                case 'js' :
                    //富媒体供应商提供的js
                    core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                    break;
                    //使魔图类型支持html投放
                case 'html' :
                    core.dom.fill(element,content.src[0]);
                    break;
                default :
                    break;
            }
        }
    });
})(core, viewModule);