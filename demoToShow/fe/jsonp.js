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