let idIndex = 0;
let rootElement;
let targetElement;
let x, y;

export default {
    register(element, target = null) {
        let id = '';

        if (target) {
            id = target.getAttribute('id') || `drag-id-${idIndex++}`;
            target.setAttribute('id', id);
        }

        element.setAttribute('data-draggable', id);

        return this;
    },

    on(element, name, callback) {
        element[`__drag_on_${name}`] = callback;
        return this;
    },

    off(element, name) {
        delete (element[`__drag_on_${name}`]);
        return this;
    }
};

function dispatch(name, event = null) {
    let fn = rootElement ? rootElement[`__drag_on_${name}`] : null;

    if (fn) {
        fn(event);
    }
}

function onMouseMove(event) {
    let dx = event.screenX - x;
    let dy = event.screenY - y;
    let evt = {
        x: x,
        y: y,
        diffX: dx,
        diffY: dy,
        cancel: false
    };

    if (!targetElement.__drag_started) {
        targetElement.__drag_started = true;
        dispatch('dragstart');
    }
    dispatch('dragging', evt);

    if (evt.cancel !== true) {
        // posiciona o elemento
        targetElement.style.position = 'absolute';
        targetElement.style.top = `${y + dy}px`;
        targetElement.style.left = `${x + dx}px`;
    }

    window.dispatchEvent(new Event('resize'));

    return false;
}

function onMouseUp() {
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('mousemove', onMouseMove);

    targetElement.__drag_started = false;

    dispatch('dragend');
}

function onMouseDown(event) {
    let t = event.target;
    let id;

    while (t.parentNode) {
        id = t.getAttribute('data-draggable');

        if (id != null) {
            rootElement = t;
            targetElement = id ? document.getElementById(id) : t;
            x = event.screenX;
            y = event.screenY;

            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('mousemove', onMouseMove);
        } else {
            t = t.parentNode;
        }

    }
}

document.addEventListener('mousedown', onMouseDown);
