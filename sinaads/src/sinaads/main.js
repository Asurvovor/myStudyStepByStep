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
import "config";

import "controller";
import "model";
import "view";
import "postmessage";

import "view/bp";
import "view/couplet";
import "view/embed";
import "view/float";
import "view/follow";
import "view/fullscreen";
import "view/stream";
import "view/textlink";
import "view/tip";
import "view/turning";
import "view/videoWindow";
import "view/bg";
import "view/pop";
import "view/skyscraper.js";
import "view/leftsuspend.js";
import "view/shopWindow.js";
import "view/shop.js";
import "view/bottomstream.js";
import "view/magicmap";
import "view/followbutton";

import "init";

import "exports";


//增加统计正文页的包含图片正文监测，图森合作项目
//import "plugin/articleImgCount.js";

return true; //初始化完成

})(window, window.sinaadToolkit);