if (window.uui === undefined) window.uui = {};

uui.config = {
    i18n_enable: false,
    i18n_namespace: null,
    debugLevel: 99
};
/*
Function: extend
	Copies all the properties of config to obj.

	Parameters:
 		obj - <Object> obj The receiver of the properties
 		config - <Object> config The source of the properties
 		defaults - <Object> defaults A different object that will also be applied for default values

	Returns:
		<Object>

	Examples:
(start code)

uui.extend(uui.Validate,{
	'hostName':function(v){
		return {'success':false, 'invalidText':'error!!!'};
	}
});

(end)
*/


uui.extend = function(obj, config, defaults) {
    if (defaults) {
        uui.extend(obj, defaults);
    }
    if (obj && config && typeof config === 'object') {
        for (var p in config) {
            obj[p] = config[p];
        }
    }
    return obj;
}
/*
	class: uui.util
*/
uui.util = {

    delay: (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })(),

    xmlEncode: function(str) {
        if (str === undefined) {
            return;
        } else {
            return str.replace(/\&/g, '&' + 'amp;').replace(/</g, '&' + 'lt;').replace(/>/g, '&' + 'gt;').replace(/\'/g, '&' + 'apos;').replace(/\"/g, '&' + 'quot;');
        }
    },

    getAttribute: function(elm, name, def) {
        var val = elm.getAttribute(name);
        if (!val) val = def;

        return val;
    },

    getXmlText: function(docRoot, tag) {
        var elm = docRoot.getElementsByTagName(tag)[0];
        if (!elm) return null;

        elm = elm.firstChild;
        if (!elm) return '';

        return elm.nodeValue;
    },
/*
Function: isEmpty
	Check obj is empty or not.

	Parameters:
 		obj - <Object>

	Returns:
		<Boolean>

*/
    isEmpty: function(obj) {
        for (var i in obj) {
            return false;
        }
        return true;
    },

    convertNum: function(str) {
        var the_length = str.length;
        var last_char = str.charAt(the_length - 1).toLowerCase();
        var head_str = str.substring(0, the_length - 1);
        var multi = 1;

        if (last_char === 't') {
            return head_str * 1024 * 1024 * 1024 * 1024;
        } else if (last_char === 'g') {
            return head_str * 1024 * 1024 * 1024;
        } else if (last_char === 'm') {
            return head_str * 1024 * 1024;
        } else if (last_char === 'k') {
            return head_str * 1024;
        } else {
            return str;
        }
    },
/*
Function: sortField
	This function will sort two field number if necessary.

	Parameters:
 		minId - <String> The HTMLElement id should smaller than the other.
		maxId - <String> The HTMLElement id should bigger than the other.

*/
    sortField: function(minId, maxId) {
        if (minId === undefined || minId === null || maxId === undefined || maxId === null) {
            return;
        } else {
            try {
                var start = $('#' + minId).val();
                var end = $('#' + maxId).val();
                if (start !== null && end !== null) {
                    if (parseInt(start) > parseInt(end)) {
                        $('#' + minId).val(end);
                        $('#' + maxId).val(start);
                    }
                }
            } catch (err) {
                throw err;
            }
        }
    },

/*
Function: intScaler
	Integer scale '0'.

	Parameters:
 		value - <String | Integer> to be coverted string.
		scale - <Integer> The total length of return string.

	Returns:
		<String>

	Examples:
	(start code)

	log(uui.util.intScaler('32',3));
	//output 320

	(end)

*/
    intScaler: function(value, scale) {
        try {
            var strZero = '';

            for (var i = 0; i < scale - value.toString().length; i++) {
                strZero += '0';
            }
            return strZero + value.toString();
        } catch (e) {
            throw e;
        }
    },

/*
Function: temperatureUnit
	Convert the data contains C or F to °C or °F.

	Parameters:
 		data - <String> To be converted string contains C or F.

	Returns:
		<String>

	Examples:
	(start code)

	log(uui.util.temperatureUnit('20'));
	//output 20°C

	(end)

*/
    temperatureUnit: function(data) {
        if (data === null) {
            return data;
        }
        return data.replace('C', '&deg;C').replace('F', '&deg;F');
    },
/*
Function: ip
	Parse the IP address to hexadecimal or decimal.

	Parameters:
 		v - <String> To be parsed string.
		returnType - <String> 'dec' or 'hex'

	Returns:
		<String> A hexadecimal or decimal IP address.

*/
    ip: function(v, returnType) {
        if (arguments.length !== 2 || v === null || returnType === null) {
            return '';
        } else {
            if (returnType === 'dec') {
                if (v.length === 8) {
                    return parseInt(v.substring(0, 2), 16) + '.' + parseInt(v.substring(2, 4), 16) + '.' + parseInt(v.substring(4, 6), 16) + '.' + parseInt(v.substring(6, 8), 16);
                } else {
                    return;
                }
            } else if (returnType === 'hex') {
                return 'not implement yet.'
            }
        }
    },
/*
Function: toArray
	Push the data to an Array and return if necessary.

	Parameters:
 		data - <Any Type>

	Returns:
		<Array>
*/
    toArray: function() {
        if (arguments.length === 1) {
            var data = arguments[0];
            if (data === null) {
                return data;
            }

            if (data.constructor !== Array) {
                var tmp = [];
                tmp.push(data);
                return tmp;
            } else {
                return data;
            }
        } else if (arguments.length === 2) {
            if (arguments[0] === null) {
                return null;
            } else {

                if ($.isArray(arguments[0][arguments[1].split('.')[0]])) {
                    return arguments[0][arguments[1].split('.')[0]];
                } else {
                    return uui.util.toArray(uui.util.getProperty(arguments[0], arguments[1]));
                }
            }
        }
    },
/*
Function: getProperty
	Return the hierarchic property of object. If the hierarchic property isn't exist, return null.

	Parameters:
 		obj - <Object>
		path - <String>

	Returns:
		<Object>

	Examples:
		(start code)
			var oFoo={
				pool_list:{
					pool:'this is data'
				}
			};

			log(uui.util.getProperty(oFoo, 'pool_list.pool'));//this is data
			log(uui.util.getProperty(oFoo, 'pool_list.disk'));//null
		(end)
*/

    getProperty: function(obj, path) {
        var ary = path.split('.');
        for (var i = 0; i < ary.length; i++) {
            try {
                if (obj.hasOwnProperty(ary[i])) {
                    obj = obj[ary[i]];
                } else {
                    return null;
                }

            } catch (err) {
                return null
            }
        }
        return obj;
    },
/*
Function: getArray
	TODO

	Parameters:
 		oR - <String>
		path - <Array>
*/
    getArray: function(oR, path) {
        return uui.util.toArray(uui.util.getProperty(oR, path))
    },
/*
Function: equals
	TODO

	Parameters:
 		v1 - <Object | Function>
		v2 - <Object | Function>

	Returns:
		<Boolean>
*/
    equals: function(v1, v2, config) {
        var omit = null;
        if (config !== undefined && config.omit !== 'undefined' && $.isArray(config.omit)) {
            omit = config.omit;
        }
        var countProps = function(obj) {
                var count = 0;
                for (k in obj) {
                    count++;
                }
                return count;
            };

        if (typeof(v1) !== typeof(v2)) {
            return false;
        }

        if (typeof(v1) === "function") {
            return v1.toString() === v2.toString();
        }

        //確保v1的Properties大於等於v2的properties,方便後面的for迴圈
        if (countProps(v1) < countProps(v2)) {
            var tmp = v1;
            v1 = v2;
            v2 = tmp;
        }
        if (v1 instanceof Object && v2 instanceof Object) {
            if (omit === null) {
                if (countProps(v1) !== countProps(v2)) {
                    return false;
                }
            }
            var r = true;
            for (k in v1) {
                if (omit === null) {
                    r = uui.util.equals(v1[k], v2[k]);
                } else {
                    if (!omit.has(k)) {
                        r = uui.util.equals(v1[k], v2[k]);
                    }
                }
                if (!r) {
                    return false;
                }
            }
            return true;
        } else {
            return v1 === v2;
        }
    },
/*
Function: resetSelectOptions
	TODO

	Parameters:
 		id - <String>
		ary - <Array>
*/
    resetSelectOptions: function(id, ary, options) {
        if (id !== null) {
            var $el = $('#' + id);
            if (options !== null) {
                if (options.clear !== undefined && options.clear === false) {
                    //do nothing
                } else {
                    $el.find('option').remove();
                }
            } else {
                $el.find('option').remove();
            }

            if (ary !== null) {
                for (var i = 0; i < ary.length; i++) {
                    var v = '';
                    if (options !== null && options.path !== undefined) {
                        v = ary[i][options.path].trim();
                    } else {
                        v = ary[i].trim();
                    }
                    if (v !== '') {
                        $el.append('<option value="' + v + '">' + v + '</option>');
                    }
                }
            }
        }
    },
/*
Function: qnapstr
	Return the span of HTMLElement of specified name in lang file.

	Parameters:
 		name - <String> The varible of lang

	Returns:
		<String> The span string of specified name.

*/
    qnapstr: function(name) {
        return "<span class='qnapstr' name='" + name + "'>" + eval(name) + "</span>";
    }

};

/*
   class: uui.html
   <html tools>
*/
uui.html = {
/*
	   class: uui.html.button
	   <button utility>
	*/
    button: function() {

        return {
            // Function: setDisabled
            //   Unbind the click event and set css class 'button_disable'.
            //
            // Parameters:
            //   id - Button HTMLElement id.
            //
            setDisabled: function(id) {
                if (document.getElementById(id) !== undefined) {
                    $('#' + id).attr('class', 'q-form-submit-disable');
                    document.getElementById(id).onclick = null;
                }
            },
            // Function: setEnabled
            //   Bind the click event and set css class 'q-form-submit'
            //
            // Parameters:
            //   id - Button HTMLElement id.
            //	 func - Click event function.
            //
            setEnabled: function(id, func) {
                if (document.getElementById(id) !== undefined) {
                    $('#' + id).attr('class', 'q-form-submit');
                    document.getElementById(id).onclick = func;
                }
            }

        };
    }()

};


/*
Function: log
	Print to the console screen.

	Parameters:
 		msg - <String> The output message.
*/
function log(msg) {
    if (window.console) {
        console.log(msg);
    }
}

/*
Function: idGenerator
	The prefix 'uui-gen' of id generator.
*/
var oCounter = {
    'uui-gen': 0
};

function idGenerator(prefix) {
    if (oCounter[prefix] === undefined && prefix !== undefined) {
        oCounter[prefix] = 0;
    }
    if (prefix === undefined) {
        oCounter['uui-gen']++;
        return 'uui-gen' + oCounter['uui-gen'];
    } else {
        oCounter[prefix]++;
        return prefix + oCounter[prefix];
    }
};
