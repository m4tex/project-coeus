Array.prototype.emptyMap = function(callbackFn) {
    let array = Array.from(this);

    for (let i = 0; i < array.length; i++) {
        array[i] = callbackFn(i);
    }

    return array;
}