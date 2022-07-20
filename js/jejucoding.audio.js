jejucoding.audio = (function () {
    var states = jejucoding.states,
        utils = jejucoding.utils,
        extension,
        sounds,
        activeSounds;

    var initialize = function () {
        extension = formatTest();
        if (!extension) {
            return;
        }
        sounds = {};
        activeSounds = [];
    };

    var formatTest = function () {
        var exts = ['ogg', 'mp3'],
            i;
        for (i = 0; i < exts.length; i++) {
            if (Modernizr.audio[exts[i]] == 'probably') {
                return exts[i];
            }
        }
        for (i = 0; i < exts.length; i++) {
            if (Modernizr.audio[exts[i]] == 'maybe') {
                return exts[i];
            }
        }
    };

    var createAudio = function (name) {
        var elem = new Audio('sounds/' + name + '.' + extension);
        elem.addEventListener('ended', cleanActive);
        sounds[name] = sounds[name] || [];
        sounds[name].push(elem);
        return elem;
    };

    var cleanActive = function () {
        for (var i = 0; i < activeSounds.length; i++) {
            if (activeSounds[i].ended) {
                activeSounds.splice(i, 1);
            }
        }
    };

    var getAudioElement = function (name) {
        if (states.isIE > 0) { return; }
        if (sounds[name]) {
            for (var i = 0, n = sounds[name].length; i < n; i++) {
                if (sounds[name][i].ended) {
                    return sounds[name][i];
                }
            }
        }
        return createAudio(name);
    };

    var play = function (name) {
        var audio = getAudioElement(name);
        audio.play();
        activeSounds.push(audio);
    };

    var stop = function () {
        for (var i = activeSounds.length - 1; i >= 0; i--) {
            activeSounds[i].stop();
        }
        activeSounds = [];
    };

    return {
        initialize: initialize,
        play: play,
        stop: stop
    };

})();

























