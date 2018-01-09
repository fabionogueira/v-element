import DOM from './dom';

DOM.prototype.remove = function () {
    return this.each(function (element) {
        element.parentNode.removeChild(element);
    });
};

export default DOM.prototype.remove;
