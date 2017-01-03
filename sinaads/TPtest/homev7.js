try { !
    function() {
        function e(e) {
            var t = 0;
            return t = e.indexOf("#"),
            t > 0 ? (T = e.substring(t), e.substring(0, t)) : (T = "", e)
        }
        function t(e) {
            for (var t = 0,
            i = 0,
            n = e;;) {
                if (t = n.indexOf("<"), i = n.indexOf(">", t), !(t >= 0 && i >= 0 && i > t)) break;
                n = n.substring(0, t) + n.substring(i + 1, n.length)
            }
            return n
        }
        function n() {
            if ("" != v) return v;
            var e = "",
            t = S.toLowerCase(),
            i = t.indexOf("sina.");
            if (i > 0) e = "sina.cn";
            else {
                var n = t.indexOf(".");
                if (! (n > 0)) return "";
                n += 1,
                i = t.indexOf("/", n),
                0 > i && (i = t.length),
                e = t.substring(n, i)
            }
            return v = e,
            e
        }
        function a(e) {
            var t = document.cookie.indexOf(e + "=");
            if ( - 1 == t) return "";
            t = document.cookie.indexOf("=", t) + 1;
            var i = document.cookie.indexOf(";", t);
            return 0 >= i && (i = document.cookie.length),
            ckValue = document.cookie.substring(t, i),
            ckValue
        }
        function s(e, t, i) {
            if (null != t) if (_suds_cmp_domainRoot = n(), "undefined" == i || null == i) document.cookie = e + "=" + t + "; domain=" + _suds_cmp_domainRoot + "; path=/";
            else {
                var a = new Date,
                s = a.getTime();
                s += 864e5 * i,
                a.setTime(s),
                s = a.getTime(),
                document.cookie = e + "=" + t + "; domain=" + _suds_cmp_domainRoot + "; expires=" + a.toUTCString() + "; path=/"
            }
        }
        function r() {
            if (ckTmp = a(g), "" == ckTmp) {
                var e = new Date;
                ckTmp = 1e13 * Math.random() + "." + e.getTime(),
                s(g, ckTmp)
            }
            return ckTmp
        }
        function o() {
            var t = Math.floor(100 * Math.random());
            if (! (f > t)) return 0;
            window.suda = !0,
            "" == _ && (_ = r(g)),
            "" == b && (b = a(w)),
            "" == x && (x = a(y));
            try {
                document.addEventListener ? (document.addEventListener("click", d, !1), window.addEventListener("load", u, !1)) : (document.attachEvent("onclick", d), window.attachEvent("onload", u))
            } catch(i) {}
            k = escape(e(window.document.referrer)),
            S = escape(e(window.document.URL))
        }
        function c(e, t, i) {
            var n = "";
            "undefined" != typeof sudaMapConfig.uId && (n = sudaMapConfig.uId),
            "undefined" != typeof sudaMapConfig.addRequestTime && (m = sudaMapConfig.addRequestTime),
            strSudsClickMapQuest = S + "|*|" + e + "|*|" + _ + "|*|" + b + "|*|" + k + "|*|" + p + "|*|" + n + "|*|" + x;
            var a = j + "?" + strSudsClickMapQuest,
            s = new Image;
            window.SUDAPIC = s,
            s.src = a;
            var r = t.toLocaleLowerCase();
            t && -1 == r.indexOf("javascript:") && setTimeout(function() {
                if (m) {
                    var e = (new Date).getTime(),
                    n = "user" + e + Math.random().toString().slice(2),
                    a = t.indexOf("?") > -1 ? "&": "?";
                    t = t + a + "clicktime=" + e + "&userid=" + n
                }
                "_blank" == i ? window.open(t + T) : location.href = t + T
            },
            200)
        }
        function l(e, t, i) {
            for (var n = 0; i > n; n++) {
                if (!e.parentNode || e == document) return null;
                if (e = e.parentNode, t == e.tagName) break
            }
            return n >= i ? null: e
        }
        function d(n) {
            var n = n || event,
            a = n.srcElement || n.target;
            if (null == a && a == document) return ! 1;
            var s = "",
            r = "",
            o = "",
            d = "",
            u = "";
            if ("A" == a.tagName) s = "txt",
            r = t(a.innerHTML),
            o = e(a.href),
            u = a.getAttribute("target"),
            d = a;
            else if ("IMG" == a.tagName) {
                s = "img",
                r = a.alt;
                var h = l(a, "A", 8);
                h && (o = e(h.href), u = a.getAttribute("target"), d = h)
            } else {
                s = "txt",
                r = t(a.innerHTML);
                var h = l(a, "A", 8);
                h && (o = e(h.href), u = h.getAttribute("target"), d = h)
            }
            var p = "",
            f = (a.tagName, "");
            try {
                for (i = 0; i < 10 && a != document; i++) {
                    var m = a.getAttribute("data-sudaclick");
                    if (m) {
                        p = m;
                        for (var g = a.getElementsByTagName("A"), v = 0; v < g.length; v++) if (g[v].innerHTML == d.innerHTML) {
                            f = v + 1;
                            break
                        }
                        break
                    }
                    if (!a.parentNode) break;
                    a = a.parentNode
                }
            } catch(_) {}
            if (p) {
                o && n.preventDefault(),
                r && r.length > 30 && (r = r.substr(0, 30));
                var w = new Date,
                y = w.getTime(),
                b = "t=" + s + ",s=" + r + ",h=" + escape(o) + ",ct=" + y + ",aid=" + p + "-" + f + "|";
                c(b, o, u)
            }
        }
        function u() {
            h(window)
        }
        function h(e) {
            for (var t = e.frames,
            i = 0; i < t.length; i++) try {
                "" != t[i].location && null != t[i].document && (document.addEventListener ? (t[i].document.removeEventListener("click", d, !1), t[i].document.addEventListener("click", d, !1)) : (t[i].document.detachEvent("onclick", d), t[i].document.attachEvent("onclick", d)), h(t[i]))
            } catch(n) {}
        }
        var p = 0,
        f = 100,
        m = !1,
        g = "Apache",
        v = "",
        _ = "",
        w = "ustat",
        y = "statuid",
        b = "",
        x = "",
        k = document.referrer,
        S = document.URL,
        j = "http://beacon.sina.com.cn/b.gif",
        T = "";
        "" == k && (k = "newpage"),
        window.suda_init = window.suds_init = function(e, t) {
            var i = arguments.length;
            i > 0 && (p = e, f = t, "function" == typeof window.getUserInfo ? window.getUserInfo(function(e) {
                e && e.uid && (window.sudaMapConfig.uId = e.uid),
                o()
            },
            !0) : o())
        },
        window.suda_count = window.suds_count = function(e) {
            if (!e.name) return ! 1;
            e.type || (e.type = "btn"),
            e.title || (e.title = ""),
            e.index || (e.index = 0),
            e.href || (e.href = "");
            var t = "",
            i = "",
            n = (new Date).getTime(),
            a = "t=" + e.type + ",s=" + e.title + ",h=" + escape(e.href) + ",ct=" + n + ",aid=" + e.name + "-" + e.index + "|";
            i = void 0 == e.target ? "": e.target,
            c(a, t, i)
        }
    } ()
} catch(e) {
    throw new Error(e + " http://mjs.sinaimg.cn/wap/public/suda/201512082000/suda_map.min.js")
}
suda_init(sudaMapConfig.pageId, 100);
try { !
    function(e, t) {
        function i(e, t, i) {
            i = i || !1;
            for (var n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) || i ? e[n] = t[n] : ""
        }
        var n = function() {
            function e(e) {
                return {
                    listener: [],
                    isLive: e || !1,
                    liveEvents: []
                }
            }
            function t(e, t) {
                var i = e.listener,
                n = !1,
                a = {};
                return n = !i.every(function(e) {
                    return e.func !== t ? !0 : (a = e, !1)
                }),
                n || (a = {
                    func: t,
                    liveIndex: 0
                },
                i.push(a)),
                a
            }
            var i = {};
            return {
                on: function(n, a, s) {
                    this.eventMap || (this.eventMap = {}),
                    i = this.eventMap;
                    var r = null,
                    s = s || !1;
                    if (i.hasOwnProperty(n) || (i[n] = e(s)), r = i[n], listenObj = t(i[n], a), s && r.liveEvents.length > 0 && listenObj.liveIndex < r.liveEvents.length) {
                        listenObj.liveIndex = r.liveEvents.length;
                        var o = listenObj.liveIndex,
                        c = r.liveEvents.length;
                        for (r.liveIndex = c; c > o; o++) r.func.apply(window, r.liveEvents[o])
                    }
                },
                trigger: function(t, n, a) {
                    var s = {};
                    this.eventMap || (this.eventMap = {}),
                    i = this.eventMap,
                    i.hasOwnProperty(t) ? (s = i[t], s.listener.forEach(function(e) {
                        try {
                            e.func.apply(window, n)
                        } catch(t) {
                            console.error && console.error(t)
                        }
                    }), a ? s.liveEvents.push(n) : "") : (s = i[t] = e("boolean" == typeof a ? a: !0), s.liveEvents.push(n))
                }
            }
        },
        a = {
            _log: function(e, t) {
                if (t = ("string" == typeof t ? t: JSON.stringify(t)) + " in " + (this._name || "default"), "err" === e) {
                    if (this._debug) return console.error(t);
                    throw new Error(t)
                } ( - 1 === ["debug", "log"].indexOf(e) || this._debug) && (e in console && "function" == typeof console[e] ? console[e](t) : console.log("[" + e + "]" + t))
            },
            _debug: !1,
            _name: "expose",
            _data: [],
            set _lock(e) {
                var t = this;
                switch (("array" !== this._type(e) || e.length < 2) && this._log("error", "set lock fail!"), "undefined" == typeof this._lockMap && (this._lockMap = {}), e[0]) {
                case "set":
                    if (this._lockMap.hasOwnProperty(e[1]) && this._lockMap[e[1]].val) return this._log("debug", "duplicate require lock " + e[1]),
                    !1;
                    this._log("debug", "get lock " + e[1]),
                    this._lockMap[e[1]] = {
                        val: !0,
                        timer: null
                    };
                    var i = "number" === this._type(e[2]) && e[2] || 1e3;
                    if (0 !== i) {
                        var n = e[1];
                        t._lockMap[n].timer = setTimeout(function() {
                            t._lockMap[n] && t._lockMap[n].val && (n._lockMap[n].val = !1)
                        },
                        i)
                    }
                    return ! 0;
                case "release":
                    if (this._lockMap.hasOwnProperty(e[1]) && this._lockMap[e[1]].val) return this._log("debug", "release lock " + e[1]),
                    this._lockMap[e[1]].val = !1,
                    clearTimeout(this._lockMap[e[1]].timer),
                    !0;
                    break;
                default:
                    this._log("warn", "unsupport lock method " + e[0])
                }
                return ! 1
            },
            get _lock() {
                return null
            },
            get _target() {
                return this._data
            },
            set _target(e) {
                if ("object" !== this._type(e)) return this._log("warn", "add target fail for error params! " + e),
                !1;
                if (this._log("debug", "add target!"), "undefined" == typeof this._data && (this._datas = []), e.node.getAttribute("data-" + this._name + "-nodeid")) return this._log("debug", "duplicate add target!"),
                !1;
                e.node.setAttribute("data-" + this._name + "-nodeid", 1);
                var t = {
                    cnf: e.cnf,
                    node: e.node,
                    active: !0
                };
                return this._data.push(t),
                !0
            },
            get _expose() {
                var e = [],
                t = this;
                return (this._lock = ["set", "getExpose"]) && (this._data.forEach(function(i) {
                    i && i.active && t.checkElemntDisp(i.node) && (e.push(i.node), (!i.cnf || !i.cnf.enableDup) && (i.active = !1))
                }), this._lock = ["release", "getExpose"]),
                e
            },
            set _expose(e) {
                return null
            },
            get guidUid() {
                var t = this._guid || null,
                i = this._uid || null;
                return t || "function" !== this._type(e.getCookie) || (t = e.getCookie("ustat"), this._guid = t),
                i || "object" !== this._type(e.userInfo) || (i = e.userInfo.uid || "", this._uid = i),
                (i || "") + "," + (t || "")
            },
            set guidUid(e) {
                return null
            }
        };
        a._type = function(e) {
            var t = typeof e;
            return "object" === t ? Object.prototype.toString.call(e).match(/\[object (.*)\]/) ? RegExp.$1.toLowerCase() : "other": t
        },
        a.checkElemntDisp = function(e, t) {
            var i = null;
            return t = t || 0,
            e && e.getBoundingClientRect ? (i = e.getBoundingClientRect(), i && "number" === this._type(i.top) && i.top > -t && i.top < a.viewHeight + t) : !1
        },
        i(a, new n);
        var s = t.documentElement;
        a.viewHeight = e.innerHeight || s.clientHeight || t.body.clientHeight || 0,
        a.on("resize",
        function(i, n) {
            a.viewHeight = e.innerHeight || s.clientHeight || t.body.clientHeight || 0
        }),
        e.addEventListener("onorientationchange" in e ? "orientationchange": "resize",
        function(e) {
            var t = navigator.userAgent; - 1 != t.toLowerCase().indexOf("xiaomi") ? setTimeout(function() {
                a.trigger("resize", ["event", e])
            },
            100) : setTimeout(function() {
                a.trigger("resize", ["event", e])
            },
            30)
        },
        !1),
        a.on("elemExposeAddItem",
        function(e, t, i) {
            if (void 0 !== t.length) for (var n = 0,
            s = t.length; s > n; n++) a._target = {
                node: t[n],
                cnf: {
                    enableDup: i || !1
                }
            };
            else a._target = {
                node: t,
                cnf: {
                    enableDup: i || !1
                }
            }
        });
        var r = 500,
        o = null,
        c = !1,
        l = !1;
        e.addEventListener("scroll",
        function(e) {
            o && clearTimeout(o),
            o = setTimeout(function() {
                if (c) l = !0;
                else {
                    for (c = !0, a.trigger("pageScroll", ["base", "first"]); l;) l = !1,
                    a.trigger("pageScroll", ["base", "repeat"]);
                    c = !1
                }
            },
            r)
        }),
        a.on("pageScroll",
        function() {
            var e = a._expose;
            a.trigger("elemExposeHappen", ["expose", e, a.guidUid])
        }),
        e.exposeObj = a
    } (window, document)
} catch(e) {
    throw new Error(e + " exposure.js")
}
try { !
    function(e, t, i) {
        "use strict";
        var n = function(e, t, i) {
            this.el = e,
            this.element = e.children[0],
            this.slides = this.element.children,
            this.sLength = this.slides.length,
            this.sumElement = document.querySelector(".j_slide_sum"),
            this.options = t || {},
            this.options = {
                curIndex: this.options.curIndex || 0,
                speed: this.options.speed || 300,
                auto: this.options.auto || 0,
                callback: this.options.callback || null,
                afterTouchStop: this.options.afterTouchStop || !1
            },
            this.autoTimer = 0,
            this.startStatus = {},
            this.endStatus = {},
            this.delta = {},
            this.slidePos = [],
            this.canSkip = !0,
            this.isScrollY,
            this.tab = i,
            this.init(),
            this.initEvents(),
            this.cardExpose(this.el),
            this.initExpose()
        };
        n.prototype = {
            handleEvent: function(e) {
                switch (e.type) {
                case "touchstart":
                    this.touchStart(e);
                    break;
                case "touchmove":
                    this.touchMove(e);
                    break;
                case "touchend":
                    this.touchEnd(e);
                    break;
                case "resize":
                    this.init()
                }
            },
            init: function() {
                this.width = this.el.getBoundingClientRect().width || this.el.offsetWidth,
                this.element.style.width = this.sLength * this.width + "px";
                for (var e = this.sLength; e--;) {
                    var t = this.slides[e];
                    t.style.width = this.width + "px",
                    t.style.left = e * -this.width + "px",
                    this.medium(e, this.width, 0)
                }
                this.medium(this.circle(this.options.curIndex - 1), -this.width, 0),
                this.medium(this.options.curIndex, 0, 0),
                this.medium(this.circle(this.options.curIndex + 1), this.width, 0),
                this.el.style.visibility = "visible",
                this.clearTimer(),
                this.setTimer(),
                this.setIndex(this.options.curIndex)
            },
            medium: function(e, t, i) {
                this.slidePos[e] = t,
                this.translate(e, t, i)
            },
            translate: function(e, t, i) {
                var n = this.slides[e];
                n.style.webkitTransitionDuration = i + "ms",
                n.style.webkitTransform = "translate3d(" + t + "px, 0, 0)"
            },
            circle: function(e) {
                return (this.sLength + e % this.sLength) % this.sLength
            },
            initEvents: function() {
                this.el.addEventListener("touchstart", this, !1),
                this.el.addEventListener("touchmove", this, !1),
                this.el.addEventListener("touchend", this, !1),
                e.addEventListener("resize", this, !1)
            },
            destroy: function() {
                this.el.removeEventListener("touchstart", this, !1),
                this.el.removeEventListener("touchmove", this, !1),
                this.el.removeEventListener("touchend", this, !1),
                window.removeEventListener("resize", this, !1),
                this.element.removeAttribute("style"),
                this.clearTimer();
                for (var e = 0,
                t = this.element.children.length; t > e; e++) this.element.children[e].removeAttribute("style")
            },
            touchStart: function(e) {
                var t = e.touches[0];
                this.startStatus = {
                    x: t.pageX,
                    y: t.pageY,
                    time: (new Date).getTime()
                },
                this.isScrollY = i,
                this.clearTimer()
            },
            touchMove: function(e) {
                if (! (e.touches.length > 1 || e.scale && 1 !== e.scale)) {
                    var t = e.touches[0];
                    this.endStatus = {
                        x: t.pageX,
                        y: t.pageY,
                        time: (new Date).getTime()
                    },
                    this.delta.x = this.endStatus.x - this.startStatus.x,
                    this.delta.y = this.endStatus.y - this.startStatus.y,
                    this.delta.time = this.endStatus.time - this.startStatus.time,
                    "undefined" == typeof this.isScrollY && (this.isScrollY = !!(this.isScrollY || Math.abs(this.delta.x) < Math.abs(this.delta.y))),
                    this.isScrollY || (e.preventDefault(), this.translate(this.circle(this.options.curIndex - 1), this.delta.x + this.slidePos[this.circle(this.options.curIndex - 1)], 0), this.translate(this.options.curIndex, this.delta.x + this.slidePos[this.circle(this.options.curIndex)], 0), this.translate(this.circle(this.options.curIndex + 1), this.delta.x + this.slidePos[this.circle(this.options.curIndex + 1)], 0)),
                    this.canSlide = !0
                }
            },
            touchEnd: function(e) {
                if (!this.isScrollY && this.canSlide) {
                    var t = !1; (Math.abs(this.delta.x) > this.width / 2 || this.delta.time < 250 && Math.abs(this.delta.x) > 20) && (t = !0, this.delta.x > 0 ? (this.medium(this.circle(this.options.curIndex + 1), this.width, this.options.speed), this.options.curIndex = this.circle(this.options.curIndex - 1)) : (this.medium(this.circle(this.options.curIndex - 1), -this.width, this.options.speed), this.options.curIndex = this.circle(this.options.curIndex + 1)), this.slideCallback(this.options.curIndex), this.setIndex(this.options.curIndex)),
                    this.medium(this.circle(this.options.curIndex - 1), -this.width, t && this.delta.x > 0 ? 0 : this.options.speed),
                    this.medium(this.options.curIndex, 0, this.options.speed),
                    this.medium(this.circle(this.options.curIndex + 1), this.width, t && this.delta.x < 0 ? 0 : this.options.speed),
                    this.options.afterTouchStop || this.setTimer()
                }
                this.canSlide = !1,
                this.loadHandle()
            },
            getDirection: function(e) {
                return (e - this.options.curIndex) * (Math.abs(e - this.options.curIndex) > this.sLength / 2 ? -1 : 1) > 0 ? 1 : -1
            },
            goTo: function(e) {
                if (this.options.curIndex != e && this.canSkip) {
                    this.canSkip = !1,
                    e = this.circle(e);
                    var t = this.getDirection(e);
                    this.translate(e, t * this.width, 0);
                    var i = this;
                    setTimeout(function() {
                        i.medium(i.options.curIndex, -t * i.width, i.options.speed),
                        i.medium(e, 0, i.options.speed),
                        i.options.curIndex = e
                    },
                    0),
                    setTimeout(function() {
                        i.medium(i.circle(e - 1), -i.width, 0),
                        i.medium(i.circle(e + 1), i.width, 0),
                        i.canSkip = !0
                    },
                    i.options.speed),
                    this.slideCallback(e),
                    this.setIndex(e)
                }
            },
            next: function() {
                this.goTo(this.options.curIndex + 1),
                this.loadHandle()
            },
            setTimer: function() {
                if (this.options.auto) {
                    var e = this;
                    0 == this.autoTimer && (e.autoTimer = setInterval(function() {
                        e.next()
                    },
                    this.options.auto))
                }
            },
            clearTimer: function() {
                this.options.auto && (clearInterval(this.autoTimer), this.autoTimer = 0)
            },
            slideCallback: function(e) {
                this.options.callback && this.options.callback(e)
            },
            setIndex: function(e) {
                this.tab && (this.tab.innerHTML = e + 1)
            },
            loadHandle: function() {
                this.loadImg(this.circle(this.options.curIndex + 1)),
                this.loadImg(this.circle(this.options.curIndex - 1))
            },
            loadImg: function(e) {
                var t = this.slides[e].querySelector("img"),
                i = t.getAttribute("data-src");
                t && i && (t.src = i, t.removeAttribute("data-src"))
            },
            cardExpose: function(e) {
                e && exposeObj.trigger("elemExposeAddItem", ["sinaIndex", [e], !0])
            },
            initExpose: function() {
                var e = this;
                exposeObj.on("elemExposeHappen",
                function(t, i, n) {
                    try { - 1 == i.indexOf(e.el) ? e.clearTimer() : -1 != i.indexOf(e.el) && (e.lastTime = new Date, e.setTimer())
                    } catch(a) {
                        console.log(a)
                    }
                })
            },
            appendItemBatch: function(e) {
                if ("[object Array]" != toString.call(e)) return void appendItem(e.dom, e.pos);
                var t = !1;
                0 != this.autoTimer && "undefined" != this.autoTimer && (t = !0),
                t && this.clearTimer(),
                this.sLength += e.length,
                this.sumElement.innerHTML = this.sLength,
                this.element.style.width = this.sLength * this.width + "px";
                for (var i = (e.filter(function(e) {
                    return parseInt(e.pos) > this.options.curIndex
                }).sort(function(e, t) {
                    return parseInt(t.pos) - parseInt(e.pos)
                }).forEach(function(t) {
                    this.element.appendChild(e[t].dom)
                }), e.filter(function(e) {
                    return parseInt(e.pos) <= this.options.curIndex
                }).sort(function(e, t) {
                    return parseInt(e.pos) - parseInt(t.pos)
                }).forEach(function(t) {
                    this.element.insertBefore(e[t].dom, this.slides[e[t].pos])
                }), this.sLength); i >= this.options.curIndex && i--;) {
                    var n = this.slides[i];
                    n.style.width = this.width + "px",
                    n.style.left = i * -this.width + "px",
                    this.medium(i, this.width, 0)
                }
                this.medium(this.circle(this.options.curIndex - 1), -this.width, 0),
                this.medium(this.options.curIndex, 0, 0),
                this.medium(this.circle(this.options.curIndex + 1), this.width, 0),
                t && this.setTimer()
            },
            appendItem: function(e, t) {
                var i = !1;
                0 != this.autoTimer && "undefined" != this.autoTimer && (i = !0),
                i && this.clearTimer(),
                this.sLength += 1,
                this.sumElement.innerHTML = this.sLength,
                this.element.style.width = this.sLength * this.width + "px",
                this.sLength - 1 >= parseInt(t) ? this.element.insertBefore(e, this.slides[t]) : this.element.appendChild(e);
                for (var n = this.sLength; n >= this.options.curIndex && n--;) {
                    var a = this.slides[n];
                    a.style.width = this.width + "px",
                    a.style.left = n * -this.width + "px",
                    this.medium(n, this.width, 0)
                }
                this.medium(this.circle(this.options.curIndex - 1), -this.width, 0),
                this.medium(this.options.curIndex, 0, 0),
                this.medium(this.circle(this.options.curIndex + 1), this.width, 0),
                i && this.setTimer(),
                this.loadHandle()
            }
        },
        window.initXwipe = function() {
            var e = t.getElementById("j_imgSlide"),
            i = t.getElementById("j_topSlide_index"),
            a = {
                auto: 3e3,
                curIndex: 0,
                speed: 300,
                afterTouchStop: !1
            };
            window.xwipe = new n(e, a, i)
        },
        window.initXwipe()
    } (window, document)
} catch(e) {
    throw new Error(e + " xwipe.js")
}
try {
    var sinaSax = function() {
        "use strict";
        var e = {
            saxType: {},
            sax: [{
                "class": "j_sax",
                url: "http://sax.sina.cn/wap/impress",
                id: "id",
                pv: "content-0-pv",
                data: "ad",
                urlFix: function() {
                    return "&rotate_count=" + parseInt(isNaN(e.storage.getMode("sax_wap")) ? 1e3 * Math.random() : e.storage.get("sax_wap"))
                }
            },
            {
                "class": "j_native",
                url: "http://sax.sina.cn/native/impress",
                id: "pdps",
                pv: "pvmonitor",
                urlFix: function() {
                    return "&rotate_count=" + parseInt(isNaN(e.storage.getMode("sax_native")) ? 1e3 * Math.random() : e.storage.get("sax_native"))
                }
            }],
            previewed: !1,
            init: function() {
                if ( - 1 == window.location.href.indexOf("wm=3206")) {
                    for (var e, t = 0,
                    i = this.sax.length; i > t; t++) this.sax[t].pdpsArr = [],
                    this.sax[t].pdpsNodes = this.sax[t].pdpsNodes || [],
                    this.sax[t].pdpsStr = this.sax[t].pdpsStr || [],
                    this.sax[t].pdpsNodes.push(this.getValidClass(this.getClass(this.sax[t]["class"]))),
                    e = this.sax[t].pdpsNodes.length - 1,
                    this.sax[t].pdpsStr.push(this.getPdpsArr(this.sax[t].pdpsNodes[e]));
                    this.creatPvElement(),
                    this.getSaxType(),
                    this.ajaxHandle(e),
                    location.hash.indexOf("preview") + 1 && setTimeout(this.preview.call(this), 300)
                }
            },
            preview: function() {
                if (!this.previewed) {
                    this.previewed = !0;
                    var e = decodeURIComponent(location.hash.substring(1)).split("|");
                    if (e[0] = e[0].split("=")[1], e[0] && e[3]) {
                        var t = "http://sax.sina.cn/wap/preview?adunit_id=" + e[0] + "&date=" + e[1] + "&ip=" + e[2] + "&deid=" + e[3] + "&rotate_count=" + parseInt(1e3 * Math.random()) + "&page_url=" + encodeURIComponent(window.location.href) + "&version=vt4&timestamp=" + Date.now();
                        this.previewArr = e,
                        this.jsonp(t, this.previewCallback)
                    } else alert("鍙傛暟閿欒")
                }
            },
            previewCallback: function(e, t, i, n) {
                e.ad ? n.previewData = e.ad[0] : alert("娌℃湁棰勮鏁版嵁")
            },
            insertPreview: function(e, t, i) {
                if (this.previewData) try {
                    t.innerHTML = this.jsTemplate(e, this.previewData),
                    i && i()
                } catch(n) {
                    this.callback("error", n)
                } else {
                    var a = this;
                    setTimeout(function() {
                        a.insertPreview(e, t, i)
                    },
                    500)
                }
            },
            creatPvElement: function() {
                var e = "sax_pv_count";
                document.getElementById(e) ? this.pvBox = document.getElementById(e) : (this.pvBox = this.creatElement("div", {
                    id: e,
                    style: "display:none"
                }), document.body.appendChild(this.pvBox))
            },
            getClass: function(e) {
                return document.getElementsByClassName(e)
            },
            getValidClass: function(e) {
                for (var t = 0,
                i = e.length,
                n = []; i > t; t++)"loaded" !== e[t].getAttribute("loaded") && e[t].getAttribute("data-id") && e[t].getAttribute("sax-type") && (e[t].setAttribute("loaded", "loaded"), n.push(e[t]));
                return n
            },
            getCookie: function(e) {
                return void 0 == e || "" == e ? "": this.stringSplice(document.cookie, e, ";", "")
            },
            stringSplice: function(e, t, i, n) {
                if ("" == e) return "";
                n = "" == n ? "=": n,
                t += n;
                var a = e.indexOf(t);
                if (0 > a) return "";
                a += t.length;
                var s = e.indexOf(i, a);
                return a > s && (s = e.length),
                e.substring(a, s)
            },
            setCookie: function(e, t, i, n, a, s) {
                var r = [];
                if (r.push(e + "=" + escape(t)), i) {
                    var o = new Date,
                    c = o.getTime() + 36e5 * i;
                    o.setTime(c),
                    r.push("expires=" + o.toGMTString())
                }
                n && r.push("path=" + n),
                a && r.push("domain=" + a),
                s && r.push(s),
                document.cookie = r.join(";")
            },
            getRate: function(e) {
                return e.dataset.rate && this.getCookie(e.dataset.id) ? !1 : !0
            },
            setRate: function(e) {
                e.dataset.rate && this.setCookie(e.dataset.id, 1, 24 * (e.dataset.rate - 0))
            },
            getPdpsArr: function(e) {
                for (var t = [], i = 0, n = e.length; n > i; i++) t.push(e[i].getAttribute("data-id"));
                return t.join(",")
            },
            ajaxHandle: function(e) {
                for (var t = 0,
                i = this.sax.length; i > t; t++) if (this.sax[t].pdpsStr[e]) {
                    var n = this.sax[t].url + "?adunit_id=" + this.sax[t].pdpsStr[e] + "&page_url=" + encodeURIComponent(window.location.href) + "&timestamp=" + Date.now();
                    n += this.sax[t].urlFix(),
                    this.setRotateCount(n),
                    this.jsonp(n, this.callbackHandle, t, e, this.completeHandle, 1e4)
                }
            },
            getSaxType: function() {
                var e = 0,
                t = function() {
                    for (var t = document.getElementsByTagName("script"), i = 0, n = t.length; n > i; i++) {
                        var a = t[i].getAttribute("sax-type");
                        if (a && !this.saxType.hasOwnProperty(a)) {
                            var s = "sax_template_" + e++;
                            t[i].id = s,
                            this.saxType[a] = s
                        }
                    }
                };
                return t
            } (),
            insertSucc: function(e) {
                if (window.insertSucc) for (var t = 0; t < insertSucc.length; t++) insertSucc[t](e)
            },
            completeHandle: function() {
                console.log('complete');
                e.callback("completeFunc")
            },
            callbackHandle: function(e, t, i, n) {
                console.log('callback');
                var a = n.sax[t].pdpsStr[i].split(","),
                s = [];
                e = n.formatData(e, t, "data"),
                n.sax[t].pdpsArr[i] = a;
                for (var r = 0,
                o = e.length; o > r; r++) !
                function(r) {
                    var o = a.indexOf(e[r][n.sax[t].id]),
                    c = n.getTemplateScriptId(t, i, o),
                    l = n.sax[t].pdpsNodes[i][o];
                    if (c) try {
                        n.previewArr && n.previewArr[0] === l.getAttribute("data-id") ? (n.insertPreview(c, l,
                        function() {
                            n.callback("insertSucc", [l])
                        }), n.previewArr = []) : (l.innerHTML = n.jsTemplate(c, e[r]), s.push(o), n.sendPv(e[r], t), n.getRate(l) && (n.insertSucc([l]), n.callback("insertSucc", [l]), n.setRate(l)))
                    } catch(d) {
                        n.callback("error", [d])
                    } else s.push(o),
                    n.getRate(l) && (n.callback("proxy", [l, e[r]]), n.setRate(l)),
                    n.sendPv(e[r], t);
                    n.deeplink(e[r], l)
                } (r);
                for (var c = 0,
                l = a.length; l > c; c++) - 1 === s.indexOf(c) && n.callback("nullData", [n.sax[t].pdpsNodes[i][c]])
            },
            clearNoneDataPdpsLock: function(e, t) {
                for (var i = this.sax[e].pdpsNodes[t], n = 0, a = i.length; a > n; n++) ! i[n].innerHTML && this.isBlank(i[n].innerHTML) && i[n].removeAttribute("loaded")
            },
            listener: {},
            bind: function(e, t) {
                this.listener.hasOwnProperty(e) || (this.listener[e] = []),
                this.listener[e].push(t)
            },
            callback: function(e, t) {
                if (this.listener.hasOwnProperty(e)) for (var i = 0,
                n = this.listener[e].length; n > i; i++) this.listener[e][i].apply(this, t)
            },
            deeplink: function(t, i) {
                if ("undefined" != typeof t.content && t.content.length > 0) for (var n = t.content,
                a = null,
                s = i.children[0], r = 0, o = n.length; o >= r; r++) !
                function(t) {
                    if ("undefined" == typeof n[t] && (a = t), t != a && "undefined" != typeof n[t].type && n[t].type.indexOf("deeplink") > -1) {
                        var i = n[t].src,
                        r = n[t].link;
                        s.addEventListener("click",
                        function(t) {
                            t.preventDefault(),
                            e.huqiFunc(i, r)
                        },
                        !1)
                    }
                } (r)
            },
            huqiFunc: function(e, t) {
                for (var i = null,
                n = 0,
                a = e.length; a >= n; n++)"undefined" != typeof e[n] && e[n].indexOf("sinaweibo") > -1 && (i = e[n], location.href = i);
                setTimeout(function() {
                    window.location.href = t
                },
                3e3)
            },
            sendPv: function(e, t) {
                for (var e = this.formatData(e, t, "pv"), i = 0, n = e.length; n > i; i++) {
                    var a = e[i];
                    if (a && !this.isBlank(a)) {
                        var s = this.creatElement("img", {
                            src: a
                        });
                        this.pvBox.appendChild(s)
                    }
                }
            },
            isBlank: function(e) {
                return /^\s*$/.test(e)
            },
            formatData: function(e, t, i) {
                if (this.sax[t][i]) for (var n = this.sax[t][i].split("-"), a = 0, s = n.length; s > a; a++) e = e[n[a]];
                return e
            },
            getTemplateScriptId: function(e, t, i) {
                var n = this.sax[e].pdpsNodes[t][i];
                return this.saxType[n.getAttribute("sax-type")]
            },
            creatElement: function(e, t) {
                var i = document.createElement(e);
                for (var n in t) i.setAttribute(n, t[n]);
                return i
            },
            setRotateCount: function(t) {
                var i = t.split("&"),
                n = i[i.length - 1].split("="),
                a = parseInt(n[1]);
                t.indexOf("sax.sina.cn/wap") > -1 ? e.storage.setMode("sax_wap", a + 1) : t.indexOf("sax.sina.cn/native") > -1 && e.storage.setMode("sax_native", a + 1)
            },
            storage: {
                setMode: function(e, t) {
                    try {
                        this.set("check", 1),
                        this.set(e, t)
                    } catch(i) {}
                },
                getMode: function(e) {
                    try {
                        return this.set("check", 1),
                        this.get(e)
                    } catch(t) {}
                },
                set: function(e, t) {
                    sessionStorage.setItem(e, parseInt(t))
                },
                get: function(e) {
                    return parseInt(sessionStorage.getItem(e))
                }
            },
            jsonp: function() {
                var e = 0,
                t = function(t, i, n, a, s, r) {
                    var o, c = e,
                    l = "sax_jsonpCallback_" + e++,
                    t = t + (t.indexOf("?") + 1 ? "&": "?") + "callback=" + l,
                    d = this.creatElement("script", {
                        src: t,
                        id: "sax_script_jsonp_" + c
                    }),
                    u = this;
                    window[l] = function(e) {
                        clearTimeout(o),
                        i(e, n, a, u),
                        s && s(),
                        document.getElementById("sax_script_jsonp_" + c).remove(),
                        window[l] = null
                    },
                    "undefined" != typeof r && (o = setTimeout(function() {
                        console.log('request timeout');
                        s && s(),
                        document.getElementById("sax_script_jsonp_" + c).remove(),
                        window[l] = null
                    },
                    r)),
                    document.body.appendChild(d)
                };
                return t
            } (),
            jsTemplate: function() {
                var e = {},
                t = function i(t, n) {
                    var a = /\W/.test(t) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + t.replace(/[\r\t\n]/g, " ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t(.*?)%>/g, "',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : e[t] = e[t] || i(document.getElementById(t).innerHTML);
                    return n ? a(n) : a
                };
                return t
            } ()
        };
        return e
    } ();
    setTimeout(function() {
        sinaSax.init()
    },
    100)
} catch(e) {
    throw new Error(e + " http://mjs.sinaimg.cn/wap/module/sina_sax/201602231006/js/sina_sax.min.js")
}
try { !
    function() {
        setTimeout(function() {
            function e(e) {
                for (var t = 0; t < e.length; t++) {
                    e[t].style.cssText += "display:block !important; visibility: visible !important;";
                    for (var i = e[t].children[0]; i;) {
                        var n = document.defaultView.getComputedStyle(i, null); ("none" == n.display || "block" == n.display) && (i.style.cssText += "display:block !important; visibility: visible !important;"),
                        i = i.children[0]
                    }
                }
            }
            e(document.querySelectorAll(".j_sax")),
            e(document.querySelectorAll(".j_native"))
        },
        500)
    } ()
} catch(e) {
    throw new Error(e + " svn:https://svn1.intra.sina.com.cn/wapcms/js/wap/trunk/module/sina_sax/201602231130/js/shielding.js")
}
try { !
    function(e, t) {
        "use strict";
        var i = {
            cloneObj: function(e) {
                var t, i = e.constructor === Array ? [] : {};
                if ("object" == typeof e) {
                    if (window.JSON) t = JSON.stringify(e),
                    i = JSON.parse(t);
                    else for (var n in e) i[n] = "object" == typeof e[n] ? cloneObj(e[n]) : e[n];
                    return i
                }
            },
            hasClass: function(e, t) {
                var i = !1;
                return e.classList.contains(t) && (i = !0),
                i
            },
            removeClass: function(e, t) {
                e.classList.contains(t) && e.classList.remove(t)
            },
            addClass: function(e, t) {
                e.classList.add(t)
            },
            toggleClass: function(e, t) {
                e.classList.contains(t) ? e.classList.remove(t) : e.classList.add(t)
            },
            creatElement: function(e, i) {
                var n = t.createElement(e);
                for (var a in i) n.setAttribute(a, i[a]);
                return n
            },
            outerHTML: function(e) {
                var t = i.creatElement("div", {});
                return t.appendChild(e),
                t.innerHTML
            },
            insertAfter: function(e, t) {
                var i = t.parentNode;
                i.lastChild == t ? i.appendChild(e) : i.insertBefore(e, t.nextSibling)
            },
            getWinWidth: function() {
                return e.innerWidth || t.docElement.clientWidth || t.body.clientWidth || 0
            },
            getWinHeight: function() {
                return e.innerHeight || t.docElement.clientHeight || t.body.clientHeight || 0
            },
            isEmptyObj: function(e) {
                for (var t in e) if (e.hasOwnProperty(t)) return ! 1;
                return ! 0
            },
            hasData: function(e) {
                return ! e || "[object Array]" === Object.prototype.toString.call(e) && !e.length || "[object Object]" === Object.prototype.toString.call(e) && this.isEmptyObj(e) ? !1 : !0
            },
            ajax: function(e, t, i, n) {
                function a() {
                    4 == s.readyState && 200 == s.status && (clearTimeout(r), t && t(JSON.parse(s.responseText), i))
                }
                var s = null,
                r = -1;
                window.ActiveXObject ? s = new ActiveXObject("Microsoft.XMLHTTP") : window.XMLHttpRequest && (s = new XMLHttpRequest),
                null != s && (s.open("get", e, !0), s.send(null), s.onreadystatechange = a),
                r = setTimeout(function() {
                    s.onreadystatechange = null,
                    t && t(null, i)
                },
                n || 3e3)
            },
            jsonp: function(e, t, n) {
                var a = {
                    timestamp: Date.now()
                },
                s = "callback",
                r = 3e3,
                o = "jsonp_" + Math.random();
                o = o.replace(".", ""),
                window[o] = function(a) {
                    clearTimeout(p),
                    t && t(a, n, e, t),
                    h.removeChild(u),
                    window[o] = null,
                    i.trigger("afterJSONP")
                },
                a[s] = o,
                -1 == e.indexOf("?") && (e += "?");
                var c = [];
                for (var l in a) c.push(l + "=" + encodeURIComponent(a[l]));
                var d = "&" + c.join("&"),
                u = document.createElement("script");
                u.src = e + d;
                var h = document.getElementsByTagName("head")[0];
                if (h.appendChild(u), r) var p = setTimeout(function() {
                    h.removeChild(u),
                    window[o] = function() {},
                    i.jsonp2(e, t, n)
                },
                r)
            },
            jsonp2: function(e, t, n) {
                console.log("jsonp2 called....");
                var a = {
                    timestamp: Date.now()
                },
                s = "callback",
                r = 2e3,
                o = "jsonp_" + Math.random();
                o = o.replace(".", ""),
                window[o] = function(a) {
                    clearTimeout(p),
                    t && t(a, n, e, t),
                    h.removeChild(u),
                    window[o] = null,
                    i.trigger("afterJSONP")
                },
                a[s] = o,
                -1 == e.indexOf("?") && (e += "?");
                var c = [];
                for (var l in a) c.push(l + "=" + encodeURIComponent(a[l]));
                var d = "&" + c.join("&"),
                u = document.createElement("script");
                u.src = e + d;
                var h = document.getElementsByTagName("head")[0];
                if (h.appendChild(u), r) var p = setTimeout(function() {
                    t && t({},
                    n, e),
                    h.removeChild(u),
                    window[o] = function() {},
                    i.trigger("afterJSONP")
                },
                r)
            },
            storage: {
                fastmode: 1,
                checkfastmode: function() {
                    try {
                        localStorage.setItem("checkfastmode", 1),
                        this.fastmode = 0
                    } catch(e) {}
                },
                set: function(e, t) {
                    localStorage.setItem(e, JSON.stringify(t))
                },
                get: function(e) {
                    return JSON.parse(localStorage.getItem(e))
                }
            },
            cookie: {
                set: function(e, t, i) {
                    var n = -1,
                    a = new Date;
                    Number(i) && (a.setTime(a.getTime() + 1e3 * i), n = a.toUTCString()),
                    document.cookie = e + "=" + t + "; expires=" + n
                },
                get: function(e) {
                    for (var t = e + "=",
                    i = document.cookie.split(";"), n = 0; n < i.length; n++) {
                        for (var a = i[n];
                        " " == a.charAt(0);) a = a.substring(1);
                        if ( - 1 != a.indexOf(t)) return a.substring(t.length, a.length)
                    }
                    return ""
                }
            },
            exchange: function(e, t) {
                var i = e.parentNode,
                n = t.parentNode,
                a = Array.prototype.indexOf.call(i.children, e),
                s = Array.prototype.indexOf.call(n.children, t);
                n.insertBefore(e, n.children[s]),
                i.insertBefore(t, i.children[a])
            },
            event: {},
            on: function(e, t) {
                this.event.hasOwnProperty(e) || (this.event[e] = []),
                this.event[e].push(t)
            },
            trigger: function(e, t) {
                if (this.event.hasOwnProperty(e)) for (var i = 0,
                n = this.event[e].length; n > i; i++) this.event[e][i].apply(this, t)
            },
            getSearchValue: function(e) {
                for (var t = location.search.substr(1), i = t.split("&"), n = "", a = 0, s = i.length; s > a; a++) {
                    var r = i[a].split("=");
                    r[0] == e && (n = r[1])
                }
                return n
            },
            readabilityNum: function(e) {
                return "number" == typeof e && e > 0 ? e > 9999999 ? "999涓�+": e > 9999 ? parseInt(e / 1e4) + "涓�": e: null
            },
            getRollNum: function(e, t) {
                var i = Math.floor(Math.random() * (t - e) + e);
                return i
            }
        };
        i.storage.checkfastmode(),
        e.sinaCnHome || (e.sinaCnHome = Object.create({},
        {
            S: {
                value: i
            }
        }))
    } (window, document)
} catch(e) {
    throw new Error(e + " utils.js")
}
try { !
    function(e, t) {
        "use strict";
        var i = e.sinaCnHome.S,
        n = {
            init: function() {
                this.initEvent()
            },
            initEvent: function() {
                this.checkXwipe(),
                this.showpic(),
                this.backToTop(),
                this.topNav(),
                this.tabNav(),
                e.addEventListener("DOMContentLoaded", this.fixHrefArgs, !1),
                e.addEventListener("load", this.fixHrefArgs, !1),
                e.addEventListener("resize", this.checkXwipe, !1)
            },
            checkXwipe: function() {
                var e = document.querySelector("#j_imgSlide");
                e.style.height = parseInt(document.documentElement.clientWidth) / 2 + "px"
            },
            fixHrefArgs: function() {
                function e(e) {
                    var t = {};
                    if (e) {
                        for (var i = e.split("&"), n = 0; n < i.length; n++) {
                            var a = i[n].split("=");
                            a && (t[a[0]] = a[1])
                        }
                        return t
                    }
                    return t
                }
                for (var t = document.querySelectorAll("a[href^=http]"), i = 0; i < t.length; i++) {
                    var n = t[i],
                    a = n.getAttribute("href"),
                    s = a.lastIndexOf("?"),
                    r = s > -1,
                    o = r ? a.slice(s + 1) : "",
                    c = e(o),
                    l = c.vt && "4" === c.vt,
                    d = c.pos && "108" === c.pos;
                    l && d || (a = r ? a: a + "?", a = l ? a: a + "&vt=4", a = d ? a: a + "&pos=108", a = a.replace("?&", "?"), n.setAttribute("href", a))
                }
            },
            showpic: function() {
                if (this.getPicType()) for (var e = document.querySelector("#j_card_yaowen"), t = e.querySelectorAll("dt"), i = 0; i < t.length; i++) {
                    t[i].classList.remove("hide");
                    var n = t[i].querySelector("img");
                    n.src = n.getAttribute("data-src")
                }
            },
            backToTop: function() {
                var i = t.getElementById("j_toTop"),
                n = 0,
                a = 0;
                e.addEventListener("scroll",
                function() {
                    t.body.scrollTop > 1.5 * e.innerHeight ? (i.style.display = "block", a && clearTimeout(a), a = setTimeout(function() {
                        i.style.display = "none"
                    },
                    3e3)) : i.style.display = "none",
                    n = t.body.scrollTop
                }),
                i.addEventListener("click",
                function() {
                    e.scrollTo(0, 0)
                },
                !1)
            },
            topNav: function() {
                var e = t.getElementById("j_top_nav").children,
                n = t.getElementById("j_toggle_nav"),
                a = 11,
                s = 23;
                n.addEventListener("click",
                function() {
                    for (var t = a,
                    r = s; r > t; t++) i.toggleClass(e[t], "hide");
                    i.toggleClass(n, "toggle_btn_down")
                },
                !1)
            },
            menuHandle: function() {
                var e = this,
                n = t.getElementById("j_menu"),
                a = t.querySelectorAll(".j_guide_btn");
                if (n.addEventListener("click",
                function() {
                    window.SUDA && SUDA.log && SUDA.log("", "", "menu"),
                    window.scrollTo(0, 1);
                    var n = t.getElementById("menu_iframe");
                    if (n) t.getElementById("menu_iframe").classList.add("blow"),
                    t.body.className += " f_fixed";
                    else {
                        var a = this.getAttribute("data-src") || "./menu",
                        s = i.creatElement("div", {
                            "class": "menu_iframe blow",
                            id: "menu_iframe"
                        }),
                        r = i.creatElement("iframe", {
                            "class": "",
                            id: ""
                        });
                        r.style.width = "100%",
                        r.style.height = "100%",
                        e.creatMenuShadow();
                        var o = new Date,
                        c = "" + o.getFullYear() + (o.getMonth() + 1) + o.getDate() + o.getHours() + o.getMinutes();
                        r.src = a + "?v=3&r=" + c,
                        r.onload = function() {
                            t.getElementById("menu_shadow").style.display = "none",
                            t.body.className += "f_fixed"
                        },
                        t.body.appendChild(s),
                        s.appendChild(r)
                    }
                },
                !1), a.length > 0) for (var s = 0; s < a.length; s++) a[s].addEventListener("click",
                function() {
                    i.toggleClass(this.parentNode.parentNode, "hide");
                },
                !1)
            },
            preventWinMove: function() {
                document.addEventListener("touchmove",
                function(e) {
                    e.preventDefault()
                },
                !1)
            },
            preventWinScroll: function() {
                t.body.scrollTop = 0
            },
            hideMenu: function(e) {
                t.getElementById("menu_iframe").classList.remove("blow"),
                t.body.className = t.body.className.replace(/f_fixed/g, ""),
                e.length && this.distributionChange(e)
            },
            creatMenuShadow: function() {
                var e = i.creatElement("div", {
                    "class": "iframe_shadow",
                    id: "menu_shadow"
                });
                e.innerHTML = '<div class="loading"></div>',
                t.body.appendChild(e)
            },
            distributionChange: function(t) {
                t.indexOf("NPIC") + 1 && e.location.reload(),
                t.indexOf("RSORT") + 1 && e.location.reload()
            },
            picConfChange: function() {
                var e = i.cookie.get("NPIC"),
                n = t.querySelectorAll(".j_channel_sort_module .f_card"),
                a = 0,
                s = n.length;
                if (0 === e) for (; s > a; a++) n[a].hasAttribute("data-img") && n[a].getAttribute("data-img") && !n[a].children[0].classList.contains("f_card_dt") && n[a].insertAdjacentHTML("afterBegin", '<dt class="f_card_dt"><img src="' + n[a].getAttribute("data-img") + '" alt="' + n[a].getAttribute("data-title") + '"></dt>');
                else for (; s > a; a++) n[a].children[0].classList.contains("f_card_dt") && n[a].children[0].remove()
            },
            getPicType: function() {
                return null === i.cookie.get("NPIC") || 0 == i.cookie.get("NPIC") ? !0 : !1
            },
            setPicStorage: function(e, t) {
                i.cookie.set(e, t)
            },
            getPicStorage: function(e) {
                return i.cookie.get(e)
            },
            guide: function() {
                if ( - 1 == window.location.href.indexOf("sou=weibo") && !(i.storage.get("main_guide") - 0)) try {
                    localStorage.test = 1;
                    var e = [];
                    e.push('<div class="guide_menu_box"><img id="j_menu_btn" src="http://mjs.sinaimg.cn/wap/homev7/201509232040/images/menu_btn.png" alt="" class="menu_cbtn" /></div>'),
                    e.push('<div class="guide_info_box"><img src="http://mjs.sinaimg.cn/wap/homev7/201509232040/images/menu_persion_btn.png" alt="" class="guide_info"><a href="javascript:;" class="guide_btn j_guide_btn"><img src="http://mjs.sinaimg.cn/wap/homev7/201509232040/images/guide_btn_1.png"></a></div>');
                    var t = document.createElement("section");
                    t.className = "guide_page j_guide_page",
                    t.innerHTML = e.join(""),
                    document.querySelector("body").appendChild(t),
                    t.addEventListener("click",
                    function() {
                        t.style.display = "none"
                    },
                    !1),
                    document.querySelector("#j_menu_btn").addEventListener("click",
                    function() {
                        document.querySelector("#j_menu a").click()
                    },
                    !1),
                    i.storage.set("main_guide", 1)
                } catch(n) {}
            },
            tabNav: function() {
                var e = this;
                if (document.querySelector(".j_scroll_tab")) var t = document.querySelector(".j_scroll_tab");
                else {
                    var t = document.createElement("section");
                    t.className = "new_tab_fixed j_scroll_tab hide",
                    document.querySelector("body").appendChild(t)
                }
                this.fnTabFixed(t),
                window.addEventListener("scroll",
                function() {
                    e.fnTabFixed(t)
                },
                !1)
            },
            fnTabFixed: function(e) {
                var t = document.querySelectorAll(".card_module"),
                i = document.querySelector(".j_scroll_tab");
                if (0 != t.length) {
                    var n = this.getCurIndex();
                    if (n >= 0) {
                        i.classList.remove("hide"),
                        i.innerHTML = t[n].children[0].outerHTML;
                        var a = t[n].getAttribute("data-sudaclick");
                        a ? i.setAttribute("data-sudaclick", a) : i.removeAttribute("data-sudaclick")
                    } else i.classList.add("hide")
                }
            },
            getCurIndex: function() {
                for (var e = document.querySelectorAll(".card_module"), t = 0; t < e.length; t++) if (e[t].children[0] && e[t].children[0].classList.contains("f_md_tit")) {
                    var i = e[t].children[0].offsetTop;
                    if (e[t].getBoundingClientRect().top <= 0 && e[t].getBoundingClientRect().bottom >= 87 && this.getWinScrollHeight() > i) return t
                }
                return - 1
            },
            getWinScrollHeight: function() {
                return document.documentElement.scrollTop || document.body.scrollTop
            }
        };
        Object.defineProperty(e.sinaCnHome, "misc", {
            value: n
        }),
        e.sinaCnHome.misc.init()
    } (window, document)
} catch(e) {
    throw new Error(e + " misc.js")
}
try { !
    function(e, t) {
        "use strict";
        var i = function(e, t) {
            this.el = e,
            this.element = this.el.children,
            this.speed = t || 3e3,
            this.length = this.element.length,
            this.height = this.element[0].offsetHeight,
            this.timer = 0,
            this.index = 0,
            this.init()
        };
        i.prototype = {
            init: function() {
                var e = this.length;
                if (1 != e) {
                    for (; e--;) {
                        this.element[e];
                        e ? this.translate(e, this.height, 0) : this.translate(e, 0, 0)
                    }
                    this.setTimer()
                }
            },
            translate: function(e, t, i) {
                var n = this.element[e];
                n.style.webkitTransitionDuration = i + "ms",
                n.style.webkitTransform = "translate3d(0, " + t + "px, 0)"
            },
            getNext: function(e) {
                return e == this.length - 1 ? e = 0 : ++e
            },
            handle: function() {
                this.translate(this.index, -this.height, 500),
                this.index = this.getNext(this.index),
                this.translate(this.index, 0, 500);
                var e = this;
                setTimeout(function() {
                    e.translate(e.getNext(e.index), e.height, 0)
                },
                500)
            },
            setTimer: function() {
                var e = this;
                this.timer = setInterval(function() {
                    e.handle()
                },
                this.speed)
            }
        };
        var n = t.getElementById("j_news_scroll");
        if (n) var a = new i(n);
        Object.defineProperties(e.sinaCnHome, {
            newsScrollEle: {
                value: n
            },
            newsScroll: {
                value: a
            }
        })
    } (window, document)
} catch(e) {
    throw new Error(e + " news_scroll.js")
}
try { !
    function() {
        var e = new Date;
        if (2 == e.getDate() && e.getHours() < 17 && e.getHours() >= 8) {
            var t = [];
            t.push('<dl class="f_card"><dd class="f_card_dd">'),
            t.push('<h3 class="f_card_h3 ellipsis">vivo Xplay5鍙戝竷锛屽敭浠�3698璧�</h3>'),
            t.push('<a href="http://photo.sina.cn/album_5_22298_67497.htm?vt=4&sid=175645"><ul class="f_card_pic">'),
            t.push('<li><img src="http://n.sinaimg.cn/default/b4f710f5/20160302/1-188x140.jpg" alt=""></li>'),
            t.push('<li><img src="http://n.sinaimg.cn/default/b4f710f5/20160302/2-188X140.jpg" alt=""></li>'),
            t.push('<li><img src="http://n.sinaimg.cn/default/b4f710f5/20160302/3-188x140.jpg" alt=""></li>'),
            t.push("</ul></a>"),
            t.push('<dl class="f_a_card">'),
            t.push('<dt class="f_a_pic"><a href="http://all.vic.sina.com.cn/news/index.php?article=1539 "><img src="http://n.sinaimg.cn/default/b4f710f5/20160302/160x120.jpg" alt=""></a></dt>'),
            t.push('<dd class="f_a_text">'),
            t.push('<h4 class="f_a_list ellipsis"><a href="http://all.vic.sina.com.cn/news/index.php?article=1539 ">vivo Xplay5鍙戝竷锛屽敭浠�3698璧�</a></h4>'),
            t.push('<h4 class="f_a_list ellipsis"><a href="http://all.vic.sina.com.cn/news/index.php?article=1539 ">閰嶅鍙屾洸闈㈠睆锛岄《绾х‖浠堕厤缃�</a></h4>'),
            t.push('<h4 class="f_a_list ellipsis"><a href="http://all.vic.sina.com.cn/news/index.php?article=1539 ">灏嗛噰鐢ㄩ珮閫�820澶勭悊鍣ㄦ惌閰�6GB鍐呭瓨</a></h4>'),
            t.push("</dd></dl></dd></dl>");
            var i = sinaCnHome.S.creatElement("div", {});
            i.innerHTML = t.join("");
            var n = document.querySelector("#j_card_yaowen");
            n.insertBefore(i, n.children[2])
        }
    } (),
    window.homePushs = [{
        cardModule: "yaowen",
        page: 0,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057683" data-pos="7"></div>'
    },
    {
        cardModule: "news",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057684" data-pos="3"></div>'
    },
    {
        cardModule: "news",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057685" data-pos="5"></div>'
    },
    {
        cardModule: "news",
        page: 2,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED01" data-pos="3"></div>'
    },
    {
        cardModule: "sports",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED02" data-pos="6"></div>'
    },
    {
        cardModule: "ent",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057686" data-pos="3"></div>'
    },
    {
        cardModule: "ent",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED03" data-pos="6"></div>'
    },
    {
        cardModule: "finance",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057687" data-pos="3"></div>'
    },
    {
        cardModule: "finance",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED04" data-pos="6"></div>'
    },
    {
        cardModule: "tech",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057688" data-pos="3"></div>'
    },
    {
        cardModule: "tech",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED05" data-pos="6"></div>'
    },
    {
        cardModule: "blog",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED07" data-pos="6"></div>'
    },
    {
        cardModule: "edu",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED08" data-pos="6"></div>'
    },
    {
        cardModule: "fashion",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED06" data-pos="6"></div>'
    },
    {
        cardModule: "life",
        page: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="WAPINFEED09" data-pos="6"></div>'
    }],
    window.homePushsAfter = [{
        index: 1,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057778" data-index="1"></div>'
    },
    {
        index: 2,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057779" data-index="2"></div>'
    },
    {
        index: 3,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057780" data-index="3"></div>'
    },
    {
        index: 4,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057781" data-index="4"></div>'
    },
    {
        index: 10,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057782" data-index="10"></div>'
    },
    {
        index: 11,
        domHTML: '<div sax-type="proxy" class="j_native" data-id="PDPS000000057783" data-index="11"></div>'
    }],
    function(e, t) {
        function i(e) {
            if ("undefined" != typeof adBlock && adBlock && e) for (var t = 0; t < adBlock.length; t++) adBlock[t] == e.getAttribute("data-id") && e.classList.add("hide")
        }
        function n() {
            var e = document.getElementsByClassName("gif_tap");
            if ("undefined" != typeof e && 0 !== e.length) for (var t = 0; t < e.length; t++) e[t].addEventListener("click",
            function(e) {
                e.target.parentNode.className.indexOf("Gifing") > -1 ? location.href = e.target.parentNode.parentNode.parentNode.firstChild.getAttribute("href") : (e.target.parentNode.nextSibling.className = "f_card_pic_ad Gifing", e.target.parentNode.className = "f_card_pic_ad hide")
            },
            !0)
        }
        var a = null,
        s = {
            lz1X1: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz1X1.jpg",
            lz2X1: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz2X1.jpg",
            lz4X3: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz4X3.jpg",
            lz148X125: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz148X125.jpg"
        };
        sinaSax.bind("proxy",
        function(e, t) {
            switch (i(e), a = window.sinaCnHome.misc.getPicType(), parseInt(t.templateid)) {
            case 31:
                d.temp31(e, t);
                break;
            case 33:
                d.temp33(e, t);
                break;
            case 35:
                d.temp35(e, t);
                break;
            case 40:
                d.temp40(e, t);
                break;
            case 42:
                d.temp42(e, t)
            }
            switch (e.getAttribute("data-id")) {
            case "PDPS000000057683":
                var n = document.querySelector("#j_card_yaowen");
                n.insertBefore(e, n.children[n.children.length])
            }
            e.getAttribute("data-index") && feedPush.dataCheck(e)
        }),
        sinaSax.bind("nullData",
        function(e) {
            var t = document.getElementsByClassName("sina_tj_lmt")[0];
            switch (t && (h = t.getAttribute("data-id")), e.getAttribute("data-id")) {
            case h:
            }
        });
        var r = !1,
        o = !1,
        c = !1,
        l = !1;
        window.feedPush = {
            dataLength: 0,
            dataAfterLen: 0,
            count: 0,
            init: function(e, t) {
                this._ua = this._getUA(),
                window.homePushsAfter && window.homePushsAfter.length > 0 && (this.homeAfterPushs = window.homePushsAfter, this.dataAfterLen = window.homePushsAfter.length, this.dataHandle()),
                window.homePushs && window.homePushs.length > 0 && (this.homePushs = window.homePushs, this.dataLength = window.homePushs.length, this.push(e, t)),
                r = this._isUCCheck(),
                o = this._isQQBrowserCheck(),
                l = this._isBaiduBrowserCheck(),
                c = this._is360BrowserCheck()
            },
            _getUA: function() {
                return navigator.userAgent.toLowerCase()
            },
            _isUCCheck: function() {
                var e = this._ua,
                t = !1;
                return t = e.indexOf("ucbrowser") > -1 && -1 == e.indexOf("iphone")
            },
            _isQQBrowserCheck: function() {
                var e = this._ua,
                t = !1;
                return t = e.indexOf("qqbrowser") > -1 && -1 == e.indexOf("iphone")
            },
            _isBaiduBrowserCheck: function() {
                var e = this._ua,
                t = !1;
                return t = e.indexOf("baidu") > -1 && -1 == e.indexOf("iphone")
            },
            _is360BrowserCheck: function() {
                var e = this._ua,
                t = !1;
                return t = e.indexOf("360 aphone") > -1 && -1 == e.indexOf("iphone")
            },
            dataHandle: function() {
                var e = "",
                t = 0,
                i = this.dataAfterLen,
                n = document.createElement("div");
                for (n.id = "sax_domAfter_storage", n.style.display = "none"; i > t; t++) e += this.homeAfterPushs[t].domHTML;
                n.innerHTML = e,
                delete window.homePushsAfter,
                document.body.appendChild(n),
                sinaSax.init()
            },
            push: function(e, t) {
                var i = "",
                n = 0,
                a = this.homePushs.length;
                if (document.querySelector("#sax_dom_storage")) var s = document.querySelector("#sax_dom_storage");
                else {
                    var s = document.createElement("div");
                    s.id = "sax_dom_storage",
                    s.style.display = "none"
                }
                for (; a > n; n++) this.homePushs[n].pushed || this.homePushs[n].cardModule !== e || this.homePushs[n].page && t !== this.homePushs[n].page || (i += this.homePushs[n].domHTML, this.homePushs[n].pushed = 1);
                s.innerHTML = i,
                document.body.appendChild(s),
                sinaSax.init()
            },
            dataCheck: function(e) {
                var t = document.getElementsByTagName("body"),
                i = document.getElementsByClassName("j_normal_card"),
                n = parseInt(e.getAttribute("data-index")),
                a = e.cloneNode(!0);
                a.style.marginBottom = "8px",
                t[0].insertBefore(a, i[n + 1])
            }
        },
        feedPush.init("yaowen");
        var d = {
            getCommStr: function(e) {
                var t = e.comment_total,
                i = "01" == e.adtype && 0 == t ? "": t;
                return 0 == i ? "": i
            },
            temp31: function(e, t) {
                var i = [];
                a ? (i.push('<a href="' + t.url + '">'), i.push('<dl class="f_card">'), i.push('<dt class="f_card_dt"><img src="' + s.lz4X3 + '" data-src="' + t.img.u + '" alt="' + t.title + '"></dt>'), i.push('<dd class="f_card_dd">'), i.push('<h3 class="f_card_h3 ellipsis">' + t.title + "</h3>"), i.push('<p class="f_card_p ellipsis">' + t.intro + "</p>"), i.push('<div class="f_card_icon">'), i.push('<span class="op_patronage_tips fr">璧炲姪</span>'), i.push("</div></dd></dl></a>")) : (i.push('<a href="' + t.url + '">'), i.push('<dl class="f_card f_no_pic">'), i.push('<dd class="f_card_dd">'), i.push('<h3 class="f_card_h3 ellipsis">' + t.title + "</h3>"), i.push('<div class="f_card_icon">'), i.push('<span class="op_patronage_tips fr">璧炲姪</span>'), i.push("</div></dd></dl></a>")),
                e.innerHTML = i.join("")
            },
            temp33: function(e, t) {
                var i = [];
                a ? (i.push('<a href="' + t.url + '">'), i.push('<dl class="f_card default">'), i.push('<dd class="f_card_dd">'), i.push('<h3 class="f_card_h3 ellipsis">' + t.title + '<span class="op_patronage_tips tips_mar fr">璧炲姪</span></h3>'), i.push('<ul class="f_card_pic">'), t.images.length >= 3 && (i.push('<li><img  src="' + s.lz4X3 + '" data-src="' + t.images[0].u + '" alt="' + t.title + '" /></li>'), i.push('<li><img  src="' + s.lz4X3 + '" data-src="' + t.images[1].u + '" alt="' + t.title + '" /></li>'), i.push('<li><img  src="' + s.lz4X3 + '" data-src="' + t.images[2].u + '" alt="' + t.title + '" /></li>')), i.push("</ul>"), i.push("</dd></dl></a>")) : (i.push('<a href="' + t.url + '">'), i.push('<dl class="f_card default">'), i.push('<dd class="f_card_dd">'), i.push('<h3 class="f_card_h3 ellipsis">' + t.title + '<span class="op_patronage_tips fr">璧炲姪</span></h3>'), i.push("</dd></dl></a>")),
                e.innerHTML = i.join("")
            },
            temp35: function(e, t) {
                var i = [];
                a ? (i.push('<a href="' + t.url + '">'), i.push('<dl class="f_card">'), i.push('<dd class="f_card_dd">'), i.push('<h3 class="f_card_h3 ellipsis">' + t.title + "</h3>"), i.push('<p class="f_card_pic_ad"><img style="width:100%"  src="' + s.lz2X1 + '" data-src="' + t.img.u + '" alt="' + t.title + '"></p>'), i.push("<div>"), i.push('<span class="op_patronage_tips fr">璧炲姪</span>'), i.push('<p class="f_card_p_ad">' + t.weibourl + "</p>"), i.push("</div></dd></dl></a>")) : (i.push('<a href="' + t.url + '">'), i.push('<dl class="f_card">'), i.push('<dd class="f_card_dd">'), i.push('<h3 class="f_card_h3 ellipsis">' + t.title + "</h3>"), i.push("<div>"), i.push('<span class="op_patronage_tips fr">璧炲姪</span>'), i.push('<p class="f_card_p_ad">' + t.weibourl + "</p></div>"), i.push("</dd></dl></a>")),
                e.innerHTML = i.join("")
            },
            temp40: function(e, t) {
                var i = [];
                a ? (i.push('<dl class="f_card bc_color">'), i.push('<dd class="f_card_dd"><a href="' + t.url + '"><h3 class="f_card_h3 ellipsis">' + t.title + "</h3></a>"), i.push(""), i.push('<a href="javascript:;" class="gif_tap"><p class="f_card_pic_ad posi_rel">'), i.push('<img style="width:100%" src="' + s.lz2X1 + '" data-src="' + t.images[0].u + '" alt="' + t.title + '">'), i.push('<span class="s_gifImg">鐐瑰嚮鏌ョ湅鍔ㄥ浘</span></p>'), i.push('<p class="f_card_pic_ad hide"><img style="width:100%" src="' + t.images[1].u + '" alt="' + t.title + '"></p>'), i.push("<div>"), i.push('<span class="op_patronage_tips fr">璧炲姪</span>'), i.push('<p class="f_card_p_ad">' + t.weibourl + "</p>"), i.push("</div></a></dd></dl>")) : (i.push('<a href="' + t.url + '">'), i.push('<dl class="f_card bc_color"><dd class="f_card_dd">'), i.push('<h3 class="f_card_h3 ellipsis">' + t.title + "</h3>"), i.push("<div>"), i.push('<span class="op_patronage_tips fr">璧炲姪</span>'), i.push('<p class="f_card_p_ad">' + t.weibourl + "</p></div>"), i.push("</dd></dl></a>")),
                e.innerHTML = i.join("")
            },
            temp42: function(t, i) {
                var n = [];
                n.push('<dl class="f_card bc_color">'),
                n.push('<dd class="f_card_dd">'),
                n.push('<a href="' + i.url + '"><h3 class="f_card_h3 ellipsis">' + i.title + "</h3></a>"),
                n.push('<p class="f_card_pic_ad posi_rel">'),
                n.push('<a href="javascript:;" class="vedioWrap"><img style="width:100%"  src="' + s.lz2X1 + '" data-src="' + i.img.u + '" alt="' + i.title + '"></a>'),
                n.push('<span class="vedioBtn"><img src="http://n.sinaimg.cn/default/d1c9d4ed/20151217/veido_play.png"/></span>'),
                r || o || l || c || n.push('<span class="video_des">鐐瑰嚮鍏ㄥ睆鎾斁</span>'),
                n.push('</p><p class="f_card_pic_ad hide" vid="' + i.vid + '" id="vid' + i.vid + '">'),
                n.push("</p>"),
                n.push('<p class="f_card_pic_ad posi_rel loading" style="display: block;width: 100%;height: 100%;background-color: #000;"></p>'),
                n.push('<div><span class="op_patronage_tips fr">璧炲姪</span>'),
                n.push('<p class="f_card_p_ad">' + i.weibourl + "</p>"),
                n.push("</div></dd></dl>"),
                t.innerHTML = n.join("");
                var a = "vid" + i.vid,
                d = "http://interface.sina.cn/video/wap/videoinfo.d.json?vid=" + i.vid;
                e.sinaCnHome.S.jsonp(d,
                function(e) {
                    e.data.baseUrl || arguments.callee(this),
                    url = e.data.baseUrl;
                    var t = document.querySelector("#" + a);
                    t.innerHTML = '<video src="' + url + '" controls="controls"></video>';
                    var i = t.firstChild,
                    n = t.parentNode.firstChild.nextSibling.firstChild.firstChild,
                    s = t.parentNode.firstChild.nextSibling.firstChild.nextSibling.firstChild;
                    n.addEventListener("click",
                    function(e) {
                        var n = e.target.parentNode.parentNode.firstChild.firstChild.width;
                        i.style.height = n / 2 + "px",
                        t.parentNode.firstChild.nextSibling.nextSibling.className = "f_card_pic_ad playing",
                        t.parentNode.firstChild.nextSibling.className = "f_card_pic_ad posi_rel hide",
                        i.play()
                    }),
                    s.addEventListener("click",
                    function(e) {
                        var n = e.target.parentNode.parentNode.firstChild.firstChild.width;
                        i.style.height = n / 2 + "px",
                        t.parentNode.firstChild.nextSibling.nextSibling.className = "f_card_pic_ad playing",
                        t.parentNode.firstChild.nextSibling.className = "f_card_pic_ad posi_rel hide",
                        i.play()
                    }),
                    i.addEventListener("click",
                    function(e) {
                        e.target.parentNode.className.indexOf("playing") > -1 && (t.parentNode.firstChild.nextSibling.nextSibling.className = "f_card_pic_ad hide", t.parentNode.firstChild.nextSibling.className = "f_card_pic_ad posi_rel", i.pause())
                    })
                })
            }
        };
        window.mediaFlag = !1;
        var u, h, p = function(e) {
            var t, i = y.get("topTjhome"),
            n = new Date,
            a = n.getFullYear() + "-" + n.getMonth() + "-" + n.getDate(),
            s = 0,
            r = e.querySelector(".j_adImgUp"),
            o = new Image,
            c = document.documentElement.clientWidth;
            o.onload = function() {
                if (t = o.height, a !== i) {
                    mediaFlag = !0,
                    y.set("topTjhome", a);
                    var n = setInterval(function() {
                        s > c / o.width * o.height ? (clearInterval(n), setTimeout(function() {
                            e.querySelector(".j_adImgUp").style.height = 0,
                            e.querySelector(".j_adCloseBtn").style.WebkitTransform = "rotate(135deg)",
                            e.querySelector(".j_adCloseBtn").style.transform = "rotate(135deg)"
                        },
                        5e3)) : (s += 5, r.style.height = s + "px")
                    },
                    20)
                }
            },
            o.src = e.querySelector(".j_adImgUp").getAttribute("data-img"),
            e.querySelector(".j_adCloseBtn").style.WebkitTransform = "rotate(135deg)",
            e.querySelector(".j_adCloseBtn").style.transform = "rotate(135deg)",
            e.querySelector(".j_adCloseBtn").addEventListener("click",
            function() {
                parseInt(r.style.height) ? (this.style.WebkitTransform = "rotate(135deg)", this.style.transform = "rotate(135deg)", r.style.height = 0) : (this.style.WebkitTransform = "rotate(-45deg)", this.style.transform = "rotate(-45deg)", r.style.height = t + "px")
            },
            !1),
            e.querySelector(".j_adCloseBtn").addEventListener("touchEnd",
            function() {
                parseInt(r.style.height) ? (this.style.WebkitTransform = "rotate(135deg)", this.style.transform = "rotate(135deg)", r.style.height = 0) : (this.style.WebkitTransform = "rotate(-45deg)", this.style.transform = "rotate(-45deg)", r.style.height = t + "px")
            },
            !1)
        },
        f = function(e) {
            var t, i = 0,
            n = e.querySelector(".j_lmtimage");
            img = new Image,
            now = new Date,
            bottomTjStorage = y.get("bottomTjhome"),
            media = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate(),
            clientWidth = document.documentElement.clientWidth,
            img.onload = function() {
                if (_sinaCallEvent.trigger("sina_clear_native"), t = img.height, media !== bottomTjStorage) {
                    if (mediaFlag) setTimeout(function() {
                        var t = setInterval(function() {
                            i > clientWidth / img.width * img.height ? (clearInterval(t), setTimeout(function() {
                                e.querySelector(".j_lmtimage").style.height = 0
                            },
                            5e3)) : (i += 5, n.style.height = i + "px")
                        },
                        20)
                    },
                    6e3);
                    else var a = setInterval(function() {
                        i > clientWidth / img.width * img.height ? (clearInterval(a), setTimeout(function() {
                            e.querySelector(".j_lmtimage").style.height = 0
                        },
                        5e3)) : (i += 5, n.style.height = i + "px")
                    },
                    20);
                    y.set("bottomTjhome", media)
                }
            },
            img.src = e.querySelector(".j_lmtimage").getAttribute("data-img"),
            e.querySelector(".j_adClose").addEventListener("click",
            function(t) {
                t.preventDefault(),
                e.querySelector(".j_lmtimage").parentNode.removeChild(e.querySelector(".j_lmtimage"))
            },
            !1)
        },
        m = document.getElementsByClassName("sina_tj_qp")[0],
        g = document.getElementsByClassName("sina_tj_lmt")[0],
        v = document.getElementsByClassName("sina_tj_jdt"),
        _ = [];
        if (m && (u = m.getAttribute("data-id")), g && (h = g.getAttribute("data-id")), v.length > 0) for (var w = 0; w < v.length; w++) _[w] = v[w].getAttribute("data-id");
        sinaSax.bind("insertSucc",
        function(e) {
            switch (i(e), e.getAttribute("data-id")) {
            case u:
                p(e);
                break;
            case h:
                f(e)
            }
            for (var t = 0; t < _.length; t++) _[t] == e.getAttribute("data-id") && (window.xwipe ? window.xwipe.appendItem(e, e.getAttribute("data-pos") - 1) : window.initXwipe(), e.classList.remove("hide"))
        }),
        sinaSax.bind("completeFunc",
        function() {}),
        sinaSax.bind("error",
        function(e) {});
        var y = {
            set: function(e, t) {
                localStorage.setItem(e, JSON.stringify(t))
            },
            get: function(e) {
                return JSON.parse(localStorage.getItem(e))
            }
        };
        window.onload = function() {
            n()
        }
    } (window, document)
} catch(e) {
    throw new Error(e + " feed_push.js")
}
try { !
    function(e, t) {
        "use strict";
        var i = e.sinaCnHome.S,
        n = "http://cre.dp.sina.cn/api/my/cate?level=1",
        a = [],
        s = [],
        r = t.querySelector("#j_card_webo"),
        o = r.parentNode,
        c = {
            init: function() {
                this.getRecommendedSort()
            },
            checkNeedSort: function() {
                a = this.getCurrentSort();
                var e = !1;
                return a != s && (e = !0),
                e
            },
            getCurrentSort: function() {
                var e = [],
                i = t.querySelectorAll(".j_channel_sort_module");
                return i = [].slice.call(i),
                i.forEach(function(t) {
                    var i = t.getAttribute("data-channel");
                    e.push(i)
                }),
                e
            },
            getRecommendedSort: function() {
                i.jsonp(n, this.calllback.bind(this))
            },
            calllback: function(e) {
                s = e.result.data.slice(0);
                var t = this.checkNeedSort();
                t && this.reSort()
            },
            reSort: function() {
                var e = t.querySelector("#j_card_yaowen"),
                n = null,
                a = null,
                r = 0,
                o = s.length;
                for (r = 0; o > r; r++) n = t.querySelector("#j_card_" + s[r]),
                a = this.getNextInsertPos(e),
                i.insertAfter(n, a),
                e = n
            },
            getNextInsertPos: function(e) {
                var t = e.nextElementSibling;
                return t ? i.hasClass(t, "j_channel_sort_module") ? (this.awayFromHere(t), e) : this.getNextInsertPos(t) : null
            },
            awayFromHere: function(e) {
                o.insertBefore(e, r)
            }
        };
        Object.defineProperty(e.sinaCnHome, "resort", {
            value: c
        })
    } (window, document)
} catch(e) {
    throw new Error(e + " resort.js")
}
try { !
    function(e, t) {
        "use strict";
        var i = e.sinaCnHome.S,
        n = {
            lz1X1: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz1X1.jpg",
            lz2X1: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz2X1.jpg",
            lz4X3: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz4X3.jpg",
            lz16X9: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz16X9.jpg",
            lz148X125: "http://mjs.sinaimg.cn/wap/online/home/v7/images/lz148X125.jpg"
        },
        a = {
            like: 0,
            news: 0,
            sports: 0,
            ent: 0,
            local: 0,
            finance: 0,
            tech: 0,
            auto: 0,
            house: 0,
            mil: 0,
            blog: 0,
            edu: 0,
            fashion: 0,
            life: 0,
            games: 0,
            breaking: 0
        },
        s = "http://s.api.sina.cn/ls/getCardDataV3?",
        r = {
            like: {
                host: "http://cre.dp.sina.cn/api/v3/get?rfunc=101&cateid=sina_all&fields=surl,stitle,url,title,short_intro,intro,type,thumb&dedup=12&pageid=http://sina.cn&lid=new_v&cre=sinaw&mod=g&statics=1&merge=3&sns_len=10",
                cardId: "j_card_like"
            },
            local: {
                host: "http://interface.sina.cn/dfz/outside/wap/news/langshou_feed_data_router.d.json?xc=1",
                cardId: "j_card_local"
            },
            house: {
                host: "http://api.m.leju.com/?site=api&ctl=api&act=sl",
                cardId: "j_card_house"
            },
            weatherFinanceApp: {
                host: "http://s.api.sina.cn/ls/allasync?ver=3",
                weatherCardId: "weather_icon",
                appCardId: "j_card_apprecommend",
                financeCardId: "j_card_finance_stocks"
            }
        },
        o = !1,
        c = {
            0 : !1,
            2 : !1,
            4 : !1,
            7 : !1
        },
        l = !1,
        d = -1,
        u = !1,
        h = [],
        p = {},
        f = {
            init: function() {
                o = window.sinaCnHome.misc.getPicType(),
                this.getAllAsyncCard();
                var e = this;
                this.initExpose(),
                this.initLikeExpose(),
                setTimeout(function() {
                    e.bindEvent()
                },
                1500),
                setTimeout(function() {
                    e.insertBuyAuto()
                },
                5e3),
                this.initSearchBar(),
                this.initLikeFeed()
            },
            initLikeFeed: function() {
                function n() {
                    var e = '<section class="card_module" data-channel="like-feed" id="j_card_like_feed" data-sudaclick="like_feed"></section>';
                    e += '<section class="h_load_more hide" id="j_loading_more">',
                    e += '<span class="loading_btn"><i class="icon_loading"></i>鍔犺浇涓�</span>',
                    e += "</section>",
                    e += '<section class="f_remind hide" id="j_f_remind">宸蹭负鎮ㄦ帹鑽�10鏉℃柊淇℃伅</section>';
                    var i = t.querySelector("#j_card_apprecommend");
                    return i.insertAdjacentHTML("beforeBegin", e),
                    g = t.querySelector("#j_card_like_feed"),
                    v = t.querySelector("#j_loading_more"),
                    _ = t.querySelector("#j_f_remind"),
                    g && v ? !0 : !1
                }
                function a(e) {
                    var t = e ? i.removeClass: i.addClass;
                    t(_, "hide")
                }
                function s() {
                    if (! (x || m.likeFeedPage > 2)) {
                        var e = w.scrollHeight,
                        t = y.height,
                        i = w.scrollTop,
                        n = e - i - t,
                        a = 500,
                        s = i > b ? !0 : !1;
                        b = i,
                        s && a > n && r()
                    }
                }
                function r() {
                    var e = "http://cre.dp.sina.cn/api/v3/get?cateid=sina_all&cre=sinaw&mod=b&statics=1&merge=3&length=10",
                    t = 10 * m.likeFeedPage;
                    e += "&offset=" + t,
                    u(!0),
                    x = !0,
                    setTimeout(function() {
                        x = !1,
                        u(!1)
                    },
                    5e3),
                    i.jsonp(e, o)
                }
                function o(e) {
                    if (e && e.data && e.data.length > 0) {
                        var t = e.data.length,
                        i = null,
                        n = "";
                        h();
                        for (var s = 0; t > s; s++) i = m.adaptInfo(e.data[s], "like"),
                        l(i) || (c(i), n += m.getCommonFeedStr(i), p(e.data[s].info));
                        d(n),
                        f(),
                        m.likeFeedPage++,
                        x = !1,
                        u(!1),
                        a(!0),
                        setTimeout(function() {
                            a(!1)
                        },
                        2e3)
                    }
                }
                function c(e) {
                    k.push(e.title)
                }
                function l(e) {
                    for (var t = 0,
                    i = k.length; i > t; t++) if (e.title == k[t]) return ! 0;
                    return ! 1
                }
                function d(e) {
                    g.insertAdjacentHTML("beforeEnd", e)
                }
                function u(e) {
                    var t = e ? i.removeClass: i.addClass;
                    t(v, "hide")
                }
                function h() {
                    S.length = 0
                }
                function p(e) {
                    S.push(e)
                }
                function f() {
                    var e = S.join(",");
                    SUDA.uaTrackLike("sinaw_b_imp", e)
                }
                var m = this,
                g = null,
                v = null,
                _ = null,
                w = t.body,
                y = e.screen,
                b = 0,
                x = !1,
                k = [],
                S = [];
                this.likeFeedPage = 0;
                var j = n();
                return j ? (e.addEventListener("scroll", s), e.addEventListener("resize", s), void e.addEventListener("load", s)) : void console.log("create ctn failed")
            },
            initSearchBar: function() {
                function n() {
                    var t = p.value,
                    i = {
                        type: f,
                        name: "keyword",
                        title: t,
                        index: 0
                    };
                    e.suda_count && e.suda_count(i)
                }
                function a() {
                    var e = i.getRollNum(0, d),
                    t = l[e],
                    n = t.word;
                    p.value = n
                }
                function s() {
                    r(),
                    c(),
                    a();
                    var e = setInterval(function() {
                        a()
                    },
                    u);
                    return e
                }
                function r() {
                    var e = h.querySelectorAll("[type=hidden]"),
                    t = e.length,
                    i = 0;
                    for (i = 0; t > i; i++) h.removeChild(e[i])
                }
                function o() {
                    var e = '<input type="hidden" name="search_kind" value="news">';
                    h.insertAdjacentHTML("afterBegin", e)
                }
                function c() {
                    var e = '<input type="hidden" name="search_kind" value="baidu_search">';
                    e += '<input type="hidden" name="searchfrom" value="baidu">',
                    h.insertAdjacentHTML("afterBegin", e)
                }
                if ("hotWord" in e && e.hotWord.length) {
                    var l = hotWord,
                    d = l.length,
                    u = 8e3,
                    h = t.querySelector(".s_module_form"),
                    p = t.querySelector("#searchInput"),
                    f = "baiduHotWord",
                    m = s();
                    p.addEventListener("focus",
                    function() {
                        clearInterval(m),
                        p.value = "",
                        f = "userInput",
                        r(),
                        o()
                    }),
                    h.parentNode.addEventListener("submit",
                    function(e) {
                        n()
                    })
                }
            },
            initLikeExpose: function() {
                var n = t.querySelector("#j_card_like"),
                a = this;
                e.addEventListener("scroll",
                function() {
                    5 === h.length && !u && a.likeExpose(n)
                },
                !1),
                i.on("repaint",
                function() {
                    5 === h.length && !u && a.likeExpose(n)
                })
            },
            sendLikeExpose: function() {
                var e = h.join(",");
                SUDA.uaTrackLike("sinaw_g_imp", e)
            },
            likeExpose: function(i) {
                var n = t.documentElement,
                a = e.innerHeight || n.clientHeight || t.body.clientHeight || 0,
                s = i.getBoundingClientRect(),
                r = s.top,
                o = s.bottom; (r >= 0 && a - r > 100 || 0 > r && o > 100) && (this.sendLikeExpose(), u = !0)
            },
            insertBuyAuto: function() {
                var e = "http://www.miaoche.com/api_sinawap/cmsinfo?",
                n = t.querySelector("#j_card_auto"),
                a = this,
                s = function(e) {
                    if (e.retData && e.retData.autobuy && e.retData.autobuy.list[0]) {
                        var t = {
                            title: e.retData.autobuy.list[0].title,
                            link: e.retData.autobuy.list[0].link,
                            img: e.retData.autobuy.list[0].img,
                            intro: e.retData.autobuy.list[0].intro
                        },
                        i = a.getCommonFeedStr(t);
                        if (this.appendToCard(i, n), e.stat_url) {
                            var s = new Image;
                            s.src = e.stat_url + "&r=" + (Math.random() + "").replace(".", "")
                        }
                    }
                };
                i.jsonp(e, s.bind(a))
            },
            bindEvent: function() {
                var e = this;
                t.addEventListener("click",
                function(t) {
                    var i = t.target;
                    if (i.classList.contains("j_card_show_more")) {
                        if (l) return;
                        l = !0,
                        d = setTimeout(function() {
                            l = !1
                        },
                        5e3);
                        var n = e.getChannelName(i);
                        feedPush.init(n, a[n] + 1),
                        e.showLoading(i, !0),
                        e.getMore(n)
                    }
                    i.parentNode && i.parentNode.classList.contains("j_card_show_more") && i.parentNode.click()
                },
                !1)
            },
            cardExpose: function(e) {
                if (e) {
                    var t = [e];
                    exposeObj.trigger("elemExposeAddItem", ["sinaIndex", [].slice.call(t)])
                }
            },
            initExpose: function() {
                exposeObj.on("elemExposeHappen",
                function(e, t, i) {
                    window.suda_count && t.forEach(function(e) {
                        try {
                            var t = e && e.getAttribute("data-sudaclick");
                            t && suda_count({
                                name: "expose_" + t
                            })
                        } catch(i) {}
                    })
                });
                var e = t.querySelectorAll(".card_module"),
                i = this;
                e = [].slice.call(e),
                e.forEach(function(t) {
                    i.cardExpose(e[t])
                })
            },
            feedpush: function(e) {
                var i = t.querySelector("#j_card_" + e),
                n = o ? 5 : 10;
                i && setTimeout(function() {
                    var e = document.querySelector("#sax_dom_storage").children,
                    t = null;
                    if (e.length > 0) for (; e.length > 0;) {
                        var a = i.querySelectorAll(".f_card").length - n + parseInt(e[0].getAttribute("data-pos")) - 1;
                        a >= i.querySelectorAll(".f_card").length ? (t = i.querySelector(".f_more_tips"), i.insertBefore(e[0], t)) : (t = i.querySelectorAll(".f_card"), i.insertBefore(e[0], t[a].parentNode))
                    }
                },
                300)
            },
            showLoading: function(e, i) {
                var n = null,
                a = null;
                if ("string" == typeof e) {
                    if (a = t.querySelector("#j_card_" + e), !a) return;
                    n = a.querySelector(".j_card_show_more")
                } else n = e;
                if (n) {
                    var s = n.parentNode.querySelector(".more_loading");
                    i ? (n.style.display = "none", s.style.display = "block") : (n.style.display = "block", s.style.display = "none")
                }
            },
            showGoToChannel: function(e) {
                var i = t.querySelector("#j_card_" + e);
                if (i) {
                    var n = i.querySelector(".main_tit");
                    if (n) {
                        var a = n.innerHTML,
                        s = n.parentNode.href,
                        r = n.parentNode.getAttribute("data-href"),
                        o = '<a href="' + (r || s) + '" class="more_btn">杩涘叆' + a + '<span class="more_icon icon_open goto"></span></a>';
                        i.querySelector(".f_more_tips").innerHTML = o
                    }
                }
            },
            hasNoMore: function(e) {
                var t = !1,
                i = 20;
                return e in r ? i: i--,
                o ? i: i -= 10,
                t = a[e] >= i ? !0 : !1
            },
            getMore: function(e) {
                e in r || !(e in p) ? this.getAsyncCard(e) : this.showCommonMore(e)
            },
            getChannelName: function(e) {
                for (; e;) {
                    if (e.classList && e.classList.contains("card_module")) return e.getAttribute("data-channel");
                    e = e.parentNode
                }
            },
            getAllAsyncCard: function() {
                for (var e in r) this.getAsyncCard(e)
            },
            getLocal: function() {
                return i.getSearchValue("df")
            },
            getURL: function(e) {
                var t = e in r ? r[e].host: s + "&card=" + e;
                if ("local" == e) {
                    var n = this.getLocal();
                    n && (t += "&df=" + this.getLocal())
                }
                if ("weatherFinanceApp" == e) {
                    var c = i.getSearchValue("time"),
                    l = i.getSearchValue("df"),
                    d = navigator.userAgent.toLowerCase(),
                    u = d.indexOf("ucbrowser") + 1 ? "uc": d.indexOf("baidu") + 1 ? "bd": d.indexOf("qqbrowser") + 1 ? "qq": "no",
                    h = /iphone|ipad|ipod/.test(d) ? "ios": d.indexOf("android") + 1 ? "android": "no";
                    c && (c = "&time=" + c),
                    l && (l = "&df=" + l),
                    t += "&ua=" + u + "&pf=" + h + c + l
                }
                return "like" == e ? t += o ? "&length=5&offset=" + 5 * a.like: "&length=10&offset=" + 10 * a.like: e in a && (t += o ? "&nopic=0": "&nopic=1", t += e in r ? "&page=" + a[e] : "&page=-1"),
                t
            },
            getAsyncCard: function(e) {
                var t = this.getURL(e);
                t && (r[e] && r[e].ajax ? i.ajax(t, this.callback.bind(this), e) : i.jsonp(t, this.callback.bind(this), e))
            },
            callback: function(e, t) {
                if (e) {
                    switch (t) {
                    case "like":
                        this.execLike(e, t, r[t].cardId);
                        break;
                    case "local":
                        this.execLocal(e, t, r[t].cardId);
                        break;
                    case "house":
                        this.execHouse(e, t, r[t].cardId);
                        break;
                    case "weatherFinanceApp":
                        this.execWFA(e, t);
                        break;
                    default:
                        return void this.execCommon(e, t)
                    }
                    a[t]++,
                    i.trigger("repaint"),
                    l && this.loadMoreOtherThing(t)
                }
            },
            showEle: function(e) {
                i.removeClass(e, "hide")
            },
            loadMoreOtherThing: function(e) {
                this.showLoading(e, !1);
                var t = this.hasNoMore(e);
                t && this.showGoToChannel(e),
                this.feedpush(e),
                setTimeout(function() {
                    window.sinaCnHome.misc.fixHrefArgs()
                },
                1e3),
                l = !1,
                clearTimeout(d)
            },
            showCommonMore: function(e) {
                var n = o ? 5 : 10,
                s = a[e] * n,
                r = 0,
                c = "",
                l = null,
                d = t.querySelector("#j_card_" + e),
                u = 0;
                if (s >= p[e].length) return void this.showGoToChannel(e);
                for (r = 0; n > r && (l = p[e][s + r], l); r++) c += l.imgNum && l.imgNum >= 3 ? this.get3PicsFeedStr(l) : this.getCommonFeedStr(l),
                u++;
                this.appendToCard(c, d),
                a[e]++,
                i.trigger("repaint"),
                this.loadMoreOtherThing(e),
                n > u && this.showGoToChannel(e)
            },
            execCommon: function(e, t) {
                if (! (e && e.retData && e.retData[t] && e.retData[t].list)) return void this.showGoToChannel(t);
                var i = e.retData[t].list.length;
                if (0 == i) return void this.showGoToChannel(t);
                var n = 0,
                a = null;
                for (p[t] = [], this.updateCardFeedsBuffer(t), n = 0; i > n; n++) a = this.adaptInfo(e.retData[t].list[n], t),
                this.hasFeedExist(a, t) || p[t].push(a);
                this.showCommonMore(t)
            },
            execLike: function(e, i, n) {
                if (h.length = 0, !e || !e.data) return void this.showGoToChannel(i);
                var a = e.data.length;
                if (0 == a) return void this.showGoToChannel(i);
                var s = 0,
                r = "",
                o = null,
                c = t.querySelector("#" + n);
                for (this.updateCardFeedsBuffer(i), s = 0; a > s; s++) h.push(e.data[s].info),
                o = this.adaptInfo(e.data[s], i),
                this.hasFeedExist(o, i) || (this.updateCardFeedsBuffer(i, o), r += this.getCommonFeedStr(o));
                this.appendToCard(r, c),
                u && this.sendLikeExpose(),
                this.showEle(c)
            },
            execHouse: function(e, i, n) {
                if (! (e && e.retData && e.retData.house && e.retData.house.list)) return void this.showGoToChannel(i);
                var s = e.retData.house.list.length;
                if (0 == s) return void this.showGoToChannel(i);
                var r = 0,
                o = "",
                c = null,
                l = t.querySelector("#" + n);
                for (0 == a[i] && (c = this.adaptTitleInfo(e, i), o += this.getCommonTitleStr(c)), e.retData.house.pic && 2 == e.retData.house.pic.length && (c = this.adapt2PicsInfo(e, i), o += this.get2PicsFeedStr(c)), this.updateCardFeedsBuffer(i), r = 0; s > r; r++) e.retData.house.list[r].title && (c = this.adaptInfo(e.retData.house.list[r], i), this.hasFeedExist(c, i) || (this.updateCardFeedsBuffer(i, c), o += this.getCommonFeedStr(c)));
                this.appendToCard(o, l),
                this.showEle(l)
            },
            localToYaowen: function(e, t) {
                var i = e.retData.yaowen.list.length,
                n = 0,
                a = "",
                s = null;
                for (n = 0; i > n; n++) s = this.adaptInfo(e.retData.yaowen.list[n], t),
                a += s.imgNum && 3 == s.imgNum ? this.get3PicsFeedStr(s) : this.getCommonFeedStr(s);
                this.appendToYaowen(a)
            },
            execLocal: function(e, i, n) {
                if (! (e && e.retData && e.retData.dfz && e.retData.dfz.list)) return void this.showGoToChannel(i);
                var s = e.retData.dfz.list.length;
                if (0 == s) return void this.showGoToChannel(i);
                var r = 0,
                o = "",
                c = null,
                l = t.querySelector("#" + n);
                for (0 == a[i] && (this.localToYaowen(e, i), c = this.adaptTitleInfo(e, i), o += this.getCommonTitleStr(c)), e.retData.xc && 2 == e.retData.xc.list.length && (c = this.adapt2PicsInfo(e.retData.xc, "xc"), o += this.get2PicsFeedStr(c)), this.updateCardFeedsBuffer(i), r = 0; s > r; r++) c = this.adaptInfo(e.retData.dfz.list[r], i),
                this.hasFeedExist(c, i) || (this.updateCardFeedsBuffer(i, c), o += c.imgNum && 3 == c.imgNum ? this.get3PicsFeedStr(c) : this.getCommonFeedStr(c));
                this.appendToCard(o, l),
                this.showEle(l)
            },
            execWFA: function(e, i) {
                var n = "",
                a = t.querySelector("#" + r[i].weatherCardId),
                s = t.querySelector("#" + r[i].financeCardId),
                o = t.querySelector("#" + r[i].appCardId);
                n = this.getWeatherStr(e),
                this.appendToWeather(n, a),
                n = this.getFinanceStr(e),
                this.appendToFinance(n, s),
                n = this.getBreakerStr(e),
                this.appendToBreakder(n, s),
                n = this.getAppStr(e),
                n && (this.appendToApp(n, o), this.showEle(o))
            },
            adapt2PicsInfo: function(e, t) {
                var i = {};
                switch (t) {
                case "house":
                    i = [{
                        title: e.retData.house.pic[0].title,
                        url: e.retData.house.pic[0].link,
                        img: e.retData.house.pic[0].pic
                    },
                    {
                        title: e.retData.house.pic[1].title,
                        url: e.retData.house.pic[1].link,
                        img: e.retData.house.pic[1].pic
                    }];
                    break;
                case "xc":
                    i = [{
                        title: e.list[0].title,
                        url: e.list[0].link,
                        img: e.list[0].img
                    },
                    {
                        title: e.list[1].title,
                        url: e.list[1].link,
                        img: e.list[1].img
                    }]
                }
                return i
            },
            adaptTitleInfo: function(e, t) {
                var n = {};
                switch (t) {
                case "house":
                    n = {
                        title: {
                            title: e.retData.house.title.title,
                            url: e.retData.house.title.url,
                            urlMore: e.retData.house.title.url_more
                        },
                        subTitle: i.cloneObj(e.retData.house.subtitle)
                    };
                    break;
                case "local":
                    n = {
                        title: {
                            title: e.retData.dfz.title.title,
                            url: e.retData.dfz.title.url
                        },
                        subTitle: i.cloneObj(e.retData.dfz.subtitle)
                    }
                }
                return n
            },
            getCommonTitleStr: function(e) {
                var t = "",
                i = e.subTitle.length,
                n = 0;
                if (t += "<aside class='f_md_tit'>", t += "<a href='" + e.title.url + (e.title.urlMore ? "' data-href='" + e.title.urlMore: "") + "' title='" + e.title.title + "'><strong class='main_tit'>" + e.title.title + "</strong></a>", i > 0) {
                    for (t += "<ul class='tit_list'>", n = 0; i > n; n++) t += "<li><a href='" + e.subTitle[n].url + "' title='" + e.subTitle[n].title + "'>" + e.subTitle[n].title + "</a></li>";
                    t += "</ul>"
                }
                return t += "</aside>"
            },
            cardFeedsBuffer: {},
            updateCardFeedsBuffer: function(e, i) {
                var n = null,
                a = [],
                s = 0,
                r = 0,
                o = 0;
                if (e in this.cardFeedsBuffer) {
                    if (!i) return;
                    this.cardFeedsBuffer[e].push({}),
                    o = this.cardFeedsBuffer[e].length - 1,
                    this.cardFeedsBuffer[e][o].title = i.title,
                    this.cardFeedsBuffer[e][o].link = i.link
                } else for (n = t.querySelector("#j_card_" + e), a = n.querySelectorAll("h3"), this.cardFeedsBuffer[e] = [], s = 0, r = a.length; r > s; s++) this.cardFeedsBuffer[e].push({}),
                o = this.cardFeedsBuffer[e].length - 1,
                this.cardFeedsBuffer[e][o].title = a[s].innerHTML,
                this.cardFeedsBuffer[e][o].link = a[s].parentNode.href || a[s].parentNode.parentNode.parentNode.href
            },
            hasFeedExist: function(e, t) {
                if (!t in this.cardFeedsBuffer) return ! 1;
                var i = this.cardFeedsBuffer[t].length,
                n = 0,
                a = null,
                s = [],
                r = [];
                for (n = 0; i > n; n++) if (a = this.cardFeedsBuffer[t][n], s = e.link.split("?"), r = a.link.split("?"), e.title == a.title || s[0] == r[0]) return ! 0;
                return ! 1
            },
            adaptInfo: function(e, t) {
                var i = {};
                switch (t) {
                case "like":
                    i = {
                        link: e.surl || e.url,
                        img: e.thumb,
                        title: e.stitle || e.mtitle || e.title,
                        intro: e.short_intro || e.stitle || e.title,
                        reason: e.reason || 0,
                        uid: e.uids ? e.uids[0].split("_")[2] || 0 : 0,
                        comment: 0
                    };
                    break;
                case "local":
                    i = {
                        link: e.link,
                        img: e.img,
                        title: e.title,
                        intro: e.intro,
                        comment: e.comment
                    };
                    break;
                case "house":
                    i = e.pics ? {
                        link: e.link,
                        title: e.title,
                        imgNum: e.pics.total,
                        imgs: e.pics.imgs.slice(0)
                    }: {
                        link: e.link,
                        img: e.pic,
                        title: e.title,
                        intro: e.zhaiyao || e.title,
                        comment: 0
                    };
                    break;
                case "app":
                    i = {
                        link: e.url,
                        img: e.pic,
                        title: e.title
                    };
                    break;
                case "stockIndex":
                    i = {
                        link: e.link,
                        range: e.range,
                        title: e.title,
                        value: e.value,
                        "class": e["class"]
                    };
                    break;
                case "breaker":
                    i = {
                        status: e.status,
                        begin: e.begin,
                        lastend: e.lastend,
                        zuixin: e.zuixin,
                        zhangdiefu: e.zhangdiefu
                    };
                    break;
                case "weather":
                    i = {
                        icon: e.icon_v3 || e.icon || "http://mjs.sinaimg.cn/wap/homev6/weather/qing_bai_2.png"
                    };
                    break;
                default:
                    i = e.pics && e.pics.total > 0 ? {
                        link: e.link,
                        title: e.wap_title || e.title,
                        imgNum: e.pics.total,
                        imgs: e.pics.imgs.slice(0)
                    }: {
                        link: e.link,
                        img: e.img,
                        title: e.wap_title || e.title,
                        intro: e.intro,
                        comment: e.comment,
                        tag: e.newsTag
                    }
                }
                return i
            },
            getWeatherStr: function(e) {
                var t = "",
                i = null;
                return i = this.adaptInfo(e.retData.weather, "weather"),
                t += "<img src='" + i.icon + "' width='22'>"
            },
            getFinanceStr: function(e) {
                var t = e.retData.finance.stocks.length,
                i = 0,
                n = "",
                a = null;
                for (i = 0; t > i; i++) a = this.adaptInfo(e.retData.finance.stocks[i], "stockIndex"),
                n += "<a href='" + a.link + "'>",
                n += "<div class='finance_card_l border_box " + a["class"] + "'>",
                n += "<strong class='finance_name'>",
                n += a.title,
                n += "</strong>",
                n += "<span class='finance_level'>",
                n += a.value,
                n += "</span>",
                n += "<span class='finance_range'>",
                n += a.range,
                n += "%</span>",
                n += "</div>",
                n += "</a>";
                return n
            },
            getBreakerStr: function(e) {
                var t = "";
                if (!e.retData.finance.breaker || !e.retData.finance.breaker.status) return t;
                if (e.retData.finance.breaker.show) {
                    var i = this.adaptInfo(e.retData.finance.breaker, "breaker");
                    switch (i.status) {
                    case "00":
                        break;
                    case "01":
                        t += "<aside class='finance_info'>",
                        t += "<div class='finance_sfrushgree'>",
                        t += "<span class='icon_exclamation'></span>",
                        t += "<span class='first_font'>宸叉仮澶嶄氦鏄�</span>",
                        t += "<span class='second_font'>鐔旀柇鎭㈠浜�" + i.lastend + "</span>",
                        t += "</div>",
                        t += "</aside>";
                        break;
                    case "02":
                        t += "<aside class='finance_info'>",
                        t += "<div class='finance_sfrushpink'>",
                        t += "<span class='icon_exclamation'></span>",
                        t += "<span class='first_font'>鍙仮澶嶇啍鏂�</span>",
                        t += "<span class='second_font'>寮€濮嬩簬" + i.begin + "</span>",
                        t += "(" + i.zuixin + "/" + i.zhangdiefu + ")",
                        t += "</div>",
                        t += "</aside>";
                        break;
                    case "03":
                        t += "<aside class='finance_info'>",
                        t += "<div class='finance_sfrushpink'>",
                        t += "<span class='icon_tick'></span>",
                        t += "<span class='first_font'>涓嶅彲鎭㈠鐔旀柇</span>",
                        t += "<span class='second_font'>鐔旀柇鍒伴棴甯�</span>",
                        t += "寮€濮嬩簬" + i.begin,
                        t += "</div>",
                        t += "</aside>"
                    }
                    return t
                }
            },
            getAppStr: function(e) {
                var t = e.retData.app_recommend.length;
                if (t = 4 * parseInt(t / 4), 0 == t) return "";
                var i = 0,
                a = "",
                s = null;
                for (a += "<ul class='app_items'>", i = 0; t > i; i++) s = this.adaptInfo(e.retData.app_recommend[i], "app"),
                a += "<li class='app_items_list'>",
                a += "<a href='" + s.link + "' title='" + s.title + "'>",
                a += "<aside class='app_ico_card'>",
                a += "<img src='" + n.lz1X1 + "' data-src='" + s.img + "' class='app_ico' alt='" + s.title + "'>",
                a += "<i class='icon_download_2'>",
                a += "</i>",
                a += "</aside>",
                a += "<aside>",
                a += "<strong class='app_ico_card_t'>",
                a += s.title,
                a += "</strong>",
                a += "</aside>",
                a += "</a>",
                a += "</li>";
                return a += "</ul>"
            },
            get2PicsFeedStr: function(e) {
                var t = "",
                i = 0;
                if (o) {
                    for (t += "<ul class='f_pic_small'>", i = 0; 2 > i; i++) t += "<li class='f_pic_li border_box'>",
                    t += "<a href='" + e[i].url + "' title='" + e[i].title + "'>",
                    t += "<img src='" + n.lz16X9 + "' data-src='" + e[i].img + "' alt='" + e[i].title + "' class='pic_img'>",
                    t += "<h3 class='pic_info ellipsis'>" + e[i].title + "<em class='icon_img'></em></h3>",
                    t += "</a>",
                    t += "</li>";
                    t += "</ul>"
                } else for (i = 0; 2 > i; i++) t += "<a href='" + e[i].url + "' title='" + e[i].title + "'>",
                t += "<dl class='f_card f_no_pic'>",
                t += "<dd class='f_card_dd'>",
                t += "<h3 class='f_card_h3 ellipsis'>" + e[i].title + "<em class='icon_img'></em></h3>",
                t += "</dd>",
                t += "</dl>",
                t += "</a>";
                return t
            },
            get3PicsFeedStr: function(e) {
                var t = "";
                return o ? (t = "<a href='" + e.link + "' title='" + e.title + "'>", t += "<dl class='f_card default'>", t += "<dd class='f_card_dd'>", t += "<h3 class='f_card_h3 ellipsis'>", t += e.title, t += "</h3>", t += "<ul class='f_card_pic'>", t += "<li>", t += "<img src='" + n.lz4X3 + "' data-src='" + e.imgs[0] + "'>", t += "</li>", t += "<li>", t += "<img src='" + n.lz4X3 + "' data-src='" + e.imgs[1] + "'>", t += "</li>", t += "<li>", t += "<img src='" + n.lz4X3 + "' data-src='" + e.imgs[2] + "'>", t += "</li>", t += "</ul>", t += "<aside class='f_card_icon'>", t += "<span class='pic_tips'>", t += "<em class='icon_img'>", t += "</em>", t += e.imgNum, t += "</span>", t += "</aside>", t += "</dd>", t += "</dl>", t += "</a>") : (t = "<a href='" + e.link + " title='" + e.title + "'>", t += "<dl class='f_card f_no_pic'>", t += "<dd class='f_card_dd'>", t += "<h3 class='f_card_h3 ellipsis'>", t += e.title, t += "</h3>", t += "<aside class='f_card_icon'>", t += "<span class='pic_tips'>", t += "<em class='icon_img'>", t += "</em>", t += e.imgNum, t += "</span>", t += "</aside>", t += "</dd>", t += "</dl>", t += "</a>"),
                t
            },
            getCommonFeedStr: function(e) {
                var t = "";
                return o ? (t = "<a href='" + e.link + "'>", t += "<dl class='f_card'>", t += e.img ? "<dt class='f_card_dt'><img src='" + n.lz4X3 + "' data-src='" + e.img + "' alt='" + e.title + "'></dt>": "", t += "<dd class='f_card_dd'>", t += "<h3 class='f_card_h3 ellipsis'>" + e.title + "</h3>", t += "<p class='f_card_p'>" + (e.intro ? e.intro: e.title) + "</p>", t += this.getTagStr(e), t += "</dd>", t += "</dl>", t += "</a>") : (t = "<a href='" + e.link + "'>", t += "<dl class='f_card f_no_pic'>", t += "<dd class='f_card_dd'>", t += "<h3 class='f_card_h3 ellipsis'>" + e.title + "</h3>", t += this.getTagStr(e), t += "</dd>", t += "</dl>", t += "</a>"),
                t
            },
            getTagStr: function(e) {
                var t = {
                    0 : {
                        title: "鍏磋叮",
                        dom: '<span class="interest"><em class="icon_interest"></em>鍏磋叮</span>'
                    },
                    2 : {
                        title: "寰崥",
                        dom: '<span class="weibo"><em class="icon_weibo"></em>寰崥</span>'
                    },
                    4 : {
                        title: "鐑棬",
                        dom: '<span class="hot"><em class="icon_hot"></em>鐑棬</span>'
                    },
                    7 : {
                        title: "鏈湴",
                        dom: '<span class="location"><em class="icon_location"></em>鏈湴</span>'
                    }
                },
                i = "";
                return i += "<div class='f_card_icon'>",
                void 0 !== e.tag && "" !== e.tag ? i += "<span class='book_tip'>" + e.tag + "</span>": e.reason in t ? (i += c[e.reason] ? "": t[e.reason].dom, 2 == e.reason && (i = i.replace("寰崥", e.uid)), c[e.reason] = !0) : (i += "<span class='comment'>", i += parseInt(e.comment) ? e.comment + "<em class='icon_comment'>": "<em class='icon_comment'>", i += "</em>", i += "</span>"),
                i += "</div>"
            },
            appendToCard: function(e, t) {
                var i = t.querySelector(".f_more_tips");
                i.insertAdjacentHTML("beforeBegin", e)
            },
            appendToYaowen: function(e) {
                var i = t.querySelector("#j_card_yaowen"),
                n = i.querySelector(".j_native");
                n ? n.insertAdjacentHTML("beforeBegin", e) : i.insertAdjacentHTML("beforeEnd", e)
            },
            appendToApp: function(e, t) {
                t.insertAdjacentHTML("beforeEnd", e)
            },
            appendToFinance: function(e, t) {
                t.insertAdjacentHTML("beforeEnd", e)
            },
            appendToBreakder: function(e, t) {
                e && t.insertAdjacentHTML("afterEnd", e)
            },
            appendToWeather: function(e, t) {
                t.insertAdjacentHTML("beforeEnd", e)
            },
            initBannerAds: function() {
                var e = t.querySelector("#j_card_webo"),
                i = "",
                n = null,
                a = new Date(2016, 0, 19, 16, 0, 0),
                s = new Date(2016, 1, 3, 16, 0, 0),
                r = new Date;
                i = "<div id='bannerAd_jd'></div>",
                e.insertAdjacentHTML("afterEnd", i),
                this.addBannerAds(t.querySelector("#bannerAd_jd"), 2),
                r >= a && s >= r && (n = t.querySelectorAll(".j_normal_card")[3], i = "<div id='bannerAd_taobao' class='iframe_h'></div>", n.insertAdjacentHTML("afterEnd", i), this.addBannerAds(t.querySelector("#bannerAd_taobao"), 1))
            },
            addBannerAds: function(e, t) {
                switch (t) {
                case 0:
                    break;
                case 1:
                    !
                    function() {
                        var t = '<a style="display:none!important" id="tanx-a-mm_15890324_8176878_47140576"></a>';
                        e.insertAdjacentHTML("beforeEnd", t);
                        var i = document.createElement("script");
                        i.type = "text/javascript",
                        i.charset = "gbk",
                        i.id = "tanx-s-mm_15890324_8176878_47140576",
                        i.async = !0,
                        i.src = "http://p.tanx.com/ex?i=mm_15890324_8176878_47140576";
                        var n = document.getElementsByTagName("head")[0];
                        n && n.insertBefore(i, n.firstChild)
                    } ();
                    break;
                case 2:
                    !
                    function() {
                        function t(e, t) {
                            var i = document.createElement("iframe"),
                            n = document.createElement("a");
                            n.style.display = "block",
                            n.id = "jdAdplace" + e,
                            t.appendChild(n);
                            var s = document.getElementById("jdAdplace" + e),
                            r = s.scrollWidth,
                            o = r / a;
                            i.id = "jdAd" + e,
                            i.frameborder = "0",
                            i.style.border = "0",
                            i.style.display = "block",
                            i.width = r,
                            i.height = o,
                            i.scrolling = "no",
                            i.src = "http://x.jd.com/exsites?spread_type=2&ad_ids=" + e + ":5&location_info=0&mobile_type=1&&callback=getjjsku_callback";
                            var c = document.createElement("div");
                            c.appendChild(i),
                            s.insertBefore(i, null)
                        }
                        function i(e) {
                            var t = document.getElementById("jdAdplace" + e),
                            i = document.getElementById("jdAd" + e);
                            i.width = t.offsetWidth,
                            i.height = i.width / a
                        }
                        var n = 645;
                        if (!document.querySelector("#jdAdplace" + n)) {
                            var a = 6.4;
                            t(n, e);
                            var s = new Image;
                            s.src = "http://sax.sina.com.cn/view?type=nonstd&t=REowMDAxMDE2Nw%3D%3D&r=" + (Math.random() + "").replace(".", ""),
                            window.addEventListener("resize",
                            function() {
                                i(n)
                            },
                            !1)
                        }
                    } (),
                    e.style.paddingBottom = "8px"
                }
            }
        }; !
        function() {
            function t(e) {
                var t = document.querySelector("body"),
                i = document.createElement("script");
                i.setAttribute("src", e),
                t.appendChild(i)
            }
            f.init(),
            parseInt(sinaCnHome.misc.getPicStorage("RSORT")) && setTimeout(function() {
                window.sinaCnHome.resort.init()
            },
            500),
            e.addEventListener("load",
            function() {
                f.initBannerAds(),
                t("http://mjs.sinaimg.cn/wap/online/public/NPH/v1/nph.min.js")
            })
        } (),
        Object.defineProperties(e.sinaCnHome, {
            cardAsync: {
                value: f
            }
        })
    } (window, document)
} catch(e) {
    throw new Error(e + " async.js")
}
try { !
    function(e, t) {
        "use strict";
        var i = e.sinaCnHome.S,
        n = {
            lazyImgAttr: "data-src",
            marginHeight: 25,
            lazyCss: !1,
            lazyClsAttr: "lazycls",
            _lazyHandler: null,
            _lazyImgCache: [],
            _lazyClsCache: [],
            init: function() {
                this._lazyHandler = null,
                this._lazyImgCache = [],
                this._lazyClsCache = [],
                this._refreshLazyItems(),
                this._initEvent()
            },
            _refreshLazyItems: function() {
                var e = this;
                this._lazyImgCache = [],
                this._lazyClsCache = [],
                Array.prototype.forEach.call(t.querySelectorAll("img"),
                function(t) {
                    t.getAttribute(e.lazyImgAttr) && e._lazyImgCache.push(t)
                }),
                e.lazyCss && Array.prototype.forEach.call(t.querySelectorAll("." + e.lazyClsAttr),
                function(t) {
                    img.getAttribute(e.lazyImgAttr) && e._lazyClsCache.push(t)
                })
            },
            _loadLazy: function() {
                var i = this;
                this._lazyHandler && (clearTimeout(this._lazyHandler), this._lazyHandler = null),
                this._lazyHandler = setTimeout(function() {
                    var n = t.documentElement,
                    a = e.innerHeight || n.clientHeight || t.body.clientHeight || 0,
                    s = [];
                    i._refreshLazyItems();
                    for (var r = 0; r < i._lazyImgCache.length; r++) {
                        var o = i._lazyImgCache[r],
                        c = o.getBoundingClientRect();
                        c && "[object Number]" === toString.call(c.top) && c.top > -i.marginHeight && c.top < a + i.marginHeight && (o.setAttribute("src", o.getAttribute(i.lazyImgAttr)), o.removeAttribute(i.lazyImgAttr), s.push(r))
                    }
                },
                100)
            },
            _initEvent: function() {
                e.addEventListener("scroll", this._loadLazy.bind(this), !1),
                e.addEventListener("resize", this._loadLazy.bind(this), !1),
                e.addEventListener("orientationchange", this._loadLazy.bind(this), !1),
                i.on("repaint", this._loadLazy.bind(this))
            }
        };
        n.init(),
        Object.defineProperties(e.sinaCnHome, {
            lazyLoad: {
                value: n
            }
        })
    } (window, document)
} catch(e) {
    throw new Error(e + " lazyload.js")
}
try { !
    function(e, t) {
        "use strict";
        var i = e.sinaCnHome.S,
        n = "http://data.api.sina.cn/api/count/apicount.php?",
        a = t.querySelector("#j_attitude");
        if (a) {
            var s = document.querySelector("body"),
            r = a.getAttribute("data-id"),
            o = "icon_ding",
            c = !1,
            l = !1,
            d = !1,
            u = {
                init: function() {
                    this.checkLocalStorage();
                    var e = this.checkSetted();
                    e && (c = !0),
                    this.bindEvent()
                },
                checkLocalStorage: function() {
                    try {
                        localStorage.setItem("test", 1),
                        d = !0
                    } catch(e) {}
                },
                checkSetted: function() {
                    var e = this.getStatus("att" + r),
                    t = null;
                    return e && (t = document.querySelector("." + e)) ? (i.removeClass(t, e), i.addClass(t, e + "_1"), this.showBar(), !0) : !1
                },
                bindEvent: function() {
                    var e = this;
                    a.addEventListener("click",
                    function(t) {
                        return c ? void e.showPrompt("涓嶈兘閲嶅琛ㄦ€侊紒") : void e.deliverAttitude(t)
                    },
                    !1)
                },
                jsonp: function(e, t, n) {
                    var a = {
                        timestamp: Date.now()
                    },
                    s = "jsonpcallback",
                    r = 3e3,
                    o = "addPraise";
                    window[o] = function(a) {
                        clearTimeout(p),
                        t && t(a, n, e, t),
                        h.removeChild(u),
                        window[o] = null,
                        i.trigger("afterJSONP")
                    },
                    a[s] = o,
                    -1 == e.indexOf("?") && (e += "?");
                    var c = [];
                    for (var l in a) c.push(l + "=" + encodeURIComponent(a[l]));
                    var d = "&" + c.join("&"),
                    u = document.createElement("script");
                    u.src = e + d;
                    var h = document.getElementsByTagName("head")[0];
                    if (h.appendChild(u), r) var p = setTimeout(function() {
                        h.removeChild(u),
                        window[o] = function() {}
                    },
                    r)
                },
                deliverAttitude: function(e) {
                    for (var t = e.target,
                    a = this; ! i.hasClass(t, "f_attitude");) {
                        if (i.hasClass(t, "attitude_l")) {
                            a.changeIcon(t, "icon_ding"),
                            n += "act=add&attitude=praise&type=1&record=0&p=" + r,
                            this.jsonp(n, this.callback.bind(this)),
                            o = "icon_ding";
                            break
                        }
                        if (i.hasClass(t, "attitude_r")) {
                            a.changeIcon(t, "icon_cai"),
                            n += "act=add&attitude=praise&type=2&record=0&p=" + r,
                            this.jsonp(n, this.callback.bind(this)),
                            o = "icon_cai";
                            break
                        }
                        t = t.parentNode
                    }
                },
                changeIcon: function(e, t) {
                    var n = e.querySelector(".attitude_pic");
                    i.removeClass(n, t),
                    i.toggleClass(n, t + "_1")
                },
                callback: function(e) {
                    e && e.status ? (c = !0, this.setStatus("att" + r, o), this.showPrompt("琛ㄦ€佹垚鍔燂紒"), this.showBar()) : (this.resetIcon(), this.showPrompt("琛ㄦ€佸け璐ワ紒"))
                },
                resetIcon: function() {
                    var e = document.querySelector("." + o + "_1");
                    e && (i.removeClass(e, o + "_1"), i.addClass(e, o))
                },
                showBar: function() {
                    var e = document.querySelectorAll(".attitude_num"),
                    t = e.length,
                    n = 0;
                    for (n = 0; t > n; n++) i.removeClass(e[n], "hide");
                    var a = document.querySelector(".bar_red"),
                    s = a.getAttribute("data-percent");
                    a.style.width = s + "%",
                    a = document.querySelector(".bar_blue"),
                    s = a.getAttribute("data-percent"),
                    a.style.width = s + "%"
                },
                showPrompt: function(e) {
                    if (!l) {
                        var t = "",
                        i = this;
                        t += '<section class="fixed_info"><a href="javscript:;">',
                        t += e,
                        t += "</a></section>",
                        s.insertAdjacentHTML("beforeEnd", t),
                        l = !0,
                        setTimeout(function() {
                            i.delAllPrompt()
                        },
                        3e3)
                    }
                },
                delAllPrompt: function() {
                    var e = document.querySelectorAll(".fixed_info"),
                    t = e.length,
                    i = 0;
                    for (i = 0; t > i; i++) s.removeChild(e[i]);
                    l = !1
                },
                setStatus: function(e, t) {
                    d ? i.storage.set(e, t) : i.cookie.set(e, t, 604800)
                },
                getStatus: function(e) {
                    return d ? i.storage.get(e) : i.cookie.get(e)
                }
            };
            u.init(),
            Object.defineProperty(e.sinaCnHome, "attitude", {
                value: u
            })
        }
    } (window, document)
} catch(e) {
    throw new Error(e + " attitude.js")
}
try { !
    function(e, t) {
        "use strict";
        var i = e.sinaCnHome.S,
        n = "http://survey.sina.cn/aj/submit?",
        a = t.querySelector("#j_vote");
        if (a) {
            var s = document.querySelector("body"),
            r = a.getAttribute("data-pid"),
            o = a.getAttribute("data-qid"),
            c = "",
            l = !1,
            d = !1,
            u = !1,
            h = {
                init: function() {
                    this.checkLocalStorage();
                    var e = this.checkSetted();
                    e && (l = !0),
                    this.bindEvent()
                },
                checkLocalStorage: function() {
                    try {
                        localStorage.setItem("test", 1),
                        u = !0
                    } catch(e) {}
                },
                checkSetted: function() {
                    var e = this.getStatus("vot" + r + "-" + o),
                    t = null;
                    return e && (t = document.querySelector('[data-aid="' + e + '"]')) ? (i.addClass(t, "cur"), this.showBar(), !0) : !1
                },
                bindEvent: function() {
                    var e = this;
                    a.addEventListener("click",
                    function(t) {
                        return l ? void e.showPrompt("涓嶈兘閲嶅鎶曠エ锛�") : void e.deliverAttitude(t)
                    },
                    !1)
                },
                deliverAttitude: function(e) {
                    for (var t = e.target; ! i.hasClass(t, "f_vote");) {
                        if (i.hasClass(t, "vote_item")) {
                            this.setSelected(t),
                            c = t.getAttribute("data-aid"),
                            n += "poll_id=" + r + "&q_" + o + "=" + c,
                            i.ajax(n, this.callback.bind(this));
                            break
                        }
                        t = t.parentNode
                    }
                },
                showBar: function() {
                    var e = t.querySelectorAll(".progress_bar");
                    Array.prototype.forEach.call(e,
                    function(e) {
                        var t = e.getAttribute("data-progress");
                        e.style.width = t;
                        var i = '<i class="progress_num">' + t + "</i>";
                        e.insertAdjacentHTML("BeforeEnd", i)
                    })
                },
                callback: function(e) {
                    e && e.status ? (l = !0, this.setStatus("vot" + r + "-" + o, c), this.showPrompt("鎶曠エ鎴愬姛锛�"), this.showBar()) : this.showPrompt("鎶曠エ澶辫触锛�")
                },
                showPrompt: function(e) {
                    if (!d) {
                        var t = "",
                        i = this;
                        t += '<section class="fixed_info"><a href="javscript:;">',
                        t += e,
                        t += "</a></section>",
                        s.insertAdjacentHTML("beforeEnd", t),
                        d = !0,
                        setTimeout(function() {
                            i.delAllPrompt()
                        },
                        3e3)
                    }
                },
                delAllPrompt: function() {
                    var e = document.querySelectorAll(".fixed_info"),
                    t = e.length,
                    i = 0;
                    for (i = 0; t > i; i++) s.removeChild(e[i]);
                    d = !1
                },
                setSelected: function(e) {
                    var t = document.querySelectorAll(".vote_item"),
                    n = t.length,
                    a = 0;
                    for (a = 0; n > a; a++) i.removeClass(t[a], "cur");
                    i.addClass(e, "cur")
                },
                setStatus: function(e, t) {
                    u ? i.storage.set(e, t) : i.cookie.set(e, t, 604800)
                },
                getStatus: function(e) {
                    return u ? i.storage.get(e) : i.cookie.get(e)
                }
            };
            h.init(),
            Object.defineProperty(e.sinaCnHome, "vote", {
                value: h
            })
        }
    } (window, document)
} catch(e) {
    throw new Error(e + " vote.js")
}
try {
    var loginBox = document.getElementById("loginBox");
    loginBox && (!
    function() {
        "undefined" == typeof window.$WeiboJsApi && (window.$WeiboJsApi = {}),
        $WeiboJsApi._ajax = function(e) {
            e = e[0] || {},
            this.url = e.url || "",
            this.param = e.param || null,
            this.callback = e.callback ||
            function() {},
            this.timeout = e.timeout || 15e3,
            this.ontimeout = e.ontimeout ||
            function() {},
            this.timeoutflag = !0,
            "undefined" == typeof window._$WeiboJsApi_callback && (window._$WeiboJsApi_callback = {}),
            this._setJSONRequest()
        },
        $WeiboJsApi._ajax.prototype = {
            _setJSONRequest: function() {
                var e = document.getElementsByTagName("head")[0],
                t = document.createElement("script"),
                i = this._setRandomFun(),
                n = this,
                a = "";
                for (var s in this.param)"" == a ? a = s + "=" + this.param[s] : a += "&" + s + "=" + this.param[s];
                t.type = "text/javascript",
                t.charset = "utf-8",
                e ? e.appendChild(t) : document.body.appendChild(t),
                window._$WeiboJsApi_callback[i.id] = function(e) {
                    n.callback(e),
                    n.timeoutflag = !1,
                    setTimeout(function() {
                        delete window._$WeiboJsApi_callback[i.id],
                        t.parentNode.removeChild(t)
                    },
                    100)
                },
                t.src = this.url + "&callback=" + i.name + "&" + a,
                setTimeout(function() {
                    n.timeoutflag && (n.ontimeout(), setTimeout(function() {
                        delete window._$WeiboJsApi_callback[i.id],
                        t.parentNode.removeChild(t)
                    },
                    100))
                },
                n.timeout)
            },
            _setRandomFun: function() {
                var e = "";
                do e = "$WeiboJsApi" + Math.floor(1e4 * Math.random());
                while (window._$WeiboJsApi_callback[e]);
                return {
                    id: e,
                    name: "window._$WeiboJsApi_callback." + e
                }
            }
        },
        window.$WeiboJsApi.ajax = function() {
            return new $WeiboJsApi._ajax(arguments)
        },
        window.$WeiboJsApi.getWeiboInfo = function(e) {
            return new $WeiboJsApi.ajax({
                url: "http://127.0.0.1:9527/query?appid=com.sina.weibo",
                callback: e
            })
        },
        window.$WeiboJsApi.getAppInfo = function(e, t) {
            return new $WeiboJsApi.ajax({
                url: "http://127.0.0.1:9527/query?appid=" + e,
                callback: t
            })
        },
        window.$WeiboJsApi.startWeibo = function(e) {
            return new $WeiboJsApi.ajax({
                url: "http://127.0.0.1:9527/si?cmp=com.sina.weibo_com.sina.weibo.SplashActivity&act=android.intent.action.VIEW",
                callback: e
            })
        },
        window.$WeiboJsApi.startApp = function(e, t, i) {
            return new $WeiboJsApi.ajax({
                url: "http://127.0.0.1:9527/si?act=android.intent.action.VIEW&cmp=" + e + "_" + t,
                callback: i
            })
        },
        window.$WeiboJsApi.startScheme = function(e, t) {
            return new $WeiboJsApi.ajax({
                url: "http://127.0.0.1:9527/si?act=android.intent.action.VIEW&data=" + e,
                callback: t
            })
        },
        window.$WeiboJsApi.getUserInfo = function(e) {
            return new $WeiboJsApi.ajax({
                url: "http://127.0.0.1:9527/login?",
                callback: e.onsuccess,
                ontimeout: e.ontimeout,
                timeout: e.timeout
            })
        }
    } (),
    function(e, t) {
        function i(t) {
            var i, n = [],
            a = /%20/g;
            for (var s in t) i = t[s].toString(),
            n.push(e.encodeURIComponent(s).replace(a, "+") + "=" + e.encodeURIComponent(i).replace(a, "+"));
            return n.join("&")
        }
        function n(e) {
            return "[object Function]" === r.call(e)
        }
        function a(e) {
            var t = (new Date).getTime() + Math.floor(1e5 * Math.random());
            return e ? e + "" + t: t
        }
        function s(e, i) {
            var n = t.createElement("script");
            return n.src = e,
            i && (n.charset = i),
            n.async = !0,
            d(n),
            c ? o.insertBefore(n, c) : o.appendChild(n),
            n
        }
        var r = Object.prototype.toString,
        o = t.getElementsByTagName("head")[0] || t.documentElement,
        c = o.getElementsByTagName("base")[0],
        l = /^(?:loaded|complete|undefined)/,
        d = function(e, t) {
            e.onload = e.onreadystatechange = function() {
                l.test(e.readyState) && (e.onload = e.onreadystatechange = null, o.removeChild(e), e = null)
            }
        },
        u = function(e) {
            var t = e.jsonp || "callback",
            r = a("jsonpcallback"),
            o = t + "=" + r,
            c = window.setTimeout(function() {
                n(e.ontimeout) && e.ontimeout()
            },
            5e3);
            window[r] = function(t) {
                window.clearTimeout(c),
                n(e.onsuccess) && e.onsuccess(t)
            };
            var l = e.url.indexOf("?") > 0 ? "&": "?";
            e.data ? s(e.url + l + i(e.data) + "&" + o, e.charset) : s(e.url + l + o, e.charset)
        },
        h = {
            setCookie: function(e, i, n, a, s, r) {
                var o = [];
                if (o.push(e + "=" + escape(i)), n) {
                    var c = new Date,
                    l = c.getTime() + 36e5 * n;
                    c.setTime(l),
                    o.push("expires=" + c.toGMTString())
                }
                a && o.push("path=" + a),
                s && o.push("domain=" + s),
                r && o.push(r),
                t.cookie = o.join(";")
            },
            getCookie: function(e) {
                e = e.replace(/([\.\[\]\$])/g, "\\$1");
                var i = new RegExp(e + "=([^;]*)?;", "i"),
                n = t.cookie + ";",
                a = n.match(i);
                return a ? a[1] || "": ""
            },
            deleteCookie: function(e) {
                t.cookie = e + "=;expires=Fri, 31 Dec 1999 23:59:59 GMT;"
            }
        },
        p = function(e) {
            return t.getElementById(e)
        },
        f = {},
        m = !1;
        f.loginBox = p("loginBox"),
        u({
            url: "http://passport.sina.cn/sso/islogin",
            data: {
                entry: "wapsso"
            },
            charset: "utf-8",
            onsuccess: function(e) {
                if (2e7 === e.retcode) {
                    f.loginBox.href = e.data.return_url;
                    var t = '<img src="' + e.data.portrait_url + '">';
                    f.loginBox.innerHTML = t
                } else if (50011039 === e.retcode) {
                    var i = h.getCookie("needapp");
                    if ("" === i) m = !0;
                    else {
                        var n = (new Date).getTime() / 1e3,
                        a = (n - i) / 3600;
                        a > 24 && (m = !0)
                    }
                    m ? $WeiboJsApi.getUserInfo({
                        onsuccess: function(e) {
                            var t = {
                                entry: "wapsso",
                                id: e.uid,
                                login_state: e.login_state,
                                from: e.from
                            };
                            u({
                                url: "http://passport.sina.cn/sso/checkapp",
                                data: t,
                                charset: "utf-8",
                                onsuccess: function(t) {
                                    if (2e7 === t.retcode && 1 === e.login_state) {
                                        f.loginBox.href = t.data.return_url;
                                        var i = '<img src="' + e.portrait_url + '">';
                                        f.loginBox.innerHTML = i
                                    } else f.loginBox.href = t.data.return_url
                                }
                            })
                        },
                        ontimeout: function() {
                            f.loginBox.href != location.href && f.loginBox.href != location.href + "#" && (f.loginBox.href = "http://my.sina.cn/?pos=108&vt=4")
                        },
                        timeout: 2e3
                    }) : f.loginBox.href != location.href && f.loginBox.href != location.href + "#" && (f.loginBox.href = "http://my.sina.cn/?pos=108&vt=4")
                }
            }
        })
    } (window, document))
} catch(e) {
    throw new Error(e + " http://i.sso.sina.com.cn/js/check_login.js")
}
try { !
    function(e, t) {
        function i(e) {
            var t = e.toString().length - e.toString().indexOf(".") - 1,
            i = Math.ceil(Math.random() * Math.pow(10, t));
            return i <= e * Math.pow(10, t) ? 1 : 0
        }
        function n(e, i, n) {
            var a, s, r, o;
            return void 0 === i ? (a = "; " + window.document.cookie, s = a.split("; " + e + "="), 2 === s.length ? s.pop().split(";").shift() : null) : (i === !1 && (n = -1), n ? (o = new Date, o.setTime(o.getTime() + 864e5 * n), r = "; expires=" + o.toGMTString()) : r = "", void(t.cookie = e + "=" + i + r + "; path=/"))
        }
        function a(e, t) {
            t.removeChild(e)
        }
        function s(e) {
            var t = e.offsetTop;
            return null !== e.offsetParent && (t += s(e.offsetParent)),
            t
        }
        var r, o, c, l, d, u = e.globalConfig ? e.globalConfig.startTime: !1,
        h = t.body,
        p = ["loadFail"],
        f = {
            isCollect: i(.001),
            cookieName: "sina_collect_fe",
            global: {},
            timeout: 5e3,
            api: "http://open.api.sina.cn/log/add?log_type=WAP_FRONT&log_msg=",
            log: function(e, i) {
                var s, r = this,
                o = t.createElement("iframe");
                o.style.cssText = "width:1px;height:1px;display:none;",
                o.onError = o.onerror = o.onload = function() {
                    a(o, h),
                    clearTimeout(s),
                    n(r.cookieName, 1, .5),
                    i && i()
                },
                s = setTimeout(function() {
                    a(o, h),
                    o.onError = o.onerror = o.onload = null
                },
                this.timeout),
                o.src = this.api + encodeURIComponent(JSON.stringify(e)),
                h.appendChild(o)
            },
            add: function(e) {
                var t, i;
                for (t in e) e.hasOwnProperty(t) && (this.global.hasOwnProperty(t) ? (i = this.global[t], !(i instanceof Array) && (this.global[t] = [i]), this.global[t].push(e[t])) : this.global[t] = e[t])
            }
        };
        return e.collect = f,
        e.addEventListener("load",
        function() {
            if (e.gCollectLive && e.gCollectLive.forEach) {
                var t = e.collectChosed;
                t || e.gCollectLive.forEach(function(e) {
                    try {
                        e && Object.keys(e).forEach(function(e) {
                            t || -1 === p.indexOf(e) || (t = !0)
                        })
                    } catch(i) {
                        console.log(i)
                    }
                }),
                t && e.gCollectLive.forEach(function(e) {
                    e && f.add(e)
                }),
                e.gCollectLive.splice(0, gCollectLive.length)
            }
            Object.keys(f.global).length > 0 && (l = !0, c = !0, f.add({
                resolution: [e.screen.width, e.screen.height],
                ua: e.navigator.userAgent,
                from: e.location.href
            }), u && f.add({
                winOnload: Date.now() - u
            }), d && clearInterval(d), f.log(f.global))
        }),
        u && f.isCollect && !n(f.cookieName) ? (e.collectChosed = !0, r = e.screen.height, o = [], c = !1, l = !1, d = setInterval(function() {
            var e, t, i, n;
            if (c) {
                if (o.length) for (e = 0; e < o.length; e++) {
                    if (t = o[e], !t.complete) {
                        l = !1;
                        break
                    }
                    l = !0
                } else l = !0;
                l && (f.add({
                    firstScreenLoaded: Date.now() - u
                }), clearInterval(d))
            } else for (i = h.getElementsByTagName("img"), e = 0; e < i.length; e++) {
                if (t = i[e], n = s(t), n > r) {
                    c = !0;
                    break
                }
                r >= n && !t.hasPushed && (t.hasPushed = 1, o.push(t))
            }
        },
        0), void t.addEventListener("DOMContentLoaded",
        function() {
            var e = h.getElementsByTagName("img");
            e.length || (c = !0),
            f.add({
                docReady: Date.now() - u
            })
        })) : void(e.collectChosed = !1)
    } (window, document)
} catch(e) {
    throw new Error(e + " http://mjs.sinaimg.cn/wap/online/public/collect/v3/collect.min.js")
}
//# sourceMappingURL=homev7.js.map
