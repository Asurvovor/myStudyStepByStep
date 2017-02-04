(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";

    var MAIN_CLOSE_BTN = '//d1.sina.com.cn/litong/zhitou/sinaads/60x18_2_close.gif';//60×18

    function BgMedia (config) {
        /*var cookie = sinaadToolkit.cookie.get('bgAdCookie' + config.pdps);
        if (cookie === '0') { //关闭后一天不再显示
            return ;
        }*/

        //body 设置背景
        this.config = config;

        var body  = document.body;

        //如果之前的cssText不以;结尾，在IE8下 样式显示不正确。
        body.style.cssText += ';background:url(' + config.src[0] + ') no-repeat center ' + config.top + 'px;margin:0px;';

        var midBg = this.midBg = document.getElementById('bgAdWrap');
        if (!midBg) {
            return;
        }
        
        midBg.style.cssText += ';position:relative;display:block;height: ' + config.headHeight + 'px;width: ' + config.midWidth + 'px;margin:0 auto;';
        midBg.innerHTML = '<a href="' + config.link[0] + '" target="_blank" style="display:block;height:' + config.headHeight + 'px;width: ' + config.midWidth + 'px;"></a>';

        var  halfWidth = (config.width - config.midWidth) / 2;
        var leftAd = this.leftAd = document.createElement('div');
        leftAd.id = 'bgLeftAd';
        leftAd.style.cssText += ';position: absolute;overflow:hidden;height: ' + config.height + 'px;width:' + halfWidth + 'px;left:0px;top: ' + config.top + 'px';
        body.appendChild(leftAd);

        var rightAd = this.rightAd = document.createElement('div');
        rightAd.id = 'bgRightAd';
        rightAd.style.cssText += ';position: absolute;overflow:hidden;height: ' + config.height + 'px;width:' + halfWidth + 'px;left:0px;top: ' + config.top + 'px';
        //var ad_logo_update_IAB =  document.createElement('div');
        //ad_logo_update_IAB.style.cssText = 'width:54px;height:26px;position:absolute;right:0;bottom:0;background:url("http://d2.sina.com.cn/litong/zhitou/sinaads/release/ad_logo_update_IAB.gif") no-repeat';
        //rightAd.appendChild(ad_logo_update_IAB);
        body.appendChild(rightAd);


        if (config.src[1]) { //左右两侧有广告内容
            var type = config.type[1] || config.type[0],
                src = config.src[1],
                options = {};
            //避免flash覆盖背景
            if (type === 'flash' || /\.swf$/.test(src)) {
                options = {wmode: 'transparent'};
            }
            sinaadToolkit.ad.embed(
                leftAd,
                type,
                halfWidth,
                config.height,
                sinaadToolkit.ad.createHTML(
                    type,
                    src,
                    halfWidth,
                    config.height,
                    config.link[1] || config.link[0],
                    config.monitor,
                    config.pv,
                    undefined,
                    options
                )
            );

            type = config.type[2] || config.type[1] || config.type[0],
            src = config.src[2] || config.src[1];
            options = {};
            if (type === 'flash' || /\.swf$/.test(src)) {
                options = {wmode: 'transparent'};
            }

            sinaadToolkit.ad.embed(
                rightAd,
                type,
                halfWidth,
                config.height,
                sinaadToolkit.ad.createHTML(
                    type,
                    src,
                    halfWidth,
                    config.height,
                    config.link[2] || config.link[1] || config.link[0],
                    config.monitor,
                    config.pv,
                    undefined,
                    options
                )
            );
        } else if (config.asideClickable) {//该变量应该是只读的，应该有更好的写法
            //左右可点击
            var clickLink = document.createElement('a');
            clickLink.setAttribute('href', config.link[1] || config.link[0]);
            clickLink.setAttribute('target', '_blank');
            clickLink.style.cssText += ';display: block;height: ' + config.height + 'px;';
            leftAd.appendChild(clickLink);

            clickLink = document.createElement('a');
            clickLink.setAttribute('href', config.link[2] || config.link[1] || config.link[0]);
            clickLink.setAttribute('target', '_blank');
            clickLink.style.cssText += ';display:block;height: ' + config.height + 'px;';
            rightAd.appendChild(clickLink);
        }
        

        var closeBtn = this.closeBtn = document.createElement('div');
        closeBtn.style.cssText += ';width: 60px;height: 18px;position:absolute;right:1px;top: 6px;background:url(' + MAIN_CLOSE_BTN + ') no-repeat right center #ebebeb;cursor:pointer';
        midBg.appendChild(closeBtn);

        //初始调整大小
        this.getResizeHandler()();

        this.resizeHandler = this.getResizeHandler(); //保存下来，为了解绑window上的事件
        sinaadToolkit.event.on(window, 'resize', this.resizeHandler);
        sinaadToolkit.event.on(closeBtn, 'click', this.getCloseHandler());

        try {
            sinaadToolkit.debug('Media: In building bg complete!');
            mediaControl.done(mediaControl.bg);
        } catch(e) {}
    }

    BgMedia.prototype = {
        getResizeHandler: function () {
            var me = this;
            return function () {
                var midWidth = me.config.midWidth;
                var midX = sinaadToolkit.dom.getPosition(document.getElementById('bgAdWrap')).left;
                var  halfWidth = (me.config.width - me.config.midWidth) / 2;
                me.leftAd.style.left = (midX - halfWidth) + 'px';
                me.rightAd.style.left = (midX + midWidth) + 'px';

                var remainWidth = document.body.clientWidth - me.config.midWidth;
                if (remainWidth < 0) {
                    remainWidth = 0;
                }
                me.rightAd.style.width = Math.floor(Math.min(remainWidth / 2, halfWidth)) + 'px';
            };
        },
        getCloseHandler: function () {
            var me = this;
            return function () {
                //sinaadToolkit.cookie.set('bgAdCookie' + me.config.pdps, 0 , 24 * 60 * 60 * 1000);
                sinaadToolkit.event.un(window, 'resize', me.resizeHandler);
                document.body.style.cssText += ';background:none;';
                me.midBg.style.display = 'none';
                me.leftAd.style.display = 'none';
                me.rightAd.style.display = 'none';
            };
        }
    };

    sinaadToolkit.BgMedia = sinaadToolkit.BgMedia || BgMedia;

})(window, window.sinaadToolkit, window.sinaadsROC);