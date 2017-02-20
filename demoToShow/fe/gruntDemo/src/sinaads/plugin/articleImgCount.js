/**
 * 1统计正文页数量，记录到
 * 2.中间有多少包含图片的内容， 记录到
 * 3.中间有多少尺寸在[240，360], [480, 720]的图片，记录到
 * 
 * @author acelan(xiaobin8[at]staff.sina.com.cn)
 */
;(function () {
    var URL = {
        PAGE: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkyNg%3D%3D', //sax非标合同为COUNT_ARTICLE, 投放单为ARTICLE_PAGE
        HASIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkyNw%3D%3D', //sax非标合同为COUNT_ARTICLE, 投放单为ARTICLE_IMG
        HASADIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkyOA%3D%3D' //sax非标合同为COUNT_ARTICLE, 投放单为AD_IMG
    };
    //体育
    var SPORTS_URL = {
        HASIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkzMw%3D%3D',
        HASADIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkzMg%3D%3D',
        PAGE: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkzNA%3D%3D'
    };
    //娱乐
    var ENT_URL = {
        PAGE: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkzNQ%3D%3D',
        HASIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkzNg%3D%3D',
        HASADIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwODkzNw%3D%3D'
    };

    //新闻
    var NEWS_URL = {
        PAGE: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwOTM3Mw%3D%3D',
        HASIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwOTM3Mg%3D%3D',
        HASADIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwOTM3NA%3D%3D'
    };

    //军事
    var MIL_URL = {
        PAGE: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwOTM3Nw%3D%3D',
        HASIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwOTM3Ng%3D%3D',
        HASADIMG: 'http://sax.sina.com.cn/view?type=nonstd&t=TkEwMDAwOTM3NQ%3D%3D'
    };

    var articleId = "artibody";

    function domReady(callback) {
        var done = false;
        //这里简单用setTimeout 5s 或者onload替代，如果这两个在任意时间内都没有执行，那么就不记录了
        //没有那么严格的domready要求
        //setTimeout在图片加载完触发
        var onloadCallback = window.onload;
        window.onload = function () {
            if (done) {
                return;
            }
            done = true;
            onloadCallback && onloadCallback.call(window);
            callback();
        };

        setTimeout(function () {
            if (done) {
                return;
            }
            done = true;
            callback();
        }, 5000);
    }

    //发送日志
    function log(url, useCache) {
        var img = new Image(),
            key = '_sinaads_sio_log_' + Math.floor(Math.random() * 2147483648).toString(36);

        window[key] = img;
     
        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null;
     
            window[key] = null;
            img = null;
        };
 
        img.src = url + (useCache ? '' : (url.indexOf('?') > 0 ? '&' : '?') + key);
    }

    //往上找3层，判断是否是广告里面的图片
    function isAdImage(imgNode) {
        var flag = false,
            times = 3;
        while (imgNode && --times >= 0) {
            if (imgNode.tagName.toUpperCase() === 'INS' && imgNode.className.indexOf('sinaads') !== -1) {
                flag = true;
                break;
            }
            imgNode = imgNode.parentNode;
        }
        return flag;
    }

    //是否是属于内容的图片，小于10的宽或者高都认为不是正文图片
    function isContentImage(width, height) {
        return !(width <= 10 || height <= 10);
    }

    function inRange(width, height) {
        var flag = false;
        if (!(width <= 10 || height <= 10)) {
            if ((width >= 240 && width <= 360 && height > width) || (width >= 480 && width <= 720 && 2 * height > 1 * width)) {
                flag = true;
            }
        }
        return flag;
    }

    //获取频道
    function getChannel() {
        return window.location.host.split('.')[0];
    }

    //统计
    function count() {
        var container = document.getElementById(articleId);

        if (!container) {
            //不是正文页，退出
            return;
        }
        //1. 统计正文页
        log(URL.PAGE);
        switch (getChannel()) {
            case 'sports':
                log(SPORTS_URL.PAGE);
                break;
            case 'ent':
                log(ENT_URL.PAGE);
                break;
            case 'news':
                log(NEWS_URL.PAGE);
                break;
            case 'mil':
                log(MIL_URL.PAGE);
                break;
            default:
                break;
        }

        var imgs = container.getElementsByTagName('img');
        var imgCount = 0;
        var adImgCount = 0;
        var width = 0;
        var height = 0;
        var img;

        for (var i = 0, len = imgs.length; i < len; i++) {
            img = imgs[i++];
            width = img.offsetWidth;
            height = img.offsetHeight;
            if (!isAdImage(img) && isContentImage(width, height)) {
                imgCount++;
                if (inRange(width, height)) {
                    adImgCount++;
                }
            }
        }

        //2.中间有多少包含图片的内容
        if (imgCount > 0) {
            log(URL.HASIMG);
            switch (getChannel()) {
                case 'sports':
                    log(SPORTS_URL.HASIMG);
                    break;
                case 'ent':
                    log(ENT_URL.HASIMG);
                    break;
                case 'news':
                    log(NEWS_URL.HASIMG);
                    break;
                case 'mil':
                    log(MIL_URL.HASIMG);
                    break;
                default:
                    break;
            }
        }
        //3.中间有多少尺寸在[240，360], [480, 720]的图片
        if (adImgCount > 0) {
            log(URL.HASADIMG);
            switch (getChannel()) {
                case 'sports':
                    log(SPORTS_URL.HASADIMG);
                    break;
                case 'ent':
                    log(ENT_URL.HASADIMG);
                    break;
                case 'news':
                    log(NEWS_URL.HASADIMG);
                    break;
                case 'mil':
                    log(MIL_URL.HASADIMG);
                    break;
                default:
                    break;
            }
        }
    }

    //domReady的时候调用统计
    domReady(count);
})();