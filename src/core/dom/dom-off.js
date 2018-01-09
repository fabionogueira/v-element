import DOM from './dom';

DOM.prototype.off = function (eventName, callback) {
    return this.each(function (element) {
        element.removeEventListener(eventName, callback);
    });
};

export default DOM.prototype.off;
