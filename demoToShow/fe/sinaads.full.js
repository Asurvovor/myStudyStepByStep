/*!
 * sinaadToolkit
 * @description 新浪广告工具包，提供了浏览器判断，渲染，cookie, storage, iframe, 转义等基础操作
 * @author  acelan <xiaobin8[at]staff.sina.com.cn>
 * @version  1.0.0
 */
(function (window, undefined) {

    "use strict";

    /**
     * @global
     * @namespace
     * @name sinaadToolkit
     */
    var sinaadToolkit = window.sinaadToolkit = window.sinaadToolkit || /** @lends sinaadToolkit */{
        /**
         * 工具包版本号
         * @type {String}
         * @const
         */
        VERSION : '1.0.0',
        /**
         * 模式 debug || release
         * 在页面url中使用__sinaadToolkitDebug__可以触发debug模式
         */
        mode : window.location.href.indexOf('__sinaadToolkitDebug__') !== -1 ? 'debug' : 'release',  //是否开启debug模式
        /**
         * 调试方法，用于方便线上调试问题
         * @param  {String} msg 输出的信息
         */
        debug : (function () {
            /**
             * @remarks 当script放在head中，立即执行的时候doc.body不存在，这时候模拟的console窗口没有地方挂接
             * 这是我们选择的是抛弃这部分debug信息，后续考虑使用cache将这部分信息缓存下来，当body加载后进行回放
             * 但是考虑到这只是调试信息，而且head上挂接js的使用方法在广告逻辑上比较少用，因此没有必要花大力气用几行
             * 代码去实现这个功能。
             */
            var containerId = 'sinaadToolkitDebugContainer';
            var console = window.console || {
                log : function (msg) {
                    if (!document.body) {
                        return;
                    }
                    var consoleView = document.getElementById(containerId);
                    if (!consoleView) {
                        consoleView = document.createElement('ul');
                        consoleView.id = containerId;
                        consoleView.style.cssText = 'z-index:99999;overflow:auto;height:300px;position:absolute;right:0;top:0;opacity:.9;*filter:alpha(opacity=90);background:#fff;width:500px;';
                        document.body.insertBefore(consoleView, document.body.firstChild);
                    }
                    var li = document.createElement('li');
                    li.style.cssText = 'border-bottom:1px dotted #ccc;line-height:30px;font-size:12px;';
                    li.innerHTML = msg + Array.prototype.slice.call(arguments, 1).join(' ');
                    consoleView.appendChild(li);
                }
            };
            return function (msg) {
                if (sinaadToolkit.mode === 'debug') {
                    console.log(msg, Array.prototype.slice.call(arguments, 1));
                }
            };
        })(),
        /**
         * 错误信息
         */
        error : function (msg, e) {
            try {
                sinaadToolkit.sio.log('//d00.sina.com.cn/a.gif?' + [
                    'type=' + 'sinaads_error',
                    'msg=' + encodeURIComponent(msg ? msg : e ? e.message : 'unknow'),
                    'ref=' + encodeURIComponent(sinaadToolkit.url.top),
                    'ja=' + (navigator.javaEnabled() ? 1 : 0),
                    'ck=' + (navigator.cookieEnabled ? 1 : 0),
                    'ds=' + (window.screen.width + "x" + window.screen.height),
                    'ua=' + encodeURIComponent(navigator.appVersion),
                    'pf=' + navigator.platform,
                    'ts=' + sinaadToolkit.now()
                ].join('&'));
            } catch (e) {}

            if (sinaadToolkit.mode === 'debug') {
                throw new Error(msg + (e ? ':' + e.message : ''));
            }
        },
        /**
         * 获取当前时间戳
         * @return {Number} 当前时间戳
         * @static
         */
        now : function () {
            return +new Date();
        },
        /**
         * 随机数生成，生成一个随机数的36进制表示方法
         * @return {String} 生成一个随机的36进制字符串（包含0-9a-z）
         * @static
         */
        rnd : function () {
            return Math.floor(Math.random() * 2147483648).toString(36);
        },
        /**
         * 获取[min, max]区间内任意整数
         * @param  {Number} min 最小值
         * @param  {Number} max 最大值
         * @return {Number}     
         */
        rand : function (min, max) {
            return Math.floor(min + Math.random() * (max - min + 1));
        },
        /**
         * 把一个字符串生成唯一hash
         * @param  {String} s 要生成hash的字符串
         * @return {String}   36进制字符串
         */
        hash : function (s) {
            var hash = 0,
                i = 0,
                w;

            for (; !isNaN(w = s.charCodeAt(i++));) {
                hash = ((hash << 5) - hash) + w;
                hash = hash & hash;
            }

            return Math.abs(hash).toString(36);
        },
        /**
         * 判断是否是函数
         * @param  {Any}        source      需要判断的对象
         * @return {Boolean}                是否是函数
         * @staitc
         */
        isFunction : function (source) {
            return '[object Function]' === Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是字符串
         * @param  {Any} source 要判断的对象
         * @return {Boolean}        是否字符串
         * @static
         */
        isString : function (source) {
            return '[object String]' === Object.prototype.toString.call(source);
        },
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
         * 判断是否是数字
         */
        isNumber : function (source) {
            return '[object Number]' === Object.prototype.toString.call(source) && isFinite(source);
        },
        /**
         * 在全局上下文中执行script
         * @remarks  来自jquery
         * @param  {String} data 要执行的脚本代码
         */
        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function (data) {
            if (data && /\S/.test(data)) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than jQuery in Firefox
                (window.execScript || function (data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },

        /**
         * 在窗口后面弹出一个窗口
         */
        underPop : function (loc, name, width, height) {
            function _popAd() {
                var _pop = window.open('about:blank', name, 'width=' + width + ',height=' + height);
                _pop.blur();
                _pop.opener.focus();
                _pop.location = loc;
                sinaadToolkit.event.un(document.body, 'click', _popAd);
            }
            try {
                _popAd();
            } catch (e) {
                sinaadToolkit.debug('sinaads:Cannot pop window, use click event.');
                sinaadToolkit.event.on(document.body, 'click', _popAd);
            }
        }
    };


    /**
     * 资源备选地址
     * @static
     * @const
     */
    sinaadToolkit.RESOURCE_URL = sinaadToolkit.RESOURCE_URL || [
        'http://d1.sina.com.cn/litong/zhitou/sinaads',
        'http://d2.sina.com.cn/litong/zhitou/sinaads',
        'http://d3.sina.com.cn/litong/zhitou/sinaads',
        'http://d4.sina.com.cn/litong/zhitou/sinaads',
        'http://d5.sina.com.cn/litong/zhitou/sinaads',
        'http://d6.sina.com.cn/litong/zhitou/sinaads',
        'http://d7.sina.com.cn/litong/zhitou/sinaads',
        'http://d8.sina.com.cn/litong/zhitou/sinaads',
        'http://d9.sina.com.cn/litong/zhitou/sinaads'
        //'.'
    ][sinaadToolkit.rand(0, 8)];

    /**
     * 工具包资源地址
     * @static
     * @const
     */
    sinaadToolkit.TOOLKIT_URL = sinaadToolkit.RESOURCE_URL + '/release/sinaadToolkit.js';

    /**
     * 视频格式素材播放器地址
     * @type {[type]}
     */
    sinaadToolkit.VPLAYER_URL = sinaadToolkit.RESOURCE_URL + '/release/SinaWindowsPlayer.swf';

    /**
     * @namespace sinaadToolkit.browser
     */
    sinaadToolkit.browser = sinaadToolkit.browser || (function (ua) {
        /**
         * @lends sinaadToolkit.browser
         */
        var browser = {
            /**
             * 是否是andriod系统
             * @type {Boolean}
             * @marks zepto的Android判断好像有问题
             * eg: userAgent: Mozilla/4.0 (compatible;Android;320x480)
             */
            //android : /(Android)\s+([\d.]+)/i.test(ua),
            android : /(Android)(\s+([\d.]+))*/i.test(ua),
            /**
             * @type {Boolean}
             */
            ipad : /(iPad).*OS\s([\d_]+)/i.test(ua),
            /**
             * @type {Boolean}
             */
            webos : /(webOS|hpwOS)[\s\/]([\d.]+)/i.test(ua),
            /**
             * @type {Boolean}
             */
            kindle : /Kindle\/([\d.]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            silk : /Silk\/([\d._]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            blackberry : /(BlackBerry).*Version\/([\d.]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            bb10 : /(BB10).*Version\/([\d.]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            rimtabletos : /(RIM\sTablet\sOS)\s([\d.]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            playbook : /PlayBook/i.test(ua),
            /** 
             * 如果是chrome浏览器，返回浏览器当前版本号
             * @type {Number}
             */
            chrome : /chrome\/(\d+\.\d+)/i.test(ua) ? + RegExp.$1 : undefined,
            /**
             * 如果是firefox浏览器，返回浏览器当前版本号
             * @type {Number}
             */
            firefox : /firefox\/(\d+\.\d+)/i.test(ua) ? + RegExp.$1 : undefined,
            /**
             * 如果是ie返回ie当前版本号
             * @type {Number}
             */
            ie : /msie (\d+\.\d+)/i.test(ua) ? (document.documentMode || + RegExp.$1) : undefined,
            /**
             * @type {Boolean}
             */
            isGecko : /gecko/i.test(ua) && !/like gecko/i.test(ua),
            /**
             * @type {Boolean}
             */
            isStrict : document.compatMode === "CSS1Compat",
            /**
             * @type {Boolean}
             */
            isWebkit : /webkit/i.test(ua),
            /**
             * 如果是opera,返回opera当前版本号
             * @type {Number}
             */
            opera : /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(ua) ?  + (RegExp.$6 || RegExp.$2) : undefined
        };

        /**
         * @type {Boolean}
         */
        browser.iphone = !browser.ipad && /(iPhone\sOS)\s([\d_]+)/i.test(ua);
        /**
         * @type {Boolean}
         */
        browser.touchpad = browser.webos && /TouchPad/.test(ua);
        /**
         * @type {Boolean}
         */
        browser.tablet = !!(browser.ipad || browser.playbook || (browser.android && !/Mobile/.test(ua)) || (browser.firefox && /Tablet/.test(ua)));
        /**
         * @type {Boolean}
         */
        browser.phone  = !!(!browser.tablet && (browser.android || browser.iphone || browser.webos || browser.blackberry || browser.bb10 || (browser.chrome && /Android/.test(ua)) || (browser.chrome && /CriOS\/([\d.]+)/.test(ua)) || (browser.firefox && /Mobile/.test(ua))));

        try {
            if (/(\d+\.\d+)/.test(window.external.max_version)) {
                /**
                 * 如果是遨游浏览器，返回遨游版本号
                 * @type {Number}
                 */
                browser.maxthon = + RegExp.$1;
            }
        } catch (e) {}

        browser.mobile = browser.tablet || browser.phone || browser.touchpad;

        /**
         * 如果是safari浏览器，返回safari版本号
         * @type {Number}
         */
        browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp.$1 || RegExp.$2) : undefined;
        /**
         * 是否支持position:fixed属性
         * @type {Boolean}
         */
        browser.isSupportFixed = !browser.ie || browser.ie >= 7;

        return browser;

    })(navigator.userAgent);

    /**
     * 获取系统信息
     * @type {Object}
     */
    sinaadToolkit.systemInfo = {
        screenSize : window.screen ? (window.screen.width + "x" + window.screen.height) : '-',
        language : navigator.systemLanguage || navigator.browserLanguage || navigator.language || navigator.userLanguage || '-',
        platform : '-'
    };


    /**
     * @namespace sinaadToolkit.array
     */
    sinaadToolkit.array = sinaadToolkit.array || /** @lends sinaadToolkit.array */{
        /**
         * 移除数组元素
         * @param  {Array} source 要移除元素的数组
         * @param  {Any} match  要移除的元素
         * @return {Array}        移除元素后的数组
         */
        remove : function (source, match) {
            var len = source.length;
                
            while (len--) {
                if (len in source && source[len] === match) {
                    source.splice(len, 1);
                }
            }
            return source;
        },
        /**
         * 遍历数组
         * @param  {Array} source     要遍历的源数组
         * @param  {Function} iterator   遍历方法
         * @param  {Object} thisObject 调用对象
         * @return {Array}            被遍历的源数组
         */
        each : function (source, iterator, thisObject) {

            source = sinaadToolkit.array.ensureArray(source);

            var returnValue,
                item,
                i,
                len = source.length;
            
            if ('function' === typeof iterator) {
                for (i = 0; i < len; i++) {
                    item = source[i];
                    //TODO
                    //此处实现和标准不符合，标准中是这样说的：
                    //If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
                    returnValue = iterator.call(thisObject || source, item, i);
            
                    if (returnValue === false) {
                        break;
                    }
                }
            }
            return source;
        },
        /**
         * 将传入元素转换成一个数组，如果是一个数组，直接返回，如果不是，判断是否为null或者undefined,如果不是，返回这个元素组成的数组，否则返回空数组
         * @param  {Any} source 需要转换的对象
         * @return {Array}      转换后的数组
         */
        ensureArray : function (source) {
            return sinaadToolkit.isArray(source) ? source : sinaadToolkit.isNull(source) ? [] : [source];
        }
    };


    /**
     * @namespace sinaadToolkit.string
     */
    sinaadToolkit.string = sinaadToolkit.string || (function () {
        var ESCAPE_MAP = {
                '"'     : '\\"',
                "\\"    : "\\\\",
                "/"     : "\\/",
                "\b"    : "\\b",
                "\f"    : "\\f",
                "\n"    : "\\n",
                "\r"    : "\\r",
                "\t"    : "\\t",
                "\x0B"  : "\\u000b"
            },
            //字符串中非中文字符串
            STR_REG =  /\uffff/.test("\uffff") ? (/[\\\"\x00-\x1f\x7f-\uffff]/g) : (/[\\\"\x00-\x1f\x7f-\xff]/g);
        
        return /** @lends sinaadToolkit.string */{
            /**
             * 转义html
             * @param  {String} source 要转义的源字符串
             * @return {String}        转义后的字符串
             */
            encodeHTML : function (source) {
                return String(source)
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, "&quot;")
                            .replace(/'/g, "&#39;");
            },
            /**
             * 反转义html
             * @param  {String} source 要转义的源字符串
             * @return {String}        转义后的字符串
             */
            decodeHTML : function (source) {
                var str = String(source)
                            .replace(/&quot;/g, '"')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&amp;/g, "&");
                //处理转义的中文和实体字符
                return str.replace(/&#([\d]+);/g, function (_0, _1) {
                    return String.fromCharCode(parseInt(_1, 10));
                });
            },
            /**
             * 转义字符串中的特殊字符
             * @params {Sting} source 要转义的字符串
             * @return {String} 转义后的字符串
             */
            formalString : function (source) {
                var ret = [];
                ret.push(source.replace(STR_REG, function (str) {
                    //如果再需要转义的字符表中，替换成转移字符对应的值
                    if (str in ESCAPE_MAP) {
                        return ESCAPE_MAP[str];
                    }
                    //否则转成对应的unicode码
                    var alphaCode = str.charCodeAt(0),
                        unicodePerfix = "\\u";
                    //需要增加几位0来补位
                    16 > alphaCode ? unicodePerfix += "000" : 256 > alphaCode ? unicodePerfix += "00" : 4096 > alphaCode && (unicodePerfix += "0");

                    //保存转移过的值到ESCAPE_MAP提高转义效率，同时返回进行替换
                    ESCAPE_MAP[str] = unicodePerfix + alphaCode.toString(16);

                    return ESCAPE_MAP[str];
                }));
                return '"' + ret.join('') + '"';
            },
            /**
             * 简单模版方法
             * @param  {String} source 模版
             * @param  {Object} opts   替换变量
             * @return {String}        模版替换后的结果
             */
            format : function (source, opts) {
                source = String(source);
                var data = Array.prototype.slice.call(arguments, 1),
                    toString = Object.prototype.toString;
                if (data.length) {
                    data = data.length === 1 ?
                        /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
                        (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) : data;
                    return source.replace(/#\{(.+?)\}/g, function (match, key) {
                        var replacer = data[key];
                        // chrome 下 typeof /a/ == 'function'
                        if ('[object Function]' === toString.call(replacer)) {
                            replacer = replacer(key);
                        }
                        return ('undefined' === typeof replacer ? '' : replacer);
                    });
                }
                return source;
            },
            toCamelCase : function (source) {
                //提前判断，提高效率
                if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
                    return source;
                }
                return source.replace(/[-_][^-_]/g, function (match) {
                    return match.charAt(1).toUpperCase();
                });
            }
        };
    })();

    /**
     * 删除目标字符串两端的空白字符
     * @name sinaadToolkit.string.trim
     * @function
     * @grammar sinaadToolkit.string.trim(source)
     * @param {string} source 目标字符串
     * @remark
     * 不支持删除单侧空白字符
     * @shortcut trim
     * @meta standard
     *             
     * @returns {string} 删除两端空白字符后的字符串
     */

    sinaadToolkit.string.trim = sinaadToolkit.string.trim || (function () {
        var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
        
        return function (source) {
            source = source || "";
            return String(source).replace(trimer, "");
        };
    })();

    sinaadToolkit.number = sinaadToolkit.number || {
        pad : function (source, length) {
            var pre = "",
                negative = (source < 0),
                string = String(Math.abs(source));
         
            if (string.length < length) {
                pre = (new Array(length - string.length + 1)).join('0');
            }
         
            return (negative ?  "-" : "") + pre + string;
        }
    };


    sinaadToolkit.date = sinaadToolkit.date || {
        format : function (source, pattern) {
            if ('string' !== typeof pattern) {
                return source.toString();
            }
         
            function replacer(patternPart, result) {
                pattern = pattern.replace(patternPart, result);
            }
             
            var pad     = sinaadToolkit.number.pad,
                year    = source.getFullYear(),
                month   = source.getMonth() + 1,
                date2   = source.getDate(),
                hours   = source.getHours(),
                minutes = source.getMinutes(),
                seconds = source.getSeconds();
         
            replacer(/yyyy/g, pad(year, 4));
            replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
            replacer(/MM/g, pad(month, 2));
            replacer(/M/g, month);
            replacer(/dd/g, pad(date2, 2));
            replacer(/d/g, date2);
         
            replacer(/HH/g, pad(hours, 2));
            replacer(/H/g, hours);
            replacer(/hh/g, pad(hours % 12, 2));
            replacer(/h/g, hours % 12);
            replacer(/mm/g, pad(minutes, 2));
            replacer(/m/g, minutes);
            replacer(/ss/g, pad(seconds, 2));
            replacer(/s/g, seconds);
         
            return pattern;
        }
    };


    /**
     * @namespace sinaadToolkit.object
     */
    sinaadToolkit.object = sinaadToolkit.object || /** @lends sinaadToolkit.object */{
        /**
         * object的遍历方法
         * @param  {Object} source   要遍历的对象
         * @param  {Function} iterator 遍历方法，第一个参数为遍历的值，第二个位key
         * @return {Object}          key映射的遍历结果
         */
        map : function (source, iterator) {
            var results = {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    results[key] = iterator(source[key], key);
                }
            }
            return results;
        }
    };

    /**
     * @namespace sinaadToolkit.json
     */
    sinaadToolkit.json = sinaadToolkit.json || /** @lends sinaadToolkit.json */{
        parse: function (data) {
            //更新至不使用原生parse，不检测用户输入是否正确
            return (new Function("return (" + data + ")"))();
        },
        stringify: (function () {
            /**
             * 字符串处理时需要转义的字符表
             * @private
             */
            var escapeMap = {
                "\b": '\\b',
                "\t": '\\t',
                "\n": '\\n',
                "\f": '\\f',
                "\r": '\\r',
                '"' : '\\"',
                "\\": '\\\\'
            };
        
            /**
             * 字符串序列化
             * @private
             */
            function encodeString(source) {
                if (/["\\\x00-\x1f]/.test(source)) {
                    source = source.replace(
                        /["\\\x00-\x1f]/g,
                        function (match) {
                            var c = escapeMap[match];
                            if (c) {
                                return c;
                            }
                            c = match.charCodeAt();
                            return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                        });
                }
                return '"' + source + '"';
            }
        
            /**
             * 数组序列化
             * @private
             */
            function encodeArray(source) {
                var result = ["["],
                    l = source.length,
                    preComma, i, item;
                    
                for (i = 0; i < l; i++) {
                    item = source[i];
                    
                    switch (typeof item) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if(preComma) {
                            result.push(',');
                        }
                        result.push(sinaadToolkit.json.stringify(item));
                        preComma = 1;
                    }
                }
                result.push("]");
                return result.join("");
            }
        
            /**
             * 处理日期序列化时的补零
             * @private
             */
            function pad(source) {
                return source < 10 ? '0' + source : source;
            }
        
            /**
             * 日期序列化
             * @private
             */
            function encodeDate(source){
                return '"' +
                    source.getFullYear() + "-" +
                    pad(source.getMonth() + 1) + "-" +
                    pad(source.getDate()) + "T" +
                    pad(source.getHours()) + ":" +
                    pad(source.getMinutes()) + ":" +
                    pad(source.getSeconds()) + '"';
            }
        
            return function (value) {
                switch (typeof value) {
                case 'undefined':
                    return 'undefined';
                    
                case 'number':
                    return isFinite(value) ? String(value) : "null";
                    
                case 'string':
                    return encodeString(value);
                    
                case 'boolean':
                    return String(value);
                    
                default:
                    if (value === null) {
                        return 'null';
                    } else if (value instanceof Array) {
                        return encodeArray(value);
                    } else if (value instanceof Date) {
                        return encodeDate(value);
                    } else {
                        var result = ['{'],
                            encode = sinaadToolkit.json.stringify,
                            preComma,
                            item;
                            
                        for (var key in value) {
                            if (Object.prototype.hasOwnProperty.call(value, key)) {
                                item = value[key];
                                switch (typeof item) {
                                case 'undefined':
                                case 'unknown':
                                case 'function':
                                    break;
                                default:
                                    if (preComma) {
                                        result.push(',');
                                    }
                                    preComma = 1;
                                    result.push(encode(key) + ':' + encode(item));
                                }
                            }
                        }
                        result.push('}');
                        return result.join('');
                    }
                }
            };
        })()
    };

    /**
     * @namespace sinaadToolkit.event
     */
    sinaadToolkit.event = sinaadToolkit.event || /** @lends sinaadToolkit.event */{
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
        },
        un : function (dom, type, callback) {
            if (dom.detachEvent) {
                dom.detachEvent('on' + type, callback);
            } else if (dom.removeEventListener) {
                dom.removeEventListener(type, callback);
            }
        }
    };

    /**
     * @namespace sinaadToolkit.cookie
     */
    sinaadToolkit.cookie = sinaadToolkit.cookie || /** @lends sinaadToolkit.cookie */{
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
            if (sinaadToolkit.cookie._isValidKey(key)) {
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
            if (!sinaadToolkit.cookie._isValidKey(key)) {
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
            var value = sinaadToolkit.cookie._getRaw(key);
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
            sinaadToolkit.cookie._setRaw(key, encodeURIComponent(value), options);
        },
        /**
         * 移除key相关的cookie
         * @param  {String} key     要移除的cookie的key
         * @param  {Object} options 选项
         */
        remove : function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            sinaadToolkit.cookie._setRaw(key, '', options);
        }
    };

    /**
     * @namespace sinaadToolkit.storage
     */
    sinaadToolkit.storage = sinaadToolkit.storage || (function () {
        //关闭浏览器后过期的key
        var _sessionStorageMap = {};
        //刷新浏览器清空没有设置expires的存储
        sinaadToolkit.event.on(window, 'beforeunload', function () {
            for (var key in _sessionStorageMap) {
                try {
                    sinaadToolkit.storage.remove(key);
                    delete _sessionStorageMap[key];
                } catch (e) {}
            }
        });

        /**
         * userData相关方法
         */
        var userData = {
            id : 'sinaadToolkitUserDataContainer',
            name : location.hostname,
            init : function () {
                var dom = document.getElementById(userData.id);
                if (!dom) {
                    try {
                        dom = document.createElement('input');
                        dom.type = "hidden";
                        dom.style.display = "none";
                        dom.addBehavior("#default#userData");
                        document.body.insertBefore(dom, document.body.firstChild);
                        var expires = new Date();
                        expires.setDate(expires.getDate() + 365);
                        dom.expires = expires.toUTCString();
                    } catch (e) {
                        sinaadToolkit.debug('sinaadToolkit.storage:userData init fail, ' + e.message);
                        return null;
                    }
                }
                return dom;
            },
            setItem : function (key, value, expires) {
                var dom = userData.init();
                if (dom) {
                    dom.load(userData.name);
                    dom.setAttribute(key, value + (expires ? ';expires=' + (sinaadToolkit.now() + expires) : ''));
                    dom.save(userData.name);
                }
                if (!expires) {
                    _sessionStorageMap[key] = 1;
                }
            },
            getItem : function (key) {
                var dom = userData.init();
                if (dom) {
                    dom.load(userData.name);
                    return dom.getAttribute(key);
                }
                return null;
            },
            removeItem : function (key) {
                var dom = userData.init();
                if (dom) {
                    dom.load(userData.name);
                    dom.removeAttribute(key);
                    dom.save(userData.name);
                }
            }
        };

        /**
         * localstorage相关方法
         */
        var ls = {
            getItem : function (key) {
                return window.localStorage.getItem(key);
            },
            setItem : function (key, value, expires) {
                window.localStorage.setItem(key, value + (expires ? ';expires=' + (sinaadToolkit.now() + expires) : ''));
                if (!expires) {
                    _sessionStorageMap[key] = 1;
                }
            },
            removeItem : function (key) {
                window.localStorage.removeItem(key);
            }
        };

        /**
         * cookie相关方法
         * @type {Object}
         */
        var cookie = {
            getItem : function (key) {
                return sinaadToolkit.cookie.get(key);
            },
            setItem : function (key, value, expires) {
                sinaadToolkit.cookie.set(key, value, {expires : expires || 0});
            },
            removeItem : function (key) {
                sinaadToolkit.cookie.remove(key);
            }
        };

        /** 
         * 根据浏览器支持选择相关的存储方案
         * 当ie且ie<8时使用userData方案，否则使用localStorage方案，否则使用cookie方案
         * 隐私模式下storage会写入失败
         */
        var storage = window.localStorage ? ls : sinaadToolkit.browser.ie && sinaadToolkit.browser.ie < 8 ? userData : cookie;

        /**
         * 测试storage是否成功，隐私模式下localstorage会失败
         */
        try {
            storage.setItem('sinaads_test_ls', 'support');
        } catch (e) {
            storage = cookie;
        }

        return /** @lends sinaadToolkit.storage */{
            /**
             * 获取本地存储的key的值
             * @param  {String} key key
             * @return {String}     取得的值
             */
            get : function (key) {
                try {
                    var value = storage.getItem(key);
                    if (value) {
                        sinaadToolkit.debug('sinaadToolkit.storage.get:get value of ' + key + ':' + value);
                        value = value.split(';expires=');
                        //有过期时间
                        if (value[1] && sinaadToolkit.now() > parseInt(value[1], 10)) {
                            storage.removeItem(key);
                            return null;
                        } else {
                            return value[0];
                        }
                    }
                    return null;
                } catch (e) {
                    sinaadToolkit.debug('sinaadToolkit.storage.get:' + e.message);
                    return null;
                }
            },
            /**
             * 设置本地存储key的值为value
             * 注意：请不要设置非字符串格式形式的值到本地存储
             * @param  {String} key     设置的key
             * @param  {String} value   设置的value
             * @param  {Number} expires 过期时间毫秒数
             */
            set : function (key, value, expires) {
                try {
                    storage.setItem(key, value, expires);
                } catch (e) {
                    sinaadToolkit.error('sinaadToolkit.storage.set:' + e.message);
                }
            },
            /**
             * 移除本地存储中key的值
             * @param  {String} key 要移除的key
             */
            remove : function (key) {
                try {
                    storage.removeItem(key);
                } catch (e) {
                    sinaadToolkit.error('sinaadToolkit.storage.remove:' + e.message);
                }
            }
        };
    })();


    /* 测试移除没有设置过期时间的存储 */
    // sinaadToolkit.storage.set('noexpireskey', 1);
    // sinaadToolkit.storage.set('noexpireskey2', 2);

    /**
     * @namespace sinaadToolkit.url
     */
    sinaadToolkit.url = sinaadToolkit.url || /** @lends sinaadToolkit.url */{
        protocol : (function() {
            return (window.location.protocol === "https:" ? "https://" : "http://");
        })(),
        /**
         * 确保传入的字符串是一个url, 同时去除前后空格
         * iframe的src在ie下协议写错会导致刷新当前页面成iframe的src,
         * 判断是否有http或者https开头，如果没有直接认定添加http或者https
         * @todo \n\r 去除
         */
        ensureURL : function (source) {
            source = sinaadToolkit.string.trim(source);
            return source ? (/^(http|https):\/\//).test(source) ? source : (sinaadToolkit.url.protocol + source) : '';
        },
        /**
         * 创建一个url
         * @param  {String} domain url主域
         * @param  {String} path   path
         * @param  {Boolean} useSSL 使用https?
         * @return {String}        生成的url
         */
        createURL : function (domain, path, useSSL) {
            return [useSSL ? "https" : "http", "://", domain, path].join("");
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
            if (!top) {
                sinaadToolkit.error('sinaadToolkit:Cannot get pageurl on which ad locates.');
            }
            return top;
        })()
    };



    /**
     * @namespace sinaadToolkit.dom
     */
    sinaadToolkit.dom = sinaadToolkit.dom || /** @lends sinaadToolkit.dom */{
        /**
         * 获取元素
         * 
         */
        get : function (id) {
            if (!id) {
                return null;
            }
            if ('string' === typeof id || id instanceof String) {
                return document.getElementById(id);
            } else if (id.nodeName && (id.nodeType === 1 || id.nodeType === 9)) {
                return id;
            }
            return null;
        },
        addClass : function (element, className) {
            element = sinaadToolkit.dom.get(element);
            var classArray = className.split(/\s+/),
                result = element.className,
                classMatch = " " + result + " ",
                i = 0,
                l = classArray.length;

            for (; i < l; i++){
                 if ( classMatch.indexOf( " " + classArray[i] + " " ) < 0 ) {
                     result += (result ? ' ' : '') + classArray[i];
                 }
            }

            element.className = result;
            return element;
        },
        /**
         * 获取某个dom节点所属的document
         * @param  {HTMLNodeElement} element 节点
         * @return {DocumentElement}         所属的document节点
         */
        getDocument : function (element) {
            return element.nodeType === 9 ? element : element.ownerDocument || element.document;
        },
        /**
         * 获取某个dom节点的某个计算后样式
         * @param  {HTMLNodeElement} element 节点
         * @param  {String} key     样式名
         * @return {String}         样式值
         */
        getComputedStyle : function (element, key) {
            var doc = sinaadToolkit.dom.getDocument(element),
                styles;
            if (doc.defaultView && doc.defaultView.getComputedStyle) {
                styles = doc.defaultView.getComputedStyle(element, null);
                if (styles) {
                    return styles[key] || styles.getPropertyValue(key);
                }
            }
            return '';
        },
        /**
         * 获取某个dom节点的某个当前样式
         * @param  {HTMLNodeElement} element 节点
         * @param  {String} key     样式名
         * @return {String}         样式值
         */
        getCurrentStyle : function (element, key) {
            return element.style[key] || (element.currentStyle ? element.currentStyle[key] : "") || sinaadToolkit.dom.getComputedStyle(element, key);
        },

        _styleFixer : {},
        _styleFilter : [],

        /**
         * 获取目标元素的样式值
         * @name sinaadToolkit.dom.getStyle
         * @function
         * @grammar sinaadToolkit.dom.getStyle(element, key)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @param {string} key 要获取的样式名
         * @remark
         * 
         * 为了精简代码，本模块默认不对任何浏览器返回值进行归一化处理（如使用getStyle时，不同浏览器下可能返回rgb颜色或hex颜色），也不会修复浏览器的bug和差异性（如设置IE的float属性叫styleFloat，firefox则是cssFloat）。<br />
         * sinaadToolkit.dom._styleFixer和sinaadToolkit.dom._styleFilter可以为本模块提供支持。<br />
         * 其中_styleFilter能对颜色和px进行归一化处理，_styleFixer能对display，float，opacity，textOverflow的浏览器兼容性bug进行处理。  
         * @shortcut getStyle
         * @meta standard
         * @returns {string} 目标元素的样式值
         */
        // TODO
        // 1. 无法解决px/em单位统一的问题（IE）
        // 2. 无法解决样式值为非数字值的情况（medium等 IE）
        getStyle : function (element, key) {
            var dom = sinaadToolkit.dom,
                fixer;

            element = dom.get(element);
            key = sinaadToolkit.string.toCamelCase(key);
            //computed style, then cascaded style, then explicitly set style.
            var value = element.style[key] ||
                        (element.currentStyle ? element.currentStyle[key] : "") ||
                        dom.getComputedStyle(element, key);

            // 在取不到值的时候，用fixer进行修正
            if (!value || value === 'auto') {
                fixer = dom._styleFixer[key];
                if (fixer) {
                    value = fixer.get ? fixer.get(element, key, value) : sinaadToolkit.dom.getStyle(element, fixer);
                }
            }
            
            /* 检查结果过滤器 */
            if ((fixer = dom._styleFilter)) {
                value = fixer.filter(key, value, 'get');
            }
            return value;
        },
        /**
         * 获取目标元素相对于整个文档左上角的位置
         * @name sinaadToolkit.dom.getPosition
         * @function
         * @grammar sinaadToolkit.dom.getPosition(element)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @meta standard
         *             
         * @returns {Object} 目标元素的位置，键值为top和left的Object。
         */
        getPosition : function (element) {
            element = sinaadToolkit.dom.get(element);
            var doc = sinaadToolkit.dom.getDocument(element),
                browser = sinaadToolkit.browser,
                getStyle = sinaadToolkit.dom.getStyle,
                // Gecko 1.9版本以下用getBoxObjectFor计算位置
                // 但是某些情况下是有bug的
                // 对于这些有bug的情况
                // 使用递归查找的方式
                // BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 &&
                //                          doc.getBoxObjectFor &&
                //                          getStyle(element, 'position') === 'absolute' &&
                //                          (element.style.top === '' || element.style.left === ''),
                pos = {"left": 0, "top": 0},
                viewport = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement,
                parent,
                box;
            
            if (element === viewport) {
                return pos;
            }


            if (element.getBoundingClientRect) { // IE and Gecko 1.9+
                
                //当HTML或者BODY有border width时, 原生的getBoundingClientRect返回值是不符合预期的
                //考虑到通常情况下 HTML和BODY的border只会设成0px,所以忽略该问题.
                box = element.getBoundingClientRect();

                pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
                pos.top  = Math.floor(box.top)  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop);
                
                // IE会给HTML元素添加一个border，默认是medium（2px）
                // 但是在IE 6 7 的怪异模式下，可以被html { border: 0; } 这条css规则覆盖
                // 在IE7的标准模式下，border永远是2px，这个值通过clientLeft 和 clientTop取得
                // 但是。。。在IE 6 7的怪异模式，如果用户使用css覆盖了默认的medium
                // clientTop和clientLeft不会更新
                pos.left -= doc.documentElement.clientLeft;
                pos.top  -= doc.documentElement.clientTop;
                
                var htmlDom = doc.body,
                    // 在这里，不使用element.style.borderLeftWidth，只有computedStyle是可信的
                    htmlBorderLeftWidth = parseInt(getStyle(htmlDom, 'borderLeftWidth'), 10),
                    htmlBorderTopWidth = parseInt(getStyle(htmlDom, 'borderTopWidth'), 10);
                if (browser.ie && !browser.isStrict) {
                    pos.left -= isNaN(htmlBorderLeftWidth) ? 2 : htmlBorderLeftWidth;
                    pos.top  -= isNaN(htmlBorderTopWidth) ? 2 : htmlBorderTopWidth;
                }
            /*
             * 因为firefox 3.6和4.0在特定页面下(场景待补充)都会出现1px偏移,所以暂时移除该逻辑分支
             * 如果 2.0版本时firefox仍存在问题,该逻辑分支将彻底移除. by rocy 2011-01-20
            } else if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT){ // gecko 1.9-

                // 1.9以下的Gecko，会忽略ancestors的scroll值
                // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
                // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

                box = doc.getBoxObjectFor(element);
                var vpBox = doc.getBoxObjectFor(viewport);
                pos.left = box.screenX - vpBox.screenX;
                pos.top  = box.screenY - vpBox.screenY;
                */
            } else { // safari/opera/firefox
                parent = element;

                do {
                    pos.left += parent.offsetLeft;
                    pos.top  += parent.offsetTop;
              
                    // safari里面，如果遍历到了一个fixed的元素，后面的offset都不准了
                    if (browser.isWebkit > 0 && getStyle(parent, 'position') === 'fixed') {
                        pos.left += doc.body.scrollLeft;
                        pos.top  += doc.body.scrollTop;
                        break;
                    }
                    
                    parent = parent.offsetParent;
                } while (parent && parent !== element);

                // 对body offsetTop的修正
                if (browser.opera > 0 || (browser.isWebkit > 0 && getStyle(element, 'position') === 'absolute')) {
                    pos.top  -= doc.body.offsetTop;
                }

                // 计算除了body的scroll
                parent = element.offsetParent;
                while (parent && parent !== doc.body) {
                    pos.left -= parent.scrollLeft;
                    // see https://bugs.opera.com/show_bug.cgi?id=249965
                    // if (!b.opera || parent.tagName != 'TR') {
                    if (!browser.opera || parent.tagName !== 'TR') {
                        pos.top -= parent.scrollTop;
                    }
                    parent = parent.offsetParent;
                }
            }

            return pos;
        },
        /**
         * dom.innerHTML的增强版本，可执行script
         * @param  {HTMLElement} dom     容器节点元素
         * @param  {String} content 插入的内容
         */
        fill : (function () {
            var rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g;

            return function (dom, content) {
                if (!dom) {
                    return;
                }

                /*
                 * 当inner的第一个节点就是script的时候ie会丢弃这个节点，不下载也不执行
                 * 因此这里有这个hack，考虑到没有什么大影响，直接没有区分浏览器
                 */
                dom.innerHTML = '<i style="display:none;">Hack ie first node is script</i>' + content;

                var scripts = dom.getElementsByTagName('script'),
                    i = 0,
                    len = scripts.length,
                    script;

                /* 保证按顺序执行 */
                function exec() {
                    if (i++ < len && (script = scripts[0])) {
                        //ie6下会自动执行具有defer属性的内联和外部脚本
                        if (sinaadToolkit.browser.ie <= 6 && script.defer) {
                            exec();
                        } else {
                            if (script.src) {
                                sinaadToolkit.sio.loadScript(script.src, exec, {charset:'gb2312'});
                            } else {
                                sinaadToolkit.globalEval((script.text || script.textContent || script.innerHTML || "").replace(rcleanScript, ""));
                                exec();
                            }
                        }
                        //移除脚本节点
                        if (script.parentNode ) {
                            script.parentNode.removeChild(script);
                        }
                    }
                }

                exec();
            };
        })(),
        /**
         * 在目标元素的指定位置插入HTML代码
         * @name baidu.dom.insertHTML
         * @function
         * @grammar baidu.dom.insertHTML(element, position, html)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @param {string} position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
         * @param {string} html 要插入的html
         * @remark
         * 
         * 对于position参数，大小写不敏感<br>
         * 参数的意思：beforeBegin&lt;span&gt;afterBegin   this is span! beforeEnd&lt;/span&gt; afterEnd <br />
         * 此外，如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
         * 
         * @shortcut insertHTML
         * @meta standard
         *             
         * @returns {HTMLElement} 目标元素
         */
        insertHTML : function (element, position, html) {
            var range,
                begin;

            //在opera中insertAdjacentHTML方法实现不标准，如果DOMNodeInserted方法被监听则无法一次插入多element
            //by lixiaopeng @ 2011-8-19
            if (element.insertAdjacentHTML && !sinaadToolkit.browser.opera) {
                element.insertAdjacentHTML(position, html);
            } else {
                // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
                // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
                range = element.ownerDocument.createRange();
                // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
                // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
                position = position.toUpperCase();
                if (position === 'AFTERBEGIN' || position === 'BEFOREEND') {
                    range.selectNodeContents(element);
                    range.collapse(position === 'AFTERBEGIN');
                } else {
                    begin = position === 'BEFOREBEGIN';
                    range[begin ? 'setStartBefore' : 'setEndAfter'](element);
                    range.collapse(begin);
                }
                range.insertNode(range.createContextualFragment(html));
            }
            return element;
        }
  
    };

    /**
     * 为获取和设置样式的过滤器
     * @private
     * @meta standard
     */
    sinaadToolkit.dom._styleFilter.filter = function (key, value, method) {
        for (var i = 0, filters = sinaadToolkit.dom._styleFilter, filter; (filter = filters[i]); i++) {
            if ((filter = filter[method])) {
                value = filter(key, value);
            }
        }
        return value;
    };


    /**
     * @namespace sinaadToolkit.page
     */
    sinaadToolkit.page = sinaadToolkit.page || /** @lends sinaadToolkit.page */{
        /**
         * 获取向上滚动高度
         * @return {Number} 向上滚动高度
         */
        getScrollTop : function () {
            var doc = document;
            return window.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop;
        },
        /**
         * 获取向左滚动高度
         * @return {Number} 向左滚动高度
         */
        getScrollLeft : function () {
            var doc = document;
            return window.pageXOffset || doc.documentElement.scrollLeft || doc.body.scrollLeft;
        },
        /**
         * 获取页面高度
         * @return {Number} 页面高度
         */
        getViewHeight : function () {
            var doc = document,
                client = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;
            return client.clientHeight;
        },
        /**
         * 获取页面宽度
         * @return {Number} 页面宽度
         */
        getViewWidth : function () {
            var doc = document,
                client = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;
            return client.clientWidth;
        },
        /**
         * @link tangram baidu.page.createStyleSheet
         * 在页面中创建样式表对象
         * @name baidu.page.createStyleSheet
         * @function
         * @grammar baidu.page.createStyleSheet(options)
         * @param {Object} options 配置信息
         * 
                        
         * @param {Document} options.document 指定在哪个document下创建，默认是当前文档
         * @param {String} options.url css文件的URL
         * @param {Number} options.index 在文档里的排序索引（注意，仅IE下有效）
         * @version 1.2
         * @remark
         *  ie 下返回值styleSheet的addRule方法不支持添加逗号分隔的css rule.
         * 
         * @see baidu.page.createStyleSheet.StyleSheet
         *             
         * @returns {baidu.page.createStyleSheet.StyleSheet} styleSheet对象(注意: 仅IE下,其他浏览器均返回null)
         */
        createStyleSheet : function(options){
            var op = options || {},
                doc = op.document || document,
                s;

            if (sinaadToolkit.browser.ie) {
                //修复ie下会请求一个undefined的bug  berg 2010/08/27 
                if(!op.url) {
                    op.url = "";
                }
                return doc.createStyleSheet(op.url, op.index);
            } else {
                s = "<style type='text/css'></style>";
                op.url && (s = "<link type='text/css' rel='stylesheet' href='"+op.url+"'/>");
                sinaadToolkit.dom.insertHTML(doc.getElementsByTagName("HEAD")[0], "beforeEnd", s);
                //如果用户传入了url参数，下面访问sheet.rules的时候会报错
                if (op.url) {
                    return null;
                }

                var sheet = doc.styleSheets[doc.styleSheets.length - 1],
                    rules = sheet.rules || sheet.cssRules;
                return {
                    self : sheet,
                    rules : sheet.rules || sheet.cssRules,
                    addRule : function(selector, style, i) {
                        if (sheet.addRule) {
                            return sheet.addRule(selector, style, i);
                        } else if (sheet.insertRule) {
                            isNaN(i) && (i = rules.length);
                            return sheet.insertRule(selector +"{"+ style +"}", i);
                        }
                    },
                    removeRule : function(i) {
                        if (sheet.removeRule) {
                            sheet.removeRule(i);
                        } else if (sheet.deleteRule) {
                            isNaN(i) && (i = 0);
                            sheet.deleteRule(i);
                        }
                    }
                };
            }
        },
        /*
         * styleSheet对象 有两个方法 
         *  addRule(selector, style, i)
         *  removeRule(i)
         *  这两个方法已经做了浏览器兼容处理
         * 一个集合
         *  rules
         */
        injectStyles : function (styles) {
            var node = sinaadToolkit.page.createStyleSheet();
            for (var key in styles) {
                node.addRule(key, styles[key]);
            }
        }
    };


    sinaadToolkit.Deferred = sinaadToolkit.Deferred || (function (core) {
        function _pipe(original, deferred, callback, actionType) {
            return function () {
                if (typeof callback === 'function') {
                    try {
                        var returnValue = callback.apply(original, arguments);

                        if (Deferred.isPromise(returnValue)) {
                            returnValue.then(
                                function () {
                                    deferred.resolve.apply(deferred, arguments);
                                },
                                function () {
                                    deferred.reject.apply(deferred, arguments);
                                }
                            );
                        }
                        else {
                            deferred.resolve.call(deferred, returnValue);
                        }
                    }
                    catch (e) {
                        sinaadToolkit.error('sinaadToolkit.Deferred:Error occurred in _pipe. ' + e.message);
                        deferred.reject(e);
                    }
                }
                // `.then()`及`.then(done, null)`时使用
                // 直接使用原`Deferred`保存的参数将`deferred`改为对应状态
                else {
                    deferred[actionType].apply(deferred, original._args);
                }
            };
        }
        //判断promise状态决定指定回调方法
        function _flush(deferred) {
            if (deferred._state === 'pending') {
                return;
            }
            var callbacks = deferred._state === 'resolved' ? deferred._resolves.slice() : deferred._rejects.slice();

            setTimeout(function () {
                core.array.each(callbacks, function (callback) {
                    try {
                        callback.apply(deferred, deferred._args);
                    } catch (e) {
                        sinaadToolkit.error('sinaadToolkit.Deferred:Error occurred in _flush. ' + e.message);
                    }
                });
            }, 0);

            deferred._resolves = [];
            deferred._rejects = [];
        }

        /**
         * @constructor
         * @class Prossmise的一个实现
         * @memberOf sinaadToolkit
         */
        function Deferred() {
            this._state = 'pending'; //当前promise状态
            this._args = null;       //传递参数
            this._resolves = [];     //成功回调集合
            this._rejects = [];      //失败回调集合
        }
        
        Deferred.prototype = /** @lends Deferred.prototype */{
            /**
             * @method
             */
            resolve : function () {
                if (this._state !== "pending") {
                    return;
                }

                this._state = 'resolved';
                this._args = [].slice.call(arguments);

                _flush(this);
            },
            reject : function () {
                if (this._state !== 'pending') {
                    return;
                }
                this._state = 'rejected';
                this._args = [].slice.call(arguments);

                _flush(this);
            },
            then : function (resolve, reject) {
                var deferred = new Deferred();
                
                this._resolves.push(_pipe(this, deferred, resolve, 'resolve'));
                this._rejects.push(_pipe(this, deferred, reject, 'reject'));

                _flush(this);

                return deferred;
            },
            done : function (callback) {
                return this.then(callback);
            },
            fail : function (callback) {
                return this.then(null, callback);
            }
        };

        Deferred.isPromise = function (value) {
            return value && typeof value.then === 'function';
        };

        return Deferred;

    })(sinaadToolkit);


    sinaadToolkit.throttle = sinaadToolkit.throttle || /** 
         * @memberOf sinaadToolkit
         * @method throttle
         * @description  频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
         * @param fn {function}  需要调用的函数
         * @param delay  {number}    延迟时间，单位毫秒
         * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
         * @return {function}    实际调用函数
         */
        function (fn, delay, immediate, debounce) {
        var curr = +new Date(),//当前时间
            last_call = 0,
            last_exec = 0,
            timer = null,
            diff, //时间差
            context,//上下文
            args,
            exec = function () {
                last_exec = curr;
                fn.apply(context, args);
            };
        return function () {
            curr = +new Date();
            context = this,
            args = arguments,
            diff = curr - (debounce ? last_call : last_exec) - delay;
            clearTimeout(timer);
     
            if (debounce) {
                if (immediate) {
                    timer = setTimeout(exec, delay);
                } else if (diff >= 0) {
                    exec();
                }
            } else {
                if (diff >= 0) {
                    exec();
                } else if (immediate) {
                    timer = setTimeout(exec, -diff);
                }
            }
     
            last_call = curr;
        };
    };
     
    sinaadToolkit.debounce = sinaadToolkit.debounce || /**
     * @method  debounce
     * @description 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
     * @memberOf sinaadToolkit
     * @param fn {function}  要调用的函数
     * @param delay   {number}    空闲时间
     * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
     * @return {function}    实际调用函数
     */
    function (fn, delay, immediate) {
        return sinaadToolkit.throttle(fn, delay, immediate, true);
    };

    /**
     * @namespace sinaadToolkit.sio
     */
    sinaadToolkit.sio = sinaadToolkit.sio || (function () {
        /**
         * @private
         * @param  {HTMLScriptElement} scr     script节点
         * @param  {String} url     资源地址
         * @param  {String} charset 字符集
         */
        function _createScriptTag(scr, url, charset) {
            scr.setAttribute('type', 'text/javascript');
            charset && scr.setAttribute('charset', charset);
            scr.setAttribute('src', url);
            document.getElementsByTagName('head')[0].appendChild(scr);
        }
        /**
         * @private
         * @param  {HTMLScriptElement} scr script节点
         */
        function _removeScriptTag(scr) {
            if (scr && scr.parentNode) {
                scr.parentNode.removeChild(scr);
            }
            scr = null;
        }
        return /** @lends sinaadToolkit.sio */{
            IMG_1_1 : 'http://d00.sina.com.cn/a.gif',
            /**
             * 加载js模块
             * @param  {String} url          资源地址
             * @param  {Function} opt_callback 成功后回调方法
             * @param  {Object} opt_options  选项
             */
            loadScript : function (url, optCallback, optOptions) {
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
            },
            /**
             * jsonp方式回调
             * @param  {String}   url         资源地址
             * @param  {Function} callback    回调方法
             * @param  {Object}   opt_options 选项
             */
            jsonp : function (url, callback, optOptions) {
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
         
                if (sinaadToolkit.isFunction(callback)) {
                    callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
                    window[callbackName] = getCallBack(0);
                } else if (sinaadToolkit.isString(callback)) {
                    // 如果callback是一个字符串的话，就需要保证url是唯一的，不要去改变它
                    // TODO 当调用了callback之后，无法删除动态创建的script标签
                    callbackName = callback;
                } else {
                    if ((matches = reg.exec(url))) {
                        callbackName = matches[2];
                    }
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
            },
            /**
             * 日志方法
             * @param  {String} url 发送日志地址
             */
            log : function (url, useCache) {
                var img = new Image(),
                    key = '_sinaads_sio_log_' + sinaadToolkit.rnd();

                window[key] = img;
             
                img.onload = img.onerror = img.onabort = function () {
                    img.onload = img.onerror = img.onabort = null;
             
                    window[key] = null;
                    img = null;
                };
         
                img.src = url + (useCache ? '' : (url.indexOf('?') > 0 ? '&' : '?') + key);
            }
        };
    })();


    /**
     * @namespace sinaadToolkit.swf
     */
    sinaadToolkit.swf = sinaadToolkit.swf || /** @lends sinaadToolkit.swf */{
        uid : 0,
        /**
         * 获取当前flash对象
         * @param  {String} name    要获取的flash的id或name
         * @param  {Object} context 从哪个上下文对象中获取这个flash对象，默认从当前上下文
         * @return {Object}         得到的flash对象
         */
        getMovie : function (name, context) {
            context = context || window;
            //ie9下, Object标签和embed标签嵌套的方式生成flash时,
            //会导致document[name]多返回一个Object元素,而起作用的只有embed标签
            var movie = context.document[name],
                ret;
            return sinaadToolkit.browser.ie === 9 ?
                movie && movie.length ?
                    (ret = sinaadToolkit.array.remove(sinaadToolkit.toArray(movie), function (item) {
                        return item.tagName.toLowerCase() !== "embed";
                    })).length === 1 ? ret[0] : ret
                    : movie
                : movie || context[name];
        },
        /**
         * 创建flash的html
         * @param  {Object} options 选项
         * @return {String}         flash的html
         * http://www.w3help.org/zh-cn/causes/HO8001  修改成仅用embed标签渲染flash
         */
        createHTML : function (options) {
            options = options || {};
            var item,
                k,
                tmpOpt = {},
                encodeHTML = sinaadToolkit.string.encodeHTML;
            
            // 复制options，避免修改原对象
            for (k in options) {
                tmpOpt[k] = options[k];
            }
            options = tmpOpt;
            
            var vars = options.vars;
            
            // 初始化flashvars参数的值
            if ('string' === typeof vars) {
                options.flashvars = vars;
            } else {
                var fvars = [];
                for (k in vars) {
                    item = vars[k];
                    fvars.push(k + "=" + encodeURIComponent(item));
                }
                options.flashvars = fvars.join('&');
            }
            
            var str = ['<embed'];
            // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
            options.name = options.id || 'sinaadtk_swf_uid_' + (sinaadToolkit.swf.uid++);
            options.align = options.align || 'middle';
            options.src  = options.url || '';
            options.type = 'application/x-shockwave-flash';
            options.pluginspage = 'http://www.macromedia.com/go/getflashplayer';

            delete options.id;
            delete options.url;
            delete options.vars;
            
            
            // 在firefox、opera、safari下，salign属性必须在scale属性之后，否则会失效
            // 经过讨论，决定采用BT方法，把scale属性的值先保存下来，最后输出
            var salign;
            for (k in options) {
                item = options[k];
                if (item || item === false || item === 0) {
                    if ((new RegExp("^salign\x24", "i")).test(k)) {
                        salign = item;
                        continue;
                    }
                    
                    str.push(' ', k, '="', encodeHTML(item), '"');
                }
            }
            
            if (salign) {
                str.push(' salign="', encodeHTML(salign), '"');
            }
            str.push('/>');
            
            return str.join('');
        }
    };



    /**
     * @namespace sinaadToolkit.iframe
     */
    sinaadToolkit.iframe = sinaadToolkit.iframe || /** @lends sinaadToolkit.iframe */{
        uid : 0,
        /**
         * 往一个对象中填充iframe的初始属性，返回一个用于生成iframe的对象
         * @param  {Object} config   需要填充的对象
         * @param  {Number} width    iframe宽
         * @param  {Number} height   iframe高
         * @param  {Boolean} useQuote 属性前后是否用引号包裹
         * @return {Object}          填充完初始属性，用于生成iframe的对象
         */
        init : function (config, width, height, useQuote) {
            var quote = useQuote ? '"' : "", //是否使用引号将属性包裹
                zero = quote + "0" + quote;
            config.width = quote + width + quote;
            config.height = quote + height + quote;
            config.frameborder = zero;
            config.marginwidth = zero;
            config.marginheight = zero;
            config.vspace = zero;
            config.hspace = zero;
            config.allowtransparency = quote + "true" + quote;
            config.scrolling = quote + "no" + quote;
        },
        /**
         * 使用iframe配置对象生成iframe的html
         * @param  {Object} config iframe配置属性对象
         * @return {String}        生成iframe的html
         */
        createHTML : function (config) {
            var html = [];

            //将iframe的name设置成跟id一样，如果没有的配置name的话
            config.name = config.name || config.id || ('sinaadtk_iframe_uid_' + sinaadToolkit.iframe.uid++);

            sinaadToolkit.object.map(config, function (value, key) {
                html.push(" " + key + '="' + (null === value ? "" : value) + '"');
            });
            return "<iframe" + html.join("") + "></iframe>";
        },
        /**
         * 往iframe中填充内容
         * @param  {HTMLIframeElement} iframe  iframe节点
         * @param  {String} content 要填充的内容
         */
        fill : function (iframe, content) {
            var doc,
                ie = sinaadToolkit.browser.ie;
            //ie
            if (ie) {
                //是否可以获取到iframe的document
                try {
                    doc = !!iframe.contentWindow.document;
                } catch (e) {
                    doc = false;
                }
                if (doc) {
                    try {
                        //ie > 6
                        if (ie > 6) {
                            // var k;
                            // i: {
                            //     //ie 7 - 10
                            //     if (ie > 7 && ie <= 10) {
                            //         for (var i = 0; i < content.length; ++i) {
                            //             if (127 < content.charCodeAt(i)) {
                            //                 k = true;
                            //                 break i;
                            //             }
                            //         }
                            //     }
                            //     k = false;
                            // }
                            // if (k) {
                            //     var content = unescape(encodeURIComponent(content));
                            //     var mid = Math.floor(content.length / 2);
                            //     k = [];
                            //     for (var i = 0; i < mid; ++i) {
                            //         k[i] = String.fromCharCode(256 * content.charCodeAt(2 * i + 1) + content.charCodeAt(2 * i));
                            //     }
                            //     1 == content.length % 2 && (k[mid] = content.charAt(content.length - 1));
                            //     content = k.join("");
                            // }
                            window.frames[iframe.name].contents = content;
                            iframe.src = 'javascript:window["contents"]';
                        // ie <= 6
                        } else {
                            window.frames[iframe.name].contents = content;
                            iframe.src = 'javascript:document.write(window["contents"]);/* document.close(); */';
                        }
                    } catch (e) {
                        sinaadToolkit.error("sinaadToolkit.iframe.fill: cannot fill iframe content in ie, ", e);
                    }
                } else {
                    /**
                     * ie下，且iframe.contentWindow.document无法取到，跨域
                     * 比如宿主页面设置了document.domain, 而iframe没有设置
                     * 在iframe中设置document.domain
                     * 当页面中设置了document.doman, 动态创建的iframe无法获取修改内容，所以需要按照下面的方式来处理
                     * iframe.src = "javascript:document.write('<script>document.domain=\"" + document.domain + "</script>')";
                     * Now write some content to the iframe
                     * iframe.contentWindow.document.write('<html><body><p>Hello world</p></body></html>');
                     * @see http://stackoverflow.com/questions/14715427/cant-access-an-aboutblank-iframe-in-ie-after-the-document-domain-changes
                     */
                    try {
                        var key = "sinaads-ad-iframecontent-" + sinaadToolkit.rnd();
                        window[key] = content;
                        content = 'var adContent = window.parent["' + key + '"];window.parent["' + key + '"] = null;document.write(adContent);';
                        content = sinaadToolkit.browser.ie && sinaadToolkit.browser.ie <= 6 ?
                             "window.onload = function() {" +
                                "document.write(\\'<sc\\' + \\'ript type=\"text/javascript\">document.domain = \"" + document.domain + '";' + content + "<\\/scr\\' + \\'ipt>\\');" +
                                "/*document.close();*/" +
                            "};" :
                            'document.domain = "' + document.domain + '";' +
                            content +
                            "/*document.close();*/";

                        iframe.src = 'javascript:\'<script type="text/javascript">' + content + "\x3c/script>'";
                    } catch (e) {
                        window[key] = null;
                        sinaadToolkit.error("sinaadToolkit.iframe.fill:Cannot fill iframe in IE by modifying the document.domain. ", e);
                    }
                }
            //标准浏览器，标准方法
            } else {
                try {
                    doc = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument,
                    sinaadToolkit.browser.firefox &&
                    doc.open("text/html", "replace");
                    doc.write(content);
                    doc.close();
                } catch (e) {
                    sinaadToolkit.error("sinaadToolkit.iframe.fill:Cannot fill iframe by regular method. ", e);
                }
            }
        }
    };


    /**
     * @namespace sinaadToolkit.monitor
     */
    sinaadToolkit.monitor = sinaadToolkit.monitor || /** @lends sinaadToolkit.monitor */{

        /**
         * 将监控url中的__xxx__变量名替换成正确的值，值从对象data中获取
         * @param  {String} monitorUrl 监控url
         * @param  {Object} data       用于替换的值对象
         * @return {String}            返回替换后的url
         */
        parseTpl : (function () {
            var reg = /\{__([a-zA-Z0-9]+(_*[a-zA-Z0-9])*)__\}/g;

            return function (monitorUrl, data) {
                data = data || {};
                //增加timestamp参数替换
                data.timestamp = data.timestamp || sinaadToolkit.now();
                if (!monitorUrl) {
                    return '';
                }
                return monitorUrl.replace(reg, function (s1, s2) {
                    //插入adbox能支持的模版变量
                    //见adbox监控接口文档，
                    //https://github.com/acelan86/pandora/wiki/%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E
                    //adbox的监控需要插入到iframe的name中，使用api_exu=xxx的方式
                    if (s2.indexOf('adbox_') > 0) {
                        s2 = s2.split('_');
                        return '{__mo' + s2[2] + '__}';
                    }
                    return data[s2] || s1;
                });
            };
        })(),
        /**
         * 创建曝光监测, 返回创建曝光的iframe的html片段
         * @param  {Array:String} pvs 曝光监控的url数组
         * @return {String}     返回创建曝光的iframe的html片段
         */
        createImpressMonitor : function (pvs) {
            var html = [];

            sinaadToolkit.array.each(pvs, function (pv) {
                var config = {};
                sinaadToolkit.iframe.init(config, 1, 1, false);
                config.src = pv;
                config.style = 'display:none;';
                html.push(sinaadToolkit.iframe.createHTML(config));
            });
            return html.join('');
        },
        /**
         * 创建二跳跟踪监测
         * @param  {String} link    落地页
         * @param  {Array:String} monitor 监测地址
         * @return {String}         二跳监测地址
         */
        createTrackingMonitor : function (link, monitor) {
            //如果没有link，就不生成二跳监测
            if (!link) {
                return '';
            }

            var clickTAG = sinaadToolkit.url.ensureURL(link);

            sinaadToolkit.array.each(monitor, function (url) {
                url = sinaadToolkit.url.ensureURL(url);
                
                if (url) {
                    clickTAG = url + encodeURIComponent(clickTAG);
                }
            });

            return clickTAG;
        },
        //[monitor1, monitor2, ..]  =>  'encodeURIComponent(monitor1)|encodeURLComponent(monitor2)|...'
        stringify : function (arr_monitor) {
            var str = [];
            sinaadToolkit.array.each(arr_monitor, function (m) {
                m && str.push(encodeURIComponent(m));
            });
            return str.join('|');
        },
        //'encodeURIComponent(monitor1)|encodeURLComponent(monitor2)|...'  => [monitor1, monitor2, ..]
        parse : function (str_monitor) {
            var arr = [],
                monitor = (str_monitor || '').split('|');
            sinaadToolkit.array.each(monitor, function (m) {
                m && arr.push(decodeURIComponent(m));
            });
            return arr;
        }
    };

    /**
     * @namespace sinaadToolkit.ad
     */
    sinaadToolkit.ad = sinaadToolkit.ad || /** @lends sinaadToolkit.ad */{
        /**
         * 获取某个存储值在某段时间内的次数，0为超出次数
         * @param  {String}  key   存储标识
         * @param  {Number}  times 次数
         * @param  {Number}  range 时间范围毫秒数
         * @return {Number}        当前次数，0为超出
         *
         * storage   time::timestamp
         */
        getTimesInRange : function (key, times, range) {
            key = 'sinaads_tc_' + key,
            range = range || 0;

            var time = (sinaadToolkit.storage.get(key) || '').split('::'),
                timestamp,
                now = sinaadToolkit.now();

            timestamp = time[1] ? parseInt(time[1], 10) : (now + range);

            //未过期
            if (timestamp - now >= 0) {
                time = time[0] ? parseInt(time[0], 10) + 1 : 1;
            } else {
                time = 1;
                timestamp = now + range;
                sinaadToolkit.storage.remove(key);
            }
            sinaadToolkit.storage.set(key, time + '::' + timestamp, now + range);

            return time > times ? 0 : time;
        },
        /**
         * 通过src地址获取资源类型
         * @param  {String} src 资源地址
         * @return {String}     类型
         */
        getTypeBySrc : function (src, defaultType) {
            var type = defaultType;
            if (!type) {
                type = src.substring(src.length - 3).toLowerCase();
                switch (type) {
                    case 'swf':
                        type = 'flash';
                        break;
                    case 'tml':
                        type = 'url';
                        break;
                    case '.js' :
                        type = 'js';
                        break;
                    case 'png':
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                        type = 'image';
                        break;
                    case 'mp4':
                    case 'flv':
                        type = 'video';
                        break;
                    default:
                        type = 'html';
                        break;
                }
            }

            if (type === 'url' && src.indexOf('adbox.sina.com.cn/ad/') >= 0) {
                type = 'adbox';
            }
            return type;
        },
        embed : function (element, type, width, height, adContent) {
            switch (type) {
                case 'text' :
                case 'image' :
                case 'url' :
                case 'adbox' :
                case 'flash' :
                    element.innerHTML = adContent;
                    break;
                default :
                    //创建广告渲染的沙箱环境，并传递部分广告参数到沙箱中
                    sinaadToolkit.sandbox.create(element, width, height, adContent);
                    break;
            }
        },
        /**
         * 创建广告展现html
         * @param  {String} type    广告类型，如图片等
         * @param  {String} src     广告资源地址
         * @param  {Number} width   广告宽
         * @param  {Number} height  广告高
         * @param  {String} link    广告资源落地页地址
         * @param  {Array:String} monitor 广告点击监测的url数组
         * @param  {String} tpl     模版
         * @param  {Object} opt_options 额外参数
         *         @param {Boolean} wmode 是否透明
         * @return {String}         广告展现html
         */
        createHTML : function (type, src, width, height, link, monitor, pv, tpl, opt_options) {
            var html = [],
                _html = '',
                config,
                tmpData = {},
                len = 0,
                i = 0;

            opt_options = opt_options || {};

            src = sinaadToolkit.array.ensureArray(src),
            type = sinaadToolkit.array.ensureArray(type),
            link = sinaadToolkit.array.ensureArray(link),
            pv = sinaadToolkit.monitor.stringify(sinaadToolkit.array.ensureArray(pv)),
            monitor = sinaadToolkit.monitor.stringify(sinaadToolkit.array.ensureArray(monitor));

            width += sinaadToolkit.isNumber(width) ? 'px' : '',
            height += sinaadToolkit.isNumber(height) ? 'px' : '';


            /**
             * 把所有的属性拉平，方便模板处理
             * src0, src1, src2 ... srcn
             * type0, type1, type2 ... typen
             * link0, link1, link2 ... linkn
             * monitor0, monitor1, monitor2 ... monitorn
             */
            sinaadToolkit.array.each(src, function (_src, i) {
                tmpData['src' + i] = _src;
                tmpData['type' + i] = type[i] || sinaadToolkit.ad.getTypeBySrc(_src, type[i]);
                tmpData['link' + i] = link[i];
            });
            tmpData.width = width;
            tmpData.height = height;
            tmpData.src = tmpData.src0 || '';
            tmpData.type = tmpData.type0 || '';
            tmpData.link = tmpData.link0 || '';


            //如果提供了模版，则使用模版来渲染广告
            //模版中可以含有参数type, src, width, height, monitor, link
            //现在主要用在智投文字链和图文方式
            if (tpl && 'string' === typeof tpl) {
                return sinaadToolkit.string.format(tpl, tmpData);
            }


            len = src.length;
            len = 1; //暂时先支持一个元素

            for (; i < len; i++) {
                //如果没有自定模版
                src = tmpData['src' + i];
                type = tmpData['type' + i];
                link = tmpData['link' + i];
                //monitor = monitor.join('|');

                switch (type) {
                    case 'image' :
                        _html = '<img border="0" src="' + sinaadToolkit.url.ensureURL(src) + '" style="width:' + width + ';height:' + height + ';border:0" alt="' + src + '"/>';
                        //onclick与跳转同时发送会导致丢失移动端的监测
                        _html = link ? '<a href="' + link + '" target="_blank">' + _html + '</a>' : _html;
                        break;
                    case 'text' :
                        _html = link ? '<a href="' + link + '" target="_blank">' + src + '</a>' : src;
                        break;
                    case 'flv' :
                    case 'video' :
                        //视频格式，则将src作为视频内容放入，并设置音量等属性, 默认视频音量为0
                        opt_options.source = src;
                        opt_options.volume = opt_options.volume || 20;
                        //设置展现的src为视频播放器
                        src = sinaadToolkit.VPLAYER_URL;
                        /* falls through */
                    case 'flash' :
                        var vars = {};
                        //拷贝opt_options的内容到vars中，使opt_options的内容可以作为flash的参数传递进去
                        for (var key in opt_options) {
                            if (opt_options[key] && opt_options.hasOwnProperty(key)) {
                                vars[key] = opt_options[key];
                            }
                        }
                        link && (vars.clickTAG = link);
                        _html = sinaadToolkit.swf.createHTML({
                            url : sinaadToolkit.url.ensureURL(src),
                            width : width,
                            height : height,
                            wmode : opt_options.wmode || 'opaque',
                            vars : vars,
                            id : opt_options.id || ''
                        });
                        if (link) {
                            _html = [
                                '<div style="width:' + width + ';height:' + height + ';position:relative;overflow:hidden;">',
                                    _html,
                                    '<a style="position:absolute;background:#fff;opacity:0;filter:alpha(opacity=0);width:' + width + ';height:' + height + ';left:0;top:0" href="' + link + '" target="_blank"></a>',
                                '</div>'
                            ].join('');
                        }
                        break;
                    case 'adbox' :
                    case 'url' :
                        config = {};
                        sinaadToolkit.iframe.init(config, width, height, false);
                        config.src = sinaadToolkit.url.ensureURL(src);
                        config.name = config.name ? ['name=' + config.name] : [];
                        monitor && config.name.push('clickTAG=' + monitor);
                        pv && config.name.push('viewTAG=' + pv);
                        config.name = config.name.join('&');
                        _html = sinaadToolkit.iframe.createHTML(config);
                        break;
                    case 'js' :
                        _html = [
                                '<', 'script>window.clickTAG=\"' + monitor + '\";window.viewTAG=\"' + pv + '\";</', 'script>',
                                '<', 'script charset="utf-8" src="', sinaadToolkit.url.ensureURL(src), '"></', 'script>'
                            ].join('');
                        break;
                    default :
                        _html = [
                                '<', 'script>window.clickTAG=\"' + monitor + '\";window.viewTAG=\"' + pv + '\";</', 'script>',
                                src.replace(/\\x3c/g, '<').replace(/\\x3e/g, '>')
                            ].join('');
                        break;
                }
                html.push(_html);
            }
            return html.join(' ');
        }
    };



    /**
     * @namespace sinaadToolkit.sandbox
     */
    sinaadToolkit.sandbox = sinaadToolkit.sandbox || (function () {
        /**
         * 沙箱uid
         * @private
         * @type {Number}
         */
        var uid = 0;
        /**
         * 将对象转换成字符串形式表示
         * @private
         */
        function _stringify(value, arr) {
            var comma = "",
                i;

            switch (typeof value) {
                case "string":
                    arr.push(sinaadToolkit.string.formalString(value));
                    break;
                case "number":
                    arr.push(isFinite(value) && !isNaN(value) ? value : "null");
                    break;
                case "boolean":
                    arr.push(value);
                    break;
                case "undefined":
                    arr.push("null");
                    break;
                case "object":
                    //is Null
                    if (null === value) {
                        arr.push("null");
                        break;
                    }
                    //is Array
                    if (value instanceof Array) {
                        var len = value.length;

                        arr.push("[");
                        for (comma = "", i = 0; i < len; i++) {
                            arr.push(comma);
                            _stringify(value[i], arr);
                            comma = ",";
                        }
                        arr.push("]");
                        break;
                    }

                    //is Object
                    arr.push("{");
                    var v;
                    comma = "";
                    for (var key in value) {
                        if (value.hasOwnProperty(key)) {
                            v = value[key];
                            if ("function" !== typeof v) {
                                arr.push(comma);
                                arr.push(key);
                                arr.push(":");
                                _stringify(v, arr);
                                comma = ",";
                            }
                        }
                    }
                    arr.push("}");
                    break;
                case "function":
                    break;
                default:
                    //throw Error("未知的值类型: " + typeof value);
            }
        }
 

        /**
         * 将config的属性值转换成变量声明代码
         * @private
         */
        function _objToJsVarCode(obj) {
            var code = [];

            sinaadToolkit.object.map(obj, function (value, key) {
                if (null !== value) {
                    var tmp = [];
                    try {
                        _stringify(value, tmp);
                        tmp = tmp.join("");
                    } catch (e) {}
                    tmp && code.push(key, "=", tmp, ";");
                }
            });

            return code.join("");
        }

        return /** @lends sinaadToolkit.sandbox */{
            /**
             * 创建一个广告展现沙箱
             * @param  {HTMLNodeElement} container 沙箱所在容器
             * @param  {Number} width     沙箱宽
             * @param  {Number} height    沙箱高
             * @param  {String} content   沙箱内容
             * @param  {Object} context   沙箱中传入的外部属性值
             */
            create : function (container, width, height, content, context) {
                var sandboxId =  'sinaadtk_sandbox_id_' + uid++;

                context = context || {};

                context.sinaadToolkitSandboxId = sandboxId; //增加sandboxId到全局变量中，方便内部获取iframe节点

                width += sinaadToolkit.isNumber(width) ? 'px' : '';
                height += sinaadToolkit.isNumber(height) ? 'px' : '';

                var iframeConfig = {};
                sinaadToolkit.iframe.init(iframeConfig, width, height, 0);
                iframeConfig.src = 'javascript:\'<html><body style=background:transparent;></body></html>\'';
                iframeConfig.id = sandboxId;
                iframeConfig.style = 'float:left;';

                container.innerHTML = sinaadToolkit.iframe.createHTML(iframeConfig);

                //context转成js代码描述，用于注入到iframe中
                context = _objToJsVarCode(context);

                //构造iframe实体
                sinaadToolkit.iframe.fill(document.getElementById(sandboxId), [
                    '<!doctype html><html><body style="background:transparent">',
                        '<', 'script>', context, '</', 'script>',
                        content,
                    '</body></html>'
                ].join(""));
            }
        };
    })();

    /**
     * @todo 简单动画方法
     */

})(window);
/**
 * Box2.0
 * @class 创建一个附属在任意元素或者视口的盒子，并可以实现跟随，是大部分富媒体广告的基础
 * @usage
 *     new Box({
 *         position : {
 *             my : 'left+200 top+100',
 *             of : [window, #id] | 'window' | #id | dom | 'body',
 *             at : 'left-20 top'
 *         },
 *         follow : 1,
 *         minViewportWidth : 1000,
 *         width : 100,
 *         height : 100
 *     });
 * @constructor
 */
(function (window, document, core, undefined) {
    "use strict";

    function Box(options) {
        options = options || {};

        this.id = options.uid || ('sinaadToolkitBox' + Box.uid++);
        this.className = options.className || 'sinaad-toolkit-box';
        this.position = this._parsePosition(options.position);
        this.width = options.width || 100;
        this.height = options.height || 100;
        this.follow = options.follow || 0;
        this.zIndex = options.zIndex || 99999;
        this.autoShow = 'undefined' === typeof options.autoShow ? 0 : options.autoShow;
        this.minViewportWidth = options.minViewportWidth || 0;  //容器最小宽度
        this.useFix = this.follow && core.browser.isSupportFixed ? 1 : 0;

        //创建盒子
        var main = document.createElement('div');
        main.id = this.id;
        main.className = this.className;
        main.style.cssText = [
            'position:' + (this.useFix ? 'fixed' : 'absolute'),
            'width:' + this.width + 'px',
            'height:' + this.height + 'px',
            'z-index:' + this.zIndex,
            'display:' + (this.autoShow ? 'block' : 'none')
            // '-webkit-transition:.5s'
            //for test
            //'background-color:#ccc'
        ].join(';');
        document.body.insertBefore(main, document.body.firstChild);

        this.main = main;

        this.resetPositionHandler = this._getResetPositionHandler();
        //调整尺寸
        core.event.on(window, 'resize', this.resetPositionHandler);
        //页面滚动
        if (this.follow && !core.browser.isSupportFixed) {
            core.event.on(window, 'scroll', this.resetPositionHandler);
        }

        this.setPosition();
    }

    Box.uid = 0;

    Box.prototype = {
        /**
         * {
         *    pos : ['left', 'top'],
         *    offset : [0, 0]
         * }
         * @param  {[type]} strPosition [description]
         * @return {[type]}             [description]
         */
        _parseStringPosition : function (strPosition) {
            var tmp = (strPosition || '').match(/^([a-zA-Z]+)*([+|-]*\d+)*(?:px)*\s+([a-zA-Z]+)*([+|-]*\d+)*(?:px)*$/),
                pos = {};

            if (!tmp) {
                //core.error('Box:no valid pos');
                tmp = [];
            }
            pos.pos = [
                tmp[1] || 'left',
                tmp[3] || 'top'
            ];
            pos.offset = [
                tmp[2] ? parseInt(tmp[2], 10) : 0,
                tmp[4] ? parseInt(tmp[4], 10) : 0
            ];

            return pos;
        },
        /**
         * *******************************
         * string type : 
         * ======================== 
         *     'left top', 
         *     'left center',
         *     'left bottom',
         *     'center top',
         *     'center center',
         *     'center bottom',
         *     'right top',
         *     'right center',
         *     'right bottom'
         * ========================
         *     'x+offset, y+offset'
         * *********************************
         *
         *
         * *********************************
         * object type :
         * ========================
         *    {
         *        my : 'left top',
         *        at : 'left top',
         *        of : 'body'
         *    }
         * *********************************
         */
        _parsePosition : function (position) {
            var pos = {},
                of = [];

            if ('string' === typeof position) {
                pos.of = window;
                pos.at = position;
            } else {
                position = position || {};
                pos.of = position.of || window;
                pos.at = position.at;
                pos.my = position.my;
            }
            core.array.each(pos.of, function (o) {
                of.push(
                    'string' === typeof o ?
                        'body' === o ?
                            document.body :
                            'window' === o ?
                                window :
                                document.getElementById(o) :
                        (o || window)
                );
            });
            pos.of = of;
            pos.at = this._parseStringPosition(pos.at);
            //如果pos.my没有指明，则等同与使用pos.at.pos, 即right,top也是right,top对应
            pos.my = this._parseStringPosition(pos.my || pos.at.pos.join(' '));
            return pos;
        },
        _getResetPositionHandler : function () {
            var me = this,
                timer;
            return function () {
                timer && clearTimeout(timer);
                timer = setTimeout(function () {
                    me.setPosition();
                }, 100);
            };
        },
        _getSize : function (dom) {
            var size = [0, 0];
            if (window === dom || document.body === dom) {
                size = [core.page.getViewWidth(), core.page.getViewHeight()];
            } else {
                size = [parseInt(core.dom.getStyle(dom, 'width'), 10), parseInt(core.dom.getStyle(dom, 'height'), 10)];
            }
            return size;
        },
        _getPosition : function(dom) {
            var pos = [0, 0],
                tmp;
            if (window === dom || document.body === dom) {
                pos = [0, 0];
            } else {
                tmp = core.dom.getPosition(dom);
                pos = [tmp.left, tmp.top];
            }
            return pos;
        },
        getMain : function () {
            return this.main;
        },
        show : function () {
            this.getMain().style.display = 'block';
        },
        hide : function () {
            this.getMain().style.display = 'none';
        },
        setPosition : function () {
            /**
             * pos = {
             *     to : dom,
             *     at : {
             *         pos : ['left', 'top'],
             *         offset : [0, 0]
             *     },
             *     my : {
             *         pos : ['left', 'top'],
             *         offset : [0, 0]
             *     }
             * }
             */
            var main = this.getMain(),
                pos = this.position,
                of = pos.of,
                at = pos.at,
                my = pos.my,
                //计算对应的值，如果只有一个相对参考系，用唯一的这个参考系当垂直跟水平参考系
                hOfSize = this._getSize(of[0]),
                hOfPosition = this._getPosition(of[0]),
                vOfSize = of[1] ? this._getSize(of[1]) : hOfSize,
                vOfPosition = of[1] ? this._getPosition(of[1]) : hOfPosition,
                mainSize = this._getSize(main),
                viewWidth = core.page.getViewWidth(),
                overflowOffset = Math.min(window === of[0] && this.minViewportWidth ? (viewWidth / 2 - this.minViewportWidth / 2) : 0, 0); //水平方向的溢出补偿

            //console.log(vOfSize, vOfPosition, hOfSize, hOfPosition, mainSize);

            var x = hOfPosition[0] + my.offset[0] + at.offset[0] + (this.follow && !core.browser.isSupportFixed ? core.page.getScrollLeft() : 0);
            switch (my.pos[0]) {
                case 'center'   : x -= mainSize[0] / 2;                 break;
                case 'right'    : x -= mainSize[0] + overflowOffset;    break;
                default         : x += overflowOffset;                  break; //left    
            }
            switch (at.pos[0]) {
                case 'center'   : x += hOfSize[0] / 2;  break;
                case 'right'    : x += hOfSize[0];      break;
                default         : x += 0;               break; //left
            }

            var y = vOfPosition[1] + my.offset[1] + at.offset[1] + (this.follow && !core.browser.isSupportFixed ? core.page.getScrollTop() : 0);
            switch (my.pos[1]) {
                case 'center'   : y -= mainSize[1] / 2; break;
                case 'bottom'   : y -= mainSize[1];     break;
                default         : y += 0;               break; //top
            }
            switch (at.pos[1]) {
                case 'center'   : y += vOfSize[1] / 2;  break;
                case 'bottom'   : y += vOfSize[1];      break;
                default         : y += 0;               break; //top
            }

            main.style.left = x + 'px';
            main.style.top  = y + 'px';

            return;
        }
    };

    core.Box = core.Box || Box;
})(window, document, window.sinaadToolkit);
/**
 * 频率控制器
 * @param  {[type]} window    [description]
 * @param  {[type]} exports   [description]
 * @param  {[type]} core      [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function (window, exports, core, undefined) {
    "use strict";
    if (exports.FrequenceController) {
        return;
    }

    function FrequenceController(uid) {
        this.uid = uid || 'fc-uid' + (+new Date()).toString(36);
        this.list = {};
    }
    FrequenceController.prototype = {
        has : function (key) {
            return this.list[key];
        },
        register : function (key, frequence) {
            if (frequence) {
                this.list[key] = frequence;
            }
        },
        enable : function (key) {
            if (this.has(key)) {
                core.storage.remove(this.uid + key + '_disabled');
            }
        },
        disable : function (key) {
            if (this.has(key)) {
                core.storage.set(this.uid + key + '_disabled', 1, this.list[key] * 1000);
            }
        },
        isDisabled : function (key) {
            return core.storage.get(this.uid + key + '_disabled');
        }
    };

    exports.FrequenceController = FrequenceController;
    return FrequenceController;

})(window, window.sinaadToolkit || window, window.sinaadToolkit);


/**
 * [description]
 * @param  {[type]} window  [description]
 * @param  {[type]} exports [description]
 * @return {[type]}         [description]
 */
(function (window, exports, undefined) {
    "use strict";

    if (exports.OrderController) {
        return;
    }

    //状态表
    var STATE_MAP = {
        'INIT' : 1,  //初始化，即创建一个顺序
        'READY' : 2, //数据准备完成，可以执行，但需要等待前驱完成
        'DOING' : 3, //正在执行处理方法
        'DONE' : 4   //执行处理方法结束
    };

    var CHECK_FREQUENCE = 1 * 1000; //默认轮询检查时间
    var DONE_TIMEOUT = 30 * 1000; //默认前驱最长处理时间，如果前驱超出处理时间还没完成，后继会直接开始处理

    function _getDoneHandler(oc, type) {
        return function () {
            oc.done(type);
        };
    }

    /**
     * 检查order列表中的所有类型是否已经可以执行
     * 完成的类型会被从order列表中被移除
     * @return {[type]} [description]
     */
    function _check(oc) {
        var i = 0,
            type,
            callback;

        while ((type = oc.order[i++])) {
            //判断某个状态是否可以执行
            if (_canDoing(oc, type)) {
                //类型为正在执行状态
                oc._state[type] = STATE_MAP.DOING;
                //设置一段时间后由正在执行状态变成完成状态，防止因为特殊原因某个执行过程被迫中断
                oc._doneTimeoutTimer[type] = setTimeout(_getDoneHandler(oc, type), oc._timeout);
                
                //获取当前类型的
                callback = oc._callback[type];
                if ('function' === typeof callback) {
                    callback.apply(oc._callbackThis[type] || null, oc._callbackArgs[type] || []);
                } else {
                    //如果没有回调，直接进入成功状态
                    oc.done(type);
                }
            }
        }
        if (OrderController.allDone(oc)) {
            oc._checkTimer && clearInterval(oc._checkTimer); //停止轮询
        }
    }

    function _getCheckHandler(oc) {
        return function () {
            _check(oc);
        };
    }

    function _canDoing(oc, type) {
        var i = 0, _type;

        while ((_type = oc.order[i++]) && _type !== type) {
            if (oc._state[_type] !== STATE_MAP.DONE) {
                return false;
            }
        }
        return oc._state[type] ? oc._state[type] === STATE_MAP.READY : true;
    }
    /**
     * [OrderController description]
     * @param {[type]} order       [description]
     * @param {[type]} opt_options [description]
     * @param {number} frequence 轮询检查时间间隔，默认1s
     * @param {number} timeout 前驱处理最长等待时间，默认20s
     */
    function OrderController(order, opt_options) {
        var options = opt_options || {},
            i = 0, type;

        this._uid = 'oc-uid' + (+new Date()).toString(36); //唯一标识id
        this._state = {}; //状态记录器
        this._callback = {};  //每一种顺序类型的回调方法
        this._callbackArgs = {}; //回调的参数，在ready的时候可以传入
        this._callbackThis = {}; //回调的this对象，在ready的时候可以传入
        this._doneTimeoutTimer = {}; //超时的计时器句柄
        this._frequence = options.frequence || CHECK_FREQUENCE;
        this._timeout = options.timeout || DONE_TIMEOUT;

        this.order = order || [];

        while ((type = this.order[i++])) {
            this._state[type] = STATE_MAP.INIT;
        }

        this._checkTimer = setInterval(_getCheckHandler(this), this._frequence);
    }

    OrderController.allDone = function (oc) {
        var i = 0, type;

        while ((type = oc.order[i++])) {
            if (oc._state[type] !== STATE_MAP.DONE) {
                return false;
            }
        }
        return true;
    };


    OrderController.prototype = {
        has : function (type) {
            return ('|' + this.order.join('|') + '|').indexOf('|' + type + '|') !== -1;
        },
        ready : function (type, callback, args, thiz) {
            if (this.has(type)) {
                this._state[type] = STATE_MAP.READY;
                this._callback[type] = callback;
                this._callbackArgs[type] = args;
                this._callbackThis[type] = thiz;
            } else {
                callback.apply(thiz || null, args || []);
            }
        },
        done : function (type) {
            if (this.has(type)) {
                this._state[type] = STATE_MAP.DONE;
                this._doneTimeoutTimer[type] && clearTimeout(this._doneTimeoutTimer[type]);
                delete this._callback[type];
                delete this._callbackArgs[type];
                delete this._callbackThis[type];
                delete this._doneTimeoutTimer[type];
            }
        }
    };

    exports.OrderController = OrderController;

})(window, window.sinaadToolkit || window);
/*!
 * sinaads
 * 新浪统一商业广告脚本
 * 负责使用pdps(新浪广告资源管理码)向广告引擎请求数据并处理广告渲染
 * @author acelan <xiaobin8[at]staff.sina.com.cn>
 * @version 1.0.0
 * @date 2013-08-08
 */
/**
  * @useage
  *     window.sinaadsPreloadData = [pdps1, pdps2, pdps3, ..., pdpsn]; 批量加载的代码
  *     (window.sinaads = window.sinaads || []).push({}); 投放一个位置
  *     (window.sinaads = window.sinaads || []).push({
  *         element : HTMLDOMElement,
  *         params : {
  *             sinaads_ad_width : xx,
  *             sinaads_ad_height : xxx,
  *             sinaads_ad_pdps : xxxx,
  *             ...
  *         }
  *     });
  *
  *
  * @info
  *    _sinaadsTargeting : 保存本页中的定向信息
  *    _SINAADS_CONF_SAX_REQUEST_TIMEOUT = 10 //设置sax请求超时时间，单位秒
  *    _SINAADS_CONF_PAGE_MEDIA_ORDER = [] //广告展现顺序配置，PDPS列表
  *    _SINAADS_CONF_PRELOAD = [] //预加载的广告pdps列表
  */
window._sinaadsIsInited = window._sinaadsIsInited || (function (window, core, undefined) {
    "use strict";

    core.debug('sinaads:Init sinaads!');

//妈蛋，smash的正则不支持前面空格然后才import，必须直接第一个字符就是import
//
//页面url转换成唯一hash值，用于标记页面唯一的广告位
var UUID = 1;
var PAGE_HASH = 'sinaads_' + core.hash(window.location.host.split('.')[0] + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));
var IMPRESS_URL = '//sax.sina.com.cn/newimpress'; //向广告引擎请求正式广告的地址
var SERVER_PREVIEW_IMPRESS_URL = '//sax.sina.com.cn/preview'; //向广告引擎请求服务端预览广告的地址
var SERVER_FY_PREVIEW_IMPRESS_URL = '//amp.ad.sina.com.cn/ea/api/ideaScreen!preview.action'; //向fuyi广告引擎请求服务端预览广告的地址
var SERVER_LY_PREVIEW_IMPRESS_URL = '//amp.ad.sina.com.cn/ly/api/ideaScreen!preview.action'; //向longyuan广告引擎请求预览广告
var PLUS_RESOURCE_URL = core.RESOURCE_URL + '/release/plus/Media.js';
//PLUS_RESOURCE_URL = ''; //测试富媒体分文件用
var SAX_TIMEOUT = parseInt(window._SINAADS_CONF_SAX_REQUEST_TIMEOUT || 30, 10) * 1000; //请求数据超时时间
var PAGE_MEDIA_ORDER = window._SINAADS_CONF_PAGE_MEDIA_ORDER || []; //渲染顺序配置
var PAGE_MEDIA_DONE_TIMEOUT = (window._SINAADS_CONF_PAGE_MEDIA_DONE_TIMEOUT || 40) * 1000; //渲染媒体执行超时时间

//fuyi 出gxicon临时配置白名单
var FUYI_WHITE_PDPS = {
    "PDPS000000046013": 1,
    "PDPS000000046012": 1,
    "PDPS000000016990": 1,
    "PDPS000000042133": 1,
    "PDPS000000042134": 1
};
var FUYI_GX_URL = "http://amp.ad.sina.com.cn/ea/privacy.html";
var FUYI_GX_ICON = core.browser.ie < 7 ? (core.RESOURCE_URL + '/release/gx_logo.gif') : (core.RESOURCE_URL + '/release/gx_logo.png');
//广告标签黑名单
var AD_LOGO_BLACK_PDPS = {};

var AD_LOGO_WHITE_PDPS = {
    PDPS000000025256: 'lb',
    // PDPS000000046011: 'lb',
    PDPS000000055164: 'lb',
    PDPS000000055163: 'lb',
    PDPS000000055165: 'lb',
    PDPS000000044086: 'lb',
    PDPS000000044089: 'lb',
    PDPS000000056065: 'lb'
    // PDPS000000055082: 'lt',
    // PDPS000000052110: 'lt',
    // PDPS000000021062: 'lb',
    // PDPS000000021063: 'lb',
    // PDPS000000055077: 'lb',
    // PDPS000000055078: 'lb'
};
var AD_ICON_URL = 'javascript:;';
//获取展现位置的方法
function GET_AD_ICON (position) {
    position = position || 'lb';
    return core.browser.ie < 7 ? (core.RESOURCE_URL + '/release/ad_logo_' + position + '.gif') : (core.RESOURCE_URL + '/release/ad_logo_' + position + '.png');
}

var controllerModule = {
    /**
     * 频次控制模块
     */
    frequenceController : new core.FrequenceController(PAGE_HASH),

    /**
     * 顺序控制模块
     */
    orderController : new core.OrderController(PAGE_MEDIA_ORDER, {
        timeout : PAGE_MEDIA_DONE_TIMEOUT
    })
};
/**
 * 数据模块
 * @return {[type]} [description]
 */
var modelModule = (function (core, controller, uid) {
    var _cache = {};
    var serverPreviewSlots = {};
    var targeting;
    var enterTime = core.now();
    var seed = {};


    /**
     * 获取页面种子，用于根据是否有频率来获取相应的轮播数
     */
    function _getSeed(key) {
        var seedkey = uid + (controller.frequenceController.has(key) ? key : '');

        if (!seed[seedkey]) {
            seed[seedkey] = parseInt(core.storage.get(seedkey), 10) || core.rand(1, 100);
            //大于1000就从0开始，防止整数过大
            core.storage.set(seedkey, seed[seedkey] > 1000 ? 1 : ++seed[seedkey], 30 * 24 * 60 * 60 * 1000); //默认一个月过期
        }
        return seed[seedkey];
    }

    // //** test 
    // window.removeSeed = function (key) {
    //     delete seed[uid + (controller.frequenceController.has(key) ? key : '')];
    // };

    // window.refreshEnterTime = function () {
    //     enterTime = core.now();
    // };
    // //test end


    /**
     * 根据是否是服务端预览的广告位来确定使用预览引擎地址还是正式引擎地址
     * @param  {String} pdps 需要判断的pdps字符串，如果是批量加载的pdps，必然是pdps,pdps,pdps格式，因此批量加载的不允许为预览位置，预览位置一定是单个请求
     * @return {String}      请求地址
     */
    function _getImpressURL(pdps) {
        if (serverPreviewSlots[pdps]) {
            var type = serverPreviewSlots[pdps].split('&')[0];
            var url;
            switch(type) {
                case 'previewtype=ea':
                    core.debug('sinaads: ' + pdps + ' is fuyi server preview slot.');
                    url = SERVER_FY_PREVIEW_IMPRESS_URL;
                    break;
                case 'previewtype=ly':
                    core.debug('sinaads: ' + pdps + ' is longyuan server preview slot.');
                    url = SERVER_LY_PREVIEW_IMPRESS_URL;
                    break;
                default:
                    core.debug('sinaads: ' + pdps + ' is common server preview slot.');
                    url = SERVER_PREVIEW_IMPRESS_URL;
                    break;
            }
            return url;
        }
        return IMPRESS_URL;
    }

    /**
     * 获取外部定义额外参数的请求串
     */
    function getExParamsQueryString() {
        var params = window.sinaadsExParams || {},
            str = [];
        for (var key in params) {
            str.push(key + '=' + encodeURIComponent(params[key]));
        }
        return str.join('&');
    }

    /**
     * 判断是否是服务端预览广告位
     * @param  {String}  pdps 广告位pdps
     * @return {Boolean}      是否
     */
    function _isServerPreviewSlot(pdps) {
        return serverPreviewSlots[pdps];
    }

    /**
     * 获取定向关键词, 全局只获取一次
     */
    function _getTargeting() {
        function clearEntryTag() {
            core.cookie.remove('sinaads_entry', {domain: '.sina.com.cn', path: '/'});
            core.storage.remove('sinaads_entry');
        }

        if (!targeting) {
            var metaNodes = document.getElementsByTagName('head')[0].getElementsByTagName('meta'),
                metas = {},
                meta,
                key,
                content,
                len = metaNodes.length,
                i = 0,
                entry;

            targeting = {};
            /* 在meta中加入固定的keywords, 记录用户平台，屏幕尺寸，浏览器类型，是否移动端*/
            metas.keywords = [];
            /* 先将所有的meta节点的name和content缓存下来, 缓存是为了提高查找效率, 不用每次都去遍历 */
            for (; i < len; i++) {
                meta = metaNodes[i];
                if (meta.name) {
                    key = meta.name.toLowerCase();
                    content = core.string.trim(meta.content);
                    if (!metas[key]) {
                        metas[key] = [];
                    }
                    content && (metas[key].push(content));
                }
            }
            /* 拆解出name = ^sinaads_ 的key, 并得到真实的key值
             * 如果name=sinaads_key的content为空，则查找name=key的content作为内容
             */
            for (var name in metas) {
                if (name.indexOf('sinaads_') === 0) {
                    key = name.replace('sinaads_', ''); //因为以sinaads_开头，因此replace的一定是开头那个，不用使用正则/^sinaads_/匹配，提高效率
                    targeting[key] = metas[name].join(',') || metas[key].join(',');
                }
            }

            if ((entry = core.cookie.get('sinaads_entry') || core.storage.get('sinaads_entry'))) {
                targeting.entry = entry;
                /**
                 * @todo
                 * 这里有个问题，如果获取到entry后保存到全局，然后立刻清除，如果iframe里面的广告需要获取entry的话则获取不到
                 * 但是如果在unload的时候清除，可能会有用户没有关闭当前文章，又打开了另外一个文章，这时候entry也没有清除
                 * 所以最终使用了延时5s删除
                 */
                var timer = setTimeout(clearEntryTag, 5000);
                core.event.on(window, 'beforeunload', function () {
                    timer && clearTimeout(timer);
                    clearEntryTag();
                });
            }

            // /* 模拟ip定向 */
            // if ((ip = core.cookie.get('sinaads_ip') || core.storage.get('sinaads_ip'))) {
            //     targeting.ip = ip;
            //     core.cookie.remove('sinaads_ip');
            //     core.storage.remove('sinaads_ip');
            // }

            core.debug('sinaads:Targeting init,', targeting);
        }
        return targeting;
    }

    function _adapter(ad) {
        var networkMap = {
                '1' : 'http://d3.sina.com.cn/litong/zhitou/union/tanx.html?pid=',
                '2' : 'http://d3.sina.com.cn/litong/zhitou/union/google.html?pid=',
                '3' : 'http://d3.sina.com.cn/litong/zhitou/union/yihaodian.html?pid=',
                '4' : 'http://d3.sina.com.cn/litong/zhitou/union/baidu.html?pid=',
                '5' : 'http://js.miaozhen.com/mzad_iframe.html?_srv=MZHKY&l='
            },
            size,
            engineType = ad.engineType;

        //旧格式数据，需要适配成新格式
        if (!ad.content && ad.value) {
            core.debug('sinaads:Old data format, need adapter(pdps)', ad.id);
            size = ad.size.split('*');
            ad.content = [];
            core.array.each(ad.value, function (value) {
                if (engineType === 'network') {
                    value.content = {
                        src : [networkMap['' + value.manageType] + value.content + '&w=' + size[0] + '&h=' + size[1]],
                        type : ['url']
                    };
                }
                if (engineType === 'dsp' && parseInt(value.manageType, 10) !== 17) {
                    value.content = {
                        src : [value.content],
                        type : ['html']
                    };
                }
                ad.content.push(value.content);
            });
            delete ad.value;
        }

        //对新格式数据进行过滤，过滤掉content.src没有内容的广告
        ad.content = (function (contents) {
            var r = [];
            core.array.each(contents, function (content, i) {
                //如果src没有内容，则为空广告位
                var nullSrc = true;
                //如果src有内容，判断内容中是否有某个元素非空字符串，有非空即为非空字符串
                core.array.each(content.src, function (src) {
                    if (core.string.trim(src)) {
                        nullSrc = false;
                        return false;
                    }
                });
                //如果广告素材不为空，那么这是一个正常可用数据，进入过滤后的列表
                if (!nullSrc) {
                    r.push(content);
                } else {
                    core.debug('sinaads: The' + i + ' Ad Content src is null, via ' + ad.id);
                }
            });
            return r;
        })(ad.content);

        //对类型进行匹配
        core.array.each(ad.content, function (content, i) {
            var type, link;

            type = core.array.ensureArray(content.type);
            link = core.array.ensureArray(content.link);

            core.array.each(content.src, function (src, i) {
                type[i] = core.ad.getTypeBySrc(src, type[i]);
            });
            ad.content[i] = content;
        });
        // 通栏  950*90 tl
        // 画中画 300*250 hzh
        // 矩形 250*230 jx
        // 短通栏 640*90 dtl
        // 大按钮 300*120 dan
        // 小按钮 240*120 xan
        // 跨栏 1000*90 kl
        // 背投  750*450 bt
        // 文字链 wzl
        ad.type = ({
            'lmt'   : 'stream',
            'kl'    : 'couplet',
            'sc'    : 'videoWindow',
            'hzh'   : 'embed',
            'jx'    : 'embed',
            'dtl'   : 'embed',
            'an'    : 'embed',
            'dan'   : 'embed',
            'xan'   : 'embed',
            'wzl'   : 'textlink',
            'ztwzl' : 'zhitoutextlink',
            'qp'    : 'fullscreen',
            'fp'    : 'turning',
            'dl'    : 'float',
            'tip'   : 'tip',
            'bt'    : 'bp',
            'sx'    : 'follow',
            'kzdl'  : 'coupletExt',
            'fc1'   : 'pop',
            'kzan'  : 'skyscraper',
            'span'  : 'leftsuspend',
            'tuigraph' : 'embed',
            'dflmt'    : 'bottomstream',
            'bj'    : 'bg',
            'motu'  : 'magicmap'
        }[ad.type]) || ad.type || 'embed';


        if (ad.type === 'tl') { // 通栏广告依据素材数目分为 橱窗或者embed来渲染
            ad.type = (ad.content.length > 1  && ad.content[0].ad_type === 'win')? 'shopWindow' : 'embed';
        }

        //橱窗广告判断
        if (('embed' === ad.type) && ad.template && ad.logo) {
            ad.type = 'shop';
        }

        return ad;
    }

    function _request(pdps) {
        var start = core.now(),
            deferred = new core.Deferred(),
            params = [],
            isLoaded = false,
            _pdps = [];

        //防止错误的非标喜报遗留页面未清除导致出错
        if ('te_xing_xi_bao' === pdps) {
            deferred.reject();
            return deferred;
        }

        //判断pdps相关数据是否存在，如果存在，直接返回，否则，请求后渲染
        core.array.each(pdps, function (str) {
            isLoaded = !!_cache[str];
            if (isLoaded) {
                core.debug('sinaads:current pdps data is loaded, render immedietly. ', str, _cache[str]);
            } else {
                _pdps.push(str);
            }
        });

        if (isLoaded) {
            deferred.resolve();
        } else {
            var targeting = _getTargeting();

            core.debug('sinaads:current pdps data is unload, load immedietly. ' + _pdps.join(), _cache);
            
            params = [
                'adunitid=' + _pdps.join(','),                                 //pdps数组
                'rotate_count=' + _getSeed(_pdps.length > 1 ? '' : _pdps[0]),   //轮播数，批量加载使用普通rotator
                'TIMESTAMP=' + enterTime.toString(36),           //时间戳
                'referral=' + encodeURIComponent(core.url.top)                  //当前页面url
            ];

            //如果是预览位置，增加预览相关参数
            var _serverPreviewParams = _isServerPreviewSlot(_pdps.join(','));
            if (_serverPreviewParams) {
                params.push(_serverPreviewParams);
            }

            //如果有额外的传递参数，请求时传入
            var _exParams = getExParamsQueryString();
            if (_exParams) {
                params.push(_exParams);
            }

            for (var key in targeting) {
                params.push('tg' + key + '=' + encodeURIComponent(targeting[key]));
            }

            core.sio.jsonp(_getImpressURL(_pdps.join(',')) + '?' + params.join('&'), function (data) {
                if (data === 'nodata') {
                    core.debug('sinaads:' + _pdps.join() + '. No register in SAX. ');
                    deferred.reject();
                } else {
                    core.debug('sinaads:request data ready. ', params, core.now(), core.now() - start, data);
                    //缓存数据到list中
                    //这里每次循环都reject可能会有问题
                    var notAllContentNull = false; //是否此次请求所有的广告都没有内容
                    core.array.each(data.ad, function (ad) {
                        ad = _adapter ? _adapter(ad) : ad;
                        if (ad.content instanceof Array && ad.content.length > 0) {
                            _cache[ad.id] = ad;
                            notAllContentNull = true;
                        } else {
                            core.debug('sinaads:' + ad.id + '. cannot found data. ');
                        }
                    });
                    /**
                     * cookie mapping
                     * 每次请求如果有mapping需要对应就发送请求
                     * @type {Number}
                     */
                    core.array.each(data.mapUrl, function (url) {
                        core.debug('sinaads:data ready, send cookie mapping. ' + url, params, core.now());
                        url && core.sio.log(url, 1);
                    });
                    if (notAllContentNull) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                }
            }, {
                timeout : SAX_TIMEOUT,
                onfailure : function () {
                    core.error('sinaads:request timeout, via ' + _pdps.join());
                    deferred.reject();
                }
            });
        }

        return deferred;
    }

    /**
     * 初始化页面广告原始数据
     */
    function _init(oninit) {
        //1、将页面上默认存在的数据填充到数据缓存中
        _cache = window._sinaadsCacheData = window._sinaadsCacheData || {};


        /**
         * 当广告位在iframe中是docuemnt.referrer获取不到hash的值，因此这里使用获取hash跟query的方法来进行保证
         */
        var _hash = (core.url.top.split('#')[1] || '').split('?')[0] || '',
            _query = (core.url.top.split('?')[1] || '').split('#')[0] || '',
            par = (_hash + '&' + _query)
                .replace(/</g, '')
                .replace(/>/g, '')
                .replace(/"/g, '')
                .replace(/'/g, '');

        /**
         * 2、将本地预览的数据填充到_cache中，url.hash，本地预览只支持一个广告位
         */
        (function () {
            var query = par.split('&'),
                preview = {},
                keys = ['pdps', 'src', 'size'], //必需有的key
                key,
                q;

            for (var i = 0, len = query.length; i < len; i++) {
                if ((q = query[i])) {
                    q = q.split('=');
                    if (q[0].indexOf('sinaads_preview_') === 0) {
                        key = q[0].replace('sinaads_preview_', '');
                        if (key && q[1] && !preview[key]) {
                            preview[key] = q[1];
                            core.array.remove(keys, key);
                        }
                    }
                }
            }
            //只有满足三个参数齐全才进行预览数据填充
            if (keys.length === 0) {
                core.debug('sinaads:Ad Unit ' + preview.pdps +  ' is for preview only. ', preview);
                //构造一个符合展现格式的数据放入到初始化数据缓存中
                _cache[preview.pdps] = {
                    content : [
                        {
                            src : decodeURIComponent(preview.src).split('|'),
                            link : (decodeURIComponent(preview.link) || '').split('|'),
                            monitor : (preview.monitor || '').split('|'),
                            pv : (preview.pv || '').split('|'),
                            type : (preview.type || '').split('|')
                        }
                    ],
                    size : preview.size,
                    id : preview.pdps,
                    type : preview.adtype || 'embed',
                    highlight : preview.highlight || false
                };
            }
        })();

        /**
         * 3、获取服务端预览的广告位pdps列表
         * #sinaads_server_preview=PDPS000000000001&sinaads_server_preview=PDPS000000000002
         */
        serverPreviewSlots = (function () {
            var query = par.split('&'),
                slots = {},
                key = 'sinaads_server_preview', //必需有的key
                q,
                i = 0,
                len = 0,
                date = core.date.format(new Date(), 'yyyyMMddHH'),
                ip = '',
                deliveryId = '',
                pdps = '';

            for (i = 0, len = query.length; i < len; i++) {
                if ((q = query[i])) {
                    q = q.split('=');

                    if (q[0] === key && q[1]) {
                        q = decodeURIComponent(q[1]).split('|');

                        pdps = q[0] || pdps;
                        date = q[1] || date;
                        ip = q[2] || ip;
                        deliveryId = q[3] || deliveryId;

                        if (pdps) {
                            var previewType = pdps.split('_')[0];
                            switch (previewType) {
                                //如果pdps以ea_开头，那么就是ea的预览
                                case "ly" :
                                case "ea" :
                                    pdps = pdps.split('_')[1];
                                    slots[pdps] = [];
                                    slots[pdps].push('previewtype=' + previewType);
                                    slots[pdps].push('pdps=' + encodeURIComponent(pdps));
                                    date && slots[pdps].push('date=' + encodeURIComponent(date));
                                    ip && slots[pdps].push('tgip=' + encodeURIComponent(ip));
                                    deliveryId && slots[pdps].push('ideaId=' + encodeURIComponent(deliveryId));
                                    slots[pdps] = slots[pdps].join('&');
                                    break;
                                default:
                                    slots[pdps] = [];
                                    slots[pdps].push("previewtype=default");
                                    date && slots[pdps].push('date=' + encodeURIComponent(date));
                                    ip && slots[pdps].push('tgip=' + encodeURIComponent(ip));
                                    deliveryId && slots[pdps].push('deid=' + encodeURIComponent(deliveryId));
                                    slots[pdps] = slots[pdps].join('&');
                                    break;
                            }
                        }
                    }
                }
            }
            return slots;
        })();


        /**
         * 4、预加载的服务端数据
         */
        var preloadData = [],
            originPreloadData = window._SINAADS_CONF_PRELOAD || [],
            i = 0,
            pdps;

        //@todo 从预加载列表里面去除需要服务端预览的数据
        while ((pdps = originPreloadData[i++])) {
            if (!serverPreviewSlots[pdps]) {
                preloadData.push(pdps);
            }
        }

        if (preloadData.length > 0) {
            core.debug('sinaads:Data preload of bulk requests. ' + preloadData.join(','));
            //预加载不允许加载频率不为0的请求，比如视窗，这个需要人工控制
            _request(preloadData, _getSeed()).done(oninit).fail(oninit);
        } else {
            oninit();
        }
    }

    return {
        init : _init,
        request : _request,
        getSeed : _getSeed,
        add : function (pdps, data) {
            _cache[pdps] = data;
        },
        get : function (pdps) {
            return (pdps ? _cache[pdps] : _cache);
        },
        getExParamsQueryString : getExParamsQueryString
    };
})(core, controllerModule, PAGE_HASH);
/**
 * 渲染模块
 */
var viewModule = (function () {
    var handlerMap = window.sinaadsRenderHandler || {};


    /**
     * 注册渲染方法
     * @param  {[type]} type    [description]
     * @param  {[type]} handler [description]
     * @return {[type]}         [description]
     */
    function _register(type, handler) {
        !handlerMap[type] && (handlerMap[type] = handler);
    }

    function _render(type, element, width, height, content, config) {
        var handler = handlerMap[type],
            /**
             * _next {
             *     type:type, //有后续步骤，即需要进行格式化类型跟内容的后续操作
             *     content: content
             * }
             * 比如，一开始是couplet类型，当格式化后，让它按照embed方式来处理
             */
            _next;

        if ('function' === typeof handler) {
            _next = handler(element, width, height, content, config);
        }
        //上面的处理将媒体类型改变，按照新类型再执行一边render方法
        if (_next && (_next.type !== type)) {
            _render(_next.type, element, width, height, _next.content, config);
        }
    }
    
    return {
        render : _render, //渲染方法
        register : _register,  //注册方法
        handlerMap : handlerMap
    };
})();

(function (core, view) {
    view.register('bp', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering bp.');
        /**
         * ie(null), firefox(null), safari(undefined)窗口拦截情况下window句柄
         * opera, chrome拦截情况下有window句柄
         * 当参数长度小于2083时，ie, chrome, firefox可以直接使用javascript:'html'方式打开窗口
         * 当参数长度大于2083时，使用拿到窗口句柄然后document.write方式写入
         * ie下拿到窗口句柄的情况下，设置了document.domain的主页面打开的空白页面会报没有权限错误
         * 其他浏览器不会
         * 最终放弃，使用原始方法进行背投处理
         *
         * 如果参数长度大于2000，从后面依此放弃monitor或者link内容，直到合适，无奈之举
         */

        content = content[0];
        //是背投广告，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        var par = [
            content.type[0],
            content.src[0] ? encodeURIComponent(content.src[0]) : '',
            content.link[0] ? encodeURIComponent(content.link[0]) : '',
            width,
            height
        ];

        var monitor = core.monitor.stringify(content.origin_monitor);
        //暂时禁用origin_monitor, bp url过长
        monitor = '';
        if (par.join('${}').length + monitor.length < 2000) {
            par.push(monitor);
        }

        var pv = core.monitor.stringify(content.pv);
        //暂时禁用pv, bp url过长
        pv = '';
        if (par.join('${}').length + pv.length < 2000) {
            par.push(pv);
        }

        // core.underPop(
        //     'http://d1.sina.com.cn/litong/zhitou/sinaads/release/pbv5.html?' + par.join('${}'),
        //     'sinaads_bp_' + config.sinaads_ad_pdps,
        //     width,
        //     height
        // );
        window.open(
            'http://d1.sina.com.cn/litong/zhitou/sinaads/release/pbv5.html?' + par.join('${}'),
            'sinaads_bp_' + config.sinaads_ad_pdps,
            'width=' + width + ',height=' + height
        );

        try {
            core.debug('Media: In building bp complete!');
            window.sinaadsROC.bp = config.sinaads_ad_pdps;
            window.sinaadsROC.done(window.sinaadsROC.bp);
        } catch (e) {}
    });
})(core, viewModule);
(function (core, view) {
    view.register('couplet', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering couplet.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/CoupletMedia.js';

        window.sinaadsROC.couplet = config.sinaads_ad_pdps;

        content = content[0]; //只用第一个内容

        window.sinaadsCoupletClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsCoupletViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        
        //是跨栏，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        //这里认为如果couplet类型给的是素材的话，那么素材必须大于1个，否则为html类型
        if (content.src.length === 1 && (content.type[0] === 'js' || content.type[0] === 'html')) {
            switch (content.type[0]) {
                case 'js' :
                    core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                    break;
                case 'html' :
                    core.dom.fill(element, content.src[0]);
                    break;
                default :
                    break;
            }
        } else {
            //注入跨栏数据
            var CoupletMediaData = {
                pdps        : config.sinaads_ad_pdps,
                src         : content.src,
                type        : content.type,
                link        : content.link,
                mainWidth   : config.sinaads_ad_main_width,
                mainHeight  : config.sinaads_ad_main_height,
                top         : config.sinaads_couple_top || 0,
                monitor     : content.origin_monitor || [],
                pv          : content.pv || [],
                sideWidth   : config.sinaads_ad_side_width,
                sideHeight  : config.sinaads_ad_side_height
            };
            if (core.CoupletMediaData) {
                new core.CoupletMedia(CoupletMediaData);
            } else {
                core.sio.loadScript(RESOURCE_URL, function () {
                    new core.CoupletMedia(CoupletMediaData);
                });
            }
        }
    });



    view.register('coupletExt', function (element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/CoupletExtMedia.js';
        
         window.sinaadsCoupletExtClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsCoupletExtViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        content = content[0]; //只用第一个内容
        //是对联，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        //注入跨栏数据
        var CoupletExtMediaData = {
            src         : content.src,
            type        : content.type,
            link        : content.link,
            width       : width,
            height      : height,
            offsettop    : config.sinaads_coupletext_offsettop || 100,
            expandpos   : config.sinaads_coupletext_expandpos || 700,
            smallsize   : config.sinaads_coupletext_smallsize,
            bigsize     : config.sinaads_coupletext_bigsize,
            monitor     : content.origin_monitor || [],
            pv          : content.pv || []
        };
        if (core.CoupletExtMediaData) {
            new core.CoupletExtMedia(CoupletExtMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.CoupletExtMedia(CoupletExtMediaData);
            });
        }
    });
})(core, viewModule);
(function (core, view) {
    /**
     * 创建常规广告的曝光请求html
     * @param  {[type]} element [description]
     * @param  {[type]} config  [description]
     * @return {[type]}         [description]
     */
    view.register('embed', function (element, width, height, content, config) {
        //暂时让embed只支持一个广告
        content = core.array.ensureArray(content);
        content = content[0];

        var uid         = config.sinaads_uid,
            type        = content.type || '',
            link        = content.link || '',
            src         = content.src || '',
            pdps        = config.sinaads_ad_pdps,
            tpl         = config.sinaads_ad_tpl || '',
            adContent;

        //如果是ios设备且类型为flash 退出，不渲染广告，但这里有曝光已经发送
        // if (core.browser.iphone && core.browser.ipad && 'flash' === type) {
        //     //保证嵌入式广告的顺序也可以被控制
        //     try {
        //         window.sinaadsROC.done(pdps);
        //     } catch (e) {}
        //     return;
        // }
        /**
         * 自适应宽度, 针对图片和flash
         */
        if (config.sinaads_ad_fullview && (type === 'flash' || type === 'image')) {
            width = '100%';
            height = 'auto';
        } else {
            width += 'px';
            height += 'px';
        }

        element.style.cssText += ';display:block;overflow:hidden;text-decoration:none;';
        element.innerHTML = '<ins style="text-decoration:none;margin:0px auto;display:block;overflow:hidden;width:' + width + ';height:' + height + ';position:relative;"></ins>';
        element = element.getElementsByTagName('ins')[0];

        adContent = src ? core.ad.createHTML(type, src, width, height, link, content.origin_monitor, content.pv, core.isFunction(tpl) ? tpl(0, content) : tpl) : ''; //广告内容， 如果没有src，则不渲染 
        /**添加fuyi 标签icon*/
        //从adid中解析出广告相关信息
        function adInfoFromAdId(adid) {
            var info = {};
            adid = (adid || '').split('_');
            //type
            switch (adid[0].toLowerCase()) {
                case "sina" :
                    info.type = "sina";
                    info.id = adid[1] || '';
                    break;
                case "dsp" :
                    if (17 === parseInt(adid[1], 10)) {
                        info.type = "ea";
                    } else {
                        info.type = adid[1] || '';
                    }
                    info.id = adid[2] || '';
                    break;
                case "bottom":
                    info.type = "bottom";
                    info.id = adid[1] || '';
                    break;
                default:
                    info.type = "unknow";
                    info.id = adid[1] || '';
                    break;
            }
            return info;
        }

        //类型为ea,且在icon白名单中
        if ('ea' === adInfoFromAdId(content.ad_id).type && FUYI_WHITE_PDPS[pdps]) {
            element.style.position = "relative";
            adContent += '<a target="_blank" href="' + FUYI_GX_URL + '" style="position:absolute;left:0;top:0;z-index:20;">' +
                            '<img src="' + FUYI_GX_ICON + '" width="18" height="18" border="0">' +
                        '</a>';
        }
        /** end */
        //增加广告标签，9.1新广告法要求
        //过滤不要加的广告
        function isDenied(pdps, src) {
            //黑名单里面的不加
            if (AD_LOGO_BLACK_PDPS[pdps]) {
                return true;
            }
            //是京东包版
            if (src[0].indexOf('x.jd.com') !== -1) {
                return true;
            }
            if (!AD_LOGO_WHITE_PDPS[pdps]) {
                return true;
            }
            return false;
        }
        if (!isDenied(pdps, src)) {
            var logo_position = AD_LOGO_WHITE_PDPS[pdps];
            var logo_position_css_map = {
                'lb': 'left:0;bottom:0',
                'lt': 'left:0;top:0',
                'rt': 'right:0;top:0',
                'rb': 'right:0;bottom:0'
            };
            adContent += '<a target="_blank" href="' + AD_ICON_URL + '" style="position:absolute;' + logo_position_css_map[logo_position] + ';z-index:20;">' +
                        '<img src="' + GET_AD_ICON(logo_position) + '" width="30" height="16" border="0">' +
                    '</a>';
        }

        if (tpl) {
            element.innerHTML  = adContent; //广告内容， 如果没有src，则不渲染
        } else {
            switch (type[0]) {
                case 'text' :
                case 'image' :
                case 'url' :
                case 'adbox' :
                case 'flash' :
                    element.innerHTML = adContent;
                    break;
                default :
                    //创建广告渲染的沙箱环境，并传递部分广告参数到沙箱中
                    core.sandbox.create(element, width, height, adContent, {
                        sinaads_uid             : uid,
                        sinaads_ad_pdps         : pdps,
                        sinaads_ad_width        : width,
                        sinaads_ad_height       : height
                    });
                    break;
            }
        }
        //保证嵌入式广告的顺序也可以被控制
        try {
            window.sinaadsROC.done(pdps);
        } catch (e) {}
    });
})(core, viewModule);
(function (core, view) {
    view.register('float', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering float.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/FloatMedia.js';

        window.sinaadsROC['float'] = config.sinaads_ad_pdps;

        content = content[0];

        window.sinaadsFloatClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsFloatViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        element.style.cssText = 'position:absolute;top:-99999px';
        if (content.src.length === 1 && 'js' === content.type[0]) {
            core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
            window.sinaadsROC.done(window.sinaadsROC['float']);
        } else {
            var FloatMediaData = {
                type : content.type,
                src : content.src,
                top : config.sinaads_float_top || 0,
                monitor : content.origin_monitor || [],
                pv  : content.pv || [],
                link : content.link,
                sideWidth : width,
                sideHeight : height,
                pdps : config.sinaads_ad_pdps,
                contentWidth : config.sinaads_ad_contentWidth, //当小于这个值时候对联两边隐藏
                follow : config.sinaads_ad_follow || 0,
                showPos : config.sinaads_float_show_pos
            };
            if (core.FloatMedia) {
                new core.FloatMedia(FloatMediaData);
            } else {
                core.sio.loadScript(RESOURCE_URL, function () {
                    new core.FloatMedia(FloatMediaData);
                });
            }
        }
    });
})(core, viewModule);
(function (core, view) {
    view.register('follow', function (element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/FollowMedia.js';


        content = content[0];

        window.sinaadsFollowClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsFollowViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        var FollowMediaData = {
                main : {
                    width : width,
                    height : height,
                    src : content.src[0] || '',
                    type : content.type[0] || '',
                    link : content.link[0] || '',
                    top : config.sinaads_follow_top || 0
                },
                mini : {
                    src : content.src[1] || '',
                    type : content.type[1] || '',
                    link : content.link[1] || content.link[0] || '',
                    top : config.sinaads_follow_mini_top || 'bottom'
                },
                monitor : content.origin_monitor || [],
                pv : content.pv || [],
                duration : config.sinaads_ad_duration || 5
            };
        if (core.FollowMedia) {
            new core.FollowMedia(FollowMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.FollowMedia(FollowMediaData);
            });
        }
    });
})(core, viewModule);
(function (core, view) {
    view.register('fullscreen', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering fullscreen');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/FullscreenMedia.js';

        window.sinaadsROC.fullscreen = config.sinaads_ad_pdps;
        
        content = content[0];

        window.sinaadsFullscreenClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsFullscreenViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        element.style.cssText = 'position:absolute;top:-9999px';

        window.sinaadsFullscreenMonitor = content.origin_monitor || [];

        switch (content.type[0]) {
            case 'js' :
                //富媒体供应商提供的js
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            case 'html' :
                core.dom.fill(element, content.src[0]);
                break;
            default :
                //是全屏广告，隐藏掉改区块
                var FullScreenMediaData = {
                    pdps        : config.sinaads_ad_pdps,
                    type        : content.type[0] || '',
                    src         : content.src[0] || '',
                    link        : content.link[0] || '',
                    monitor     : content.origin_monitor || [],
                    pv          : content.pv || [],
                    width       : width,
                    height      : height,
                    hasClose    : config.sinaads_fullscreen_close || ('flash' === content.type[0] ? 1 : 0)
                };
                if (core.FullscreenMedia) {
                    new core.FullscreenMedia(FullScreenMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.FullscreenMedia(FullScreenMediaData);
                    });
                }
                break;
        }
    });
})(core, viewModule);
(function (core, view) {
    view.register('stream', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering stream.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/StreamMedia.js';

        window.sinaadsROC.stream = config.sinaads_ad_pdps;
        
        content = content[0];
        //流媒体，隐藏掉该区块
        element.style.cssText = 'position:absolute;top:-9999px';

        //暴露个变量供第三方使用监测链接
        //WTF，如果多个video就shi了
        //先hack一下，当喜报和流媒体用同一个的type的时候会覆盖，这里判断下如果已经赋值就不在复制
        //
        window.sinaadsStreamMonitor = (window.sinaadsStreamMonitor && window.sinaadsStreamMonitor.join('')) ? window.sinaadsStreamMonitor : (content.origin_monitor || []);
        window.sinaadsStreamClickTAG = window.sinaadsStreamClickTAG || core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsStreamViewTAG = window.sinaadsStreamViewTAG || core.monitor.stringify(core.array.ensureArray(content.pv));


        if (content.src.length === 1) {
            //生成一个用于渲染容器到页面中
            var streamContainer = document.createElement('div');
            streamContainer.id = 'SteamMediaWrap';
            document.body.insertBefore(streamContainer, document.body.firstChild);

            switch (content.type[0]) {
                case 'js' :
                    //富媒体供应商提供的js
                    core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                    break;
                case 'html' :
                    core.dom.fill(element, content.src[0]);
                    break;
                default :
                    break;
            }
        } else {
            //这里认为如果给的是素材的话，那么素材必须大于1个，否则为js类型
            //注入流媒体数据
            var StreamMediaData = {
                main : {
                    type    : content.type[0] || 'flash',
                    src     : content.src[0] || '',
                    link    : content.link[0] || '',
                    width   : width,
                    height  : height,
                    top     : config.sinaads_top || 0
                },
                mini : {
                    src     : content.src[1] || '',
                    type    : content.type[1] || 'flash',
                    link    : content.link[1] || content.link[0] || ''
                },
                pdps: config.sinaads_ad_pdps,
                monitor : content.origin_monitor || [],
                pv : content.pv || []
            };
            if (core.StreamMedia) {
                new core.StreamMedia(StreamMediaData);
            } else {
                core.sio.loadScript(RESOURCE_URL, function () {
                    new core.StreamMedia(StreamMediaData);
                });
            }
        }
    });
})(core, viewModule);
(function (core, view) {
    function _textLink(element, width, height, content, config) {
        var tpl = config.sinaads_ad_tpl || '',
            html = [];
        core.array.each(content, function (content, i) {
            html.push(core.ad.createHTML(content.type, content.src, 0, 0, content.link, content.origin_monitor, content.pv, core.isFunction(tpl) ? tpl(i, content) : tpl));
        });
        element.style.cssText += ';text-decoration:none';
        element.innerHTML = html.join('');
    }

    view.register('textlink', _textLink);
    view.register('zhitoutextlink', _textLink);
})(core, viewModule);
(function (core, view) {
    view.register('tip', function (element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/TipsMedia.js';

        
        content = content[0];

        window.sinaadsTipClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsTipViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        var TipsMediaData = {
                width : width,
                height : height,
                src : content.src,
                type : content.type,
                link : content.link,
                monitor : content.origin_monitor || [],
                pv : content.pv || [],
                autoShow : 1,
                top : config.sinaads_tip_top || 0,
                left : config.sinaads_tip_left || 0,
                zIndex : config.sinaads_ad_zindex || 0
            };
        if (core.TipsMedia) {
            new core.TipsMedia(element, TipsMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.TipsMedia(element, TipsMediaData);
            });
        }
    });
})(core, viewModule);
(function (core, view) {
    view.register('turning', function (element, width, height, content, config) {
        var src = [],
            link = [],
            monitor = [],
            len = content.length;

        core.array.each(content, function (content) {
            content.src && content.src[0] && (src.push(content.src[0]));
            content.link && content.link[0] && (link.push(content.link[0]));
        });
        content = [
            {
                src : [
                    core.swf.createHTML({
                        id : 'TurningMedia' + config.sinaads_uid,
                        url : 'http://d3.sina.com.cn/litong/zhitou/sinaads/release/picshow_new.swf',
                        width : width,
                        height : height,
                        wmode : 'transparent',
                        vars : {
                            ad_num : len,
                            pics : src.join('§'),
                            urls : link.join('§'),
                            monitor : monitor.join('§'),
                            pic_width : width - 5,
                            pic_height : height - 5,
                            flip_time : config.sinaads_turning_flip_duration * 1000 || 300,
                            pause_time : config.sinaads_turning_flip_delay * 1000 || 4000,
                            wait_time : config.sinaads_turning_wait * 1000 || 1000
                        }
                    })
                ],
                type : ['html'],
                link : []
            }
        ];
        return {
            type : 'embed',
            content : content
        }; //使用embed来解析
    });
})(core, viewModule);
(function (core, view) {
    view.register('videoWindow', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering videoWindow.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/VideoWindowMedia.js';
        window.sinaadsROC.videoWindow = config.sinaads_ad_pdps;

        content = content[0];
        element.style.cssText = 'position:absolute;top:-9999px';


        //暴露个变量供第三方使用监测链接
        //WTF，如果多个video就shi了
        window.sinaadsVideoWindowMonitor = content.origin_monitor || [];
        window.sinaadsVideoWindowClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsVideoWindowViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        switch (content.type[0]) {
            case 'js' :
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            case 'html' :
                core.dom.fill(element, content.src[0]);
                break;
            default :
                var VideoWindowMediaData = {
                    pdps    : config.sinaads_ad_pdps,
                    src     : content.src[0],
                    type    : content.type[0],
                    width   : width,
                    height  : height,
                    link    : content.link[0],
                    monitor : content.origin_monitor || [],
                    pv      : content.pv || [],
                    zIndex  : config.sinaads_ad_zindex
                };
                if (core.VideoWindowMedia) {
                    new core.VideoWindowMedia(VideoWindowMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.VideoWindowMedia(VideoWindowMediaData);
                    });
                }
                break;
        }
    });
})(core, viewModule);
(function (core, view) {
    view.register('bg', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering bp.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/BgMedia.js';
        content = content[0];

        window.sinaadsROC.bg = config.sinaads_ad_pdps;
        window.sinaadsBgClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsBgViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        var bgMediaData = {
            pdps : config.sinaads_ad_pdps,
            src : content.src,
            type : content.type,
            link : content.link,
            width : width || 1600,
            height : height || config.sinaads_bg_height,
            midWidth : config.sinaads_bg_midWidth || 1000,
            headHeight : config.sinaads_bg_headHeight || 30,
            top : 'undefined' !== typeof config.sinaads_bg_top ? config.sinaads_bg_top : 46,
            asideClickable: config.sinaads_bg_asideClick,
            monitor : content.origin_monitor || [],
            pv : content.pv || []
        };
        if (core.BgMedia) {
            new core.BgMedia(bgMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.BgMedia(bgMediaData);
            });
        }
    });

})(core, viewModule);
(function (core, view) {
    view.register('pop', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering pop.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/PopMedia.js';

        window.sinaadsROC.pop = config.sinaads_ad_pdps;
        content = content[0];


        window.sinaadsPopClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsPopViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        switch (content.type[0]) {
            case 'js' :
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            default :
                var popMediaData = {
                    pdps : config.sinaads_ad_pdps,
                    src : content.src,
                    type : content.type,
                    link : content.link,
                    width : width || 300,
                    height : height || 250,
                    position : config.sinaads_pop_position || 'center center',
                    monitor : content.origin_monitor || [],
                    pv : content.pv || []
                };

                if (core.PopMedia) {
                    new core.PopMedia(element, popMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.PopMedia(element, popMediaData);
                    });
                }
                break;
        }
    });
})(core, viewModule);
(function(core, view) {
    view.register('skyscraper', function(element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/SkyscraperMedia.js';


        content = content[0];

        window.sinaadsSkyscraperClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsSkyscraperViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        var skyscraperMediaData = {
            main: {
                width: width,
                height: height,
                src: content.src[0] || '',
                type: content.type[0] || '',
                link: content.link[0] || ''

            },
            mini: {
                src: content.src[1] || '',
                type: content.type[1] || '',
                link: content.link[1] || content.link[0] || '',
                width: config.sinaads_mini_width || width //此处的mini width，如果页面没有传入配置的参数，就使用和大素材一致的宽度
            },
            monitor: content.origin_monitor,
            pv : content.pv,
            duration: config.sinaads_ad_duration || 5,
            midWidth: config.sinaads_ss_mdWidth || 950,
            top: config.sinaads_ss_top || 0,
            left: config.sinaads_ss_left || 0,
            pdps:config.sinaads_ad_pdps
        };
        if (core.SkyScraperMedia) {
            new core.SkyScraperMedia(skyscraperMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function() {
                new core.SkyScraperMedia(skyscraperMediaData);
            });
        }
    });
})(core, viewModule);
(function(core, view) {
    view.register('leftsuspend', function(element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/LeftSuspendMedia.js';

        content = content[0];

        window.sinaadsLeftsuspendClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsLeftsuspendViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));


        var leftSuspendrMediaData = {
            width: width,
            height: height,
            src: content.src[0] || '',
            type: content.type[0] || '',
            link: content.link[0] || '',
            monitor: content.origin_monitor,
            pv : content.pv,
            cookieKey: config.sinaads_ls_cookieKey,
            root: config.sinaads_ls_root,
            pdps: config.sinaads_ad_pdps
        };
        if (window.sinaadToolkit.LeftSuspendMedia) {
            new window.sinaadToolkit.LeftSuspendMedia(leftSuspendrMediaData);
        } else {
            window.sinaadToolkit.sio.loadScript(RESOURCE_URL, function() {
                new window.sinaadToolkit.LeftSuspendMedia(leftSuspendrMediaData);
            });
        }
    });
})(core, viewModule);
(function (core, view) {
    view.register('shopWindow', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering shopWindow.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/ShopWindowMedia.js';
        var mediaData = {
            pdps : config.sinaads_ad_pdps,
            width : width,
            height : height,
            content: content
        };
        if (core.ShopWindowMedia) {
            new core.ShopWindowMedia(element, mediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.ShopWindowMedia(element, mediaData);
            });
        }
    });
})(core, viewModule);
/**
 * 橱窗广告
 * @param  {[type]} core [description]
 * @param  {[type]} view [description]
 * @return {[type]}      [description]
 * @author  acelan(xiaobin8@staff.sina.com.cn)
 */
(function (core, view) {
    var SHOP_AD_PAGE_URL = core.RESOURCE_URL + '/release/spec/fyrad.html';

    view.register('shop', function (element, width, height, content, config) {
        content = core.array.ensureArray(content);
        element.style.cssText += ';display:block;overflow:hidden;text-decoration:none;';
        element.innerHTML = '<ins style="text-decoration:none;margin:0px auto;display:block;overflow:hidden;width:' + width + ';height:' + height + ';"></ins>';
        element = element.getElementsByTagName('ins')[0];

        //格式化商品信息
        var goods = [],
            good,
            i = 0;
        while ((good = content[i++])) {
            goods.push({
                exposal_url:    good.link[0],   //商品落地页
                image_url:      good.src[0],    //商品图片
                ad_title:       good.src[1],    //商品标题
                oldPrice:       good.src[2],    //商品原价
                price:          good.src[3]     //商品现价
            });
        }

        //或许模板id和logo
        var extForView = config.extForView || {};
        var tid = extForView.template;
        var logo = core.url.ensureURL(extForView.logo);

        //创建iframe展现广告
        var iframeConfig = {};
        core.iframe.init(iframeConfig, width, height, false);
        iframeConfig.src = SHOP_AD_PAGE_URL;

        //通过window.name传递信息
        iframeConfig.name = [
            'tid=' + encodeURIComponent(tid),
            'logo=' + encodeURIComponent(logo),
            'goods=' + encodeURIComponent(core.json.stringify(goods))
        ].join('&');

        element.innerHTML = core.iframe.createHTML(iframeConfig);

        //保证橱窗广告的顺序也可以被控制
        try {
            window.sinaadsROC.done(config.pdps);
        } catch (e) {}
    });
})(core, viewModule);
(function (core, view) {
        view.register('bottomstream', function (element, width, height, content, config) {
            core.debug('sinaads:Rendering bottomstream.');
            var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/BottomStreamMedia.js';

            window.sinaadsROC.bottomstream = config.sinaads_ad_pdps;
            
            content = content[0];
            //流媒体，隐藏掉该区块
            element.style.cssText = 'position:absolute;top:-9999px';

            //暴露个变量供第三方使用监测链接
            //WTF，如果多个video就shi了
            window.sinaadsBottomStreamMonitor = content.origin_monitor || [];
            window.sinaadsBottomStreamClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
            window.sinaadsBottomStreamViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

            if (content.src.length === 1) {
                //生成一个用于渲染容器到页面中
                var bottomStreamContainer = document.createElement('div');
                bottomStreamContainer.id = 'BottomSteamMediaWrap';
                document.body.insertBefore(bottomStreamContainer, document.body.firstChild);

                switch (content.type[0]) {
                    case 'js' :
                        //富媒体供应商提供的js
                        core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                        break;
                    case 'html' :
                        core.dom.fill(element, content.src[0]);
                        break;
                    default :
                        break;
                }
            } else {
                //这里认为如果给的是素材的话，那么素材必须大于1个，否则为js类型
                //注入流媒体数据
                var BottomStreamMediaData = {
                    main : {
                        type    : content.type[0] || 'flash',
                        src     : content.src[0] || '',
                        link    : content.link[0] || '',
                        width   : width,
                        height  : height,
                        top     : config.sinaads_top || 0
                    },
                    middle : {
                        src     : content.src[1] || '',
                        type    : content.type[1] || 'flash',
                        link    : content.link[1] || content.link[0] || '',
                        width   : width
                    },
                    mini : {
                        src     : content.src[2] || '',
                        type    : content.type[2] || 'flash',
                        link    : content.link[2] || content.link[0] || ''
                    },
                    pdps: config.sinaads_ad_pdps,
                    monitor : content.monitor
                };
                if (core.BottomStreamMedia) {
                    new core.BottomStreamMedia(BottomStreamMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.BottomStreamMedia(BottomStreamMediaData);
                    });
                }
            }
        });
})(core, viewModule);
(function (core, view) {
    view.register('magicmap', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering magicmap.');

        window.sinaadsROC.magicmap = config.sinaads_ad_pdps;

        content = content[0];

        //暴露个变量供第三方使用监测链接
        window.sinaadsMagicMapMonitor = content.origin_monitor || [];
        window.sinaadsMagicMapClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsMagicMapViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        if (content.src.length === 1) {
            switch (content.type[0]) {
                case 'js' :
                    //富媒体供应商提供的js
                    core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                    break;
                default :
                    break;
            }
        }
    });
})(core, viewModule);

/**
 * 初始化方法
 * @return {[type]} [description]
 */
var _init = (function (core, model, view, controller) {
    /**
     * 判断是否为sina商业广告节点且为未完成状态
     */
    //1.class=sinaads 
    //2.data-sinaads-status !== "done"
    function _isPenddingSinaad(element) {
        return (/(^| )sinaads($| )/).test(element.className) && "done" !== element.getAttribute("data-ad-status");
    }

    /**
     * 判断是否为sina商业广告节点且为异步插入的节点
     */
    //1.class=sinaads 
    //2.data-ad-status === "async"
    function _isAsyncSinaAd(element) {
        return (/(^| )sinaads($| )/).test(element.className) && "async" === element.getAttribute("data-ad-status");
    }
    /**
     * 如果有id参数，则获取id为当前id的未渲染元素，如果没有提供id，则从现有的元素中获取一个待渲染广告元素
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function _getSinaAd(id) {
        var inss = document.getElementsByTagName("ins"),
            i = 0,
            len = inss.length,
            ins;
        for (ins = inss[i]; i < len; ins = inss[++i]) {
            if (_isPenddingSinaad(ins) && ((!id && !_isAsyncSinaAd(ins)) || ins.id === id)) {
                return ins;
            }
        }
        return null;
    }

    /**
     * 根据广告媒体类型渲染广告
     */
    function render(element, data, config) {
        if (!data) {
            core.debug('sinaads:' + config.sinaads_ad_pdps + ', Cannot render this element because the data is unavilable.');
            return;
        }
        var mediaType = config.sinaads_ad_type || data.type,
            start = core.now(),
            size    = data.size.split('*'),
            width   = config.sinaads_ad_width || (config.sinaads_ad_width = Number(size[0])) || 0,
            height  = config.sinaads_ad_height || (config.sinaads_ad_height = Number(size[1])) || 0,
            _exParams = model.getExParamsQueryString(); //获取额外参数

        core.array.each(data.content, function (content, i) {
            core.debug('sinaads:Processing the impression of the ' + (i + 1) + ' creative of ad unit ' + config.sinaads_ad_pdps);

            content.src    = core.array.ensureArray(content.src);
            content.link   = core.array.ensureArray(content.link);
            content.type   = core.array.ensureArray(content.type);
            //content.sinaads_content_index = i;  //带入该内容在广告中的序号
            
            var monitor = [],
                origin_monitor = [],
                pv = content.pv;

            /* 解析曝光，并注入模版值，发送曝光 
               曝光还是需要使用iframe进行处理，因为有些曝光是通过地址引入一段脚本实现，如果用img log的话没法执行脚本，会丢失曝光
               比如allyes，在曝光连接会返回document.write('<img src="impress.log"/>')
               这里需要修改方案
            */
            core.array.each(pv, function (url, i) {
                //增加额外参数
                if (_exParams && url && (url.indexOf('sax.sina.com.cn\/view') !== -1 || url.indexOf('sax.sina.com.cn\/dsp\/view') !== -1)) {
                    url += (url.indexOf('?') !== -1 ? '&' : '?') + _exParams;
                }

                pv[i] = core.monitor.parseTpl(url, config);
                core.debug('sinaads:Recording the impression of ad unit ' + config.sinaads_ad_pdps + ' via url ' + url);
                //修改下这里的曝光监测的log, 不需要使用随机参数发送，而是在曝光值替换的时候将{__timestamp__} 替换成当前值，因为可能有些第三方监测会直接把url
                //后面的内容当作跳转连接传递，造成allyes.com/url=http://d00.sina.com.cn/a.gif&_sio_kdflkf请求跳转后为http://d00.sina.com.cn/a.gif&_sio_kdflkf，这个连接是个404的请求
                //如果是背投，先不发送曝光
                //如果不加随机数，会造成曝光缓存
                //('bp' !== mediaType) && pv[i] && core.sio.log(pv[i]);
                //如果是视窗广告，延后1s发送曝光
                if (pv[i]) {
                    if ('videoWindow' === mediaType) {
                        setTimeout((function (_pv) {
                            return function () {
                                core.sio.log(_pv);
                            };
                        })(pv[i]), 1000);
                    } else {
                        core.sio.log(pv[i]);
                    }
                }
            });

            /**
             * 20140820 增加origin_monitor传递给第三方需要用到的监测链接
             * url类型： iframe name="clickTAG=encodeURIComponent(monitor1)|encodeURIComponent(monitor2)|encodeURIComponent(monitor3)"
             * html片段类型： <script>var clickTAG = encodeURIComponent(monitor1)|encodeURIComponent(monitor2)|encodeURIComponent(monitor3)</script>
             * js类型： 同上
             * 页面上的富媒体类型: var sinaads_pdps_clickTAG = 'encodeURIComponent(monitor1)|encodeURIComponent(monitor2)|encodeURIComponent(monitor3)';
             * 处理模板变量
             */
            core.array.each(content.monitor, function (m) {
                m && origin_monitor.push(core.monitor.parseTpl(m, config));
            });
            core.array.each(content.origin_monitor, function (om) {
                om && origin_monitor.push(core.monitor.parseTpl(om, config));
            });
            content.origin_monitor = origin_monitor;
            
            /**
             * 解析监控链接，注入模版， 后续使用
             * 增加过滤出saxclick和saxdspclick链接，并按照逆序方式压入，先saxclick后saxdspclick
             * 由于后续拼接需要逆序进行包裹，所以这里实际需要dspclick在前面则需要dspclick后压入
             */
            // core.array.each(monitor, function (url, i) {
            //     //为sax monitor兼容一定是二跳的方案
            //     if (url && (url.indexOf('sax.sina.com.cn\/click') !== -1 || url.indexOf('sax.sina.com.cn\/dsp\/click') !== -1)) {
            //         url = url.replace(/&url=$/, '') + '&url=';
            //     }
            //     monitor[i] = core.monitor.parseTpl(url, config);
            //     core.debug('sinaads:Processing the click of ad unit ' + config.sinaads_ad_pdps + ' via url ' + url);
            // });
            // 
            var _dspMonitorURL,
                _mfpMonitorURL,
                _saxMonitorURL;

            core.array.each(content.monitor, function (url) {
                //为sax monitor兼容一定是二跳的方案
                if (url && url.indexOf('sax.sina.com.cn\/click') !== -1) {
                    url = url.replace(/&url=$/, '') +
                        (_exParams ? '&' + _exParams : '') + //增加额外参数
                        '&url=';                             //加上&url=

                    _saxMonitorURL = core.monitor.parseTpl(url, config);
                } else if (url && url.indexOf('sax.sina.com.cn\/dsp\/click') !== -1) {
                    url = url.replace(/&url=$/, '') +
                        (_exParams ? '&' + _exParams : '') + //增加额外参数
                        '&url=';                             //加上&url=

                    _dspMonitorURL = core.monitor.parseTpl(url, config);
                } else if (url && url.indexOf('sax.sina.com.cn\/mfp\/click') !== -1) {
                    url = url.replace(/&url=$/, '') +
                        (_exParams ? '&' + _exParams : '') + //增加额外参数
                        '&url=';                             //加上&url=

                    _mfpMonitorURL = core.monitor.parseTpl(url, config);
                } else {
                    url = core.monitor.parseTpl(url, config);
                    url && monitor.push(url);
                }
                core.debug('sinaads:Processing the click of ad unit ' + config.sinaads_ad_pdps + ' via url ' + url);
            });

            _saxMonitorURL && monitor.push(_saxMonitorURL);
            _mfpMonitorURL && monitor.push(_mfpMonitorURL);
            _dspMonitorURL && monitor.push(_dspMonitorURL);

            //拼接二跳
            var link = content.link;
            core.array.each(link, function (url, i) {
                //link增加monitor处理
                link[i] = core.monitor.createTrackingMonitor(url, monitor);
            });

        });

        //橱窗广告特殊代码，将template和logo注入到config中
        if (data.template && data.logo) {
            config.extForView = config.extForView || {};
            config.extForView.template = data.template;
            config.extForView.logo = data.logo;
        }

        /** 
         * 按照媒体类型渲染广告
         */
        view.render(
            mediaType,
            element,
            width,
            height,
            data.content,
            config
        );


        //如果需要高亮广告位，则在广告位外部加上高亮标记
        if (data.highlight && (config.sinaads_ad_type || data.type) === 'embed') {
            element.style.outline = '2px solid #f00';
        }

        core.debug('sinaads:Ads Rendering is complete. (pdps:' + config.sinaads_ad_pdps + ', time elpased:' + (core.now() - start) + 'ms)');
    }


    /**
     * 广告请求成功，有广告的情况下处理
     * @param  {[type]} element [description]
     * @param  {[type]} config  [description]
     * @return {[type]}         [description]
     */
    function _done(element, config) {
        var pdps = config.sinaads_ad_pdps;

        //向展现顺序控制器中注册执行方法
        controller.orderController.ready(pdps, function (element, pdps, frequence, disableKey, data, config) {
            //增加广告加载结束标志sinaads-done
            core.dom.addClass(element, 'sinaads-done');

            //如果有频率限制，则在成功时写入频率限制数据
            controller.frequenceController.disable(pdps);

            render(element, data, config);
            core.isFunction(config.sinaads_success_handler) && config.sinaads_success_handler(element, data, config);
        }, [
            element,
            pdps,
            config.sinaads_frequence || 0,
            PAGE_HASH + pdps + '_disabled',
            model.get(pdps),
            config
        ]);
    }

    function _fail(element, config) {
        var pdps = config.sinaads_ad_pdps;
        controller.orderController.ready(pdps, function (element, config) {
            controller.orderController.done(config.sinaads_ad_pdps);
            core.dom.addClass(element, 'sinaads-fail');
            /* 广告位不能为空 */
            if (config.sinaads_cannot_empty) {
                //@todo 渲染默认数据
                core.debug('Use Default ad data.');
            }
            core.isFunction(config.sinaads_fail_handler) && config.sinaads_fail_handler(element, config);
        },
        [
            element,
            config
        ]);
    }

    function _getRequestDoneHandler(element, config) {
        return function () {
            var delay = config.sinaads_ad_delay;
            //处理延时
            if (delay && (delay = parseInt(delay, 10))) {
                setTimeout(function () {
                    _done(element, config);
                }, delay * 1000);
            } else {
                _done(element, config);
            }
        };
    }
    function _getRequestFailHandler(element, config) {
        return function () {
            _fail(element, config);
        };
    }

    return function (conf) {
        var element = conf.element,    //广告容器
            config = conf.params || {};   //广告配置

        //如果是字符串，那么获取id=string的dom
        if ('string' === typeof element) {
            element = document.getElementById(element);
        }

        //从config.element中得到需要渲染的ins元素，如果没有，则获取页面上未完成状态的广告节点
        if (element) {
            if (!_isPenddingSinaad(element) && (element = element.id && _getSinaAd(element.id), !element)) {
                core.debug("sinaads:Rendering of this element has been done. Stop rendering.", element);
                return;
            }
            if (!("innerHTML" in element)) {
                core.debug("sinaads:Cannot render this element.", element);
                return;
            }
        //没有对应的ins元素, 获取一个待初始化的ins, 如果没有，抛出异常
        } else if (element = _getSinaAd(), !element) {
            core.debug("sinaads:Rendering of all elements in the queue is done.");
            return;
        }

        //置成完成状态，下面开始渲染
        element.setAttribute("data-ad-status", "done");

        //记录所在位置，留用
        var pos = core.dom.getPosition(element);
        element.setAttribute('data-ad-offset-left', pos.left);
        element.setAttribute('data-ad-offset-top', pos.top);


        //全局唯一id标识，用于后面为容器命名
        config.sinaads_uid = UUID++;

        //将data-xxx-xxxx,转换成sinaads_xxx_xxxx，并把值写入config
        //这里因为上面设置了data-ad-status属性, 所以sinaads-ad-status的状态也会被写入conf
        for (var attrs = element.attributes, len = attrs.length, i = 0; i < len; i++) {
            var attr = attrs[i];
            if (/data-/.test(attr.nodeName)) {
                var key = attr.nodeName.replace("data", "sinaads").replace(/-/g, "_");
                //fix alert for nodeValue -> value
                config.hasOwnProperty(key) || (config[key] = attr.value);
            }
        }

        //获取page_url 广告所在页面url
        config.sinaads_page_url = core.url.top;

        var pdps = config.sinaads_ad_pdps;

        //保存pdps的坐标到全局
        try {
            window._sinaadsADPosition = window._sinaadsADPosition || {};
            window._sinaadsADPosition[pdps] = [pos.left, pos.top];
        } catch (e) {}

        /* 处理本地轮播数据2014-04-29 acelan*/
        var localData = config.sinaads_ad_data,
            rotateCount = 0;
        if (localData) {
            //如果localData不是数组，把内容作为数组元素
            localData = core.array.ensureArray(localData);
            rotateCount = localData.length <= 1 ? 0 : (model.getSeed(pdps) % localData.length);
            model.add(pdps, localData[rotateCount]);
            core.debug('sinaads: Use local data in count ' + rotateCount);
        }

        //@TODO 通过sinaad-ad-disable参数+frequenceController来实现可以禁用某个广告
        //如果广告位标记了不发请求，那么注册一个广告频次控制器,且设置广告为disable状态
        //
        //
        //

        //注册一个频率控制器
        controller.frequenceController.register(pdps, config.sinaads_frequence || 0);

        //如果该pdps不是处于禁止请求状态，发请求，否者直接进入失败处理
        if (pdps && !controller.frequenceController.isDisabled(pdps)) {
            model.request(pdps)
                .done(_getRequestDoneHandler(element, config))
                .fail(_getRequestFailHandler(element, config));
        } else {
            _fail(element, config);
        }
    };
})(core, modelModule, viewModule, controllerModule);


/**
 * 初始化数据模型，并在初始化完成后处理js加载成功之前压入延迟触发的广告位，
 * 并将后续广告压入方法置成内部初始化方法
 */
modelModule.init(function () {
    core.debug('sinaads:Begin to scan and render all ad placeholders.' + core.now());
    /* 在脚本加载之前注入的广告数据存入在sinaads数组中，遍历数组进行初始化 */
    var preloadAds = window.sinaads;
    if (preloadAds && preloadAds.shift) {
        for (var ad, len = 100; (ad = preloadAds.shift()) && 0 < len--;) {
            _init(ad);
        }
    }
    //在脚本加载之后，sinaad重新定义，并赋予push方法为初始化方法
    window.sinaads = {push : _init};
});

//导出一些变量
window.sinaadsROC = controllerModule.orderController;
window.sinaadsRFC = controllerModule.frequenceController;
window._sinaadsCacheData = modelModule.get();
window.sinaadsGetSeed = modelModule.getSeed;
window.sinaadsRenderHandler = viewModule.handlerMap;

return true; //初始化完成

})(window, window.sinaadToolkit);
