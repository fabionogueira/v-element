/**
 * Animation fo CSS3
 */

export default class Animate3 {
  suffix = {
    ENTER: 'enter', // Inicia o estado de entrada. Aplicado antes do elemento ser inserido, removido depois de um frame.
    ENTER_ACTIVE: 'enter-active', // Ativa e termina o estado de entrada. Aplicado antes do elemento ser inserido, removido quando a transição/animação termina.
    ENTER_TO: 'enter-to', // Estado final de entrada. Adicionado um frame após o elemento ser inserido (ao mesmo tempo que "enter" é removido), removido quando a transição/animação termina.
    LEAVE: 'leave', // Ativa o estado de saída. Aplicado quando a transição de saída é acionada, removido depois de um frame.
    LEAVE_ACTIVE: 'leave-active', // Estado ativo de saída. Aplicado duranto toda a fase de saída. Adicionado imediatamente quando a transição de saída é disparada, removido quando a transição/animação termina. Esta clase pode ser usada para definir a duração, atraso e a curva da transição de saída.
    LEAVE_TO: 'leave-to' // Estado final da saída. Adicionado um frame após a transição de saída ser disparada (ao mesmo tempo que "leave" é removido), removida quando a transição/animação termina.
  }

  /**
   * 
   * @param {HTMLElement} element 
   * @param {string} className 
   */
  addClass(element, className) {
    let options = element.element && element.className ? element : {element:element, className:className}

    options.events = options.events || {};

    // 0. remove e adiciona para garantir que a classe existe no atributo class do elemento
    element.classList
      .remove(options.className)
      .addClass(options.className);

    // prepara as funções de tratamento de início e fim da animação
    element.__animationstart = () => {
      if (options.events.start) options.events.start();
      this._removeMultipleEventListener(element, 'webkitAnimationStart animationstart', element.__animationstart)
    }
    element.__animationend = () => {
      if (options.events.end) options.events.end();
      this._complete(element, options)
    }
    
    // 1. injeta a classe enter
    element.classList.add(`${className}-${this.suffix.ENTER}`)
    window.requestAnimationFrame(() => {
      if (options.events.enter) options.events.enter()
      
      // registra os eventos DOM de animação
      this._addMultipleEventListener(element, 'webkitAnimationStart animationstart', element.__animationstart)
      this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', element.__animationend)

      // registra um tempo para a animação
      setTimeout(() => { this._complete(element, options) }, this._getElementAnimationDelay(element));

      // 2. injeta a classe enter-active
      element.classList.add(`${className}-${this.suffix.ENTER_ACTIVE}`)
      window.requestAnimationFrame(() => {
        if (options.events.enter_active) options.events.enter_active()
      })
    });
  }

  _complete(element, options){
    this._addMultipleEventListener(element, 'webkitAnimationEnd animationend', element.__animationend);
    this._addState(element, this.suffix.ENTER_ACTIVE, options.className, options.events.enter_active)
  }

  /**
   * @param {HTMLElement} element 
   * @param {String} className 
   * @param {Function} next
   */
  _enter(element, className, next) {
    className = `className-${this.suffix.ENTER}`;
    element.classList.add(className);

    window.requestAnimationFrame(() => {
      element.classList.remove(className);
      next()
    });
  }

  /**
   * @credits https://github.com/aurelia/animator-css
   * Vendor-prefix save method to get the animation-delay
   * 
   * @param {HTMLElement} element the element to inspect
   * @returns animation-delay in seconds
   */
  _getElementAnimationDelay(element) {
    let styl = window.getComputedStyle(element);
    let prop;
    let delay;

    if (styl.getPropertyValue('animation-delay')) {
      prop = 'animation-delay';
    } else if (styl.getPropertyValue('-webkit-animation-delay')) {
      prop = '-webkit-animation-delay';
    } else if (styl.getPropertyValue('-moz-animation-delay')) {
      prop = '-moz-animation-delay';
    } else {
      return 0;
    }

    delay = styl.getPropertyValue(prop);
    delay = Number(delay.replace(/[^\d\.]/g, ''));

    return (delay * 1000);
  }

  /**
   * @credits https://github.com/aurelia/animator-css
   * 
   * Add multiple listeners at once to the given element
   *
   * @param el the element to attach listeners to
   * @param s  collection of events to bind listeners to
   * @param fn callback that gets executed
   */
  _addMultipleEventListener(el, s, fn) {
    let evts = s.split(' ');
    for (let i = 0, ii = evts.length; i < ii; ++i) {
      el.addEventListener(evts[i], fn, false);
    }
  }

  /**
   * @credits https://github.com/aurelia/animator-css
   * 
   * Remove multiple listeners at once from the given element
   *
   * @param el the element
   * @param s  collection of events to remove
   * @param fn callback to remove
   */
  _removeMultipleEventListener(el, s, fn) {
    let evts = s.split(' ');
    for (let i = 0, ii = evts.length; i < ii; ++i) {
      el.removeEventListener(evts[i], fn, false);
    }
  }

}
