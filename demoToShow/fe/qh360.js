(function () {

/**
 * jsonp方式回调
 * @param  {String}   url         资源地址
 * @param  {Function} callback    回调方法
 * @param  {Object}   opt_options 选项
 */
function jsonp(url, callback, optOptions) {
    var scr = document.createElement('SCRIPT'),
        prefix = '_sinaads_cbs_',
        callbackName,
        // callbackImpl,
        options = optOptions || {},
        charset = options.charset || 'utf-8',
        queryField = options.queryField || 'callback',
        timeOut = options.timeout || 0,
        timer,
        reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
        matches;

    function getCallBack(onTimeOut) {

        return function () {
            try {
                if (onTimeOut) {
                    options.onfailure && options.onfailure();
                } else {
                    callback.apply(window, arguments);
                    clearTimeout(timer);
                }
                window[callbackName] = null;
                delete window[callbackName];
            } catch (e) {
                // ignore the exception
            } finally {
                _removeScriptTag(scr);
            }
        };
    }

    if (isString(callback)) {
        // 如果callback是一个字符串的话，就需要保证url是唯一的，不要去改变它
        // TODO 当调用了callback之后，无法删除动态创建的script标签
        callbackName = callback;
    } else {
        if ((matches = reg.exec(url))) {
            callbackName = matches[2];
        }
    }
    if (!callbackName) {
        callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
    }

    if (isFunction(callback)) {
        window[callbackName] = getCallBack(0);
    }
    if (timeOut) {
        timer = setTimeout(getCallBack(1), timeOut);
    }

    //如果用户在URL中已有callback，用参数传入的callback替换之
    url = url.replace(reg, '\x241' + queryField + '=' + callbackName);

    if (url.search(reg) < 0) {
        url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
    }
    _createScriptTag(scr, url, charset);
}



function _createScriptTag(scr, url, charset) {
    scr.setAttribute('type', 'text/javascript');
    charset && scr.setAttribute('charset', charset);
    scr.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(scr);
}

function _removeScriptTag(scr) {
    if (scr && scr.parentNode) {
        scr.parentNode.removeChild(scr);
    }
    scr = null;
}



/**
  * 判断是否是函数
  * @param  {Any}        source      需要判断的对象
  * @return {Boolean}                是否是函数
  * @staitc
  */
function isFunction(source) {
    return '[object Function]' === Object.prototype.toString.call(source);
}


/**
 * 判断是否是字符串
 * @param  {Any} source 要判断的对象
 * @return {Boolean}        是否字符串
 * @static
 */
function isString(source) {
    return '[object String]' === Object.prototype.toString.call(source);
}




    // debugger;
    var currentScript = getCurrentScript();
    // console.log(currentScript)
    var divId = currentScript.split('?id=')[1];
    if (!divId) {
        return;
    }
    // var cbName = getParams('callback')
    function getCurrentScript () {
      // 取得正在解析的script节点
      if (document.currentScript) { // firefox 4+
        return document.currentScript.src
      }
      // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
      var stack
      try {
        window.b.c() // 强制报错,以便捕获e.stack
      } catch (e) { // safari的错误对象只有line,sourceId,sourceURL
        stack = e.stack
        if (!stack && window.opera) {
          // opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
          stack = (String(e).match(/of linked script \S+/g) || []).join(' ')
        }
      }
      if (stack) {
        /**
         * e.stack最后一行在所有支持的浏览器大致如下:
         * chrome23:
         * at http://domain.com/data.js:4:1
         * firefox17:
         * @http://domain.com/data.js:4
         * opera12:
         * @http://domian.com/data.js:4
         * IE10:
         * at Global code (http://domain.com/data.js:4:1)
         */
        stack = stack.split(/[@ ]/g).pop() // 取得最后一行,最后一个空格或@之后的部分
        stack = stack[0] === '(' ? stack.slice(1, -1) : stack
        return stack.replace(/(:\d+)?:\d+$/i, '') // 去掉行号与或许存在的出错字符起始位置
      }
      var nodes = document.getElementsByTagName('script') // 只在head标签中寻找
      for (let i = 0, node; (node = nodes[i++]);) {
        if (node.readyState === 'interactive') {
          return (node.className = node.src)
        }
      }
    }


    var logo_ico = '<div style="width:26px;height:13px;position:absolute;right:16px;bottom:16px;z-index:99;background:url(//d2.sina.com.cn/litong/zhitou/sinaads/release/ad_logo_update_IAB.gif) no-repeat;"></div>';
    var url = "http://show.g.mediav.com/s?type=1&of=4&newf=1&showid=ea2EuC&uid=14703100938272515666870689766453&impct=1";

    jsonp(url, function (data) {
        var  html = '';
        var ads = data.ads[0];

        var myapp = {
            slot   : ads.slot,
            type   : ads.type,
            img    : ads.img || [],
            src    : ads.src,
            desc   : ads.desc,
            title  : ads.title,
            link   : ads.curl,
            imptk  : ads.imptk,
            clktk  : ads.clktk,
            assets : ads.assets || []
        };
        switch(myapp.type){
            case 1:
                html = [
                    '<div class="ty-card ty-card-type1 clearfix">',
                    '<div class="ty-card-l">',
                    '<div class="ty-card-thumb-w"><a href="' + myapp.link + '" target="_blank"><img src="' + myapp.img + '" alt="" class="ty-card-thumb" width="150" height="100"></a></div>',
                    '</div>',
                    '<div class="ty-card-r">',
                    '<h3 class="ty-card-tt" style="padding-top:16px;"><a href="' + myapp.link + '" target="_blank">' + myapp.title + '</a></h3>',
                    '</div>',
                    logo_ico,
                    '</div>'].join('');
                break;
            case 2:
                html = [
                    '<div class="ty-card ty-card-type3 clearfix" >',
                    '<h3 class="ty-card-tt"><a href="' + myapp.link + '" target="_blank">' + myapp.title + '</a></h3>',
                    '<div class="ty-card-thumbs-w">',
                    '<div class="ty-card-thumbs-c" style="vertical-align: middle;"><a href="' + myapp.assets[0].curl + '" target="_blank"><img style="width:150px;height:100px;" src="' + myapp.assets[0].img + '" alt="" class="ty-card-thumb"></a></div>',
                    '<div class="ty-card-thumbs-c" style="vertical-align: middle;"><a href="' + myapp.assets[1].curl + '" target="_blank"><img style="width:150px;height:100px;" src="' + myapp.assets[1].img + '" alt="" class="ty-card-thumb"></a></div>',
                    '<div class="ty-card-thumbs-c" style="vertical-align: middle;"><a href="' + myapp.assets[2].curl + '" target="_blank"><img style="width:150px;height:100px;" src="' + myapp.assets[2].img + '" alt=""  class="ty-card-thumb"></a></div>',
                    // '<div class="ty-card-thumbs-c" style="background-color: #7E7E7E;width: 150px;line-height: 100px;text-align: center;vertical-align: middle;"><div class="ty-card-thumb" style="cursor:pointer;"><a href="' + data.url + '" target="_blank" style="color:#FFF;font-size: 20px; font-weight: bold;">更多精彩</a></div>',
                    '<div class="ty-card-thumbs-c" style="vertical-align: middle;"><a href="' + myapp.assets[3].curl + '" target="_blank"><img style="width:150px;height:100px;" src="' + myapp.assets[3].img + '" alt=""  class="ty-card-thumb"></a></div>',
                    '</div>',
                    logo_ico,
                    '</div>'].join('');
                break;
            default:
            break;
        }

        var node = document.getElementById(divId);
        node.innerHTML = html;

        /**
         监听事件的兼容处理
        */
        function onEvent(obj, type, callback) {
            if (obj.addEventListener) {
                obj.addEventListener(type, callback);
            } else if (obj.attachEvent) {
                obj.attachEvent('on' + type, callback)
            }
        }
        /**
         点击监测
        */
        var clcPV = new Array();
        var clcCnt = 0;
        function onClickExpose() {
            for (var i = 0, len = myapp.clktk.length; i < len; i++ ){
                // console.log("一次点击发几条曝光"+ len)
                clcPV[clcCnt] = new Image();
                clcPV[clcCnt].src = myapp.clktk[i];
                clcCnt++;
                // console.log("一共几条点击"+ clcCnt)
            }
        }
        /**
          可见曝光
        */
        var imgVision = new Array();
        for (var i = 0, len = myapp.imptk.length; i < len; i++ ) {
            // console.log("可见曝光几条"+len)
            imgVision[i] = new Image();
            imgVision[i].src = myapp.imptk[i];
        }
        /**
          点击监测
        */
        var links = node.getElementsByTagName('a');
        for (var i = 0, len = links.length; i < len; i++ ) {
            // console.log("a链接数"+len)
            onEvent(links[i], 'mousedown', onClickExpose);
        }

    }, {queryField: 'jsonp'});
})();









