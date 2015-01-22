/*! uui 2015-01-21 */
function log(msg) {
    window.console && console.log(msg);
}

function idGenerator(prefix) {
    return void 0 === oCounter[prefix] && void 0 !== prefix && (oCounter[prefix] = 0), 
    void 0 === prefix ? (oCounter["uui-gen"]++, "uui-gen" + oCounter["uui-gen"]) : (oCounter[prefix]++, 
    prefix + oCounter[prefix]);
}

void 0 === window.uui && (window.uui = {}), uui.config = {
    i18n_enable: !1,
    i18n_namespace: null,
    debugLevel: 99
}, uui.extend = function(obj, config, defaults) {
    if (defaults && uui.extend(obj, defaults), obj && config && "object" == typeof config) for (var p in config) obj[p] = config[p];
    return obj;
}, uui.util = {
    delay: function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer), timer = setTimeout(callback, ms);
        };
    }(),
    xmlEncode: function(str) {
        return void 0 === str ? void 0 : str.replace(/\&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;");
    },
    getAttribute: function(elm, name, def) {
        var val = elm.getAttribute(name);
        return val || (val = def), val;
    },
    getXmlText: function(docRoot, tag) {
        var elm = docRoot.getElementsByTagName(tag)[0];
        return elm ? (elm = elm.firstChild, elm ? elm.nodeValue : "") : null;
    },
    isEmpty: function(obj) {
        for (var i in obj) return !1;
        return !0;
    },
    convertNum: function(str) {
        var the_length = str.length, last_char = str.charAt(the_length - 1).toLowerCase(), head_str = str.substring(0, the_length - 1);
        return "t" === last_char ? 1024 * head_str * 1024 * 1024 * 1024 : "g" === last_char ? 1024 * head_str * 1024 * 1024 : "m" === last_char ? 1024 * head_str * 1024 : "k" === last_char ? 1024 * head_str : str;
    },
    sortField: function(minId, maxId) {
        if (void 0 !== minId && null !== minId && void 0 !== maxId && null !== maxId) try {
            var start = $("#" + minId).val(), end = $("#" + maxId).val();
            null !== start && null !== end && parseInt(start) > parseInt(end) && ($("#" + minId).val(end), 
            $("#" + maxId).val(start));
        } catch (err) {
            throw err;
        }
    },
    intScaler: function(value, scale) {
        try {
            for (var strZero = "", i = 0; i < scale - value.toString().length; i++) strZero += "0";
            return strZero + value.toString();
        } catch (e) {
            throw e;
        }
    },
    temperatureUnit: function(data) {
        return null === data ? data : data.replace("C", "&deg;C").replace("F", "&deg;F");
    },
    ip: function(v, returnType) {
        return 2 !== arguments.length || null === v || null === returnType ? "" : "dec" === returnType ? 8 === v.length ? parseInt(v.substring(0, 2), 16) + "." + parseInt(v.substring(2, 4), 16) + "." + parseInt(v.substring(4, 6), 16) + "." + parseInt(v.substring(6, 8), 16) : void 0 : "hex" === returnType ? "not implement yet." : void 0;
    },
    toArray: function() {
        if (1 === arguments.length) {
            var data = arguments[0];
            if (null === data) return data;
            if (data.constructor !== Array) {
                var tmp = [];
                return tmp.push(data), tmp;
            }
            return data;
        }
        return 2 === arguments.length ? null === arguments[0] ? null : $.isArray(arguments[0][arguments[1].split(".")[0]]) ? arguments[0][arguments[1].split(".")[0]] : uui.util.toArray(uui.util.getProperty(arguments[0], arguments[1])) : void 0;
    },
    getProperty: function(obj, path) {
        for (var ary = path.split("."), i = 0; i < ary.length; i++) try {
            if (!obj.hasOwnProperty(ary[i])) return null;
            obj = obj[ary[i]];
        } catch (err) {
            return null;
        }
        return obj;
    },
    getArray: function(oR, path) {
        return uui.util.toArray(uui.util.getProperty(oR, path));
    },
    equals: function(v1, v2, config) {
        var omit = null;
        void 0 !== config && "undefined" !== config.omit && $.isArray(config.omit) && (omit = config.omit);
        var countProps = function(obj) {
            var count = 0;
            for (k in obj) count++;
            return count;
        };
        if (typeof v1 != typeof v2) return !1;
        if ("function" == typeof v1) return v1.toString() === v2.toString();
        if (countProps(v1) < countProps(v2)) {
            var tmp = v1;
            v1 = v2, v2 = tmp;
        }
        if (v1 instanceof Object && v2 instanceof Object) {
            if (null === omit && countProps(v1) !== countProps(v2)) return !1;
            var r = !0;
            for (k in v1) if (null === omit ? r = uui.util.equals(v1[k], v2[k]) : omit.has(k) || (r = uui.util.equals(v1[k], v2[k])), 
            !r) return !1;
            return !0;
        }
        return v1 === v2;
    },
    resetSelectOptions: function(id, ary, options) {
        if (null !== id) {
            var $el = $("#" + id);
            if (null !== options ? void 0 !== options.clear && options.clear === !1 || $el.find("option").remove() : $el.find("option").remove(), 
            null !== ary) for (var i = 0; i < ary.length; i++) {
                var v = "";
                v = null !== options && void 0 !== options.path ? ary[i][options.path].trim() : ary[i].trim(), 
                "" !== v && $el.append('<option value="' + v + '">' + v + "</option>");
            }
        }
    },
    qnapstr: function(name) {
        return "<span class='qnapstr' name='" + name + "'>" + eval(name) + "</span>";
    }
}, uui.html = {
    button: function() {
        return {
            setDisabled: function(id) {
                void 0 !== document.getElementById(id) && ($("#" + id).attr("class", "q-form-submit-disable"), 
                document.getElementById(id).onclick = null);
            },
            setEnabled: function(id, func) {
                void 0 !== document.getElementById(id) && ($("#" + id).attr("class", "q-form-submit"), 
                document.getElementById(id).onclick = func);
            }
        };
    }()
};

var oCounter = {
    "uui-gen": 0
}, frm = function() {
    var _items = [], _appendDiv = function(config) {
        if (null !== config && void 0 !== config.items && 0 !== config.items.length && void 0 !== config.style && null !== config.style && void 0 !== config.style.div && null !== config.style.div && void 0 !== config.style.el && null !== config.style.el) {
            var target = config.items[0], div = document.createElement("span");
            config.items[0].setAttribute("class", config.style.el);
            {
                target.parentNode.replaceChild(div, target);
            }
            if (div.setAttribute("class", config.style.div + " q-form-wrap"), div.id = idGenerator(), 
            config.items) for (var i = 0; i < config.items.length; i++) div.appendChild(config.items[i]);
            _items.push(config.items[0].id);
        }
    };
    return {
        cleanOnDisable: !1,
        render: function(config) {
            _items = [], $('input[class="uui-textfield"]').each(function() {
                "" === $(this).attr("id") && $(this).attr("id", idGenerator()), _appendDiv({
                    items: [ this ],
                    style: {
                        div: "x-form-text-wrap",
                        el: "x-form-text q-form-field"
                    }
                });
            }), $(".uui-textarea").each(function() {
                "" === $(this).attr("id") && $(this).attr("id", idGenerator()), _appendDiv({
                    items: [ this ],
                    style: {
                        div: "x-form-text-wrap",
                        el: "x-form-text q-form-field"
                    }
                });
            }), $('input[class="uui-password"]').each(function() {
                "" === $(this).attr("id") && $(this).attr("id", idGenerator()), _appendDiv({
                    items: [ this ],
                    style: {
                        div: "x-form-text-wrap",
                        el: "x-form-text q-form-field"
                    }
                });
            }), $(".uui-numberfield").each(function() {
                "" === $(this).attr("id") && $(this).attr("id", idGenerator());
                var items = [ this ];
                _appendDiv({
                    items: items,
                    style: {
                        div: "x-form-text-wrap",
                        el: "x-form-text q-form-field x-form-num-field"
                    }
                });
            });
            if ($('input[class="uui-checkbox"]').each(function() {
                var id = this.id;
                if (str_label = "", "" === id && (id = idGenerator(), this.id = id), 0 === $("#" + id + "-label").length) {
                    var label = document.createElement("label");
                    label.setAttribute("for", id), label.id = id + "-label", label.setAttribute("class", "x-form-cb-label"), 
                    str_label = uui.i18nHelper.t(this.value), label.innerHTML = str_label, _appendDiv({
                        items: [ this, label ],
                        style: {
                            div: "q-form-check-wrap",
                            el: "x-form-checkbox q-form-field"
                        }
                    });
                }
                $(this).click(function() {
                    frm.changeStatus(this, this.checked);
                });
            }), $('input[class="uui-radiogroup"]').each(function() {
                var id = this.id;
                "" === id && (id = idGenerator(), this.id = id);
                var label = document.createElement("label");
                label.setAttribute("for", id), label.id = id + "-label", label.setAttribute("class", "x-form-cb-label"), 
                console.info("uuuuu", uui.i18nHelper.t(this.value)), label.innerHTML = uui.i18nHelper.t(this.value), 
                $(this).removeAttr("value"), _appendDiv({
                    items: [ this, label ],
                    style: {
                        div: "q-form-check-wrap",
                        el: "x-form-radio q-form-field"
                    }
                }), $(this).change(function() {
                    frm.changeRadio(this, this.checked);
                });
            }), $('select[class="uui-select"]').each(function() {
                _appendDiv({
                    items: [ this ],
                    style: {
                        div: "x-form-form-wrap",
                        el: "x-form-text x-form-field q-form-select"
                    }
                });
            }), void 0 === config || void 0 === config.disableBy || config.disableBy) for (var i = 0; i < _items.length; i++) {
                var $tmp = $("#" + _items[i]);
                void 0 !== $tmp.attr("disableBy") && $("#" + $tmp.attr("disableBy")).attr("checked") === !1 && $tmp.attr("disabled", "disabled").parent().addClass("x-item-disabled");
            }
        },
        changeStatus: function(targetEl, enabled) {
            var children = $(document).find('*[disableBy="' + targetEl.id + '"]');
            children.each(enabled ? function() {
                $(this).removeAttr("disabled").parent().removeClass("x-item-disabled"), frm.changeStatus(this, this.checked);
            } : function() {
                $(this).attr("disabled", "disabled").removeClass("x-form-invalid").parent().addClass("x-item-disabled").children(".x-form-invalid-icon").each(function() {
                    $(this).css("visibility", "hidden");
                }), frm.changeStatus(this, !1);
            });
        },
        changeRadio: function(targetEl, enabled) {
            var current = targetEl, groupName = targetEl.name;
            $('input[name="' + groupName + '"]').each(function() {
                log(this.id);
                $(document).find('*[disableBy="' + this.id + '"]').each(function() {
                    $(this).attr("disableBy") === current.id && $(current)[0].checked && enabled ? ($(this).removeAttr("disabled").parent().removeClass("x-item-disabled"), 
                    "checkbox" === $(this).attr("type") ? frm.changeStatus(this, !0) : "radio" === $(this).attr("type") && frm.changeRadio(this, !0)) : ($(this).attr("disabled", "disabled").removeClass("x-form-invalid").parent().addClass("x-item-disabled").children(".x-form-invalid-icon").each(function() {
                        $(this).css({
                            visibility: "hidden"
                        });
                    }), "checkbox" === $(this).attr("type") ? frm.changeStatus(this, !1) : "radio" === $(this).attr("type") && frm.changeRadio(this, !1));
                });
            });
        }
    };
}();

uui.Form = function(o) {
    this.init(o);
}, uui.Form.render = frm.render, uui.Form.prototype = {
    cfg: null,
    id: null,
    items: null,
    rendered: !1,
    dirty: !1,
    init: function(obj) {
        this.cfg = obj, null !== obj && (null !== obj.id && (this.id = obj.id), $.isArray(obj) && (this.items = obj, 
        uui.Form.render(), uui.Validate.items(obj)));
    },
    isValid: function() {
        for (var i = 0; i < this.items.length; i++) $("#" + this.items[i].id).attr("disabled") || $("#" + this.items[i].id).triggerHandler("checkbox" === $("#" + this.items[i].id).attr("type") ? "click" : "keyup");
        for (var i = 0; i < this.items.length; i++) if (!$("#" + this.items[i].id).attr("disabled") && !$("#" + this.items[i].id).parent().hasClass("x-item-disabled") && $("#" + this.items[i].id).hasClass("x-form-invalid")) return !1;
        return !0;
    },
    items: function(ary) {
        this.items = ary, uui.Validate.items(ary);
    },
    addItem: function(o) {
        this.items.push(o), uui.Validate.items(this.items);
    },
    isRendered: function() {
        return this.rendered ? (this.rendered = !1, !0) : !1;
    },
    onRenderedEvent: function() {
        this.rendered = !0, log("onRenderedEvent was been fired." + this.rendered);
    }
}, uui.i18nHelper = function() {
    return {
        t: function(key) {
            return uui.config.i18n_enable ? '<span class="qnapstr" name="' + uui.config.i18n_namespace[key] + '"></span>' : key;
        }
    };
}(), uui.Validate = function() {
    var _success = !0, _allowBlank = !0, _items = [];
    return {
        blankText: "This field is required",
        minLengthText: "The minimum length for this field is {0}",
        maxLengthText: "The maximum string length is 255 characters",
        numberText: "Invalid integer number",
        emailText: "Invalid email format",
        cronText: "Invalid format",
        DELAY: 300,
        items: function(ary) {
            _items = [];
            for (var i = 0; i < ary.length; i++) {
                var id = ary[i].id, allowBlank = void 0 !== ary[i].allowBlank ? ary[i].allowBlank : _allowBlank;
                _items.push(id);
                var evt = function() {
                    if (!$(this).parent().hasClass("x-item-disabled")) {
                        var fn, p, a, minLength, vtarget, obj = uui.json.parse("{" + $(this).attr("qParameters") + "}");
                        void 0 !== obj.validate && (fn = obj.validate.fn, p = obj.validate.parameters, a = obj.validate.allowBlank, 
                        minLength = obj.validate.minLength, vtarget = obj.validate.vtarget), uui.Validate.trigger(fn, this, p, a, minLength, vtarget);
                    }
                };
                "checkbox" === $("#" + id).attr("type") ? $("#" + id).click(evt) : "select-one" === $("#" + id).attr("type") ? $("#" + id).change(evt) : $("#" + id).keyup(evt);
                var tmp = "";
                void 0 !== ary[i].fn && (tmp = '"fn":"' + ary[i].fn + '"'), void 0 !== ary[i].parameters && (tmp += tmp.length > 0 ? "," : "", 
                tmp += '"parameters":' + uui.json.toString(ary[i].parameters)), void 0 !== ary[i].minLength && (tmp += tmp.length > 0 ? "," : "", 
                tmp += '"minLength":' + ary[i].minLength), void 0 !== allowBlank && (tmp += tmp.length > 0 ? "," : "", 
                tmp += '"allowBlank":' + allowBlank), void 0 !== ary[i].vtarget && (tmp += tmp.length > 0 ? "," : "", 
                tmp += '"vtarget":"' + ary[i].vtarget + '"'), $("#" + id).attr("qParameters", '"validate":{' + tmp + "}");
            }
        },
        trigger: function(fn, target, oParameter, allowBlank, minLength, vtarget) {
            var ret = {}, val = target instanceof jQuery ? target.val() : target.value;
            if (allowBlank && 0 === val.length) ret.success = !0; else if (0 === val.length) ret.success = !1, 
            ret.invalidText = this.blankText; else if ($(target).hasClass("uui-numberfield") && isNaN(val)) ret.success = !1, 
            ret.invalidText = this.numberText; else if (void 0 !== minLength && target.value.length < minLength) ret.success = !1, 
            ret.invalidText = this.minLengthText, ret.from = minLength; else if (void 0 !== fn) {
                var tmp = escape(val);
                ret = eval(null !== oParameter ? "this." + fn + '("' + tmp + '",' + uui.json.toString(oParameter) + ")" : "this." + fn + '("' + tmp + '")');
            } else ret.success = !0;
            if (ret) if (ret.success) this.hide({
                target: target,
                vtarget: vtarget
            }); else {
                var msg;
                try {
                    msg = uui.i18nHelper.t(ret.invalidText);
                } catch (err) {}
                void 0 !== msg && (ret.invalidText = msg), void 0 !== ret.from && (ret.invalidText = ret.invalidText.replace("{0}", ret.from)), 
                this.show({
                    target: target,
                    vtarget: vtarget,
                    msg: ret.invalidText
                });
            }
        },
        hide: function(o) {
            var $target, $vtarget;
            $target = "string" == typeof o.target ? $("#" + o.target) : o.target, $vtarget = o.vtarget ? $("#" + o.vtarget).children(".x-form-invalid-icon") : $($target).parent().children(".x-form-invalid-icon"), 
            $($target).removeClass("x-form-invalid"), $vtarget.each(function() {
                $(this).css("visibility", "hidden");
            });
        },
        show: function(o) {
            var target = o.target, vtarget = o.vtarget, msg = o.msg;
            "string" == typeof target && (target = $("#" + target)), $(target).addClass("x-form-invalid"), 
            void 0 === vtarget ? 0 === $(target).parent().children(".x-form-invalid-icon").length ? ($(target).after('<span class="x-form-invalid-icon q-form-invalid-icon" style="display: inline-block;  visibility: visible;" qclass="x-form-invalid-tip"></span>'), 
            $(target).parent().children(".x-form-invalid-icon").attr("qtip", $.htmlEncode(msg))) : $(target).parent().children(".x-form-invalid-icon").css("visibility", "visible").attr("qtip", $.htmlEncode(msg)) : 0 === $("#" + vtarget).children(".x-form-invalid-icon").length ? ($("#" + vtarget).append('<span class="x-form-invalid-icon q-form-invalid-icon" style="display: inline-block;  visibility: visible;" qclass="x-form-invalid-tip"></span>'), 
            $("#" + vtarget).children(".x-form-invalid-icon").attr("qtip", $.htmlEncode(msg))) : $("#" + vtarget).children(".x-form-invalid-icon").css("visibility", "visible").attr("qtip", $.htmlEncode(msg));
        },
        isValid: function() {
            for (var i = 0; i < _items.length; i++) $("#" + _items[i]).attr("disabled") || $("#" + _items[i]).triggerHandler("checkbox" === $("#" + _items[i]).attr("type") ? "click" : "keyup");
            for (var i = 0; i < _items.length; i++) if (!$("#" + _items[i]).attr("disabled") && !$("#" + _items[i]).parent().hasClass("x-item-disabled") && $("#" + _items[i]).hasClass("x-form-invalid")) return !1;
            return !0;
        },
        numberRange: function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                if (void 0 !== condiction.min && void 0 !== condiction.max) {
                    var num = parseInt(v);
                    if (num < condiction.min || num > condiction.max) return {
                        success: !1,
                        invalidText: condiction.invalidText
                    };
                }
            }
            return {
                success: !0
            };
        },
        ip: function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i], p = new RegExp(/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/);
                if (!p.test(v)) return {
                    success: !1,
                    invalidText: condiction.invalidText
                };
            }
            return {
                success: !0
            };
        },
        userName: function(v, o) {
            if (QNAP.util.countStrLen(v) > 255) return {
                success: !1,
                invalidText: this.maxLengthText
            };
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                if (void 0 !== condiction.validChar && !QNAP.util.isNotValidChar(v)) return {
                    success: !1,
                    invalidText: condiction.invalidText
                };
                if (void 0 !== condiction.startChar && ("-" === v.charAt(0) || "#" === v.charAt(0) || "@" === v.charAt(0) || " " === v.charAt(0))) return {
                    success: !1,
                    invalidText: condiction.invalidText
                };
            }
            return {
                success: !0
            };
        },
        domainName: function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                if (void 0 !== condiction.name_rule) {
                    var p = new RegExp(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/);
                    if (!p.test(v)) return {
                        success: !1,
                        invalidText: condiction.invalidText
                    };
                }
            }
            return {
                success: !0
            };
        },
        password: function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                if (v.indexOf("\\") >= 0 || v.indexOf("/") >= 0 || v.indexOf('"') >= 0 || v.indexOf("'") >= 0) return {
                    success: !1,
                    invalidText: condiction.invalidText
                };
            }
            return {
                success: !0
            };
        },
        email: function(v) {
            var pattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
            return pattern.test(v) ? {
                success: !0
            } : {
                success: !1,
                invalidText: this.emailText
            };
        },
        commonWord: function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i], pattern = new RegExp(/^[\w|\_|\-\.]*$/);
                if (!pattern.test(v)) return {
                    success: !1,
                    invalidText: condiction.invalidText
                };
            }
            return {
                success: !0
            };
        }
    };
}();