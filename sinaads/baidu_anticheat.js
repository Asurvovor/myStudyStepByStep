define && define({
    name: "anticheat",
    namespace: "rs.business",
    $anticheat: function() {
        window.antiArray && document.getElementById("container") && this.check("container", window.antiArray)
    },
    antiCheatArray: [],
    mouseInClientX: -1,
    mouseInClientY: -1,
    mouseInTime: -1,
    mouseInTimeSpan: -1,
    mousePressTime: -1,
    mouseClickClientX: -1,
    mouseClickClientY: -1,
    mouseClickCheckNum: -1,
    mouseOverTimes: -1,
    bind: function(e, i, t) {
        window.addEventListener ? e.addEventListener(i, t, !1) : e.attachEvent("on" + i, t)
    },
    formatEventObj: function(e) {
        return e = e || window.event,
        e.target = e.target || e.srcElement,
        e
    },
    mouseInHandler: function(e) { - 1 === this.mouseInClientX && (this.mouseInClientX = e.clientX),
        -1 === this.mouseInClientY && (this.mouseInClientY = e.clientY)
    },
    mouseInTimeHandler: function() { - 1 === this.mouseInTime && (this.mouseInTime = (new Date).getTime()),
        this.mouseInTimeSpan = (new Date).getTime() - this.mouseInTime
    },
    mousePressTimeHandler: function(e) {
        this.mousePressTime = "mousedown" === e.type ? (new Date).getTime() : (new Date).getTime() - this.mousePressTime
    },
    mouseClickHandler: function(e) {
        e = this.formatEventObj(e);
        var i = e.target;
        "a" !== i.tagName.toLowerCase() && (i = i.parentNode),
        this.mouseClickClientX = e.clientX,
        this.mouseClickClientY = e.clientY,
        this.mouseInTimeHandler(),
        this.mouseClickCheckNum = 0;
        var t = !1,
        n = i.href,
        s = /(?:\?|&)q=(.*?)(?=\&|$)/i;
        if (i.href.indexOf("google.com") > 0) {
            t = !0;
            var o = n.match(s)[1];
            i.href = decodeURIComponent(o)
        }
        for (var m = /\.php\?(url=)?([0-9a-zA-Z_-]*)\./.exec(i.href), r = m[2], a = /.*(\d+)/.exec(i.id), h = a[1], u = this.antiCheatArray[h], l = 0; l < this.mouseOverTimes * u % 99 + 9; l++) {
            var c = this.mousePressTime * l % r.length;
            this.mouseClickCheckNum += r.charCodeAt(c)
        }
        var d = i.innerHTML; - 1 == i.href.indexOf("&ck") && (i.href += "&ck=" + this.mouseClickCheckNum + "." + this.mouseOverTimes + "." + this.mousePressTime + "." + this.mouseClickClientX + "." + this.mouseClickClientY + "." + this.mouseInClientX + "." + this.mouseInClientY + "." + this.mouseInTimeSpan),
        null != d.match(/(www\.)|(.*@.*)/i) && document.all && (null == d.match(/\<.*\>/i) ? i.innerHTML = d: i.innerTEXT = d),
        t && (i.href = n.replace(s, "&q=" + encodeURIComponent(i.href)))
    },
    mouseOverHandler: function() { - 1 === this.mouseOverTimes && (this.mouseOverTimes = 0),
        this.mouseOverTimes++
    },
    check: function(e, i) {
        this.antiCheatArray = i || window.antiCheatArray;
        var t = document.getElementById(e),
        n = t.getElementsByTagName("a");
        this.bind(t, "mouseover", this.mouseInHandler.proxy(this)),
        this.bind(t, "mouseover", this.mouseInTimeHandler.proxy(this));
        for (var s = 0; s < n.length; s++) {
            var o = n[s].className;
            o && (o = o.toLowerCase(), "gylogo" === o || "bdlogo" === o || "bd-logo" === o.substring(0, 7)) || (this.bind(n[s], "mousedown", this.mousePressTimeHandler.proxy(this)), this.bind(n[s], "mouseup", this.mousePressTimeHandler.proxy(this)), this.bind(n[s], "click", this.mouseClickHandler.proxy(this)), this.bind(n[s], "mouseover", this.mouseOverHandler.proxy(this)))
        }
    }
});