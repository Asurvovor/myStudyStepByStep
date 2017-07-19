/**
  * 加载js模块
  * @param  {String} url          资源地址
  * @param  {Function} opt_callback 成功后回调方法
  * @param  {Object} opt_options  选项
  */


function loadScript (url, optCallback, optOptions) {
    var scr = document.createElement("SCRIPT"),
    scriptLoaded = 0,
    options = optOptions || {},
    charset = options.charset || 'utf-8',
    callback = optCallback || function () {},
    timeOut = options.timeout || 0,
    timer;

    // IE和opera支持onreadystatechange
    // safari、chrome、opera支持onload
    scr.onload = scr.onreadystatechange = function () {
        // 避免opera下的多次调用
        if (scriptLoaded) {
            return;
        }

        var readyState = scr.readyState;
        if ('undefined' === typeof readyState ||
            readyState === "loaded" ||
            readyState === "complete") {
                scriptLoaded = 1;
            try {
                callback();
                clearTimeout(timer);
            } finally {
                scr.onload = scr.onreadystatechange = null;
                _removeScriptTag(scr);
            }
        }
    };

    if (timeOut) {
        timer = setTimeout(function () {
            scr.onload = scr.onreadystatechange = null;
            _removeScriptTag(scr);
            options.onfailure && options.onfailure();
        }, timeOut);
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
