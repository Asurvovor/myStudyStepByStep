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


    function PopMedia(element, config) {
        var position = config.position || 'center center',
            buttonSize = [60, 22],
            buttonBackground = MAIN_CLOSE_ICON_FOR_OTHER,
            height = config.height,
            mainPadding = 0;

        this.closetime = config.closetime || 0;

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

        var CloseContent = this.CloseContent = document.createElement('div');
        CloseContent.style.cssText = [
            'width:60px',
            'height:18px',
            'background:#000',
            'opacity:0.5',
            'filter:alpha(opacity=50)',
            'display:none',
            'position:absolute',
            'top:0',
            'right:' + buttonSize[0] + 'px',
            'z-index:' + CLOSE_ZINDEX,
            'font-size:12px',
            'font-family:宋体'
        ].join(';');

        var CloseTips = this.CloseTips = document.createElement('div');
        CloseTips.style.cssText = [
            'width:50px',
            'height:18px',
            'line-height:18px',
            'padding:0 0 0 3px',
            'position:absolute',
            'top:0',
            'left:0',
            'color:#fff'
        ].join(';');

        var CloseTimes = this.CloseTimes = document.createElement('div');
        CloseTimes.style.cssText = [
            'width:10px',
            'height:18px',
            'line-height:18px',
            'overflow:hidden',
            'position:absolute',
            'top:0',
            'left:43px',
            'color:#ff0000'
        ].join(';');

        main.getMain().appendChild(button);
        main.getMain().appendChild(CloseContent);
        CloseContent.appendChild(CloseTips);
        CloseContent.appendChild(CloseTimes);
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
                sinaadToolkit.swf.hackAutoPlay(element, adContent);
                break;
            default :
                //创建广告渲染的沙箱环境，并传递部分广告参数到沙箱中
                sinaadToolkit.sandbox.create(element, config.width + 'px', config.height + 'px', adContent, {
                    sinaads_uid             : 'PopMediaSandbox' + UID++,
                    sinaads_ad_pdps         : config.pdps,
                    sinaads_ad_width        : config.width,
                    sinaads_ad_height       : config.height
                });
                break;
        }

        sinaadToolkit.event.on(button, 'click', this._getCloseHandler());

        try {
            sinaadToolkit.debug('Media: In building pop(' + config.pdps + ')complete!');
            mediaControl.done(config.pdps);
        } catch (e) {}
    }

    PopMedia.prototype = {
        _getCloseHandler : function () {
            var me = this;
            return function CloseTime() {
                    if (me.closetime === 0) {
                        me.hide();
                    } else {
                        me.CloseContent.style.display = "block";
                        me.CloseTips.innerHTML = "关闭中";
                        me.CloseTimes.innerHTML = me.closetime;
                        me.closetime--;
                    }
                    setTimeout(function () {
                        new CloseTime();
                    }, 1000);
            };
        },
        hide : function () {
            this.main.hide();
        }
    };

    sinaadToolkit.PopMedia = sinaadToolkit.PopMedia || PopMedia;

})(window, window.sinaadToolkit, window.sinaadsROC);