// 外壳
var monbox = document.createElement('div');
monbox.style.cssText = "width:300px;height:380px;background-color:yellow;position:fixed;left:0;bottom:0;z-index:10500;font-family:'microsoft yahei';";
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
  monbox.appendChild(ifr);
}

//运营内容1

//广告


//运营广告2

//更多
