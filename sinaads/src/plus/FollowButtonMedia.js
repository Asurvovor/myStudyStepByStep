/**
 * 弹窗广告，各个位置的广告
 */
(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";

    var MAIN_CLOSE_ICON_FOR_CENTER = '//d2.sina.com.cn/litong/zhitou/sinaads/75x22-close.gif',
        MAIN_CLOSE_ICON_FOR_OTHER = '//d2.sina.com.cn/litong/zhitou/sinaads/60x18_2_close.gif',
        MAIN_ZINDEX = 11000,
        CLOSE_ZINDEX = 11010,
        UID = 0;


    function FollowButtonMedia(element, config) {
        var position = config.position || 'center center',
            buttonSize = [60, 22],
            buttonBackground = MAIN_CLOSE_ICON_FOR_OTHER,
            height = config.height,
            mainPadding = 0;

        this.showPos = config.showPos || 0;

        if ('center center' === position) {
            buttonSize = [75, 22];
            buttonBackground = MAIN_CLOSE_ICON_FOR_CENTER;
            height = parseInt(height, 10) + buttonSize[1];
            mainPadding = buttonSize[1];
        }

        var main = this.main = new sinaadToolkit.Box({
            position: position,
            width : config.width,
            height : height,
            follow : config.follow || 1,
            autoShow : 1,
            zIndex : config.zIndex || MAIN_ZINDEX
        });

        var button = this.button = document.createElement('div');
        button.style.cssText = [
            'width:' + buttonSize[0] + 'px',
            'height:' + buttonSize[1] + 'px',
            'position:absolute',
            'right:0px',
            'top:0px',
            'z-index:' + CLOSE_ZINDEX,
            'background:url(' + buttonBackground + ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');


        main.getMain().appendChild(button);
        main.getMain().appendChild(element);

        element.style.cssText += ';display:block;overflow:hidden;text-decoration:none;padding-top:' + mainPadding + 'px';
        element.innerHTML = '<ins style="text-decoration:none;margin:0px auto;display:block;overflow:hidden;width:' + config.width + 'px;height:' + config.height + 'px;"></ins>';
        element = element.getElementsByTagName('ins')[0];

        var adContent = config.src ? sinaadToolkit.ad.createHTML(
            config.type,
            config.src,
            config.width,
            config.height,
            config.link,
            config.monitor,
            config.pv
        ) : '';   //广告内容， 如果没有src，则不渲染

        switch (config.type[0]) {
            case 'text' :
            case 'image' :
            case 'url' :
            case 'adbox' :
            case 'flash' :
                element.innerHTML = adContent;
                break;
            default :
                //创建广告渲染的沙箱环境，并传递部分广告参数到沙箱中
                sinaadToolkit.sandbox.create(element, config.width + 'px', config.height + 'px', adContent, {
                    sinaads_uid             : 'FollowButtonMediaSandbox' + UID++,
                    sinaads_ad_pdps         : config.pdps,
                    sinaads_ad_width        : config.width,
                    sinaads_ad_height       : config.height
                });
                break;
        }

        sinaadToolkit.event.on(button, 'click', this._getCloseHandler());

        //设置滚动出现距离事件
        if (config.showPos) {
            this.getScrollHandler()();
            sinaadToolkit.event.on(window, 'scroll', this.getScrollHandler());
        }

        try {
            sinaadToolkit.debug('Media: In building followbutton(' + config.pdps + ')complete!');
            mediaControl.done(config.pdps);
        } catch (e) {}
    }

    FollowButtonMedia.prototype = {
        _getCloseHandler : function () {
            var me = this;
            return function () {
                me.isClose = true;
                me.hide();
            };
        },
        hide : function () {
            this.main.hide();
        },
        decideShow : function() {
            if (this.isClose) {
                return;
            }
            if (this.scrollTop > this.showPos) {
                this.main.show();
            } else {
                this.main.hide();
            }
        },
        getScrollHandler : function () {
            var me = this;
            return function () {
                me.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                me.decideShow();
            };
        }
    };

    sinaadToolkit.FollowButtonMedia = sinaadToolkit.FollowButtonMedia || FollowButtonMedia;

})(window, window.sinaadToolkit, window.sinaadsROC);