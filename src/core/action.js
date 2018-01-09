import closest from './dom/dom-closest';

let RULES = {};
let resizeTimeout;
let activeDownElement;

const action = {
    register (eventName, rule, callback) {
        if (!RULES[rule]) {
            RULES[rule] = [];
        }

        RULES[rule].push({
            eventName: eventName,
            callback: callback
        });

        return action;
    },

    unregister (eventName, rule, callback) {
        let i;
        let array = RULES[rule];

        if (array) {
            i = array.findIndex(function (item) {
                return eventName == item.eventName && (callback == item.callback);
            });

            if (i >= 0) array.splice(i, 1);
        }

        return action;
    },

    dispatch (event) {
        let target, rules, rule;
        let value = null;

        function doCallbacks (arr) {
            let a;

            (arr || []).forEach(item => {
                if (item.eventName == '*' || item.eventName == event.type) {
                    a = value ? value.replace(`${rule}:`, '').split(':') : [value];
                    item.callback.apply(null, [event, target].concat(a));
                }
            });
        }

        if (event.target) {
            target = closest(event.target, '[action]');

            if (target) {
                value = target.getAttribute('action');
            }

            if (value) {
                rule = value ? value.split(':')[0] : null;
                rules = target ? RULES[rule] : null;
                doCallbacks(rules);
            }

            doCallbacks(RULES['*']);
        }

    }
};

// <element data-action="back"></element>
action.register('click', 'back', () => {
    history.back();
});

document.addEventListener('click', event => {
    action.dispatch(event);
});
document.addEventListener('mousedown', event => {
    let e = closest(event.target, '.v-element');

    if (activeDownElement) {
        activeDownElement.removeAttribute('pressed');
    }

    if (e) {
        activeDownElement = e;
        activeDownElement.setAttribute('pressed', '');
    }

    action.dispatch(event);
});
document.addEventListener('mouseup', event => {
    if (activeDownElement) {
        activeDownElement.removeAttribute('pressed');
        activeDownElement = null;
    }

    action.dispatch(event);
});
document.addEventListener('keydown', event => {
    action.dispatch(event);
});
document.addEventListener('keyup', event => {
    action.dispatch(event);
});

window.addEventListener('resize', event => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        action.dispatch(event);
    }, 250);
});

export default action;
