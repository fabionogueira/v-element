import DOM from './dom';

DOM.prototype.rect = function () {
    let h, r, D;
    let element = this[0];
    
    if (!element) {
        r = {
            top: 0,
            left: 0,
            width: 0,
            height: 0
        };
        h = 0;
    } else {
        if (element === document || element === document.body || element === window) {
            D = document;

            r = D.body.getBoundingClientRect();
            h = Math.max(
                D.body.scrollHeight, D.documentElement.scrollHeight,
                D.body.offsetHeight, D.documentElement.offsetHeight,
                D.body.clientHeight, D.documentElement.clientHeight
            );
        } else {
            r = element.getBoundingClientRect();
            h = r.height; // element.clientHeight || element.offsetHeight;
        }
    }

    return {
        top: r.top,
        left: r.left,
        width: D === document ? r.width : (element.clientWidth || element.offsetWidth),
        height: h
    };  
};

export default function(element){
    return DOM(element).rect();
}
