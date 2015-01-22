uui.i18nHelper = function () {

    return {
        t: function (key) {
            if (uui.config.i18n_enable) {
                return '<span class="qnapstr" name="' + uui.config.i18n_namespace[key] + '"></span>';
            } else {
                return key;
            }
        }
    };

}();