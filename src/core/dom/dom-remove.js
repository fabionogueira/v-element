import DOM from './dom';

DOM.prototype.remove = function () {
    return this.each(function (element) {
        if (element.parentNode){
            element.parentNode.removeChild(element);
        }
    });
};

export default DOM.prototype.remove;
