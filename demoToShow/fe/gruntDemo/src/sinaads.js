/*!
 * sinaads
 * 新浪统一商业广告脚本
 * 负责使用pdps(新浪广告资源管理码)向广告引擎请求数据并处理广告渲染
 * @author acelan <xiaobin8[at]staff.sina.com.cn>
 * @version 1.8.0
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
//var IMPRESS_URL = '//sax.sina.com.cn/' + (+new Date()).toString(36); //向广告引擎请求正式广告的地址
var IMPRESS_URL = '//sax.sina.com.cn/newimpress'; //向广告引擎请求正式广告的地址
var HTTPS_IMPRESS_URL = 'https://sax.sina.com.cn/newimpress'; // 443的广告引擎接口

//错误日志发送地址
var ERROR_TRACKING_URL = '//d00.sina.com.cn/a.gif';

var SERVER_PREVIEW_IMPRESS_URL = '//sax.sina.com.cn/preview'; //向广告引擎请求服务端预览广告的地址
var SERVER_FY_PREVIEW_IMPRESS_URL = '//amp.ad.sina.com.cn/ea/api/ideaScreen!preview.action'; //向fuyi广告引擎请求服务端预览广告的地址
var SERVER_LY_PREVIEW_IMPRESS_URL = '//amp.ad.sina.com.cn/ly/api/ideaScreen!preview.action'; //向longyuan广告引擎请求预览广告
var PLUS_RESOURCE_URL = core.RESOURCE_URL + '/release/plus/Media.js';
//PLUS_RESOURCE_URL = ''; //测试富媒体分文件用
var SAX_TIMEOUT = parseInt(window._SINAADS_CONF_SAX_REQUEST_TIMEOUT || 10, 10) * 1000; //请求数据超时时间
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
    //PDPS000000025256: 'lb',
    //// PDPS000000046011: 'lb',
    //PDPS000000055164: 'lb',
    //PDPS000000055163: 'lb',
    //PDPS000000055165: 'lb',
    //PDPS000000044086: 'lb',
    //PDPS000000044089: 'lb',
    //PDPS000000056065: 'lb'
    //// PDPS000000055082: 'lt',
    //// PDPS000000052110: 'lt',
    //// PDPS000000021062: 'lb',
    //// PDPS000000021063: 'lb',
    //// PDPS000000055077: 'lb',
    //// PDPS000000055078: 'lb'
};

var IAB20160901_AD_LOGO_BLACK_PDPS = {
    PDPS000000010399: 'PDPS000000010399',
    PDPS000000010400: 'PDPS000000010400',
    PDPS000000010403: 'PDPS000000010403',
    PDPS000000010419: 'PDPS000000010419',
    PDPS000000010420: 'PDPS000000010420',
    PDPS000000010421: 'PDPS000000010421',
    PDPS000000010426: 'PDPS000000010426',
    PDPS000000010430: 'PDPS000000010430',
    PDPS000000010423: 'PDPS000000010423',
    PDPS000000010428: 'PDPS000000010428',
    PDPS000000010398: 'PDPS000000010398',
    PDPS000000010401: 'PDPS000000010401',
    PDPS000000010402: 'PDPS000000010402',
    PDPS000000010404: 'PDPS000000010404',
    PDPS000000010410: 'PDPS000000010410',
    PDPS000000010418: 'PDPS000000010418',
    PDPS000000010422: 'PDPS000000010422',
    PDPS000000010427: 'PDPS000000010427',
    PDPS000000010429: 'PDPS000000010429',
    PDPS000000010417: 'PDPS000000010417',
    PDPS000000010424: 'PDPS000000010424',
    PDPS000000010425: 'PDPS000000010425',
    PDPS000000010434: 'PDPS000000010434',
    PDPS000000010440: 'PDPS000000010440',
    PDPS000000010432: 'PDPS000000010432',
    PDPS000000010433: 'PDPS000000010433',
    PDPS000000010435: 'PDPS000000010435',
    PDPS000000010437: 'PDPS000000010437',
    PDPS000000010438: 'PDPS000000010438',
    PDPS000000010439: 'PDPS000000010439',
    PDPS000000010441: 'PDPS000000010441',
    PDPS000000010436: 'PDPS000000010436'
};

var AD_ICON_URL = 'javascript:;';
//获取展现位置的方法
function GET_AD_ICON(position) {
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
    var _getImpressURL = (function () {
        var DEFAULT_URL = IMPRESS_URL;
        try {
            //灰度控制，如果cookie的最后一位能被5整除，就使用https请求
            var sinaglobal = core.cookie.get('SINAGLOBAL');
            //如果是release方式，使用https请求, 即100%流量使用https请求2016-05-24
            if (core.mode !== 'debug' /* (sinaglobal && parseInt(core.hash(sinaglobal), 36) % 10 < 7)*/) {
                core.debug('sinaads: ' + sinaglobal + ' is in gray test, use parseInt(sinaadToolkit.hash(sinaadToolkit.cookie.get("SINAGLOBAL")), 16) to check.');
                DEFAULT_URL = HTTPS_IMPRESS_URL;
            }
        } catch (e) {}

        return function (pdps) {
            var url = DEFAULT_URL;
            //如果是预览走预览链接
            if (serverPreviewSlots[pdps]) {
                var type = serverPreviewSlots[pdps].split('&')[0];
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
            }
            return url;
        };
    })();

    /**
     * 获取外部定义额外参数的请求串
     */
    function getExParamsQueryString() {
        var params = window.sinaadsExParams || {},
            str = [];

        //增加反作弊参数记录 20160326 acelan
        params.am = params.am || '{ds:' + core.systemInfo.screenSize + ',fv:' + core.systemInfo.flashVersion + ',ov:' + core.systemInfo.platform + '}';


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

            //去掉content里src的http|https协议
            for(var i = 0;i < r.length;i++){
                var src = r[i].src;
                var type = r[i].type;
                for(var j = 0;j < src.length;j++){
                    switch (type[j]){
                        case "url":
                        case "js":
                        case "image":
                        case "flash":
                        case "video":
                            src[j] = src[j].replace(/^http:|https:/, '');
                            break;
                        default:
                            break;
                    }
                }
            }

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
            'lmt'   : 'stream',                 //流媒体
            'kl'    : 'couplet',                //跨栏
            'sc'    : 'videoWindow',            //视窗
            'hzh'   : 'embed',
            'jx'    : 'embed',
            'dtl'   : 'embed',
            'an'    : 'embed',
            'dan'   : 'embed',
            'xan'   : 'embed',
            'wzl'   : 'textlink',
            'ztwzl' : 'zhitoutextlink',
            'qp'    : 'fullscreen',             //全屏
            'fp'    : 'turning',                //翻牌
            'dl'    : 'float',                  //对联
            'tip'   : 'tip',                    //tip
            'bt'    : 'bp',                     //背投
            'sx'    : 'follow',                 //随屏
            'kzdl'  : 'coupletExt',             //扩展对联
            'fc1'   : 'pop',                    //浮层
            'kzan'  : 'skyscraper',
            'span'  : 'leftsuspend',
            'tuigraph' : 'embed',
            'dflmt'    : 'bottomstream',        //底浮
            'bj'    : 'bg',                     //背景
            'motu'  : 'magicmap',               //魔图
            'sxan'  : 'followbutton'            //随屏按钮
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
                    //发送超时日志
                    core.sio.log(ERROR_TRACKING_URL + '?type=tp_pc_timeout&pos=' + _pdps.join(',') + '&ref=' + encodeURIComponent(core.url.top));
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
//监听postmessage数据
core.event.on(window, "message", function (e) {
    switch (e.origin) {
        case "http://g.alicdn.com":
            var data = core.json.parse(e.data);
            if (Number(data.overtime_state) === 1 || data.content.src.length === 0) {
                window.sinaadsROC.done(data.sinaads_ad_pdps);
                return;
            }
            else {
                _message(data);
                //加强验证素材后缀名这块,看能不能正则一次搞定(要是实现了就可以吹牛逼了)
                //var src = data.content.src[0],
                //    regex1 = /[^?|#]+/,
                //    regex2 = /[^\.]+$/,
                //    resultSRC = regex1.exec(src),
                //    srcType = regex2.exec(resultSRC);
                //switch (srcType[0]) {
                //    case 'swf':
                //        srcType = 'flash';
                //        break;
                //    case 'png':
                //    case 'jpg':
                //    case 'gif':
                //    case 'bmp':
                //        srcType = 'image';
                //        break;
                //}
                //if (srcType === "image" || srcType === "flash") {
                //    _message(data);
                //}
            }
            break;
    }
});

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
        if (content.src.length === 1 && (content.type[0] === 'js' || content.type[0] === 'html' || content.type[0] === 'postmessage')) {
            switch (content.type[0]) {
                case 'js' :
                    core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                    break;
                case 'html' :
                    core.dom.fill(element, content.src[0]);
                    break;
                case 'postmessage' :
                    if (core.browser.ie <= 7) {
                        window.sinaadsROC.done(config.sinaads_ad_pdps);
                        return;
                    }
                    else {
                        var sinaads_ad_type = 'couplet';
                        var data = {
                            "sinaads_ad_pdps": config.sinaads_ad_pdps,
                            "sinaads_ad_type": sinaads_ad_type,
                            "sinaads_page_url": config.sinaads_page_url,
                            "sinaads_couple_top": config.sinaads_couple_top,
                            "sinaads_ad_width": config.sinaads_ad_width,
                            "sinaads_ad_height": config.sinaads_ad_height,
                            "sinaads_uid": config.sinaads_uid,
                            "ad_id": content.ad_id
                        };
                        var Data = core.json.stringify(data);
                        var ifram = document.createElement("iframe");
                        ifram.width = "0";
                        ifram.height = "0";
                        //如果content.src[0]未加载成功也应考虑sinaadsROC.done问题
                        ifram.src = content.src[0];
                        ifram.name = Data;
                        element.appendChild(ifram);
                    }
                    break;
                default :
                    break;
            }
        } else {
            //注入跨栏数据
            var CoupletMediaData = {
                pdps: config.sinaads_ad_pdps,
                src: content.src,
                type: content.type,
                link: content.link,
                mainWidth: config.sinaads_ad_main_width,
                mainHeight: config.sinaads_ad_main_height,
                top: config.sinaads_couple_top || 0,
                monitor: content.origin_monitor || [],
                pv: content.pv || [],
                sideWidth: config.sinaads_ad_side_width,
                sideHeight: config.sinaads_ad_side_height
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
            src: content.src,
            type: content.type,
            link: content.link,
            width: width,
            height: height,
            offsettop: config.sinaads_coupletext_offsettop || 100,
            expandpos: config.sinaads_coupletext_expandpos || 1200,
            smallsize: config.sinaads_coupletext_smallsize,
            bigsize: config.sinaads_coupletext_bigsize,
            monitor: content.origin_monitor || [],
            pv: content.pv || []
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
        if (config.sinaads_ad_fullview && (type[0] === 'flash' || type[0] === 'image')) {
            width = '100%';
            height = 'auto';
        } else {
            width += 'px';
            height += 'px';
        }

        element.style.cssText += ';display:block;overflow:hidden;text-decoration:none;';
        element.innerHTML = '<ins style="text-decoration:none;margin:0px auto;width:' + width + ';display:block;position:relative;overflow:hidden;"></ins>';

        var ad_logo_update_IAB =  document.createElement('div');
        ad_logo_update_IAB.style.cssText = 'width:26px;height:13px;position:absolute;right:1px;bottom:1px;z-index:99;background:url("//d2.sina.com.cn/litong/zhitou/sinaads/release/ad_logo_update_IAB.gif") no-repeat';
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
            //var clearDiv = document.createElement("div");
            //clearDiv.style.cssText = 'clear:both';
            //element.appendChild(clearDiv);
            element.appendChild(ad_logo_update_IAB);
        } else {
            switch (type[0]) {
                case 'text' :
                case 'image' :
                case 'url' :
                case 'adbox' :
                case 'flash' :
                    core.swf.hackAutoPlay(element, adContent);
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

        if(type[0] === "image" || type[0] === "flash"){
            element.appendChild(ad_logo_update_IAB);
        }
        else if(src[0].indexOf('//d3.sina.com.cn/litong/zhitou/sinaads/release/picshow_new.swf') >= 0){
            //用来判断翻牌广告添加广告标识
            element.appendChild(ad_logo_update_IAB);
        }

        //保证嵌入式广告的顺序也可以被控制
        //try {
        //    window.sinaadsROC.done(pdps);
        //} catch (e) {}
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
            //case 'postmessage' :
                //if(core.browser.ie <= 7){
                //    window.sinaadsROC.done(config.sinaads_ad_pdps);
                //    return;
                //}
                //else {
                //    var sinaads_ad_type = 'fullscreen';
                //    var data = '{"sinaads_ad_pdps":"' + config.sinaads_ad_pdps + '","sinaads_ad_type":"' + sinaads_ad_type + '","sinaads_page_url":"' + config.sinaads_page_url + '","sinaads_ad_width":"' + config.sinaads_ad_width + '","sinaads_ad_height":"' + config.sinaads_ad_height + '","sinaads_uid":"' + config.sinaads_uid + '","ad_id":"' + content.ad_id + '"}';
                //    var ifram = document.createElement("iframe");
                //    ifram.width = "0";
                //    ifram.height = "0";
                //    ifram.src = content.src[0];
                //    ifram.name = data;
                //    element.appendChild(ifram);
                //}

                //if(core.browser.ie <= 7) {
                //    var PID = /[^?|#]+$/.exec(content.src[0]);
                //    var PID_VAL = PID[0].slice(4);
                //    var num = 0;
                //    var timer = function(str){
                //        if(typeof window.navigator[str] !== "undefined"){
                //            clearTimeout(timer);
                //            var dataStr = window.navigator[str];
                //            var data = eval("("+ dataStr +")");
                //            var src = data.content.src[0],
                //                regex1 = /[^?|#]+/,
                //                regex2 = /[^\.]+$/,
                //                resultSRC = regex1.exec(src),
                //                srcType = regex2.exec(resultSRC);
                //            switch (srcType[0]) {
                //                case 'swf':
                //                    srcType = 'flash';
                //                    break;
                //                case 'png':
                //                case 'jpg':
                //                case 'gif':
                //                case 'bmp':
                //                    srcType = 'image';
                //                    break;
                //            }
                //            if(srcType === "image" || srcType === "flash"){
                //                _message(data);
                //            }
                //        }
                //        else{
                //            setTimeout(function(){
                //                num+=1;
                //                if(num >= 8){
                //                    clearTimeout(timer);
                //                    window.sinaadsROC.done(config.sinaads_ad_pdps);
                //                    return;
                //                }else{
                //                    timer(PID_VAL);
                //                }
                //            },1000);
                //        }
                //    };
                //    timer(PID_VAL);
                //}
                //break;
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
            pdps = config.sinaads_ad_pdps,
            html = [];
        //过滤不需要加广告标识的文字链
        function isTextLinkDenied(pdps){
            if(IAB20160901_AD_LOGO_BLACK_PDPS[pdps]){
                return true;
            }
            return false;
        }
        if(!isTextLinkDenied(pdps)){
            html.push('<i style="font-style:normal;">广告:</i>');
        }

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
                        url : '//d3.sina.com.cn/litong/zhitou/sinaads/release/picshow_new.swf', //这个url被用作判断翻牌广告添加广告标识的ID,判断逻辑在embed.js
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
            height : height || config.sinaads_bg_height || 800,
            midWidth : config.sinaads_bg_midWidth || 1000,
            headHeight : config.sinaads_bg_headHeight || 80,
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
                    closetime : config.sinaads_pop_closetime || 0,
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
        element.innerHTML = '<ins style="text-decoration:none;margin:0px auto;display:block;overflow:hidden;width:' + width + 'px;height:' + height + 'px;"></ins>';
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
                    //使魔图类型支持html投放
                case 'html' :
                    core.dom.fill(element,content.src[0]);
                    break;
                default :
                    break;
            }
        }
    });
})(core, viewModule);
(function (core, view) {
    view.register('followbutton', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering followbutton.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/FollowButtonMedia.js';

        window.sinaadsROC.followbutton = config.sinaads_ad_pdps;
        content = content[0];

        window.sinaadsFollowButtonClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsFollowButtonViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        switch (content.type[0]) {
            case 'js' :
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            default :
                var FollowButtonMediaData = {
                    pdps : config.sinaads_ad_pdps,
                    src : content.src,
                    type : content.type,
                    link : content.link,
                    width : width || 180,
                    height : height || 150,
                    position : config.sinaads_followbutton_position || 'center center',
                    showPos : config.sinaads_followbutton_show_pos,
                    monitor : content.origin_monitor || [],
                    pv : content.pv || []
                };

                if (core.FollowButtonMedia) {
                    new core.FollowButtonMedia(element, FollowButtonMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.FollowButtonMedia(element, FollowButtonMediaData);
                    });
                }
                break;
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
            size = data.size.split('*'),
            width = config.sinaads_ad_width || (config.sinaads_ad_width = Number(size[0])) || 0,
            height = config.sinaads_ad_height || (config.sinaads_ad_height = Number(size[1])) || 0,
            _exParams = model.getExParamsQueryString(); //获取额外参数

        core.array.each(data.content, function (content, i) {
            core.debug('sinaads:Processing the impression of the ' + (i + 1) + ' creative of ad unit ' + config.sinaads_ad_pdps);

            content.src = core.array.ensureArray(content.src);
            content.link = core.array.ensureArray(content.link);
            content.type = core.array.ensureArray(content.type);
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
                    } else if ('magicmap' === mediaType) {
                        return false;
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
        //会影响性能，每次需要计算尺寸造成reflow，去除，可以放到onload后执行
        // var pos = core.dom.getPosition(element);
        // element.setAttribute('data-ad-offset-left', pos.left);
        // element.setAttribute('data-ad-offset-top', pos.top);
        //保存pdps的坐标到全局
        // try {
        //     window._sinaadsADPosition = window._sinaadsADPosition || {};
        //     window._sinaadsADPosition[pdps] = [pos.left, pos.top];
        // } catch (e) {}


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
 * postmessage从新渲染广告
 *
 * **/

function _message(data) {
    var type = data.sinaads_ad_type;
    var width = Number(data.sinaads_ad_width);
    var height = Number(data.sinaads_ad_height);
    var pdps = data.sinaads_ad_pdps;
    var url = data.sinaads_page_url;
    var uid = Number(data.sinaads_uid);
    var ad_id = data.ad_id;
    var date = new Date().getTime();
    var content, config, element;
    switch (type) {
        //case "fullscreen":
        //    content = [{
        //        ad_id:ad_id,
        //        link:[data.content.link[0]],
        //        src:[data.content.src[0]],
        //        type:[data.content.type[0]],
        //        origin_monitor:[]
        //    }];
        //    config = {
        //        sinaads_ad_width: width,
        //        sinaads_ad_height: height,
        //        sinaads_ad_pdps: pdps,
        //        sinaads_ad_status: "done",
        //        sinaads_page_url: url,
        //        sinaads_uid:uid,
        //        timestamp:date
        //    };
        //    break;
        case "couplet":
            var top = data.sinaads_couple_top;
            content = [{
                ad_id: ad_id,
                link: [data.content.link[0]],
                src: [data.content.src[0], data.content.src[1] || data.content.src[0], data.content.src[2] || data.content.src[1] || data.content.src[0]],
                type: [data.content.type[0],data.content.type[1] || data.content.type[0], data.content.type[2] || data.content.type[1] || data.content.type[0]],
                origin_monitor: []
            }];
            config = {
                sinaads_ad_width: width,
                sinaads_ad_height: height,
                sinaads_ad_pdps: pdps,
                sinaads_couple_top: top,
                sinaads_ad_status: "done",
                sinaads_page_url: url,
                sinaads_uid: uid,
                timestamp: date
            };
            break;
        default:
            break;
    }
    var items = document.getElementsByTagName("ins");
    for (var i = 0; i < items.length; i++) {
        if (items[i].getAttribute("data-ad-pdps") === pdps) {
            element = items[i];
        }
    }
    viewModule.render(type, element, width, height, content, config);
}

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
    window.sinaads = {push: _init};
});

//导出一些变量
window.sinaadsROC = controllerModule.orderController;
window.sinaadsRFC = controllerModule.frequenceController;
window._sinaadsCacheData = modelModule.get();
window.sinaadsGetSeed = modelModule.getSeed;
window.sinaadsRenderHandler = viewModule.handlerMap;


//增加统计正文页的包含图片正文监测，图森合作项目
//import "plugin/articleImgCount.js";

return true; //初始化完成

})(window, window.sinaadToolkit);
