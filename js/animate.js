
function animate(el, stylesObject, time, callback) {

    time = time || 1000;

    var startTime = null;

    var stylesArray = Object.keys(stylesObject);

    var ruleValue = stylesObject[stylesArray[0]];

    var splitRule = ruleValue.split(/[a-z]/gi);

    var unitLess = splitRule[0], unit = ruleValue.replace(unitLess, '');

    var startPos = parseInt(window.getComputedStyle(el,stylesArray[0])[stylesArray[0]].replace(/[^0-9]/gi, ''));

    var distance = Math.abs(startPos - unitLess);

    var frames = (time / 1000) * 60;

    var distancePerFrame = distance / frames;

    var nuPos = startPos;

    var lastProgress = 0;

    function step(timestamp) {
        if (!startTime) { startTime = timestamp; }
        var progress = timestamp - startTime;
        nuPos += (distancePerFrame * (Math.round((progress - lastProgress) / (16.666666666666668))));
        lastProgress = progress;
        el.style[stylesArray[0]] = Math.round(nuPos) + unit;
        if (Math.floor(progress) < time && nuPos < unitLess) {
            window.requestAnimationFrame(step);
        } else {
            el.style[stylesArray[0]] = stylesObject[stylesArray[0]];
            if (typeof callback === 'function') { callback(); }
        }
    }

    window.requestAnimationFrame(step);
}
