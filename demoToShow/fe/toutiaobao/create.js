// 外壳
var monbox = document.createElement('div');
monbox.style.cssText = "width:300px;height:380px;background-color:#fff;position:fixed;left:0;bottom:0;z-index:10500;font-family:'microsoft yahei';";
var body = document.getElementsByTagName('body')[0];
body.appendChild(monbox);

// 关闭按钮
var closeBtn = document.createElement('img');
closeBtn.setAttribute("src","close-h.jpg");
closeBtn.style.cssText = 'position:absolute;right:0;top:-18px;border:none;cursor:pointer;';
monbox.appendChild(closeBtn);

var clicked = 0;
window.onscroll = function () {
  if (clicked == 0) {
    var st = document.body.scrollTop || document.documentElement.scrollTop;
    if (st>1700) {
      monbox.style.display = 'none';
    } else {
      monbox.style.display = 'block';
    }
  }
}
closeBtn.addEventListener('click',function(){
  clicked = 1;
  monbox.style.display = 'none';
  monbox.parentNode.removeChild(monbox);
});

//栏目条
var lanmutiao = document.createElement('div');
lanmutiao.style.cssText = 'width: 300px;height: 30px;background-color: #d44229;line-height:30px;text-indent:.5em;color: #fff;font-size: 16px;font-weight:bold;';
lanmutiao.innerHTML = toutiaobaoData.lanmutiao.title;
monbox.appendChild(lanmutiao);

//赞助广告
var logoAD = document.createElement('div');
logoAD.style.cssText = 'float: right;width: 130px;height:25px;padding-top: 5px;';
logoAD.innerHTML = '<img src="logo.png">';
lanmutiao.appendChild(logoAD);

//焦点图
if(toutiaobaoData.focusPic.src){
  var src = toutiaobaoData.focusPic.src,
      w = toutiaobaoData.focusPic.width,
      h = toutiaobaoData.focusPic.height;

  var ifr = document.createElement('iframe');
  ifr.setAttribute("src",src);
  ifr.setAttribute("width",w);
  ifr.setAttribute("height",h);
  ifr.setAttribute("frameborder","0");
  ifr.setAttribute("scrolling","no");
  ifr.style.display = 'block';
  monbox.appendChild(ifr);
}

//运营内容1
var channel1 = document.createElement('div');
  channel1.style.cssText = 'width: 300px;height: 87px;border-bottom: 1px solid #f1f1f1;';
  channel1.innerHTML = '<div style="width: 90px;height: 70px;padding:9px;float:left;"><a href="'+ toutiaobaoData.tuwen1.link +'" target="_blank" style="text-decoration: none;"><img src="'+ toutiaobaoData.tuwen1.imgSrc +'"></a></div><div style="width: 172px;height: 70px;float: left;margin: 9px 16px 9px 4px;"><a href="'+ toutiaobaoData.tuwen1.link +'" target="_blank" style="text-decoration: none;"><h3 style="font-size: 18px;text-indent: .5em;color: #000;">'+ toutiaobaoData.tuwen1.title +'</h3></a><a href="'+ toutiaobaoData.tuwen1.link +'" target="_blank" style="text-decoration: none;"><p style="font-size: 12px;color: #9a9a9a;">'+ toutiaobaoData.tuwen1.content +'</p></a></div>'
  monbox.appendChild(channel1);

//广告
var tuwenAD = document.createElement('div');
tuwenAD.style.cssText = 'width: 300px;height: 87px;border-bottom: 1px solid #f1f1f1;background-color:yellow;';
monbox.appendChild(tuwenAD);
//运营广告2
if(!toutiaobaoData.focusPic.src){
  var channel2 = document.createElement('div');
  channel2.style.cssText = 'width: 300px;height: 87px;border-bottom: 1px solid #f1f1f1;';
  channel2.innerHTML = '<div style="width: 90px;height: 70px;padding:9px;float:left;"><a href="'+ toutiaobaoData.tuwen2.link +'" target="_blank" style="text-decoration: none;"><img src="'+ toutiaobaoData.tuwen2.imgSrc +'"></a></div><div style="width: 172px;height: 70px;float: left;margin: 9px 16px 9px 4px;"><a href="'+ toutiaobaoData.tuwen2.link +'" target="_blank" style="text-decoration: none;"><h3 style="font-size: 18px;text-indent: .5em;color: #000;">'+ toutiaobaoData.tuwen2.title +'</h3></a><a href="'+ toutiaobaoData.tuwen2.link +'" target="_blank" style="text-decoration: none;"><p style="font-size: 12px;color: #9a9a9a;">'+ toutiaobaoData.tuwen2.content +'</p></a></div>'
  monbox.appendChild(channel2);
}
//更多
var moreInfo = document.createElement('div');
moreInfo.style.cssText = 'width: 300px;height: 24px;text-align: center;font-size: 12px;';
moreInfo.innerHTML = '<a style="display: block;padding-top: 8px;color: #a8a8a8;" href="http://www.sina.com.cn" target="_blank">查看更多</a>';
monbox.appendChild(moreInfo);


