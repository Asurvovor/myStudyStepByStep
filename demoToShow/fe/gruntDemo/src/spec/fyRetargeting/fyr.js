(function () {
    var util = {
        /**
         * 判断是否是null或者未定义
         * @param  {Any} source  要判断的对象
         * @return {Boolean}      是否为null或未定义
         */
        isNull : function (source) {
            return ('undefined' === typeof source) || (source === null);
        },
        /**
         * 判断是否是数组
         */
        isArray : function (source) {
            return '[object Array]' === Object.prototype.toString.call(source);
        },
        /**
         * 将传入元素转换成一个数组，如果是一个数组，直接返回，如果不是，判断是否为null或者undefined,如果不是，返回这个元素组成的数组，否则返回空数组
         * @param  {Any} source 需要转换的对象
         * @return {Array}      转换后的数组
         */
        ensureArray : function (source) {
            return util.isArray(source) ? source : util.isNull(source) ? [] : [source];
        },
        /**
         * 获取当前页面所在的主页面url
         * @return {String} 获取当前页面所在的主页面url
         */
        top : (function () {
            var top;
            try {
                top = window.top.location.href;
            } catch (e) {}
            top = top || ((window.top === window.self) ?  window.location.href : window.document.referrer);
            return top;
        })()
    };

     /**
     * @namespace util.event
     */
    util.event = {
        /**
         * 注册事件
         * @param  {HTMLNodeElement}   dom      事件监听节点
         * @param  {String}   type     事件类型
         * @param  {Function} callback 回调方法
         */
        on : function (dom, type, callback) {
            if (dom.attachEvent) {
                dom.attachEvent('on' + type, callback);
            } else if (dom.addEventListener) {
                dom.addEventListener(type, callback, false);
            }
        }
    };

    /**
     * @namespace util.cookie
     */
    util.cookie = {
        /**
         * @private
         * @param  {String} key 要验证的cookie的key
         * @return {Boolean}    是否为符合规则的key
         */
        // http://www.w3.org/Protocols/rfc2109/rfc2109
        // Syntax:  General
        // The two state management headers, Set-Cookie and Cookie, have common
        // syntactic properties involving attribute-value pairs.  The following
        // grammar uses the notation, and tokens DIGIT (decimal digits) and
        // token (informally, a sequence of non-special, non-white space
        // characters) from the HTTP/1.1 specification [RFC 2068] to describe
        // their syntax.
        // av-pairs   = av-pair *(";" av-pair)
        // av-pair    = attr ["=" value] ; optional value
        // attr       = token
        // value      = word
        // word       = token | quoted-string
         
        // http://www.ietf.org/rfc/rfc2068.txt
        // token      = 1*<any CHAR except CTLs or tspecials>
        // CHAR       = <any US-ASCII character (octets 0 - 127)>
        // CTL        = <any US-ASCII control character
        //              (octets 0 - 31) and DEL (127)>
        // tspecials  = "(" | ")" | "<" | ">" | "@"
        //              | "," | ";" | ":" | "\" | <">
        //              | "/" | "[" | "]" | "?" | "="
        //              | "{" | "}" | SP | HT
        // SP         = <US-ASCII SP, space (32)>
        // HT         = <US-ASCII HT, horizontal-tab (9)>
        _isValidKey : function (key) {
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        },
        /**
         * 从cookie中获取key所对应的值
         * @private
         * @param  {String} key 要获取的cookie的key
         * @return {String}     cookie对应该key的值
         */
        _getRaw : function (key) {
            if (util.cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                     
                if (result) {
                    return result[2] || null;
                }
            }
            return null;
        },
        /**
         * 将cookie中key的值设置为value, 并带入一些参数
         * @private
         * @param  {String} key 要设置的cookie的key
         * @param  {String} value 要设置的值
         * @param  {Object} options 选项
         */
        _setRaw : function (key, value, options) {
            if (!util.cookie._isValidKey(key)) {
                return;
            }
             
            options = options || {};

            // 计算cookie过期时间
            var expires = options.expires;
            if ('number' === typeof options.expires) {
                expires = new Date();
                expires.setTime(expires.getTime() + options.expires);
            }
             
            document.cookie =
                key + "=" + value +
                (options.path ? "; path=" + options.path : "") +
                (expires ? "; expires=" + expires.toGMTString() : "") +
                (options.domain ? "; domain=" + options.domain : "") +
                (options.secure ? "; secure" : '');

        },
        /**
         * 获取cookie中key的值
         * @param  {String} key 要获取的key
         * @return {String}     cookie值
         */
        get : function (key) {
            var value = util.cookie._getRaw(key);
            if ('string' === typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        },
        /**
         * 设置cookie值
         * @param  {String} key     要设置的key
         * @param  {String} value   要设置的value   
         * @param  {object} options 选项
         */
        set : function (key, value, options) {
            util.cookie._setRaw(key, encodeURIComponent(value), options);
        },
        /**
         * 移除key相关的cookie
         * @param  {String} key     要移除的cookie的key
         * @param  {Object} options 选项
         */
        remove : function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            util.cookie._setRaw(key, '', options);
        }
    };

    var fyr = {
        //RECORD_URL: '//10.13.2.92:9000/behavior/write',
        RECORD_URL: window.location.protocol.indexOf('https') !== -1 ? '//r.dmp.sina.com.cn/behavior/write' : '//r.dmp.sina.com.cn/behavior/write',
        account: '',
        platform: 'pc',
        thirdCookie: '',
        push: function (cmd) {
            var method = cmd[0];
            switch (method) {
                case '_setAccount':
                case '_setThirdCookie':
                case '_setPlatform':
                    if ('function' === typeof this[method]) {
                        this[method].apply(fyr, Array.prototype.splice.call(cmd, 1));
                    }
                    break;
                default:
                    if ('function' === typeof this[method]) {
                        var data = this[method].apply(fyr, Array.prototype.splice.call(cmd, 2));
                        this.record(cmd[1], data);
                    }
                    break;
            }
        },
        //SESSION_TIMEOUT: 30 * 1000, //for test
        SESSION_TIMEOUT: 30 * 60 * 1000,
        getSSIDkey: function () {
            return 'fyr_ssid_' + (this.account || 'unknown');
        },
        //session id应该以用户的globalid为key,否则同一个客户代码传递到服务端就是同样的了，无法区分某一个用户
        //所以session id的生成规则变成fyr_accountid_sinaglobal_timestamp
        //
        initSSID: function () {
            var THIS = this;
            var key = this.getSSIDkey();
            SSID = util.cookie.get(key) || 'fyr_' + this.account + '_' + (new Date().getTime()).toString(36);
            this.SSID = SSID;

            //用户关闭前将SSID写进cookie半个小时
            util.event.on(window, 'beforeunload', function () {
                util.cookie.set(key, SSID, {expires: THIS.SESSION_TIMEOUT, path: '/'});
            });

            return this.getSSID();
        },
        getSSID: function () {
            var THIS = this;
            this.SSIDTimer && clearTimeout(this.SSIDTimer);
            this.SSIDTimer = setTimeout(function () {
                util.cookie.remove(THIS.getSSIDkey());
                THIS.initSSID();
            }, this.SESSION_TIMEOUT);
            return this.SSID;
        },
        _setAccount: function (id) {
            this.account = id || this.account;
            this.initSSID();
        },
        _setPlatform: function (platform) {
            this.platform = platform || this.platform;
        },
        _setThirdCookie: function (cookie) {
            this.thirdCookie = cookie || this.thirdCookie;
        },
        /**
         * 访问
         * @return {[type]} [description]
         * @usage _fyr.push('_visit')
         */
        _visit: function () {
            //扩展参数
            var ext = Array.prototype.splice.call(arguments, 1, 3);
            var data = {
                ref_url: document.referrer
            };
            return this.extParams(data, ext);
        },
        /**
         * 订单
         */
        _order: function (userId, orderId, orderPrice, goodsInfo) {
            var ext = Array.prototype.splice.call(arguments, 4, 3);

            var data = {
                third_uid: userId,
                order_id: orderId,
                order_price: orderPrice,
                goods_info: util.ensureArray(goodsInfo).join('|')
            };
            return this.extParams(data, ext);
        },
        //注册
        _regist: function (userId) {
            var ext = Array.prototype.splice.call(arguments, 1, 3);
            var data = {
                third_uid: userId
            };
            return this.extParams(data, ext);
        },
        //购物车
        _cart: function (userId, goodsInfo) {
            var ext = Array.prototype.splice.call(arguments, 2, 3);
            var data = {
                third_uid: userId,
                goods_info: util.ensureArray(goodsInfo).join('|')
            };
            return this.extParams(data, ext);
        },
        //商品浏览
        _goodVisit: function (userId, goodsId) {
            var ext = Array.prototype.splice.call(arguments, 1, 3);
            var data = {
                third_uid: userId,
                goods_id: goodsId
            };
            return this.extParams(data, ext);
        },
        //站内搜索
        _insiteSearch: function (keywords, resultUrl)  {
            var ext = Array.prototype.splice.call(arguments, 1, 3);
            var data = {
                keywords: keywords,
                srp_url: resultUrl
            };
            return this.extParams(data, ext);
        },
        //咨询
        _ask: function (keywords, askUrl) {
            var ext = Array.prototype.splice.call(arguments, 2, 3);
            var data = {
                keywords: keywords,
                url: askUrl
            };
            return this.extParams(data, ext);
        },
        //收藏
        _favourite: function (userId, goodsId) {
            var ext = Array.prototype.splice.call(arguments, 2, 3);
            var data = {
                third_uid: userId,
                goods_id: goodsId
            };
            return this.extParams(data, ext);
        },
        //登录
        _login: function (userId) {
            var ext = Array.prototype.splice.call(arguments, 1, 3);
            var data = {
                third_uid: userId
            };
            return this.extParams(data, ext);
        },
        //自定义
        _custom: function (key) {
            var ext = Array.prototype.splice.call(arguments, 1, 3);
            var data = {
                key: key
            };
            return this.extParams(data, ext);
        },
        extParams: function (data, ext) {
            for (var i = 0, len = ext.length; i < len; i++) {
                data['param' + (i + 1)] = ext[i];
            }
            //公共属性
            data['bhv_time'] = Math.round(new Date().getTime() / 1000); //访问时间
            if (!data['url']) {
                data['url'] = util.top; //页面所在url
            }
            this.thirdCookie && (data['third_cookie'] = this.thirdCookie); //第三方cookie

            data['session_id'] = this.getSSID(); //增加sessionid
            return data;
        },
        record: function (convId, params) {
            var result = [];
            params = params || {};
            for (var key in params) {
                result.push(key + '=' + encodeURIComponent(params[key]));
            }
            this.log([
                this.RECORD_URL,
                this.account,
                this.platform,
                convId
            ].join('/') + '?' + result.join('&'), false, convId === '1_1' ? 2000 : 0);
        },
        log: function (url, useCache, timeout) {
            var img = new Image(),
                key = '_fyr_log_' + (+new Date()).toString(36),
                timer;


            if (timeout) {
                timer = setTimeout(function () {
                    fyr.log('//d00.sina.com.cn/a.gif?error=dmp_visit_timeout&cid=' + fyr.account);
                }, timeout);
            }

            window[key] = {timer: timer, img: img};

            img.onload = function () {
                img.onload = img.onerror = img.onabort = null;
                window[key] && window[key].timer && clearTimeout(window[key].timer);
                window[key] = null;
                img = null;
                timer = null;
            }
            img.onerror = img.onabort = function () {
                alert('error');
                var ifr = document.createElement('iframe');
                ifr.src = '//d0.sina.com.cn/a.gif?error=dmp_visit_timeout&cid=' + fyr.account;
                document.body.appendChild(ifr);
                img.onload = img.onerror = img.onabort = null;
                window[key] && window[key].timer && clearTimeout(window[key].timer);
                window[key] = null;
                img = null;
                timer = null;
            }
     
            img.src = url + (useCache ? '' : (url.indexOf('?') > 0 ? '&' : '?') + key);
        }
    };

    var cmdList = window._fyr;
    if (cmdList && cmdList.shift) {
        for (var cmd, len = 100; (cmd = cmdList.shift()) && 0 < len--;) {
            fyr.push(cmd);
        }
    }
    window._fyr = {
        push: function (cmd) {
            fyr.push(cmd);
        }
    };
})();