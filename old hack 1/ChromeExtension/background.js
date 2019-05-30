! function () {
    return function e(t, o, n) {
        function r(a, s) {
            if (!o[a]) {
                if (!t[a]) {
                    var c = "function" == typeof require && require;
                    if (!s && c) return c(a, !0);
                    if (i) return i(a, !0);
                    var d = new Error("Cannot find module '" + a + "'");
                    throw d.code = "MODULE_NOT_FOUND", d
                }
                var u = o[a] = {
                    exports: {}
                };
                t[a][0].call(u.exports, function (e) {
                    return r(t[a][1][e] || e)
                }, u, u.exports, e, t, o, n)
            }
            return o[a].exports
        }
        for (var i = "function" == typeof require && require, a = 0; a < n.length; a++) r(n[a]);
        return r
    }
}()({
    1: [function (e, t, o) {
        "use strict";
        var n, r = function () {
                return "_" + Math.random().toString(36).substring(7)
            },
            i = {
                game: r(),
                exports: r(),
                interactionEmitter: r(),
                emitActionCb: r(),
                smokeAlpha: r()
            },
            a = function (e) {
                return [{
                    name: "Exports exports scope",
                    from: /var ([a-z])={},(.*?);/g,
                    to: 'var $1={},$2;window["' + i.exports + '"]=$1;'
                }].forEach(function (t) {
                    t.from.test(e) ? e = e.replace(t.from, t.to) : console.log("Err patching: " + t.name)
                }), e
            },
            s = function (e) {
                return e = "(function(" + i.game + "," + i.exports + "," + i.interactionEmitter + "," + i.emitActionCb + "," + i.smokeAlpha + "){" + e, e += "\nwindow.init(" + i.game + "," + i.exports + "," + i.interactionEmitter + "," + i.emitActionCb + "," + i.smokeAlpha + "," + JSON.stringify(n) + "," + '"' + chrome.runtime.id + '");' + '})({}, window["' + i.exports + '"], {}, {}, {}, {});'
            };
        var c = function () {
                var e = null,
                    t = null,
                    o = null,
                    r = !1,
                    d = !1,
                    u = !1;
                var l = function (e, t) {
                        (function (e) {
                            [{
                                name: "Export game scope",
                                from: /this.canvasMode=this.pixi.renderer/,
                                to: i.game + ".scope=this;this.canvasMode=this.pixi.renderer"
                            }, {
                                name: "Action emitter export",
                                from: /([a-z])\.interaction\.text\=this\.getInteractionText\(([A-Za-z])\,([A-Za-z])\),/g,
                                to: "$1.interaction.text=this.getInteractionText($2,$3)," + i.interactionEmitter + ".scope=$3,"
                            }, {
                                name: "Action emission export",
                                from: /([a-z]).interaction.text&&\(([a-z]).interaction.text.innerHTML=([a-z]).interaction.text\)/g,
                                to: "e.interaction.text&&(a.interaction.text.innerHTML=t.interaction.text," + i.emitActionCb + ".scope())"
                            }, {
                                name: "Change removeAds function",
                                from: /removeAds:function\(\)/g,
                                to: "removeAds:function(){},_removeAds:function()"
                            }, {
                                name: "Smoke grenade alpha",
                                from: /sprite.tint=([a-z]).tint,([a-z]).sprite.alpha=[a-z],([a-z]).sprite.visible=([a-z]).active/g,
                                to: "sprite.tint=$1.tint,$2.sprite.alpha=" + i.smokeAlpha + ".scope,$3.sprite.visible=$4.active"
                            }, {
                                name: "Wheeldown emotes",
                                from: /([a-z])\(document\).on\(\"mousedown\",function\(([a-z])\){var ([a-z])=\"which\"in e\?3==e.which/g,
                                to: '$1(document).on("mousedown",function($2){var $3="which"in e?2==e.which'
                            }, {
                                name: "Wheelup emotes",
                                from: /([a-z])\(document\).on\("mouseup",function\(([a-z])\){3==e.which&&([a-z]).pingKeyTriggered&&([a-z]).pingMouseTriggered&&([a-z]).triggerPing\(\),3==e.which/g,
                                to: '$1(document).on("mouseup",function($2){2==e.which&&$3.pingKeyTriggered&&$4.pingMouseTriggered&&$5.triggerPing(),2==e.which'
                            }, {
                                name: "Window.appk fix",
		                    	from: /([A-Za-z_]).storeGeneric\("error","error"\),([A-Za-z_]).enabled=!1,e&&e.ws&&e.ws.close\(\);var t=document.body;if\(t\){for\(;t.firstChild;\)t.removeChild\(t.firstChild\);r\(t\)}/g,
                                to: ""
                            }, {
                                name: "Console Fix",
		                    	from: /console.log=i,/g,
                                to: "i(\"Nice try. ;) --zbot473\");\n"
                            }, {
                                name: "WS Fix",
		                    	from: /this\.ws\.send\(e\.getBuffer\(\)\)/g,
                                to: "if(e.getBuffer().length!=10){this.ws.send(e.getBuffer())}"
                            },  {
                                name: "Window onerror",
                                from: /window.onerror/g,
                                to: "window.onrandomvariable"
                            }].forEach(function (t) {
                                t.from.test(e) ? e = e.replace(t.from, t.to) : console.log("Err patching: " + t.name)
                            });
                            var t = chrome.extension.getURL("init.js");
                            return fetch(t).then(function (e) {
                                return e.text()
                            }).then(function (t) {
                                return t + e
                            }).then(function (e) {
                                return s(e)
                            })
                        })(e).then(function (e) {
                            c.setAppCode(e), u = !1, c.tryToInjectCode(t)
                        })
                    },
                    f = function (e, t) {
                        var o = "(function(){";
                        o += "var code = (", o += JSON.stringify({
                            code: t
                        }), o += ").code;", o += "var script = document.createElement('script');", o += "script.innerHTML = code;", o += "document.body.appendChild(script);", o += "})()";
                        try {
                            chrome.tabs.executeScript(e, {
                                code: o
                            })
                        } catch (e) {}
                    };
                return {
                    updateManifestCode: function (e, t, o) {
                        console.log("Executing xhr manifest request...");
                        var n = new XMLHttpRequest;
                        n.open("GET", e, !0), n.send(), n.onreadystatechange = function () {
                            if (4 == n.readyState) return 200 != this.status ? o() : void chrome.storage.local.set({
                                manifestCode: n.responseText,
                                mainfestVer: e.match(/manifest\.(.*)\.js/)[1]
                            }, function () {
                                return t(n.responseText)
                            })
                        }
                    },
                    updateVendorCode: function (e, t, o) {
                        console.log("Executing xhr vendor request...");
                        var n = new XMLHttpRequest;
                        n.open("GET", e, !0), n.send(), n.onreadystatechange = function () {
                            if (4 == n.readyState) return 200 != this.status ? o() : void chrome.storage.local.set({
                                vendorCode: n.responseText,
                                vendorVer: e.match(/vendor\.(.*)\.js/)[1]
                            }, function () {
                                return t(n.responseText)
                            })
                        }
                    },
                    updateAppCode: function (e, t, o) {
                        console.log("Executing xhr app request...");
                        var n = new XMLHttpRequest;
                        n.open("GET", e, !0), n.send(), n.onreadystatechange = function () {
                            if (4 == n.readyState) return 200 != this.status ? o() : void chrome.storage.local.set({
                                appCode: n.responseText,
                                appVer: e.match(/app\.(.*)\.js/)[1]
                            }, function () {
                                return t(n.responseText)
                            })
                        }
                    },
                    setManifestCode: function (t) {
                        e = t
                    },
                    setVendorCode: function (e) {
                        t = e
                    },
                    setAppCode: function (e) {
                        o = e
                    },
                    tryToInjectCode: function (n) {
                        if (e && t && o) return f(n, e), f(n, t), f(n, o), void(e = t = o = null)
                    },
                    onRequest: function (e, t) {
                        if (e.url.match(/manifest/)) {
                            if (r) return;
                            r = !0, chrome.storage.local.get(["manifestCode"], function (o) {
                                void 0 === o.manifestCode ? c.updateManifestCode(e.url, function (e) {
                                    console.log("Manifest code updated.");
                                    var o = a(e);
                                    c.setManifestCode(o), r = !1, c.tryToInjectCode(t.id)
                                }, function () {
                                    r = !1, console.log("Err getting manifest file. Page will be reloaded after 5 seconds..."), setTimeout(function () {
                                        chrome.tabs.reload(t.id, null, null)
                                    }, 5e3)
                                }) : chrome.storage.local.get(["mainfestVer"], function (n) {
                                    if (n.mainfestVer != e.url.match(/manifest\.(.*)\.js/)[1]) c.updateManifestCode(e.url, function (e) {
                                        console.log("Manifest code updated.");
                                        var o = a(e);
                                        c.setManifestCode(o), r = !1, c.tryToInjectCode(t.id)
                                    }, function () {
                                        r = !1, console.log("Err getting manifest file. Page will be reloaded after 5 seconds..."), setTimeout(function () {
                                            chrome.tabs.reload(t.id, null, null)
                                        }, 5e3)
                                    });
                                    else {
                                        var i = a(o.manifestCode);
                                        c.setManifestCode(i), r = !1, c.tryToInjectCode(t.id)
                                    }
                                })
                            })
                        }
                        if (e.url.match(/vendor/)) {
                            if (d) return;
                            d = !0, chrome.storage.local.get(["vendorCode"], function (o) {
                                void 0 === o.vendorCode ? c.updateVendorCode(e.url, function (e) {
                                    console.log("Vendor code updated."), c.setVendorCode(e), d = !1, c.tryToInjectCode(t.id)
                                }, function () {
                                    d = !1, console.log("Err update vendor file. Page will be reloaded after 5 seconds..."), setTimeout(function () {
                                        chrome.tabs.reload(t.id, null, null)
                                    }, 5e3)
                                }) : chrome.storage.local.get(["vendorVer"], function (n) {
                                    n.vendorVer != e.url.match(/vendor\.(.*)\.js/)[1] ? c.updateVendorCode(e.url, function (e) {
                                        console.log("Vendor code updated."), c.setVendorCode(e), d = !1, c.tryToInjectCode(t.id)
                                    }, function () {
                                        d = !1, console.log("Err update vendor file. Page will be reloaded after 5 seconds..."), setTimeout(function () {
                                            chrome.tabs.reload(t.id, null, null)
                                        }, 5e3)
                                    }) : (c.setVendorCode(o.vendorCode), d = !1, c.tryToInjectCode(t.id))
                                })
                            })
                        }
                        if (e.url.match(/app/)) {
                            if (u) return;
                            u = !0, chrome.storage.local.get(["options"], function (e) {
                                n = void 0 !== e.options ? e.options : null
                            }), chrome.storage.local.get(["appCode"], function (o) {
                                void 0 === o.appCode ? c.updateAppCode(e.url, function (e) {
                                    console.log("App code updated."), l(e, t.id)
                                }, function () {
                                    u = !1, console.log("Err update app file. Page will be reloaded after 5 seconds..."), setTimeout(function () {
                                        chrome.tabs.reload(t.id, null, null)
                                    }, 5e3)
                                }) : chrome.storage.local.get(["appVer"], function (n) {
                                    n.appVer != e.url.match(/app\.(.*)\.js/)[1] ? c.updateAppCode(e.url, function (e) {
                                        console.log("App code updated."), l(e, t.id)
                                    }, function () {
                                        u = !1, console.log("Err update app file. Page will be reloaded after 5 seconds..."), setTimeout(function () {
                                            chrome.tabs.reload(t.id, null, null)
                                        }, 5e3)
                                    }) : l(o.appCode, t.id)
                                })
                            })
                        }
                    }
                }
            }(),
            d = function (e, t, o) {
                try {
                    void 0 === (n = JSON.parse(e)).type ? chrome.storage.local.set({
                        options: n
                    }, function () {}) : "telemetry" === n.type && function (e) {
                        var t = new FormData;
                        for (var o in e) "string" == typeof e[o] ? t.append(o, e[o]) : t.append(o, JSON.stringify(e[o]));
                        fetch("https://survivnotifs.herokuapp.com/api/report", {
                            method: "POST",
                            body: t
                        })
                    }(n)
                } catch (e) {
                    console.log("Error: cannot handle user-script request.")
                }
            };
        chrome.webRequest.onBeforeRequest.addListener(function e(t) {
            return chrome.tabs.get(t.tabId, function (o) {
                if (!chrome.runtime.lastError) {
                    c.onRequest(t, o);
                    try {
                        extensionManager
                    } catch (e) {
                        return void console.log("Cannot find extensionManager. Launch default extension.")
                    }
                    extensionManager.isUpdateNeeded(function (t) {
                        t && extensionManager.updateExtension(function () {
                            extensionManager.extension(function (t) {
                                chrome.webRequest.onBeforeRequest.removeListener(e), chrome.runtime.onMessage.removeListener(d), extensionManager.install(t), chrome.tabs.update(o.id, {}, function (e) {}), console.log("Updating tab")
                            })
                        })
                    })
                }
            }), {
                cancel: !0
            }
        }, {
            urls: ["*://*.surviv.io/js/manifest.*.js", "*://*.surviv.io/js/vendor.*.js", "*://*.surviv.io/js/app.*.js", "*://*.surviv2.io/js/manifest.*.js", "*://*.surviv2.io/js/vendor.*.js", "*://*.surviv2.io/js/app.*.js", "*://*.2dbattleroyale.com/js/manifest.*.js", "*://*.2dbattleroyale.com/js/vendor.*.js", "*://*.2dbattleroyale.com/js/app.*.js", "*://*.2dbattleroyale.org/js/manifest.*.js", "*://*.2dbattleroyale.org/js/vendor.*.js", "*://*.2dbattleroyale.org/js/app.*.js", "*://*.googlesyndication.com/pagead/osd.js"],
            types: ["script"]
        }, ["blocking"]), chrome.runtime.onMessageExternal.addListener(d)
    }, {}]
}, {}, [1]);
