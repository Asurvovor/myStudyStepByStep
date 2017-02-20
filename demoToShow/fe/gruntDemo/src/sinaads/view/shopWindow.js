(function (core, view) {
    view.register('shopWindow', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering shopWindow.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/ShopWindowMedia.js';
        var mediaData = {
            pdps : config.sinaads_ad_pdps,
            width : width,
            height : height,
            content: content
        };
        if (core.ShopWindowMedia) {
            new core.ShopWindowMedia(element, mediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.ShopWindowMedia(element, mediaData);
            });
        }
    });
})(core, viewModule);