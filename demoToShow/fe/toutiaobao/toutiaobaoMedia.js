
(function(window, sinaadToolkit) {
  "use strict";

  var box_size = [300,380],
    box_pos = ['left', 'bottom'],
    box_wrap_size = [300,180],
    box_content_size = [300,380],
    closeBtnSize = [40,18],
    clsoBtnSrc = "//d3.sina.com.cn/litong/zhitou/sinaads/demo/jiliang/toutiaobao/close-h.jpg";

  function toutiaoBox(config) {
    var me = this;
    me.width = config.width || box_size[0];
    me.height = config.height || box_size[1];
    me.position = config.position || box_pos;
    me.contentSize = config.contentSize || box_content_size;


    //整个大区域
    var monbox = me.monbox = new sinaadToolkit.Box({
      width: me.width,
      height: me.height,
      position : {
          my : 'left bottom',
          of : 'window',
          at : 'left bottom'
      },
      follow: 1,
      zIndex: 10500
    });
    monbox.getMain().style.cssText = 'margin: 0;padding: 0;font-family:"microsoft yahei";background-color: #fff;';
    //栏目条
    var lanmutiao = me.lanmutiao = document.createElement('div');
    lanmutiao.id = 'lanmutiao';
    lanmutiao.style.cssText = 'width: 300px;height: 30px;background-color: #d44229;';
    lanmutiao.innerHTML = '<div style="color: #fff;font-size: 16px;font-weight:bold;padding-left: 10px;padding-top: 5px;">'+toutiaobaoData.lanmutiao.title+'</div>';

    monbox.getMain().appendChild(lanmutiao);

//广告部分
    // var boxWrapAD = me.boxWrapAD = document.createElement('div');
    // boxWrapAD.id = 'wrapAD';
    // boxWrapAD.style.cssText = 'position:relative;width:' + box_wrap_size[0] + 'px;height:' + box_wrap_size[1] + 'px;margin:0;padding:0;';
    // boxWrapAD.innerHTML = '<ins class="sinaads" data-ad-pdps="6B482B6B164D"></ins>';
//运营内容
    // var boxContet = me.boxContet = document.createElement('div');
    // boxContet.id = "boxContet";
    // boxContet.style.cssText = 'width:' + me.contentSize[0] + 'px;height:' + me.contentSize[1] + 'px;margin:0 auto;background:transparent url(' + MONBOX_CONTENT + ') no-repeat center bottom;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=noscale, src=' + MONBOX_CONTENT + ');_background:none;';

    // boxContet.innerHTML = '<iframe frameborder="0" width="320px" height="120px" scrolling="no" src="//auto.sina.com.cn/blank/2016-10-25/blank-ifxwztru7125613.shtml"></iframe>';


//关闭按钮
    var closeBtn = me.closeBtn = document.createElement('a');
    closeBtn.id = 'closeBtn';
    closeBtn.style.cssText = 'position:absolute;' + 'right:0;top:-18px;display:block;width:' + closeBtnSize[0] + ';height:' + closeBtnSize[1] + 'cursor:pointer;text-decoration:none;border:none;';
    closeBtn.href = 'javascript:void(0);';
    closeBtn.innerHTML = '<img src="' + clsoBtnSrc + '" style="cursor:pointer;border:none;">';

    monbox.getMain().appendChild(closeBtn);


    // monbox.getMain().appendChild(me.boxWrapAD);
    // monbox.getMain().appendChild(me.boxContet);
    // (sinaads = window.sinaads || []).push({}); // 完成包框广告的渲染

    // monbox.hide();
    var clicked = 0;
    window.onscroll = function () {
      if (clicked == 0) {
        var st = document.body.scrollTop || document.documentElement.scrollTop;
        if (st>1700) {
          monbox.hide();
        } else {
          monbox.show();
        }
      }

    }

    sinaadToolkit.event.on(closeBtn, 'click', function(){
        clicked = 1;
        monbox.hide();
        monbox.remove();
    });



    try {
        sinaadToolkit.debug('Media: In building toutiaoBox complete!');
        return this;
    } catch (e) {}


  }


  toutiaoBox.prototype = {
      show: function() {
          var me = this;
          me.monbox.show();
      },
      hide: function() {
          var me = this;
          me.monbox.hide();
      }
  };
  sinaadToolkit.toutiaoBox = sinaadToolkit.toutiaoBox || toutiaoBox;
})(window, sinaadToolkit);