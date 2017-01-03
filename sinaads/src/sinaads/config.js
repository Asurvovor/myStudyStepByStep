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
