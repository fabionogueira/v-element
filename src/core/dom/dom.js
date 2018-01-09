/**
 * @credits https://github.com/dciccale/ki.js/blob/master/ki.js
 */

let array = [];
let DOM;

function Init(selector) {
    array.push.apply(this, selector && selector.nodeType ? [selector] : '' + selector === selector ? document.querySelectorAll(selector) : null);
}

DOM = function (selector) {
    return /^f/.test(typeof selector) ? /c/.test(document.readyState) ? selector() : DOM(document).on('DOMContentLoaded', selector) : new Init(selector);
};

DOM.prototype = Init.prototype = DOM.fn = Init.fn = {
    length: 0,
    splice: array.splice,
    
    /**
     * each method
     * use native forEach to iterate collection
     * a = the function to call on each iteration
     * b = the this value for that function
    */
    each: function (a, b) {
        array.forEach.call(this, a, b);
        return this;
    }
};

DOM.fn = function(name, callback) {
    DOM.prototype[name] = callback;
};

export default DOM;
