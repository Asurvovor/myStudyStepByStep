/**
 * Created by sola on 14/12/25.
 */
(function(window, sinaadToolkit) {
    "use strict";

    var MONBOX_SIZE = [320,220],
        MONBOX_POSITION = ['left', 'bottom'],
        MONBOX_WRAPAD_SIZE = [320,100],
        //MONBOX_WRAPAD = '//d2.sina.com.cn/litong/zhitou/sources/hapiWrapAD.png', //DEMO 默认背景图
        //MONBOX_WRAPAD_CS = '//d1.sina.com.cn/litong/zhitou/test/longyue/worldcup/topwrapcs.png', //DEMO 带用户权益体现
        MONBOX_CONTENT = '//d1.sina.com.cn/litong/zhitou/sinaads/demo/jiliang/chezhanContent.png',
        //MONBOX_CONTENT_IFRAME = '//d3.sina.com.cn/litong/zhitou/sinaads/demo/wanglt/zaowanbao/zaowanbao-pop.html',
        MONBOX_CONTENT_SIZE = [320,120],
        MONBOX_CLOSE_BTN_SIZE = [20,50],
        MONBOX_CLOSE_BTN = "//d5.sina.com.cn/litong/zhitou/sinaads/demo/jiliang/pop_close.png",
        MONBOX_CS_SIZE = [300, 170],
        //MONBOX_CS = '//d1.sina.com.cn/201304/19/487324_zwb-A-class.png', //仅供测试
        MONBOX_CS_TIME = '3000'; //展现时间 默认为 3s

    function MonBoxMediaCheZhan(config) {
        var me = this;
        me.width = config.width || MONBOX_SIZE[0];
        me.height = config.height || MONBOX_SIZE[1];
        me.position = config.position || MONBOX_POSITION;
        //me.wrapAD = config.wrapAD || MONBOX_WRAPAD;
        me.contentSize = config.contentSize || MONBOX_CONTENT_SIZE;
        //me.contentIframe = config.contentIframe || MONBOX_CONTENT_IFRAME;

        var monbox = me.monbox = new sinaadToolkit.Box({
            width: me.width,
            height: me.height,
//            position: (me.position[0] || 0) + (me.position[1] || 0),
            position : {
                my : 'left bottom',
                of : 'window',
                at : 'left bottom'
            },
            follow: 1,
            zIndex: 10500
        });
        //monbox.getMain().style.cssText += ';background:transparent url("' + MONBOX_CONTENT + '") no-repeat left bottom;';

        var monboxWrapAD = me.monboxWrapAD = document.createElement('div');
        monboxWrapAD.id = 'wrapAD';
        monboxWrapAD.style.cssText = 'position:relative;width:' + MONBOX_WRAPAD_SIZE[0] + 'px;height:' + MONBOX_WRAPAD_SIZE[1] + 'px;margin:0;padding:0;';
        monboxWrapAD.innerHTML = '<ins class="sinaads" data-ad-pdps="6B482B6B164D"></ins>';

        var monboxContent = me.monboxContent = document.createElement('div');
        monboxContent.id = "monboxContent";
        monboxContent.style.cssText = 'width:' + me.contentSize[0] + 'px;height:' + me.contentSize[1] + 'px;margin:0 auto;background:transparent url(' + MONBOX_CONTENT + ') no-repeat center bottom;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=noscale, src=' + MONBOX_CONTENT + ');_background:none;';
        //monboxContent.innerHTML = '<div id="zaowanbao-pop"><div id="zaowanbao-pop-box" class="clearfix"><div class="zaowanbao-pop-content"><div class="zaowanbao-pop-pic"><ins id="ins-pop" class="sinaads" data-ad-pdps="5C1AF74295B2" style="width:120px;"></ins></div><div class="zaowanbao-pop-list zaowanbao-linkRedBox"><h4 class="zaowanbao-pop-title"><ins id="h4-title" class="sinaads" data-ad-pdps="2015CHEZHAN00"></ins></h4><ul><li><ins id="wenzilian0" class="sinaads" data-ad-pdps="3D6C1FE98A25"></ins></li><li><ins id="wenzilian1" class="sinaads" data-ad-pdps="74842C1F6B42"></ins></li><li><ins id="wenzilian2" class="sinaads" data-ad-pdps="608FB5F65602"></ins></li><li><ins id="wenzilian3" class="sinaads" data-ad-pdps="FC90A2924193"></ins></li></ul></div></div></div></div>';
        monboxContent.innerHTML = '<iframe frameborder="0" width="320px" height="120px" scrolling="no" src="//auto.sina.com.cn/blank/2016-10-25/blank-ifxwztru7125613.shtml"></iframe>';



        var monboxCloseBtn = me.monboxCloseBtn = document.createElement('a');
        monboxCloseBtn.id = 'closeBtn';
        monboxCloseBtn.style.cssText = 'position:absolute;' + 'left:320px;top:100px;display:block;width:' + MONBOX_CLOSE_BTN_SIZE[0] + ';height:' + MONBOX_CLOSE_BTN_SIZE[1] + 'cursor:pointer;text-decoration:none;border:none;';
        monboxCloseBtn.href = 'javascript:void(0);';
        monboxCloseBtn.innerHTML = '<img src="' + MONBOX_CLOSE_BTN + '" style="cursor:pointer;border:none;">';

        monbox.getMain().appendChild(monboxCloseBtn);

        var _closeAD = me._closeAD = document.createElement('div');
        _closeAD.style.cssText = 'position:absolute;bottom:0;left:0;width:' + MONBOX_CS_SIZE[0] + 'px;height:' + MONBOX_CS_SIZE[1] + 'px;';
        _closeAD.innerHTML = '<ins id="ins-close" class="sinaads" data-ad-pdps="038DD5A0D288"></ins>';

        monbox.getMain().appendChild(me.monboxWrapAD);
        monbox.getMain().appendChild(me.monboxContent);
        (sinaads = window.sinaads || []).push({
            params: {
                // 包框广告加载完成后 针对 IE 添加 CSS样式透明化 PNG 图
                sinaads_ad_tpl: '<a style="display:block;height:100px;border:none;text-decoration:none;background:url(#{src0});' +
                    '_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=noscale, src=#{src0});_background:none;" href=#{link0} target="_blank"></a>'
            }
        }); // 完成包框广告的渲染
//        (sinaads = window.sinaads || []).push({}); // 完成主体内容的渲染

        //(sinaads = window.sinaads || []).push({params : {
        //    element: document.getElementById("ins-pop"),
        //    sinaads_ad_width : 120,
        //    sinaads_ad_height :120,
        //    sinaads_ad_tpl: function(){
        //        return '<a href="#{link0}" title="#{src1}" target="_blank"><img src="#{src0}" width="118" height="88" /><p class="zaowanbao-pop-txt">#{src1}</p></a>'
        //    }
        //}});

        //(sinaads = window.sinaads || []).push({element: document.getElementById("h4-title")});
        //(sinaads = window.sinaads || []).push({element: document.getElementById("wenzilian0")});
        //(sinaads = window.sinaads || []).push({element: document.getElementById("wenzilian1")});
        //(sinaads = window.sinaads || []).push({element: document.getElementById("wenzilian2")});
        //(sinaads = window.sinaads || []).push({element: document.getElementById("wenzilian3")});

        monbox.hide();

        sinaadToolkit.event.on(monboxCloseBtn, 'click', me.getCloseSideHandler());

        try {
            sinaadToolkit.debug('Media: In building MonBoxMediaCheZhan complete!');
            return this;
        } catch (e) {}
    }

    MonBoxMediaCheZhan.prototype = {
        show: function() {
            var me = this;
            me.monbox.show();
        },
        hide: function() {
            var me = this;
            me.monbox.hide();
        },
        getCloseSideHandler: function() {
            var me = this;
            return function() {
                me.monbox.getMain().innerHTML = '';
                me.monbox.getMain().style.background = 'none';
                me.monbox.getMain().appendChild(me._closeAD);
                (sinaads = window.sinaads || []).push({element: document.getElementById("ins-close")});

                setTimeout(function() {
                     me.monbox.hide();
                }, MONBOX_CS_TIME);
            };
        }
    };
    sinaadToolkit.MonBoxMediaCheZhan = sinaadToolkit.MonBoxMediaCheZhan || MonBoxMediaCheZhan;
})(window, sinaadToolkit);