var data = JSON.parse(decodeURIComponent(window.name));
var htmlStr = '';
var logo_ico = '<div style="width:26px;height:13px;position:absolute;right:16px;bottom:16px;z-index:99;background:url(//d2.sina.com.cn/litong/zhitou/sinaads/release/ad_logo_update_IAB.gif) no-repeat;"></div>';
var templateid = data.templateid - 0;

switch (templateid) {
    case 11:
    htmlStr = [
        '<div class="ty-card ty-card-type1 clearfix" data-info="' + data.info + '" data-cre=' + data.cre + '">',
        '<div class="ty-card-l">',
        '<div class="ty-card-thumb-w"><a href="' + data.url + '" target="_blank"><img src="' + data.img.u + '" alt="" class="ty-card-thumb" width="150" height="100"></a></div>',
        '</div>',
        '<div class="ty-card-r">',
        '<h3 class="ty-card-tt" style="padding-top:16px;"><a href="' + data.url + '" target="_blank">' + data.title + '</a></h3>',
        '</div>',
        logo_ico,
        '</div>'].join('');
    break;

    case 12:
    htmlStr = [
        '<div class="ty-card ty-card-type1 clearfix" data-info="' + data.info + '" data-cre=' + data.cre + '">',
        '<div class="ty-card-l">',
        '<div class="ty-card-thumb-w" style="width:310px;height:175px;"><a href="' + data.url + '" target="_blank"><img src="' + data.img.u + '" alt="" class="ty-card-thumb" style="width:310px;height:175px;" width="310" height="175"><s class="ty-card-video"></s></a></div>',
        '</div>',
        '<div class="ty-card-r" style="width: 320px;">',
        '<h3 class="ty-card-tt" style="padding-top:16px;padding-left: 20px;"><a href="' + data.url + '" target="_blank">' + data.title + '</a></h3>',
        '</div>',
        logo_ico,
        '</div>'].join('');
    break;

    case 13:
    htmlStr = [
    '<div class="ty-card ty-card-type3 clearfix" data-info="' + data.info + '" data-cre=' + data.cre + '">',
    '<h3 class="ty-card-tt"><a href="' + data.url + '" target="_blank">' + data.title + '</a></h3>',
    '<div class="ty-card-thumbs-w">',
    '<div class="ty-card-thumbs-c" style="vertical-align: middle;"><a href="' + data.url + '" target="_blank"><img width="150" height="100" src="' + data.images[0].u + '" alt="" class="ty-card-thumb"></a></div>',
    '<div class="ty-card-thumbs-c" style="vertical-align: middle;"><a href="' + data.url + '" target="_blank"><img width="150" height="100" src="' + data.images[1].u + '" alt="" class="ty-card-thumb"></a></div>',
    '<div class="ty-card-thumbs-c" style="vertical-align: middle;"><a href="' + data.url + '" target="_blank"><img width="150" height="100" src="' + data.images[2].u + '" alt=""  class="ty-card-thumb"></a></div>',
    '<div class="ty-card-thumbs-c" style="background-color: #7E7E7E;width: 150px;line-height: 100px;text-align: center;vertical-align: middle;"><div class="ty-card-thumb" style="cursor:pointer;"><a href="' + data.url + '" target="_blank" style="color:#FFF;font-size: 20px; font-weight: bold;">更多精彩</a></div></div>',
    '</div>',
    logo_ico,
    '</div>'].join('');
    break;

    case 14:
    htmlStr = [
        '<div class="ty-card ty-card-type1 clearfix" data-info="' + data.info + '" data-cre=' + data.cre + '">',
        '<div class="ty-card-l">',
        '<div class="ty-card-thumb-w" style="width: 310px;height: 155px;"><a href="' + data.url + '" target="_blank"><img src="' + data.img.u + '" alt="" class="ty-card-thumb" style="width:310px;height:155px;" width="310" height="155"></a></div>',
        '</div>',
        '<div class="ty-card-r" style="width:320px;">',
        '<h3 class="ty-card-tt" style="padding-top:16px;padding-left: 20px;"><a href="' + data.url + '" target="_blank">' + data.title + '</a></h3>',
        '</div>',
        logo_ico,
        '</div>'].join('');
    break;

    default :
    break;
}

document.getElementsByClassName('cardlist-a__list')[0].innerHTML = htmlStr;