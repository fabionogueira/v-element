import DOM from './dom';

const Animator = {
    callEvent(element, cls, options, event){
        let ctrl = DOM(element).vue();

        event = `on-${event}`;
        
        if (options[event]){
            options[event](element, cls);
        }

        if (ctrl) {
            ctrl.$emit(event);
        }
    },
    addClass(element, cls, options, name){
        element.$$dom_animating_state = name;
        element.classList.add(`${cls}-${name}`);
        Animator.callEvent(element, cls, options, name);
    },

    // class="cls-[enter|leave]-active cls-[enter|leave]"
    state0(element, cls, options, name, fn){
        if (element.$$dom_animating) return;
        
        element.$$dom_animating = true;

        element.classList.add(`${cls}-${name}-active`); // add cls-[enter|leave]-active
        Animator.addClass(element, cls, options, name); // add cls-[enter|leave]
        
        setTimeout(() => { Animator.state1(element, cls, options, name, fn); }, 1);    
    },

    // class="cls-[enter|leave]-active cls-[enter|leave]-to"
    state1(element, cls, options, name, fn){
        let delay;
    
        if (!element.$$dom_animating) return;
        
        element.classList.remove(`${cls}-${name}`);    // remove cls-[enter|leave]
        Animator.addClass(element, cls, options, `${name}-to`);// add cls-[enter|leave]-to
        
        element.$$dom_animating_transitionend = function(){
            if (element.$$dom_animating){
                element.$$dom_animating = false;
                
                Animator.callEvent(element, cls, options, 'complete');
                element.removeEventListener('transitionend', element.$$dom_animating_transitionend);
                delete (element.$$dom_animating_transitionend);

                // remove all cls-[enter|leave]*
                Animator.clear(element, cls, options);
                if (fn) fn();
            }
        };
        
        delay = Animator.getElementAnimationDelay(element);
        element.addEventListener('transitionend', element.$$dom_animating_transitionend);
        setTimeout(() => {
            if (element.$$dom_animating_transitionend){
                element.$$dom_animating_transitionend();
            }
        }, delay + 40);
    },
    clear(element, cls, options){
        element.classList.remove(`${cls}-enter`);
        element.classList.remove(`${cls}-enter-to`);
        element.classList.remove(`${cls}-enter-active`);
        element.classList.remove(`${cls}-leave`);
        element.classList.remove(`${cls}-leave-to`);
        element.classList.remove(`${cls}-leave-active`);

        element.removeEventListener('transitionend', element.$$dom_animating_transitionend);

        delete (element.$$dom_animating);
        delete (element.$$dom_animating_transitionend);

        if (options.cancel){
            options.cancel(element, cls);
        }
    },
    getElementAnimationDelay(element){
        // REVIEW: deley value cache
        let styl = window.getComputedStyle(element);
        let delay, prefix, max;
    
        if (styl.getPropertyValue('animation-delay')) {
            prefix = '';
        } else if (styl.getPropertyValue('-webkit-animation-delay')) {
            prefix = '-webkit-';
        } else if (styl.getPropertyValue('-moz-animation-delay')) {
            prefix = '-moz-';
        } else {
            return 0;
        }
    
        delay = styl.getPropertyValue(`${prefix}animation-delay`);
        delay = Number(delay.replace(/[^\d\.]/g, ''));
        if (delay == 0){
            max = 0;
            styl.getPropertyValue(`${prefix}transition-duration`).split(',').forEach((d) => {
                delay = Number(d.replace(/[^\d\.]/g, ''));
                if (max === undefined) max = delay;
                if (delay > max) max = delay;
            });

            delay = max;
        }
    
        return (delay * 1000);
    }
};

/**
 * @param transition String enter|leave
 * @param cls String css class name
 * @param options Object
 */
DOM.prototype.animate = function (transition, cls, options) {
    options = options || {};
    if (typeof (options) == 'function'){
        options = {
            complete: options
        }
    }

    return this.each(function (element) {
        Animator.clear(element, cls, options);
        Animator.state0(element, cls, options, transition);
        
        return this;
    });
};

export default function(element, options){
    return DOM(element).animate(options);
}
