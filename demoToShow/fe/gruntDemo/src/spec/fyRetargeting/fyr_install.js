_fyr = window._fyr || [];
//必须
//设置账户，第二个参数为账户id
_fyr.push(['_setAccount', 'acelan']);
//设置第三方cookie, 第二个参数为cookie值
_fyr.push(['_setThirdCookie', 'acelan_cookie']);
//设置平台，值为'pc'或者'wap'
_fyr.push(['_setPlatform', 'pc']);

//调用
//登陆行为监测， 第一二参数勿动，扩展参数1，2，3
_fyr.push(['_login', '1_9', 1, 2, 3]);
//访问行为监测， 第一二参数勿动，扩展参数1，2，3
_fyr.push(['_visit', '1_1', 1, 2, 3]);
//订单行为监测， 第一二参数勿动，用户ID, 订单id, 订单金额，[订单商品id:订单数量, 订单商品id:订单数量]
_fyr.push(['_order', '1_2', 111, 111, 12.36, ['111:1', '222:12']]);
//注册行为监测，第一二参数勿动，注册用户id, 扩展参数1，2，3
_fyr.push(['_regist', '1_3', 111, 1, 2, 3]);
//购物车行为监测, 第一二参数勿动，用户id, 商品id, 扩展参数1，2，3
_fyr.push(['_cart', '1_4', 1111, 111, 1, 2, 3]);
//商品浏览代码， 第一二参数勿动，商品ID, 扩展参数1，2，3
_fyr.push(['_goodVisit', '1_5', 111, 111, 1, 2, 3]);
//站内搜索代码，第一二参数勿动，关键词，结果页URL
_fyr.push(['_insiteSearch', '1_6', 'keyword', 'http://result.com/page']);
//咨询行为代码，第一二参数勿动，咨询问题，咨询页URL
_fyr.push(['_ask', '1_7', 'ask content', 'http://ask.com/page']);
//收藏行为代码，第一二参数勿动，用户ID, 商品ID
_fyr.push(['_favourite', '1_8', 1, 2]);
//自定义监测代码，第一二参数勿动，扩展参数1，2，3
_fyr.push(['_customVar', 'custom', 1, 2, 3]);

(function (d, s, id) {
    var n = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    s = d.createElement(s);
    s.id = id;
    s.setAttribute('charset', 'utf-8');
    s.src = '//d' + Math.floor(0 + Math.random() * (9 - 0 + 1)) + '.sina.com.cn/litong/zhitou/sinaads/release/spec/fyr.js';
    n.parentNode.insertBefore(s, n);
})(document, 'script', 'fyr-script');