+function() {
    "use strict";
    for (var a = 0, b = ["ms", "moz", "webkit", "o"], c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(b) {
        var c = (new Date).getTime(),
            d = Math.max(0, 16 - (c - a)),
            e = window.setTimeout(function() {
                b(c + d)
            }, d);
        return a = c + d, e
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(a) {
        clearTimeout(a)
    })
}();
var store = function(a, b) {
    "use strict";

    function c(a, b, c) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * c * 60 * 60 * 1e3);
        var e = "; expires=" + d.toGMTString();
        document.cookie = a + "=" + b + e + "; path=/"
    }

    function d(a) {
        for (var b = a + "=", c = document.cookie.split(";"), d = 0, e = c.length; e > d; d++) {
            for (var f = c[d];
                " " === f.charAt(0);) f = f.substring(1, f.length);
            if (0 === f.indexOf(b)) return f.substring(b.length, f.length)
        }
        return null
    }
    var e, f = navigator.userAgent.toLowerCase().indexOf("android") > -1,
        g = f ? !1 : !0;
    if ("undefined" != typeof b && null !== b && ("object" == typeof b && (b = JSON.stringify(b)), g ? localStorage.setItem(a, b) : c(a, b, 100)), "undefined" == typeof b) {
        if (g) e = localStorage.getItem(a);
        else {
            var h = d(a);
            e = null !== h ? h : localStorage.getItem(a)
        }
        try {
            e = JSON.parse(e)
        } catch (i) {
            e = e
        }
        return e
    }
    null === b && (g ? localStorage.removeItem(a) : c(a, "", -1))
};
$(function() {
    "use strict";

    function a(a) {
        this.options = a || {};
        var d, e, f, g, h, i = 320,
            j = 480,
            k = this.options.width || i,
            l = this.options.height || j,
            m = k / i,
            n = l / j,
            o = Math.round(50 * m),
            p = Math.round(120 * n),
            q = 3,
            r = o - q,
            s = p,
            t = 4,
            u = 3,
            v = 6,
            w = 5,
            x = 3,
            y = 20,
            z = 10,
            A = o + 30,
            B = k - o,
            C = Math.round(15 * m),
            D = Math.round(69 * m),
            E = "webkitTransitionEnd transitionend animationend webkitAnimationEnd",
            F = !1,
            G = !1,
            H = !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch),
            I = H ? "touchstart" : "click",
            J = [
                [18, 24, 10, 6],
                [18, 24, 5],
                [20, 18, 14],
                [18, 18, 7, 22, 11, 13],
                [18, 24, 10, 20, 28, 10, 20],
                [18, 24, 10, 28, 15, 32, 5],
                [20, 24, 15, 3, 7, 11],
                [18, 26, 8],
                [21, 28, 8, 17, 13, 9, 6, 5, 16],
                [18, 26, 7, 11, 5],
                [18, 24, 5],
                [26, 26, 2, 14, 18, 30, 22, 12, 12, 22],
                [24, 26, 13, 28, 24, 28, 15, 18, 15, 13, 24]
            ],
            K = {
                WELCOME: 0,
                PRE_BEGIN: 1,
                BEGIN: 2,
                STICK_ROTATION: 3,
                HERO_WALK: 4,
                SHIFTING: 5,
                DYING: 6,
                UPDATE: 7,
                DEAD: 8
            },
            L = K.DEAD,
            M = [{
                level: 1,
                from: 270,
                per: 25,
                prize: 5
            }, {
                level: 2,
                from: 0,
                per: 25,
                prize: 10
            }, {
                level: 3,
                from: 90,
                per: 20,
                prize: 20
            }, {
                level: 4,
                from: 162,
                per: 15,
                prize: 50
            }, {
                level: 5,
                from: 216,
                per: 10,
                prize: 100
            }, {
                level: 6,
                from: 252,
                per: 5,
                prize: "hero13"
            }],
            N = 13;
        return this.init = function() {
            this.initVars(), this.bindEvents(), this.reset()
        }, this.initVars = function() {
            this.$game = $("#game").css({
                width: k + "px",
                height: l + "px"
            }), H, this.$gametitle = $(".game-title"), this.$gameover = $(".game-over"), this.$welcome = $(".welcome"), this.$share = $(".share"), this.$livescore = $(".live-score"), this.$instruction = $(".instruction"), this.$about = $(".about"), this.$perfect = $(".perfect"), this.$score = $(".score"), this.$best = $(".best"), this.$total = $(".total"), this.$movedStick = $("nothing"), this._currentState = K.WELCOME, this.total = parseInt(store("total") || 0, 10), this.$total.text(this.total), this.heroInit(), this.switchHero(this.hero)
        }, this.heroInit = function() {
            this.hero = store("hero") || 11, this.$heros = $(".hero-p");
            for (var a = 0; a < J.length; a++) {
                var b = a + 1,
                    c = store("hero" + b) + "" == "true",
                    d = Math.round(J[a][0] * m),
                    e = Math.round(J[a][1] * m),
                    f = $(".hero" + b);
                1 !== b && 11 !== b && c && $('.wrapper[data-src="' + b + '"]').removeClass("locked"), f.css({
                    width: d + "px",
                    height: e + "px"
                }), (11 === b || 2 === b || 4 === b) && f.find(".hat").css({
                    width: d + 2 + "px"
                }), 1 === b && f.find(".mouse").css({
                    width: Math.floor(J[a][3] * m) + "px"
                }), 4 === b && f.find(".body").css({
                    width: Math.floor(J[a][3] * m) + "px",
                    height: Math.floor(J[a][4] * m) + "px",
                    top: Math.floor(J[a][5] * m) + "px"
                }), 5 === b && (f.find(".hair-up").css({
                    width: Math.floor(J[a][3] * m) + "px",
                    height: Math.floor(J[a][5] * m) + "px"
                }), f.find(".hair-down").css({
                    width: Math.floor(J[a][4] * m) + "px",
                    height: Math.floor(J[a][5] * m) + "px"
                }), f.find(".ribbon").css({
                    "border-right-width": Math.floor(J[a][6] * m) + "px"
                })), 6 === b && (f.find(".top").css({
                    width: Math.floor(J[a][3] * m) + "px",
                    height: Math.floor(J[a][4] * m) + "px"
                }), f.find(".top-front").css({
                    width: Math.floor(J[a][5] * m) + "px",
                    height: Math.floor(J[a][6] * m) + "px"
                })), 7 === b && (f.find(".hat1").css({
                    left: Math.floor(J[a][3] * m) + "px"
                }), f.find(".hat2").css({
                    left: Math.floor(J[a][4] * m) + "px"
                }), f.find(".hat3").css({
                    left: Math.floor(J[a][5] * m) + "px"
                })), 9 === b && (f.find(".body").css({
                    width: d + "px",
                    height: e + "px",
                    "border-radius": d + "px/" + e + "px"
                }), f.find(".head").css({
                    width: Math.floor(J[a][3] * m) + "px",
                    height: Math.floor(J[a][4] * m) + "px",
                    "border-radius": Math.floor(J[a][3] * m) + "px/" + Math.floor(J[a][4] * m) + "px"
                }), f.find(".heart").css({
                    width: Math.floor(J[a][5] * m) + "px",
                    left: Math.ceil(J[a][6] * m) + "px"
                }), f.find(".hand").css({
                    width: Math.floor(J[a][7] * m) + "px",
                    height: Math.floor(J[a][8] * m) + "px"
                })), 10 === b && f.find(".mouse").css({
                    width: Math.floor(J[a][3] * m) + "px",
                    height: Math.floor(J[a][4] * m) + "px",
                    "border-radius": Math.floor(J[a][3] * m) + "px/" + Math.floor(J[a][4] * m) + "px"
                }), 12 === b && (f.find(".body").css({
                    width: d + "px",
                    height: e + "px"
                }), f.find(".inside").css({
                    width: Math.floor(J[a][3] * m) + "px",
                    height: Math.floor(J[a][4] * m) + "px"
                }), f.find(".head").css({
                    width: Math.floor(J[a][5] * m) + "px",
                    height: Math.floor(J[a][5] * m) + "px",
                    top: -Math.floor(J[a][9] * m) + "px"
                }), f.find(".face").css({
                    width: Math.floor(J[a][6] * m) + "px",
                    height: Math.floor(J[a][6] * m) + "px"
                }), f.find(".mouse").css({
                    width: Math.floor(J[a][7] * m) + "px",
                    "border-radius": "0px 0px " + Math.floor(J[a][7] * m) + "px " + Math.floor(J[a][7] * m) + "px"
                }), f.find(".m").css({
                    width: Math.floor(J[a][8] * m) + "px"
                })), 13 === b && (f.find(".body").css({
                    width: d + "px",
                    height: e + "px"
                }), f.find(".head").css({
                    width: Math.floor(J[a][3] * m) + "px",
                    height: Math.floor(J[a][4] * m) + "px"
                }), f.find(".half").css({
                    width: Math.floor(J[a][5] * m) + "px",
                    height: Math.floor(J[a][6] * m) + "px"
                }), f.find(".mouse").css({
                    top: Math.floor(J[a][7] * m) + "px"
                }), f.find(".m").css({
                    width: Math.floor(J[a][8] * m) + "px",
                    top: Math.floor(J[a][9] * m) + "px"
                }), f.find(".strip1, .strip2").css({
                    width: Math.floor(J[a][10] * m) + "px"
                }))
            }
        }, this.switchHero = function(a) {
            this.hero = parseInt(a, 10) || this.hero, store("hero", this.hero);
            var b = J[this.hero - 1];
            d = Math.round(b[0] * m), e = Math.round(b[1] * m), f = b[2], g = p + f, h = o - d - t - q, this.$heros.hide(), this.$hero = $(".hero-p.hero" + this.hero).css({
                bottom: g + "px",
                transform: "translate3d(" + (k - d) / 2 + "px, 0, 0)",
                "-webkit-transform": "translate3d(" + (k - d) / 2 + "px, 0, 0)"
            }).show(), this.$feet = this.$hero.find(".foot")
        }, this.bindEvents = function() {
            var a = this;
            $(".btn-play").on(I, function() {
                a.nextAfterAnimation(a.$gametitle, K.PRE_BEGIN), a.$gametitle.addClass("hinge")
            }), $(".btn-playagain").on(I, function() {
                a.reset(), a.next(K.PRE_BEGIN)
            }), $(".btn-home").on(I, function() {
                a.reset(), a.next(K.WELCOME)
            }), $(document).on(I, ".heropick .wrapper", function(b) {
                var c = $(b.currentTarget),
                    d = parseInt(c.data("price"), 10),
                    e = c.data("src");
                c.hasClass("locked") ? a.total >= d ? (a.updateTotal(-d), a.unlockHero(e)) : b.preventDefault() : (a.switchHero(e), $(document).off(I, ".overlay"), a.$heropick.removeClass("in")), b.stopPropagation()
            }), $(document).on("mousedown touchstart", function(a) {
                F = !0, a.preventDefault()
            }), $(document).on("mouseup touchend", function() {
                F = !1
            })
        }, this.reset = function() {
            this.score = 0, this.count = 0, this.best = store("best") || 0, this.$heroContainer = this.$hero.parent(), this.$game.removeClass("bounce bg1 bg2 bg3 bg4 bg5 bg6").addClass("bg" + this._getRandom(1, 6)), this.$gametitle.removeClass("hinge"), this.$livescore.hide(), this.$gameover.hide(), this.updateScore(), $(".box, .stick").remove(), this.BOX1 = {
                left: 0,
                width: o
            }, this.$box1 = $("<div />").addClass("box init").css({
                height: p + "px",
                width: this.BOX1.width + "px",
                right: -this.BOX1.width + "px",
                transform: "translate3d(" + -(k + this.BOX1.width) / 2 + "px, 0, 0)",
                "-webkit-transform": "translate3d(" + -(k + this.BOX1.width) / 2 + "px, 0, 0)"
            }), this.$hero.hide().css({
                bottom: g + "px",
                transform: "translate3d(" + (k - d) / 2 + "px, 0, 0)",
                "-webkit-transform": "translate3d(" + (k - d) / 2 + "px, 0, 0)"
            }).show(), this.$game.append(this.$box1)
        }, this.start = function() {
            this.welcome()
        }, this.next = function(a) {
            void 0 !== a ? this._currentState = a : this._currentState === L ? this._currentState = 0 : this._currentState++;
            var d = c(b(K, this._currentState));
            "function" == typeof this[d] && this[d].call(this)
        }, this.nextAfterAnimation = function(a, b) {
            var c = this;
            a.on(E, function() {
                a.off(E), c.next(b)
            })
        }, this.welcome = function() {
            this.$gameover.hide(), this.$livescore.hide(), this.$welcome.show()
        }, this.preBegin = function() {
            this.$welcome.hide(), this.$gameover.hide(), this.$livescore.show(), this.$instruction.addClass("in"), this.BOX2 = this._createBox(), this.$box2 = $("<div />").addClass("box").css({
                height: p + "px",
                width: this.BOX2.width + "px",
                right: -this.BOX2.width + "px"
            }), this.$game.append(this.$box2), this.nextAfterAnimation(this.$box2), this.$hero.css({
                transform: "translate3d(" + (o - d - t - q) + "px, 0, 0)",
                "-webkit-transform": "translate3d(" + (o - d - t - q) + "px, 0, 0)"
            }), this.$box1.css({
                transform: "translate3d(" + -k + "px, 0, 0)",
                "-webkit-transform": "translate3d(" + -k + "px, 0, 0)"
            });
            var a = this;
            setTimeout(function() {
                a.$box2.css({
                    transform: "translate3d(" + -(k - a.BOX2.left) + "px, 0, 0)",
                    "-webkit-transform": "translate3d(" + -(k - a.BOX2.left) + "px, 0, 0)"
                })
            }, 100)
        }, this.begin = function() {
            this._activeStickHeight = 0, this._validStickMin = this.BOX2.left - o, this._validStickMax = this._validStickMin + this.BOX2.width, $(".plus-one").remove(), this.$activeStick = $("<div />").addClass("stick").css({
                left: r + "px",
                bottom: s + "px"
            }), this.$game.append(this.$activeStick);
            var a = this;
            G = !1, F = !1,
                function b() {
                    (G && F || !G) && window.requestAnimationFrame(b), F && (G || (a.$heroContainer.addClass("shake"), a.$instruction.removeClass("in"), G = !0), a._activeStickHeight += u, a.$activeStick[0].style.height = a._activeStickHeight + "px"), !F && G && a.next()
                }()
        }, this.stickRotation = function() {
            this.nextAfterAnimation(this.$activeStick), this.$heroContainer.removeClass("shake"), this.$activeStick.css({
                "transition-duration": "0.4s",
                "-webkit-transition-duration": "0.4s",
                "transition-timing-function": "ease-in",
                "-webkit-transition-timing-function": "ease-in"
            }).addClass("rotate")
        }, this.heroWalk = function() {
            if (this.dx = this.BOX2.left + this.BOX2.width - o, this._activeStickHeight > this._validStickMin && this._activeStickHeight < this._validStickMax) {
                if (this.nextAfterAnimation(this.$hero, K.SHIFTING), this._perfectMin = this._validStickMin + (this.BOX2.width - v) / 2, this._perfectMax = this._perfectMin + v, this.inc = 1, this._activeStickHeight >= this._perfectMin && this._activeStickHeight <= this._perfectMax) {
                    this.inc = 2, this.count++, this.$perfect.addClass("in");
                    var a = $("<div />").addClass("plus-one").css({
                        left: this.BOX2.left + (this.BOX2.width - 14) / 2 + "px",
                        bottom: p + 10 + "px"
                    }).text("+1");
                    this.$game.append(a), setTimeout(function() {
                        a.addClass("out")
                    }, 100), this.count >= w && this.unlockHero(5)
                } else this.count = 0;
                this.$hero.css({
                    transform: "translate3d(" + (this.BOX2.left + this.BOX2.width - d - t - q) + "px, 0, 0)",
                    "-webkit-transform": "translate3d(" + (this.BOX2.left + this.BOX2.width - d - t - q) + "px, 0, 0)",
                    "transition-duration": this.dx / 225 + "s",
                    "-webkit-transition-duration": this.dx / 225 + "s",
                    "transition-timing-function": "linear",
                    "-webkit-transition-timing-function": "linear"
                })
            } else {
                this.nextAfterAnimation(this.$hero, K.DYING);
                var b = (t + d + this._activeStickHeight) / 225;
                b = b > 1 ? 1 : b, this.$hero.css({
                    transform: "translate3d(" + (o + this._activeStickHeight) + "px, 0, 0)",
                    "-webkit-transform": "translate3d(" + (o + this._activeStickHeight) + "px, 0, 0)",
                    "transition-duration": b + "s",
                    "-webkit-transition-duration": b + "s",
                    "transition-timing-function": "linear",
                    "-webkit-transition-timing-function": "linear"
                })
            }
            this.$feet.addClass("walk"), this.$activeStick.css({
                "transition-duration": "",
                "-webkit-transition-duration": "",
                "transition-timing-function": "",
                "-webkit-transition-timing-function": ""
            })
        }, this.shifting = function() {
            this.nextAfterAnimation(this.$hero, K.UPDATE);
            var a = this;
            this.$feet.removeClass("walk").css("opacity", .9), setTimeout(function() {
                a.$feet.css("opacity", 1)
            }, 0), this.$perfect.removeClass("in"), this.$hero.css({
                transform: "translate3d(" + (o - d - t - q) + "px, 0, 0)",
                "-webkit-transform": "translate3d(" + (o - d - t - q) + "px, 0, 0)",
                "transition-duration": "",
                "-webkit-transition-duration": "",
                "transition-timing-function": "",
                "-webkit-transition-timing-function": ""
            }), this.$box1.css({
                transform: "translate3d(" + -(this.dx + k) + "px, 0, 0)",
                "-webkit-transform": "translate3d(" + -(this.dx + k) + "px, 0, 0)"
            }), this.$box2.css({
                transform: "translate3d(" + -(k - o + this.BOX2.width) + "px, 0, 0)",
                "-webkit-transform": "translate3d(" + -(k - o + this.BOX2.width) + "px, 0, 0)"
            }), this.$movedStick.css({
                transform: "translate3d(" + -(this.dx + k) + "px, 0, 0) rotate(90deg)",
                "-webkit-transform": "translate3d(" + -(this.dx + k) + "px, 0, 0) rotate(90deg)"
            }), this.BOX3 = this._createBox(), this.$box3 = $("<div />").addClass("box").css({
                height: p + "px",
                width: this.BOX3.width + "px",
                right: -this.BOX3.width + "px"
            }), this.$game.append(this.$box3), setTimeout(function() {
                a.$box3.css({
                    transform: "translate3d(" + -(k - a.BOX3.left) + "px, 0, 0)",
                    "-webkit-transform": "translate3d(" + -(k - a.BOX3.left) + "px, 0, 0)"
                })
            }, 100), this.$activeStick.css({
                transform: "translate3d(" + -this.dx + "px, 0, 0) rotate(90deg)",
                "-webkit-transform": "translate3d(" + -this.dx + "px, 0, 0) rotate(90deg)"
            })
        }, this.dying = function() {
            this.nextAfterAnimation(this.$hero, K.DEAD), this.$hero.css({
                transform: "translate3d(" + (o + this._activeStickHeight) + "px, " + (p + e + 50) + "px , 0)",
                "-webkit-transform": "translate3d(" + (o + this._activeStickHeight) + "px, " + (p + e + 50) + "px , 0)",
                "transition-duration": "0.2s",
                "-webkit-transition-duration": "0.2s",
                "transition-timing-function": "",
                "-webkit-transition-timing-function": ""
            }), this.$feet.removeClass("walk"), this.$activeStick.addClass("died");
            var a = Math.floor(this.score / y);
            a && this.updateDraw(a)
        }, this.update = function() {
            this.updateScore(this.inc), this.updateTotal(1), this.$box1.remove(), this.$box1 = this.$box2, this.BOX1 = this.BOX2, this.$box2 = this.$box3, this.BOX2 = this.BOX3, this.$movedStick.remove(), this.$movedStick = this.$activeStick, this.next(K.BEGIN)
        }, this.dead = function() {
            this._getRandom(1, 100) <= 70 && setTimeout(function() {
            }, this._getRandom(500, 1500)), this.$livescore.hide(), this.$gameover.show(), this.$game.addClass("bounce"), this.$hero.css({
                "transition-duration": "",
                "-webkit-transition-duration": ""
            })
        }, this.updateScore = function(a) {
            void 0 !== a && (this.score += a), this.best < this.score && (this.best = this.score, store("best", this.best)), this.$livescore.text(this.score), this.$score.text(this.score), this.$best.text(this.best)
        }, this.updateTotal = function(a) {
            void 0 !== a && (this.total += a), store("total", this.total), this.$total.text(this.total)
        }, this._createBox = function() {
            return {
                left: this._getRandom(A, B),
                width: this._getRandom(C, D)
            }
        }, this._getRandom = function(a, b) {
            return Math.floor(Math.random() * (b - a + 1)) + a
        }, this.init(), this
    }

    function b(a, b) {
        for (var c in a)
            if (a.hasOwnProperty(c) && a[c] === b) return c
    }

    function c(a) {
        return a ? a.toLowerCase().replace(/_(.)/g, function(a, b) {
            return b.toUpperCase()
        }) : void 0
    }
    var d = $(window).width(),
        e = $(window).height(),
        f = {};
    e > d && 500 > d && (f.width = d, f.height = e), new a(f).start()
});
