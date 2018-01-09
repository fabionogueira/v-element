import DOM from './dom';

DOM.prototype.on = function (eventName, callback) {
    return this.each(function (element) {
        element.addEventListener(eventName, callback);
    });
};

export default DOM.prototype.on;
