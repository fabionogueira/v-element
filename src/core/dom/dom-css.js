import DOM from './dom';

DOM.prototype.css = function (css) {
    return this.each(function (element) {
        let i;

        for (i in css) {
            element.style[i] = css[i];
        }
      
        return this;
    });
};

export default function(element, css){
    return DOM(element).css(css);
}
