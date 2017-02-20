/**
 * 底浮流媒体
 * @param  {[type]} window    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";

    var MAIN_CLOSE_ICON1 = '//d1.sina.com.cn/litong/zhitou/sinaads/77x31-close.gif',
        MAIN_CLOSE_ICON2 = '//d1.sina.com.cn/litong/zhitou/sinaads/75x22-close.gif',
        MIDDLE_REPLAY_ICON = '//d1.sina.com.cn/litong/zhitou/sinaads/demo/changwy/middleplay.gif',
        MIDDLE_CLOSE_ICON = '//d1.sina.com.cn/litong/zhitou/sinaads/51x31-close.gif',
        REPLAY_ICON = '//d5.sina.com.cn/d1images/lmt/play.gif',
        MINI_CLOSE_ICON = '//d1.sina.com.cn/litong/zhitou/sinaads/25x65_1-close.gif',

        MAIN_ZINDEX = 11990,
        MIDDLE_ZINDEX = 10510,
        MIN_ZINDEX = 9990,
        SHOW_COUNT = 2; //自动显示次数

    function BottomStreamMedia(config) {
        var THIS = this;
        this.deferred = new sinaadToolkit.Deferred();
        //test code
        //config.duration = 8000000;

        //频次控制，24小时内只能自动播放2次
        var showCount = sinaadToolkit.storage.get('BottomStreamMedia' + config.pdps);
        showCount = showCount ? (parseInt(showCount, 10) + 1) : 1;
        sinaadToolkit.storage.set('BottomStreamMedia' + config.pdps, showCount, 24 * 60 * 60 * 1000);

        var width = this.width = config.main.width,
            height = this.height = config.main.height;

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        this.config = config;
        this.pdps = config.pdps;
        
        var main = this.main = new sinaadToolkit.Box({
            width : width,
            height : height,
            position : 'center bottom',
            follow : 1,
            zIndex : MAIN_ZINDEX,
            className : 'sinaads-bottomstream-main'
        });
        var middle = this.middle = new sinaadToolkit.Box({
            width : width,
            height : 80,
            position : 'center bottom',
            follow : 1,
            zIndex : MIDDLE_ZINDEX,
            className : 'sinaads-bottomstream-middle'
        });
        var mini = this.mini = new sinaadToolkit.Box({
            width : 25,
            height : 239,
            position : 'right bottom',
            follow : 1,
            zIndex : MIN_ZINDEX,
            className : 'sinaads-bottomstream-side'
        });

        var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
        mainCloseBtn.style.cssText = [
            'width:' + (width > 375 ? 77 : 75) + 'px',
            'height:' + (width > 375 ? 31 : 22) + 'px',
            'position:absolute',
            'right:0px',
            'bottom:' + height + 'px',
            'z-index:' + MAIN_ZINDEX,
            'background:url(' + (width > 375 ? MAIN_CLOSE_ICON1 : MAIN_CLOSE_ICON2) + ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');
        var middleCloseBtn = this.middleCloseBtn = document.createElement('div');
        middleCloseBtn.style.cssText = [
            'width:51px',
            'height:31px',
            'position:absolute',
            'right:0px',
            'bottom:80px',
            'z-index:' + MIDDLE_ZINDEX,
            'background:url(' + MIDDLE_CLOSE_ICON + ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');
        var middleReplayBtn = this.middleReplayBtn = document.createElement("div");
        middleReplayBtn.style.cssText = [
            'width:35px',
            'height:31px',
            'position:absolute',
            'right:51px',
            'bottom:80px',
            'z-index:' + MIDDLE_ZINDEX,
            'background:url(' + MIDDLE_REPLAY_ICON + ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');

        var miniCloseBtn = this.miniCloseBtn = document.createElement('div');
        miniCloseBtn.style.cssText = 'margin:0px;padding:0px;display:block;cursor:pointer;width:25px;height:65px;position:absolute;left:0px;top:174px;background:url(' + MINI_CLOSE_ICON + ') no-repeat center;';
        var miniReplayBtn = this.miniReplayBtn = document.createElement("div");
        miniReplayBtn.style.cssText = 'width:25px;height:24px;position:absolute;left:0px;top:150px;background:url(' + REPLAY_ICON + ') no-repeat center;margin:0px;padding:0px;display:block;cursor:pointer;';


        sinaadToolkit.event.on(miniCloseBtn, 'click', this.getCloseMiniHandler());
        sinaadToolkit.event.on(miniReplayBtn, 'click', this.getReplayHandler());
        sinaadToolkit.event.on(mainCloseBtn, 'click', this.getCloseMainHandler());
        sinaadToolkit.event.on(middleCloseBtn, 'click', this.getCloseMiddleHandler());
        sinaadToolkit.event.on(middleReplayBtn, 'click', this.getReplayMiddleHandler());
        
        var mainContent = this.mainContent = document.createElement('div');
        var middleContent = this.middleContent = document.createElement('div');
        var miniContent = this.miniContent = document.createElement('div');
        
        main.getMain().appendChild(mainContent);
        main.getMain().appendChild(mainCloseBtn);

        middle.getMain().appendChild(middleContent);
        middle.getMain().appendChild(middleCloseBtn);
        middle.getMain().appendChild(middleReplayBtn);

        mini.getMain().appendChild(miniContent);
        mini.getMain().appendChild(miniReplayBtn);
        mini.getMain().appendChild(miniCloseBtn);

        //bug
        // document.body.insertBefore(main.getMain(), document.body.firstChild);
        // document.body.insertBefore(mini.getMain(), document.body.firstChild);

        if (this.delay) {
            setTimeout(function () {
                showCount > SHOW_COUNT ? THIS.hide() : THIS.show();
            }, this.delay * 1000);
        } else {
            showCount > SHOW_COUNT ? this.hide() : this.show();
        }

    }
    BottomStreamMedia.prototype = {
        timer : null,
        show : function () {
            var THIS = this,
                config = this.config;

            clearTimeout(this.timer);
            this.middleContent.innerHTML = '';
            this.miniContent.innerHTML = '';
            sinaadToolkit.ad.embed(
                this.mainContent,
                config.main.type,
                config.main.width,
                config.main.height,
                sinaadToolkit.ad.createHTML(
                    config.main.type,
                    config.main.src,
                    config.main.width,
                    config.main.height,
                    config.main.link || config.link,
                    config.monitor,
                    config.pv,
                    '',
                    {
                        wmode : 'transparent'
                    }
                )
            );
            this.main.show();
            this.middle.hide();
            this.mini.hide();

            this.timer = setTimeout(function () {
                THIS.show_hide();
            },  config.duration || 8000);
        },
        show_hide : function () {
            var THIS = this,
                config = this.config;

            clearTimeout(this.timer);
            this.mainContent.innerHTML = '';
            this.miniContent.innerHTML = '';
            this.main.hide();
            this.mini.hide();
            this.middle.show();
            sinaadToolkit.ad.embed(
                this.middleContent,
                config.middle.type,
                config.middle.width,
                80,
                sinaadToolkit.ad.createHTML(
                    config.middle.type,
                    config.middle.src,
                    config.middle.width,
                    80,
                    config.middle.link || config.link,
                    config.monitor,
                    config.pv,
                    '',
                    {
                        wmode : 'transparent'
                    }
                )
            );

            this.timer = setTimeout(function () {
                THIS.hide();
            },  config.duration || 8000);
        },
        hide : function () {
            var config = this.config;

            clearTimeout(this.timer);
            this.mainContent.innerHTML = '';
            this.middleContent.innerHTML = '';
            this.mini.show();
            this.middle.hide();
            this.main.hide();
            sinaadToolkit.ad.embed(
                this.miniContent,
                config.mini.type,
                25,
                150,
                sinaadToolkit.ad.createHTML(
                    config.mini.type,
                    config.mini.src,
                    25,
                    150,
                    config.mini.link || config.link,
                    config.monitor,
                    config.pv
                )
            );
            try {
                sinaadToolkit.debug('Media: In building bottomstream complete!');
                mediaControl.done(mediaControl.bottomstream);
            } catch(e) {}
        },
        //关闭标签
        getCloseMiniHandler : function () {
            var THIS = this;
            return function () {
                clearTimeout(THIS.timer);
                THIS.mini.hide();
                THIS.miniContent.innerHTML = '';
            };
        },
        getReplayHandler : function () {
            var THIS = this;
            return function () {
                THIS.show();
            };
        },
        getReplayMiddleHandler : function () {
            var THIS = this;
            return function () {
                THIS.show();
            };
        },
        getCloseMainHandler : function () {
            var THIS = this;
            return function () {
                THIS.hide();
            };
        },
        getCloseMiddleHandler : function () {
            var THIS = this;
            return function () {
                THIS.hide();
            };
        }
    };

    sinaadToolkit.BottomStreamMedia = sinaadToolkit.BottomStreamMedia || BottomStreamMedia;

})(window, window.sinaadToolkit, window.sinaadsROC);