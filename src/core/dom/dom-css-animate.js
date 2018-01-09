import DOM from './dom';

const Animator = {
    callEvent(element, cls, options, event){
        if (options[event]){
            options[event](element, cls);
        }
    },
    addClass(element, cls, options, name){
        element.$$dom_animating_state = name;
        element.classList.add(`${cls}-${name}`);
        Animator.callEvent(element, cls, options, name);
    },
    state0(element, cls, options, name, fn){
        if (element.$$dom_animating_state == name) return;
        
        Animator.addClass(element, cls, options, name);
        setTimeout(() => { Animator.state1(element, cls, options, `${name}-to`, fn); }, 1);    
    },
    state1(element, cls, options, name, fn){
        let delay;
    
        if (element.$$dom_animating_state == name) return;
    
        Animator.addClass(element, cls, options, name);
        
        element.$$dom_animating_transitionend = function(){
            if (element.$$dom_animating_state == name){
                element.$$dom_animating_state = null;
                Animator.callEvent(element, cls, options, 'complete');
                element.removeEventListener('transitionend', element.$$dom_animating_transitionend);
                delete (element.$$dom_animating_transitionend);
                fn();
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
        element.classList.remove(`${cls}-leave`);
        element.classList.remove(`${cls}-leave-to`);

        element.removeEventListener('transitionend', element.$$dom_animating_transitionend);

        delete (element.$$dom_animating_state);
        delete (element.$$dom_animating_transitionend);

        if (options.cancel){
            options.cancel(element, cls);
        }
    },
    getElementAnimationDelay(element){
        // REVIEW: deley value cache
        let styl = window.getComputedStyle(element);
        let delay, prefix;
    
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
            delay = styl.getPropertyValue(`${prefix}transition-duration`);
            delay = Number(delay.replace(/[^\d\.]/g, ''));
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

    return this.each(function (element) {
        if (transition == 'enter'){
            Animator.clear(element, cls, options);
        }

        Animator.state0(element, cls, options, transition, () => {
            if (transition == 'leave'){
                Animator.clear(element, cls, {});
            }
        });
        
        return this;
    });
};

export default function(element, options){
    return DOM(element).animate(options);
}
