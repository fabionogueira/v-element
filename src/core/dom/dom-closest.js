import DOM from './dom';
import match from './dom-selector';

DOM.prototype.closest = function (selector) {
    let el = this[0];

    while (el && el != document.body){
        if (match(el, selector)){
            return el;
        }

        el = el.parentNode;
    }
};

export default function(element, selector){
    return DOM(element).closest(selector);
}
