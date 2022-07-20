var jejucoding = {
    states: {}
};

jejucoding.utils = {
    getUseragent: function () {
        var useragent = window.navigator.userAgent.toLowerCase();
        return useragent;
    },

    checkIE: function () {
        var isIE = false;
        var elemHtml = document.querySelector('html');
        var ua = jejucoding.utils.getUseragent();

        if (ua.indexOf('windows') >= 0) {
            isIE = true;
            elemHtml.classList.add('ie');
            if (ua.indexOf('rv:11') >= 0) {
                elemHtml.classList.add('ie-11');
            }
        } else {
            elemHtml.classList.add('not-ie');
        }
        return isIE;
    },

    getOSName: function () {
        var useragent = jejucoding.utils.getUseragent();
        var os_name = '';

        if (useragent.indexOf('iphone') > 0 || useragent.indexOf('ipod') > 0 || useragent.indexOf('ipad') > 0) {
            os_name = 'ios';
        } else if (useragent.indexOf('android') > 0) {
            os_name = 'android';
        } else {
            os_name = 'not-mobile-os';
        }
        return os_name;
    }
};

jejucoding.init = (function () {
    var elemHtml = document.querySelector('html');
    jejucoding.states.isIE = jejucoding.utils.checkIE();
    elemHtml.classList.add(jejucoding.utils.getOSName());
})();























