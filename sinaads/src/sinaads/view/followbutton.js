(function (core, view) {
    view.register('followbutton', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering followbutton.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/FollowButtonMedia.js';

        window.sinaadsROC.followbutton = config.sinaads_ad_pdps;
        content = content[0];

        window.sinaadsFollowButtonClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsFollowButtonViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        switch (content.type[0]) {
            case 'js' :
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            default :
                var FollowButtonMediaData = {
                    pdps : config.sinaads_ad_pdps,
                    src : content.src,
                    type : content.type,
                    link : content.link,
                    width : width || 180,
                    height : height || 150,
                    position : config.sinaads_followbutton_position || 'center center',
                    showPos : config.sinaads_followbutton_show_pos,
                    monitor : content.origin_monitor || [],
                    pv : content.pv || []
                };

                if (core.FollowButtonMedia) {
                    new core.FollowButtonMedia(element, FollowButtonMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.FollowButtonMedia(element, FollowButtonMediaData);
                    });
                }
                break;
        }
    });
})(core, viewModule);