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