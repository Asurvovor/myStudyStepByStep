(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";

    var AnimationInterval = 2000;
    function ShopWindowMedia (element, config) {

        this.config = config;
        this.content = config.content;
        this.len = this.content.length;
        var stageWidth = this.stageWidth = config.width - 30;
        /**
         * [wrapKey 为样式加上id选择器，因为页面中的样式很容易覆盖设定样式]
         * @param  {[type]} id     [pdps 也是容器ID]
         * @param  {[type]} styles [样式]
         * @return {[type]}        [包装后样式]
         */
        function wrapKey(id, styles) {
            var ret = {};
            sinaadToolkit.object.map(styles, function (value, key) {
                ret[id+key] = value;
            });
            return ret;
        }
        sinaadToolkit.page.injectStyles(wrapKey('#'+config.pdps, {
            '.sinaads-shopwindow': 'position:relative;overflow:hidden;width:' + config.width + 'px;height:' + config.height + 'px;',
            '.sinaads-shopwindow .aside': 'position:absolute;width:30px;height:86px;padding:2px 0 0;font:12px/14px "Microsoft YaHei";text-align:center;border:1px solid #ccc;',
            '.sinaads-shopwindow .indicator': 'margin:0px;padding:0px;list-style:none;',
            '.sinaads-shopwindow .indicator li': 'display:block;width:17px;height:14px;padding-top:3px;margin:2px auto;border-radius:10px;color:#999;background:#eee;cursor:pointer;',
            '.sinaads-shopwindow .indicator li.active': 'background:red;color:white;',
            '.sinaads-shopwindow .stage': 'position:absolute;width:' + stageWidth + 'px;height:90px;left:30px;overflow:hidden;',
            '.sinaads-shopwindow .item': 'display:none;position:absolute;top:0;left:0;width:' + stageWidth + 'px;height:90px;transition:top .5s;',
            '.sinaads-shopwindow .item.active': 'display:block;top:0px;',
            '.sinaads-shopwindow .item.next': 'display:block;top:90px;',
            '.sinaads-shopwindow .item.active.top': 'top:-90px;'
        }));
        
        var container = document.createElement('div');
        container.className = 'sinaads-shopwindow';
        container.id = config.pdps;
        element.appendChild(container);
        element.style.cssText += ';text-decoration:none;';
        
        var aside = document.createElement('div');
        aside.className = 'aside';
        var tips = document.createElement('span');
        tips.innerHTML = '猜你喜欢';
        aside.appendChild(tips);
        this.indicator = this.buildIndicator();
        aside.appendChild(this.indicator);
        container.appendChild(aside);

        this.stage = this.buildStage();
        container.appendChild(this.stage);

        this.index = 0;
        this.start();
    }

    ShopWindowMedia.prototype = {
        buildIndicator: function () {
            var i,
                len = this.content.length,
                me = this,
                htmlContent = '',
                indicator = document.createElement('ul');

            var fn = function (index) {
                return function (event) {
                    event.cancelBubble = true;
                    event.stopPropagation && event.stopPropagation();
                    me.slideTo(index);
                    me.stopAnimation = true;
                };
            };

            indicator.className = 'indicator';
            for (i = 0; i < len; i++) {
                htmlContent += '<li class="' + (i === 0 ? 'active': '') + '">' + (i + 1) + '</li>';
            }
            indicator.innerHTML = htmlContent;
            for (i = 0; i < len; i++) {
                sinaadToolkit.event.on(indicator.childNodes[i], 'mouseover', fn(i));
            }

            return indicator;
        },
        buildStage: function () {
            var stage,
                i,
                me = this,
                len = this.content.length,
                config = this.config,
                htmlContent = '',
                itemContent = '';

            stage = document.createElement('div');
            stage.className = 'stage';
            for (i = 0; i < len; i++) {
                itemContent = sinaadToolkit.ad.createHTML(
                    config.content[i].type[0],
                    config.content[i].src[0],
                    me.stageWidth,
                    config.height,
                    config.content[i].link[0],
                    config.content[i].monitor[0],
                    config.content[i].pv[0]
                );
                htmlContent += '<div class="item ' + (i === 0 ? 'active': '') + '">' + itemContent + '</div>';
            }
            stage.innerHTML = htmlContent;

            return stage;
        },
        start: function () {
            var me = this;
            var anmiation = function () {
                if (me.stopAnimation) {
                    return ;
                }
                var next = (me.index + 1) % me.len;
                me.slideTo(next);
                setTimeout(anmiation, AnimationInterval);
            };
            setTimeout(anmiation, AnimationInterval);
        },
        /**
         * [slideTo 切换轮播内容，]
         * @param  {Function} next [下个轮播索引]
         */
        slideTo: function (next) {
            var me = this,
                curIndex = this.index,
                curNode = this.stage.childNodes[curIndex],
                nextNode = this.stage.childNodes[next];
            if (next === curIndex) {
                return ;
            }
            if (this.sliding) { // 正在切换
                return ;
            }
            this.index = next;
            this.sliding = true;

            nextNode.className = 'item next';

            this.indicator.childNodes[curIndex].className = '';
            this.indicator.childNodes[next].className = 'active';
            setTimeout(function () {
                curNode.className = 'item active top';
                nextNode.className = 'item active';
            }, 0);
            setTimeout(function () {
                curNode.className = 'item';
                me.sliding = false;
            }, 500);
        }
    };

    sinaadToolkit.ShopWindowMedia = sinaadToolkit.ShopWindowMedia || ShopWindowMedia;
})(window, window.sinaadToolkit, window.sinaadsROC);