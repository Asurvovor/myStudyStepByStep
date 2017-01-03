/**
 * <meta name='sinaPlistaAD' content='{"article":"true","articleID":"artibody","video":"true","photos":"true","photosID":"entHdPic_1_0","buttonPDPS":"文章内按钮PDPS","plistaPDPS":"plista素材投放PDPS"}'>
 content参数说明：
 var example = {
        "article": "true",  //是否要过滤此文章 true/false
        "articleID": "artibody",  //文章正文内容容器ID
        "video": "true",  //文章正文是否有视频 true/false
        "photos": "true",  //文章正文是否有组图 true/false
        "photosID": "entHdPic_1_0",  //填写组图容器ID,没有组图可为空
        "buttonPDPS": "PDPS000000044086",  //文章正文里按钮广告的PDPS
        "plistaPDPS": ""  //plista素材投放的PDPS
    };
 * 筛选符合条件的文章插入广告
 * @author sola (leitao3[at]staff.sina.com.cn)
 */
(function sinaplistaAD() {
    "use strict";
    //文章内定义好的meta标签
    var requirement = document.getElementsByTagName('meta').sinaPlistaAD.content;
    var obj = eval("(" + requirement + ")");
    var article = obj.article,
        articleID = obj.articleID,
        video = obj.video,
        photos = obj.photos,
        photosID = obj.photosID,
        buttonPDPS = obj.buttonPDPS,
        plistaPDPS = obj.plistaPDPS;
    var ARTICLE_MIN_HEIGHT = 1000;  //文章高度要满足最小高度
    var element;
    //文章是否过滤
    if (article === "true") {
        return;
    } else {
        //文章内如果有视频过滤掉
        if (video === "true") {
            return;
        }
        else {
            //判断是否满足其他条件
            var articleDOM = document.getElementById(articleID);
            var articleDOM_clientHeight = articleDOM.clientHeight;
            var articleDOM_offsetTop = articleDOM.offsetTop;
            var default_frequency = 0;
            var buttonADoffsetTop;

            var items = articleDOM.getElementsByTagName("ins");
            for (var i = 0; i < items.length; i++) {
                if (items[i].getAttribute("data-ad-pdps") === buttonPDPS) {
                    element = items[i];
                    break;
                }
            }
            if(typeof element === "undefined"){
                return;
            }
            else{
                var elementParent = element.parentNode;
            }

            //取文章内左下画中画广告offsettop,因广告是异步加载,所以这块有用settimeout
            var timer = function () {
                return setTimeout(function () {
                    var elementChild = element.children;
                    if (elementChild.length === 0) {
                        if (default_frequency >= 4) {
                            clearTimeout(timer);
                            buttonADoffsetTop = 0;
                        }
                        else {
                            default_frequency += 1;
                            return timer();
                        }
                    } else {
                        clearTimeout(timer);
                        buttonADoffsetTop = elementParent.offsetTop;
                    }
                    //文章内左下画中画广告到文章结尾所占高度
                    var buttonAD_bottomHeight = buttonADoffsetTop > 0 ? articleDOM_clientHeight + articleDOM_offsetTop - buttonADoffsetTop : buttonADoffsetTop;
                    //判断文章高度是否满足展示要求
                    if (ARTICLE_MIN_HEIGHT > articleDOM_clientHeight - buttonAD_bottomHeight) {
                        return;
                    } else {
                        var articleChild = articleDOM.children;
                        var num;
                        //得到第一次大于高度要求的下标
                        for (var i = 0; i < articleChild.length; i++) {
                            if (articleChild[i].offsetTop - articleDOM_offsetTop > ARTICLE_MIN_HEIGHT) {
                                num = i;
                                break;
                            }
                        }
                        //判断下标DOM和下标-1的DOM谁离要求高度值最近
                        var arrMIN_num = 1000 - (articleChild[num - 1].offsetTop - articleDOM_offsetTop);
                        var arrMAX_num = articleChild[num].offsetTop - articleDOM_offsetTop - 1000;
                        var articleChild_num = arrMIN_num > arrMAX_num ? num : num - 1;

                        var sinaPlistaAD_ins = document.createElement("ins");
                        var sinaPlistaAD_script = document.createElement("script");
                        sinaPlistaAD_ins.className = "sinaads";
                        sinaPlistaAD_ins.id = "Sina_Plista_AD";
                        sinaPlistaAD_ins.setAttribute("data-ad-pdps", plistaPDPS);
                        sinaPlistaAD_ins.setAttribute("data-ad-status", "async");
                        sinaPlistaAD_script.text = '(sinaads = window.sinaads || []).push({element: document.getElementById("Sina_Plista_AD")});';

                        //从符合要求的下标开始循环找到符合的DOM节点
                        for (var j = articleChild_num; j < articleChild.length; j++) {
                            if (photos === "true") {
                                if (articleChild[j].className.indexOf("img_wrapper") === -1 && articleChild[j].id.indexOf(photosID) === -1 && articleChild[j].id.indexOf(elementParent.id) >= 0 || articleChild[j].tagName.toLowerCase() === "p") {
                                    articleDOM.insertBefore(sinaPlistaAD_ins, articleChild[j]);
                                    articleDOM.insertBefore(sinaPlistaAD_script, articleChild[j]);
                                    return;
                                }
                            } else {
                                if (articleChild[j].className.indexOf("img_wrapper") === -1 && articleChild[j].id.indexOf(elementParent.id) >= 0 || articleChild[j].tagName.toLowerCase() === "p") {
                                    articleDOM.insertBefore(sinaPlistaAD_ins, articleChild[j]);
                                    articleDOM.insertBefore(sinaPlistaAD_script, articleChild[j]);
                                    return;
                                }
                            }
                        }
                    }
                }, 500);
            };
            timer();
        }
    }
})();