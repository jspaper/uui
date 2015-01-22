/*
Class: uui.Form
This class would add CSS class based on Ext and set dependance disabled or not via HTML tag 'disableBy'.
The form component contain as below would be rendered:
 - uui-textfield
 - uui-password
 - uui-numberfield
 - uui-checkbox
 - uui-radiogroup
 - uui-select

Also see: <Validate>

*/
var frm = function() {
    //private
    var _items = []; //the id of been rendered items
    var _appendDiv = function(config) {
/*
		config:	{
			items:		<HTMLElement Array>
			style:{
				div: 	<String>
				el:		<String>
			}
		}
		*/
            if (config === null || config.items === undefined || config.items.length === 0 || config.style === undefined || config.style === null || config.style.div === undefined || config.style.div === null || config.style.el === undefined || config.style.el === null) {
                return;
            }

            var target = config.items[0];
            var div = document.createElement('span');
            config.items[0].setAttribute('class', config.style.el);
            var a = target.parentNode.replaceChild(div, target);
            div.setAttribute('class', config.style.div + ' q-form-wrap');
            div.id = idGenerator();
            if (config.items) {
                for (var i = 0; i < config.items.length; i++) {
                    div.appendChild(config.items[i]);
                }
            }

            _items.push(config.items[0].id);
        };


    return {
        //public
        'cleanOnDisable': false,

/*
Function: render
Pre-define the HTML tag and excute this function.

Parameters:
	config - <Object>
		{
			disableBy:		//TODO
		}

o Defind the HTML tag of the follow:

(start code)
<input type="radio" name="group1" id="rd1" value="DNS_STR01" class="uui-radiogroup">
<select id="xxx" class="uui-select" disableBy='rd1'>
<input type="text" class="uui-numberfield" name='pd_ip1' id='pd_ip1' maxlength=3 disableBy='rd1'>
<input type="radio" name="group1" id="rd2" value="DNS_STR01" class="uui-radiogroup">
(end)

o Excute the render():
(start code)
uui.Form.render();
(end)
*/
        render: function(config) {
            _items = [];

            // TextField
            $('input[class="uui-textfield"]').each(function() {
                if ($(this).attr('id') === '') {
                    $(this).attr('id', idGenerator());
                }
                _appendDiv({
                    items: [this],
                    style: {
                        div: 'x-form-text-wrap',
                        el: 'x-form-text q-form-field'
                    }
                });

            });

            // Textarea
            $('.uui-textarea').each(function() {
                if ($(this).attr('id') === '') {
                    $(this).attr('id', idGenerator());
                }
                _appendDiv({
                    items: [this],
                    style: {
                        div: 'x-form-text-wrap',
                        el: 'x-form-text q-form-field'
                    }
                });

            });

            // Password
            $('input[class="uui-password"]').each(function() {
                if ($(this).attr('id') === '') {
                    $(this).attr('id', idGenerator());
                }

                _appendDiv({
                    items: [this],
                    style: {
                        div: 'x-form-text-wrap',
                        el: 'x-form-text q-form-field'
                    }
                });
            });


            // NumberField
            $('.uui-numberfield').each(function() {
                if ($(this).attr('id') === '') {
                    $(this).attr('id', idGenerator());
                }

                // $(this).numeric(); TODO
                var items = [this];

                _appendDiv({
                    'items': items,
                    'style': {
                        div: 'x-form-text-wrap',
                        el: 'x-form-text q-form-field x-form-num-field'
                    }
                });
            });

            // Checkbox
            var chkArray = [];
            $('input[class="uui-checkbox"]').each(function() {
                var id = this.id;
                str_label = '';
                if (id === '') {
                    id = idGenerator();
                    this.id = id;
                }
                if ($('#' + id + '-label').length === 0) {
                    var label = document.createElement('label');
                    label.setAttribute('for', id);
                    label.id = id + '-label';
                    label.setAttribute('class', 'x-form-cb-label');
                    str_label = uui.i18nHelper.t(this.value);
                    label.innerHTML = str_label;

                    _appendDiv({
                        items: [this, label],
                        style: {
                            div: 'q-form-check-wrap',
                            el: 'x-form-checkbox q-form-field'
                        }
                    });
                }

                //Click Event
                $(this).click(function() {
                    frm.changeStatus(this, this.checked);
                });
            });

            // RadioGroup
            $('input[class="uui-radiogroup"]').each(function() {
                var id = this.id;
                if (id === '') {
                    id = idGenerator();
                    this.id = id;
                }
                var label = document.createElement('label');
                label.setAttribute('for', id);
                label.id = id + '-label';
                label.setAttribute('class', 'x-form-cb-label');
                console.info('uuuuu', uui.i18nHelper.t(this.value));
                label.innerHTML = uui.i18nHelper.t(this.value);
                $(this).removeAttr('value');
                _appendDiv({
                    items: [this, label],
                    style: {
                        div: 'q-form-check-wrap',
                        el: 'x-form-radio q-form-field'
                    }
                });

                $(this).change(function() {
                    frm.changeRadio(this, this.checked);
                });
            });

            // Select
            $('select[class="uui-select"]').each(function() {
                _appendDiv({
                    items: [this],
                    style: {
                        div: 'x-form-form-wrap',
                        el: 'x-form-text x-form-field q-form-select'
                    }
                });
            });

            // QNAP.util.RefreshString();

            //Set disable to all of the element of which parent is unchecked.
            if (config === undefined || config.disableBy === undefined || config.disableBy) {
                for (var i = 0; i < _items.length; i++) {
                    var $tmp = $('#' + _items[i]);
                    if ($tmp.attr('disableBy') !== undefined && $('#' + $tmp.attr('disableBy')).attr('checked') === false) {
                        $tmp.attr('disabled', 'disabled').parent().addClass('x-item-disabled');
                    }
                }
            }
        },

        changeStatus: function(targetEl, enabled) {
            //checkbox
            var children = $(document).find('*[disableBy="' + targetEl.id + '"]');
            if (enabled) {
                children.each(function(index) {
                    $(this).removeAttr('disabled').parent().removeClass('x-item-disabled');
                    frm.changeStatus(this, this.checked);
                });
            } else {
                children.each(function(index) {
                    $(this).attr('disabled', 'disabled').removeClass('x-form-invalid').parent().addClass('x-item-disabled').children('.x-form-invalid-icon').each(function() {
                        $(this).css('visibility', 'hidden');
                    });;
                    frm.changeStatus(this, false);
                });
            }
        },

        changeRadio: function(targetEl, enabled) {
            //radiogroup
            var current = targetEl,
                groupName = targetEl.name;
            //找出同一個group的radio
            $('input[name="' + groupName + '"]').each(function() {
                log(this.id);
                var sibling = this;
                //disableBy等於目前點選的radio就設為enabled,反之disabled
                $(document).find('*[disableBy="' + this.id + '"]').each(function() {
                    //1. children設為enabled
                    if ($(this).attr('disableBy') === current.id && $(current)[0].checked && enabled) {
                        $(this).removeAttr('disabled').parent().removeClass('x-item-disabled');

                        if ($(this).attr('type') === 'checkbox') {
                            frm.changeStatus(this, true);
                        } else if ($(this).attr('type') === 'radio') {
                            frm.changeRadio(this, true); //recursive
                        }
                    } else {
                        $(this).attr('disabled', 'disabled').removeClass('x-form-invalid').parent().addClass('x-item-disabled').children('.x-form-invalid-icon').each(function() {
                            $(this).css({
                                'visibility': 'hidden'
                            });
                        });

                        if ($(this).attr('type') === 'checkbox') {
                            frm.changeStatus(this, false);
                        } else if ($(this).attr('type') === 'radio') {
                            frm.changeRadio(this, false); //recursive
                        }
                    }
                    //2. children is checkbox
                    //3. children is radiogroup
                });
            });
        }
    };
}();

/*
Function: uui.Form
	Create and render a new Form object which contains validation.

	- If you use this method to add validation, be careful of don't render again.
	- If you declare <uui.Form> before load data, don't forget to trigger the 'change event' of elements of parent. Moreover, if you load data first, you don't need to trigger event.
		(start code)
			//html
			//<input id="auto_v6" name="ipv6_setting" type="radio" class="uui-radiogroup" value="DHCP" />
			//<input id="manual_v6" name="ipv6_setting" type="radio" class="uui-radiogroup" value="Manual" />
			//<input id="ipv6_address" class="uui-textfield" disableBy="manual_v6" />

			//declare a new Form object
			ES.Net.form.formCardV6=new uui.Form(...);

			//load data
			if (rec.ipv6_dhcp=='1'){
				$('#auto_v6').attr('checked',true).triggerHandler('change');
			}
		(end)

	Parameters:
 		o - <Object> The uui.Validate settings.
*/
uui.Form = function(o) {
    this.init(o);
}

uui.Form.render = frm.render;


uui.Form.prototype = {
    cfg: null,
    id: null,
    items: null,
    rendered: false,
    dirty: false,
    //配合validation的keyup event,可用來判斷表單是否有更動過
    init: function(obj) {
        this.cfg = obj;
        if (obj !== null) {
            if (obj.id !== null) {
                this.id = obj.id;
            }
            if ($.isArray(obj)) {
                this.items = obj;
                uui.Form.render();
                uui.Validate.items(obj);
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

(end)
*/
    isValid: function() {
        //only validate the enabled field
        for (var i = 0; i < this.items.length; i++) {
            if (!$('#' + this.items[i].id).attr('disabled')) {
                if ($('#' + this.items[i].id).attr('type') === 'checkbox') {
                    $('#' + this.items[i].id).triggerHandler('click');
                } else {
                    $('#' + this.items[i].id).triggerHandler('keyup');
                }
            }
        }
        for (var i = 0; i < this.items.length; i++) {
            if (!$('#' + this.items[i].id).attr('disabled')) {
                if (!$('#' + this.items[i].id).parent().hasClass('x-item-disabled') && $('#' + this.items[i].id).hasClass('x-form-invalid')) {
                    return false;
                }
            }
        }
        return true;
    },

/*
Function: items
	Add an array of objects representing the uui.Validate items.

*/
    items: function(ary) {
        this.items = ary;
        uui.Validate.items(ary);
    },
/*
Function: addItem
	Add a object representing the uui.Validate items.

*/
    addItem: function(o) {
        this.items.push(o);
        uui.Validate.items(this.items);
    },

/*
Function: isRendered
	TODO

*/
    isRendered: function() {
        if (this.rendered) {
            this.rendered = false;
            return true;
        } else {
            return false;
        }
    },
/*
Function: onRenderedEvent
	TODO

*/
    onRenderedEvent: function() {
        this.rendered = true;
        //$('#q-tip').html('onRenderedEvent was been fired.'+this.rendered);
        log('onRenderedEvent was been fired.' + this.rendered);
    }

};
