(function(core, view) {
    view.register('leftsuspend', function(element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/LeftSuspendMedia.js';

        content = content[0];

        window.sinaadsLeftsuspendClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsLeftsuspendViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        var leftSuspendrMediaData = {
            width: width,
            height: height,
            src: content.src[0] || '',
            type: content.type[0] || '',
            link: content.link[0] || '',
            monitor: content.origin_monitor,
            pv : content.pv,
            cookieKey: config.sinaads_ls_cookieKey,
            root: config.sinaads_ls_root,
            pdps: config.sinaads_ad_pdps
        };
        if (window.sinaadToolkit.LeftSuspendMedia) {
            new window.sinaadToolkit.LeftSuspendMedia(leftSuspendrMediaData);
        } else {
            window.sinaadToolkit.sio.loadScript(RESOURCE_URL, function() {
                new window.sinaadToolkit.LeftSuspendMedia(leftSuspendrMediaData);
            });
        }
    });
})(core, viewModule);