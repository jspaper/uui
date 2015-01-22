//@singleton
/*
Class: uui.Validate
This is a singleton object which contains a set of commonly used field validation functions. The validations provided are basic and intended to be easily customizable and extended.

Validation could only verify type is select-one, input text, and checkbox, else didnt support yet. The input textfield would invoke keyup event after 500ms.

To add custom Validate specify the validation function, and optionally specify any corresponding error text to display. For example,

(start code)
	//setp1. custom validation function
	uui.extend(uui.Validate,{
		'diskTemperature':function(v){
			var strUnit=$('#tempUnit').val();
			var min,max;
			if (strUnit=='C'){
				if (v<5 || v>75){
					return {'success':false, 'invalidText':'IEI_NAS_ALERT88_3'};
				}
			}else if (strUnit=='F'){
				if (v<41 || v>167){
					return {'success':false, 'invalidText':'IEI_NAS_ALERT88_4'};
				}
			}
			return {'success':true};
		}
	});
	//step2. assign custom function to HTMLElement
	uui.Validate.items([
		{	id:'tempAlarm',
			fn:'diskTemperature'
		}
	]);
(end)
*/
uui.Validate = function() {
    //private
    var _success = true;
    var _allowBlank = true;
    var _items = []; //for form apply

    return {
        //public
        'blankText': 'This field is required',
        'minLengthText': 'The minimum length for this field is {0}',
        'maxLengthText': 'The maximum string length is 255 characters',
        'numberText': 'Invalid integer number',
        'emailText': 'Invalid email format',
        'cronText': 'Invalid format',

        'DELAY': 300,
/*
Function: items
	Add an array of objects representing the configuration of this class.

	Parameters:
 		ary - <Array> An Array of setting of the follow
		(start code)
		ary=[{
			 	id:				<String>					//HTMLElement id, see <Form>.
				fn:				<String>					//Validate function name
				parameters:		(optional) <String Array>	//invalidText contained.
				allowBlank:		(optional) <Boolean>
				minLength:		(optional) <Integer>
			 }
		];
		(end)

	Examples:
(start code)
				uui.extend(uui.Validate,{
					'protocol_type':function(){
						if (!$('#chk_prot_standard').attr('checked') && !$('#chk_prot_ssl').attr('checked')){
							return {'success':false, 'invalidText':'FTP_STR26'};
						}else{
							return {'success':true};
						}
					},
					'protocol_ssl':function(){
						uui.Validate.trigger('protocol_type',$('#chk_prot_standard'),null,null,null,'vProtocol');

						return {'success':true};
					},
					'maxIn':function(v, o){
						var num=parseInt(v);
						if (num<2 || num>256){
							return {'success':false, 'invalidText':'FTP_STR45'};
						}

						if ($('#txt_maxconn').val().length>0){
							var num2=parseInt($('#txt_maxconn').val());
							if (num<num2){
								return {'success':false, 'invalidText':'FTP_STR42'};
							}
						}
						return {'success':true};
					},
					'maxConn':function(v,o){
						var num=parseInt(v);
						if (num<2 || num>256){
							return {'success':false, 'invalidText':'FTP_STR45'};
						}
						uui.Validate.trigger('maxIn',$('#txt_maxinstance'));//validate the other field

						return {'success':true};
					}
				});

				uui.Validate.items([
					{	id:"txt_port",
						fn:"port",
						parameters:
							[{
								"exceptionPort":21,
								"invalidText":"IEI_DEVICE_MSG160"
							},{
								"min":1,"max":65535,
								"invalidText":"NIC_WAN_ALERT07"
							}],
						allowBlank:false
					},{
						id:"chk_prot_standard",
						fn:"protocol_type",
						vtarget:"vProtocol"
					},{
						id:"chk_prot_ssl",
						fn:"protocol_ssl"
					},{
						id:"txt_maxinstance",
						fn:"maxIn"
					},{
						id:"txt_maxconn",
						fn:"maxConn"
					},{
						id:"txt_urate",
						allowBlank:false
					},{
						id:"txt_drate",
						allowBlank:false
					},{
						id:"txt_portstart",
						fn:"port",
						parameters:
							[{
							 	"exceptionPort":-1,
								"invalidText":"IEI_DEVICE_MSG160"
							 },{
								"min":1025,"max":65535,
								"invalidText":"FTP_STR39"
							}],
						allowBlank:false
					},{
						id:"txt_portend",
						fn:"port",
						parameters:
							[{
							 	"exceptionPort":-1,
								"invalidText":"IEI_DEVICE_MSG160"
							 },{
								"min":1025,"max":65535,
								"invalidText":"FTP_STR39"
							}],
						allowBlank:false
					},{
						id:"txt_wanip",
						fn:"ip",
						parameters:[{"invalidText":"NIC_WAN_ALERT02"}],
						allowBlank:false
					}
				]);
(end)
*/
        'items': function(ary) {
            _items = []; //clear

            for (var i = 0; i < ary.length; i++) {
                var id = ary[i].id;
                var allowBlank = (ary[i].allowBlank !== undefined) ? ary[i].allowBlank : _allowBlank;
                _items.push(id);

                var evt = function() {
                    if (!$(this).parent().hasClass('x-item-disabled')) {
                        var obj = uui.json.parse('{' + $(this).attr('qParameters') + '}');
                        var fn, p, a, minLength, vtarget;

                        if (obj.validate !== undefined) {
                            fn = obj.validate.fn;
                            p = obj.validate.parameters;
                            a = obj.validate.allowBlank;
                            minLength = obj.validate.minLength;
                            vtarget = obj.validate.vtarget;
                        }
                        uui.Validate.trigger(fn, this, p, a, minLength, vtarget);
                    }
                };

                if ($('#' + id).attr('type') === 'checkbox') {
                    $('#' + id).click(evt);
                } else if ($('#' + id).attr('type') === 'select-one') {
                    $('#' + id).change(evt);
                } else {
                    $('#' + id).keyup(evt);
                    /*var delay = (function(){
					  var timer = 0;
					  return function(callback, ms){
						clearTimeout (timer);
						timer = setTimeout(callback, ms);
					  };
					})();
					$('#'+id).keyup(function(){
						var scope=this;
						delay(function(){evt.call(scope);},this.DELAY);
					});*/
                }

                var tmp = '';
                if (ary[i].fn !== undefined) {
                    tmp = '"fn":"' + ary[i].fn + '"';
                }
                if (ary[i].parameters !== undefined) {
                    tmp += (tmp.length > 0) ? ',' : '';
                    tmp += '"parameters":' + uui.json.toString(ary[i].parameters);
                }
                if (ary[i].minLength !== undefined) {
                    tmp += (tmp.length > 0) ? ',' : '';
                    tmp += '"minLength":' + ary[i].minLength;
                }
                if (allowBlank !== undefined) {
                    tmp += (tmp.length > 0) ? ',' : '';
                    tmp += '"allowBlank":' + allowBlank;
                }
                if (ary[i].vtarget !== undefined) {
                    tmp += (tmp.length > 0) ? ',' : '';
                    tmp += '"vtarget":' + '"' + ary[i].vtarget + '"';
                }

                $('#' + id).attr('qParameters', '"validate":{' + tmp + '}');
            }
        },
/*
Function: trigger
	Trigger the event which was defined before. Generally, you don't need to use this function to trigger event.

	Parameters:
 		fn - <String> the function name
 		target - <jQuery>
 		oParameter - <Object>
 		allowBlank - <Boolean>
		minLength - <Integer>
		vtarget	- <String> The HTMLElement id which will display the alarm icon.

*/
        'trigger': function(fn, target, oParameter, allowBlank, minLength, vtarget) {
            var ret = {};
/*
			ret={
				success: 		<Boolean>
				invalidText:	<String>
				from:			(optional) <String>
			}
			*/
            var val = (target instanceof jQuery) ? target.val() : target.value;
            if (allowBlank && val.length === 0) {
                ret.success = true;
            } else {
                //check blank
                if (val.length === 0) {
                    ret.success = false;
                    ret.invalidText = this.blankText;
                } else {
                    //check numeric
                    if ($(target).hasClass('uui-numberfield') && isNaN(val)) {
                        ret.success = false;
                        ret.invalidText = this.numberText;
                    } else {
                        //check minLength
                        if (minLength !== undefined && target.value.length < minLength) {
                            ret.success = false;
                            ret.invalidText = this.minLengthText;
                            ret.from = minLength;
                        } else {
                            if (fn !== undefined) {
                                //var tmp=escape(val.replaceChars('"','\'').replaceChars('\\','\\\\'));//input is "
                                var tmp = escape(val);

                                if (oParameter !== null) {
                                    ret = eval('this.' + fn + '("' + tmp + '",' + uui.json.toString(oParameter) + ')');
                                } else {
                                    ret = eval('this.' + fn + '("' + tmp + '")');
                                }
                            } else {
                                ret.success = true;
                            }
                        }
                    }

                }

            }

            //show or hide icon
            if (ret) {
                if (ret.success) {
                    this.hide({
                        'target': target,
                        'vtarget': vtarget
                    });
                } else {
                    var msg;
                    try {
                        msg = uui.i18nHelper.t(ret.invalidText);
                    } catch (err) {
                        //throw 'illegal character in "'+ret.invalidText+'"';
                    }
                    if (msg !== undefined) {
                        ret.invalidText = msg;
                    }
                    if (ret.from !== undefined) {
                        ret.invalidText = ret.invalidText.replace('{0}', ret.from);
                    }

                    this.show({
                        'target': target,
                        'vtarget': vtarget,
                        'msg': ret.invalidText
                    });
                }
            }
        },

/*
Function: hide
	Hide the error icon and message.

	Parameters:
 		o - <Object>

	Examples:
		(start code)
		uui.Validate.hide({'target':'username','vtarget': 'vUsername'});
		uui.Validate.hide({'target':'username'});
		(end)

*/
        hide: function(o) {
            var $target, $vtarget;

            $target = (typeof o.target === 'string') ? $('#' + o.target) : o.target;

            if (!o.vtarget) {
                $vtarget = $($target).parent().children('.x-form-invalid-icon');
            } else {
                $vtarget = $('#' + o.vtarget).children('.x-form-invalid-icon');
            }

            $($target).removeClass('x-form-invalid');
            $vtarget.each(function() {
                $(this).css('visibility', 'hidden');
            });
        },

/*
Function: show
	Show the error icon and message.

	Parameters:
 		o - <Object>

	Examples:
		(start code)
		uui.Validate.show({'target':'username','vtarget': 'vUsername','msg':ERROR_DELETE_AD_USER});
		(end)

*/
        show: function(o) {
            var target = o.target;
            var vtarget = o.vtarget;
            var msg = o.msg;

            if (typeof target === 'string') {
                target = $('#' + target);
            }
            $(target).addClass('x-form-invalid');

            if (vtarget === undefined) {
                if ($(target).parent().children('.x-form-invalid-icon').length === 0) {
                    $(target).after('<span class="x-form-invalid-icon q-form-invalid-icon" style="display: inline-block;  visibility: visible;" qclass="x-form-invalid-tip"></span>');
                    $(target).parent().children('.x-form-invalid-icon').attr('qtip', $.htmlEncode(msg));
                } else {
                    $(target).parent().children('.x-form-invalid-icon').css('visibility', 'visible').attr('qtip', $.htmlEncode(msg));
                }
            } else {
                if ($('#' + vtarget).children('.x-form-invalid-icon').length === 0) {
                    $('#' + vtarget).append('<span class="x-form-invalid-icon q-form-invalid-icon" style="display: inline-block;  visibility: visible;" qclass="x-form-invalid-tip"></span>');
                    $('#' + vtarget).children('.x-form-invalid-icon').attr('qtip', $.htmlEncode(msg));
                } else {
                    $('#' + vtarget).children('.x-form-invalid-icon').css('visibility', 'visible').attr('qtip', $.htmlEncode(msg));
                }

            }
        },

/*
Function: isValid
	This function would trigger the Keyup events of all component and return true or false.

	Returns:
		<Boolean>

	Examples:
(start code)
if (uui.Validate.isValid()){
	log('validate successfully');
}else{
	log('validate failure');
}
(end)
*/
        'isValid': function() {
            //only validate the enabled field
            for (var i = 0; i < _items.length; i++) {
                if (!$('#' + _items[i]).attr('disabled')) {
                    if ($('#' + _items[i]).attr('type') === 'checkbox') {
                        $('#' + _items[i]).triggerHandler('click');
                    } else {
                        $('#' + _items[i]).triggerHandler('keyup');
                    }
                }
            }
            for (var i = 0; i < _items.length; i++) {
                if (!$('#' + _items[i]).attr('disabled')) {
                    if (!$('#' + _items[i]).parent().hasClass('x-item-disabled') && $('#' + _items[i]).hasClass('x-form-invalid')) {
                        return false;
                    }
                }
            }
            return true;
        },

/*
Function: numberRange
	Check the numeric range is illegal or not.

	Parameters:
 		v - <Integer> Integer number
 		o - <Array>
		(start code)
			o=[{
				min:			<Integer>	//Minimum number
				max:			<Integer>	//Maxmimum number
				invalidText:	<String>	//When validate failure will display this message
			}];
		(end)

	Returns:
		<Object>
		(start code)
		returns={
			success:		<Boolean>
			invalidText:	(optional) <String>	(while success is false)
		};
		(end)
*/
        'numberRange': function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                if (condiction.min !== undefined && condiction.max !== undefined) {
                    var num = parseInt(v);
                    if (num < condiction.min || num > condiction.max) {
                        return {
                            'success': false,
                            'invalidText': condiction.invalidText
                        };
                    }
                }
            }
            return {
                'success': true
            };
        },

/*
Function: ip
	Check the IPv4 address is illegal or not.

	Parameters:
 		v - <String> IP address
 		o - <Array>
		(start code)
			o=[{
				invalidText:	<String>	//When validate failure will display this message
			}];
		(end)

	Returns:
		<Object>
		(start code)
		returns={
			success:		<Boolean>
			invalidText:	(optional) <String>	(while success is false)
		};
		(end)
*/

        'ip': function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                var p = new RegExp(/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/);
                if (!p.test(v)) {
                    return {
                        'success': false,
                        'invalidText': condiction.invalidText
                    };
                }

            }
            return {
                'success': true
            };
        },

/*
Function: userName
	Check the user name is illegal or not.

	Parameters:
 		v - <String> user name
 		o - <Array>
		(start code)
			o=[{
				"validChar":true,
				invalidText:	<String>	//When validate failure will display this message
			},{
				"startChar":true,
				invalidText:	<String>	//When validate failure will display this message
			}];
		(end)

	Returns:
		<Object>
		(start code)
		returns={
			success:		<Boolean>
			invalidText:	(optional) <String>	(while success is false)
		};
		(end)
*/
        'userName': function(v, o) {
            if (QNAP.util.countStrLen(v) > 255) {
                return {
                    'success': false,
                    'invalidText': this.maxLengthText
                };
            }
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                if (condiction.validChar !== undefined) {
                    if (!QNAP.util.isNotValidChar(v)) {
                        return {
                            'success': false,
                            'invalidText': condiction.invalidText
                        };
                    }
                }
                if (condiction.startChar !== undefined) {
                    if (v.charAt(0) === '-' || v.charAt(0) === '#' || v.charAt(0) === '@' || v.charAt(0) ===' ') {
                        return {
                            'success': false,
                            'invalidText': condiction.invalidText
                        };
                    }
                }
            }
            return {
                'success': true
            };
        },
/*
Function: domainName
	Check domain name is illegal or not.

	Parameters:
 		v - <String> domain name
 		o - <Array>
		(start code)
			o=[{
				"name_rule":true,
				invalidText: 	<String>	//When check letters failure will display this message
			}];
		(end)

	Returns:
		<Object>
		(start code)
		returns={
			success:		<Boolean>
			invalidText:	(optional) <String>	(while success is false)
		};
		(end)
*/

        'domainName': function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                if (condiction.name_rule !== undefined) {
                    var p = new RegExp(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/);
                    if (!p.test(v)) {
                        return {
                            'success': false,
                            'invalidText': condiction.invalidText
                        };
                    }
                }
            }
            return {
                'success': true
            };
        },

/*
Function: password
	Check the password is illegal or not.

	Parameters:
 		v - <String> password value
 		o - <Array>
		(start code)
			o=[{
				invalidText:	<String>	//When validate failure will display this message
			},];
		(end)

	Returns:
		<Object>
		(start code)
		returns={
			success:		<Boolean>
			invalidText:	(optional) <String>	(while success is false)
		};
		(end)
*/

        'password': function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                if (v.indexOf("\\") >= 0 || v.indexOf("/") >= 0 || v.indexOf('"') >= 0 || v.indexOf("'") >= 0) {
                    return {
                        'success': false,
                        'invalidText': condiction.invalidText
                    };
                }
            }
            return {
                'success': true
            };
        },
/*
Function: email
	Check the email is illegal or not.

	Parameters:
 		v - <String> email address

	Returns:
		<Object>
		(start code)
		returns={
			success:		<Boolean>
			invalidText:	(optional) <String>	(while success is false)
		};
		(end)
*/
        'email': function(v) {
            var pattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
            if (!pattern.test(v)) {
                return {
                    'success': false,
                    'invalidText': this.emailText
                };
            }
            return {
                'success': true
            };
        },
/*
Function: commonWord
	Letter, Number, dash, underline, and dot only.
*/
        'commonWord': function(v, o) {
            for (var i = 0; i < o.length; i++) {
                var condiction = o[i];
                var pattern = new RegExp(/^[\w|\_|\-\.]*$/);
                if (!pattern.test(v)) {
                    return {
                        'success': false,
                        'invalidText': condiction.invalidText
                    };
                }
            }
            return {
                'success': true
            };
        }

    };
}();
