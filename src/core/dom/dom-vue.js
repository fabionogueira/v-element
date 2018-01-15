import DOM from './dom';

DOM.prototype.vue = function () {
    let element = this[0];
    return (element && element.__vue__) ? element.__vue__ : null; 
};

DOM.vue = function (selector) {
    let element = document.querySelector(selector);
    return (element && element.__vue__) ? element.__vue__ : null; 
};

export default function(){
    return arguments.length == 1 ? DOM.vue(arguments[0]) : DOM(arguments[0]).vue(arguments[1]);
}
