(function (window, sinaadToolkit, undefined) {
    "use strict";
    //常量定义
    var BIG_SIDE_CLOSE_BTN = '//d2.sina.com.cn/litong/zhitou/sinaads/60x18_1_close.gif',
        SMALL_SIDE_CLOSE_BTN = "//d2.sina.com.cn/litong/zhitou/sinaads/25x65_1-close.gif",
        BIG_SIDE_CLOSE_BTN_SIZE = [120, 18],
        SMALL_SIDE_CLOSE_BTN_SIZE = [25, 65],
        BIG_SIDE_SIZE = [120, 270],
        SMALL_SIDE_SIZE = [25, 270],
        OFFSET_TOP = 100,//扩展对联距顶部高度
        SCROLL_TOP = 1200,//页面滚动超过该参数扩展对联展开
        MIN_EXPAND_WIDTH = 1024;//对联展开所需窗口最小宽度，只有窗口大于1024px时对联才会展开。
    /**
     * 对联广告扩展
     * @param  {[type]} config   [description]
     * @param  {[type]} window   [description]
     * @param  {[type]} document [description]
     * @return {[type]}          [description]
     */
    function CoupletExtMedia(config) {
        /* 移动端不出广告 */
        if (sinaadToolkit.browser.mobile) {
            return;
        }

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        config.src = sinaadToolkit.array.ensureArray(config.src);
        config.type = sinaadToolkit.array.ensureArray(config.type);
        config.link = sinaadToolkit.array.ensureArray(config.link);

        config.offsettop = config.offsettop || OFFSET_TOP;
        config.expandpos = config.expandpos || SCROLL_TOP;
        var smallsize = config.smallsize = config.smallsize || SMALL_SIDE_SIZE;
        var bigsize = config.bigsize = config.bigsize || BIG_SIDE_SIZE;

        this.config = config;

        this.deferred = new sinaadToolkit.Deferred();

        var hasSmall = this.hasSmall = config.src.length === 2;

        if (hasSmall) {
            //*********************************左侧窄对联
            var leftSmall = this.leftSmall = createContainer('small', 'left ' + config.offsettop);
            var leftSmallContent = this.leftSmallContent = createAdContent(smallsize, {
                type : config.type[0],
                src : config.src[0],
                link : config.link[0],
                monitor : config.monitor,
                pv : config.pv
            }, leftSmall);
            var leftSmallCloseBtn = this.leftSmallCloseBtn = createCloseBtn('small');
            sinaadToolkit.event.on(leftSmallCloseBtn, 'click', this.getCloseSideHandler());
            fillContainer(leftSmallContent, leftSmallCloseBtn, leftSmall);
        }

        //*********************************左侧宽对联
        var leftBig = this.leftBig = createContainer('big', 'left ' + config.offsettop);
        var leftBigContent = this.leftBigContent = createAdContent(bigsize, {
            type : config.type[1] || config.type[0],
            src : config.src[1] || config.src[0],
            link : config.link[1] || config.link[0],
            monitor : config.monitor,
            pv : config.pv
        }, leftBig);
        var leftBigCloseBtn = this.leftBigCloseBtn = createCloseBtn('big');
        fillContainer(leftBigContent, leftBigCloseBtn, leftBig);

        if (hasSmall) {
            //*********************************右侧窄对联
            var rightSmall = this.rightSmall = createContainer('small', 'right ' + config.offsettop);
            var rightSmallContent = this.rightSmallContent = createAdContent(smallsize, {
                type : config.type[2] || config.type[0],
                src : config.src[2] || config.src[0],
                link : config.link[2] || config.link[0],
                monitor : config.monitor,
                pv : config.pv
            }, rightSmall);
            var rightSmallCloseBtn = this.rightSmallCloseBtn = createCloseBtn('small');
            sinaadToolkit.event.on(rightSmallCloseBtn, 'click', this.getCloseSideHandler());
            fillContainer(rightSmallContent, rightSmallCloseBtn, rightSmall);
        }

        //*********************************右侧宽对联
        var rightBig = this.rightBig = createContainer('big', 'right ' + config.offsettop);
        var rightBigContent = this.rightBigContent = createAdContent(bigsize, {
            type : config.type[3] || config.type[1] || config.type[0],
            src : config.src[3] || config.src[1] || config.src[0],
            link : config.link[3] || config.link[1] || config.link[0],
            monitor : config.monitor,
            pv : config.pv
        }, rightBig);
        var rightBigCloseBtn = this.rightBigCloseBtn = createCloseBtn('big');
        fillContainer(rightBigContent, rightBigCloseBtn, rightBig);


        sinaadToolkit.event.on(leftBigCloseBtn, 'click', this.getCloseSideHandler());
        sinaadToolkit.event.on(rightBigCloseBtn, 'click', this.getCloseSideHandler());

        sinaadToolkit.event.on(window, 'scroll', this.getScrollHandler());
        sinaadToolkit.event.on(window, 'resize', this.getResizeHandler());

        this.isClose = false;
        this.clientWidth = document.body.clientWidth;
        this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.show();
    }

    /**
     * [createAdContent description]
     * @return {[type]} [description]
     */
    function createAdContent (adContentSize, adContentConfig, container) {
        var adContent = document.createElement('div');
        adContent.style.cssText = 'width:' + adContentSize[0] + 'px;height:' + adContentSize[1] + 'px;position:absolute;left:0px;top:0px;';
        container.getMain().appendChild(adContent);
        sinaadToolkit.ad.embed(
            adContent,
            adContentConfig.type,
            adContentSize[0],
            adContentSize[1],
            sinaadToolkit.ad.createHTML(
                adContentConfig.type,
                adContentConfig.src,
                adContentSize[0],
                adContentSize[1],
                adContentConfig.link,
                adContentConfig.monitor,
                adContentConfig.pv
            )
        );
        return adContent;
    }

    /**
     * [createCloseBtn description]
     * @param  {[String]} type          [在这个广告中，关闭按钮只分两种，分别对应大的和小的广告]
     * @return {[Object]}              [closeBtn]
     */
    function createCloseBtn (type) {
        var closeBtnSize, offsetTop, url;
        if (type === 'big') {
            closeBtnSize = BIG_SIDE_CLOSE_BTN_SIZE;
            offsetTop =  BIG_SIDE_SIZE[1];
            url = BIG_SIDE_CLOSE_BTN;
        } else {
            closeBtnSize = SMALL_SIDE_CLOSE_BTN_SIZE;
            offsetTop =  SMALL_SIDE_SIZE[1];
            url = SMALL_SIDE_CLOSE_BTN;
        }
        var closeBtn = document.createElement('div');
        closeBtn.style.cssText = 'width:' + closeBtnSize[0] + 'px;height:' + closeBtnSize[1] + 'px;position:absolute;left:0px;top:' + offsetTop + 'px;background:url(' + url + ') no-repeat right center #ebebeb;cursor:pointer';
        return closeBtn;
    }
    /**
     * [createContainer 在页面创建一个固定位置的box]
     * @param  {[type]} sizeType     [这儿的尺寸大小只有大小两种，参数固定，所以每次不再重新传入。]
     * @param  {[String]} position  [在这儿只有left或right两个选项]
     * @return {[Object]}           [Box对象]
     */
    function createContainer (sizeType, position) {
        var width, height;
        if (sizeType === 'big') {
            width = BIG_SIDE_SIZE[0];
            height = BIG_SIDE_SIZE[1] + BIG_SIDE_CLOSE_BTN_SIZE[1];
        } else {
            width = SMALL_SIDE_SIZE[0];
            height = SMALL_SIDE_SIZE[1] + SMALL_SIDE_CLOSE_BTN_SIZE[1];
        }
        var container = new sinaadToolkit.Box({
            width : width,
            height : height,
            position : position,
            autoShow : 1,
            // minViewportWidth : config.mainWidth + 2 * config.sideWidth,
            follow : true,
            zIndex : 10501
        });
        return container;
    }

    function fillContainer (adContent, closeBtn, container) {
        //container.getMain().appendChild(adContent);
        container.getMain().appendChild(closeBtn);
    }

    CoupletExtMedia.prototype = {
        
        getResizeHandler : function () {
            var THIS = this;
            return function () {
                THIS.clientWidth = document.body.clientWidth;
                THIS.show();
            };
        },
        getScrollHandler : function () {
            var THIS = this;
            return function () {
                THIS.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                THIS.show();
            };
        },
        show : function () {

            if (this.isClose) {
                return;
            }

            if(this.scrollTop > this.config.expandpos && this.clientWidth > MIN_EXPAND_WIDTH){
                if (this.hasSmall) {
                    this.leftSmall.hide();
                    this.rightSmall.hide();
                }
                this.leftBig.show();
                this.rightBig.show();
            }else{
                if (this.hasSmall) {
                    this.leftSmall.show();
                    this.rightSmall.show();
                }
                this.leftBig.hide();
                this.rightBig.hide();
            }
        },
        getCloseSideHandler : function () {
            var THIS = this;
            return function () {
                THIS.isClose = true;
                if (THIS.hasSmall) {
                    THIS.leftSmall.hide();
                    THIS.rightSmall.hide();
                }
                THIS.leftBig.hide();
                THIS.rightBig.hide();
            };
        }
    };
    sinaadToolkit.CoupletExtMedia = sinaadToolkit.CoupletExtMedia || CoupletExtMedia;

})(window, window.sinaadToolkit);