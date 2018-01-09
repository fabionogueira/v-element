let selectors = {};

function checkById(id) {
    return function(element){
        return element.getAttribute('id') == id;
    };
}

function checkByAttributeExists(attr) {
    return function(element){
        return element.hasAttribute(attr);
    };
}

function checkByAttributeEquals(attr, value) {
    return function(element){
        return element.getAttribute(attr) == value;
    };
}

function checkByClassName(cls) {
    return function(element){
        return element.classList.contains(cls);
    };
}

function checkByTagName(tagName) {
    return function(element){
        return element.localName == tagName;
    };
}

function checkByCustomMethod(fn) {
    return function(element){
        return fn(element);
    };
}

export default function match(element, selector) {
    let a, c;
    let fn = selectors[selector];

    if (!fn){
        if (typeof selector == 'function'){
            return checkByCustomMethod(selector)(element);
        }

        c = selector.substr(0, 1);

        if (c === '#') {
            fn = checkById(selector.substr(1));
        } else if (c === '[') {
            a = selector.substr(1, selector.length - 2).split('=');
            fn = a.length == 1 ? checkByAttributeExists(a[0]) : checkByAttributeEquals(a[0], a[1]);
        } else if (c === '.') {
            fn = checkByClassName(selector.substr(1));
        } else {
            fn = checkByTagName(selector);
        }

        selectors[selector] = fn;
    }

    return fn(element);
}
