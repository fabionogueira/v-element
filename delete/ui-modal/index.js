import Vue from 'vue';
// import DomManager from '../../core/dom-manager'
import PopupManager from '../../core/popup-manager'
import CssAnimator from '../../core/animate-css'
import Action from '../../core/action'
// import Utils from '../../core/utils'

import './index.scss'

let animator = new CssAnimator();

Vue.component('ui-modal', {
  template: require('./index.html'),

  mounted(){
    this.$el.style.display = 'none';
    // this.show();
  },

  destroyed(){
    if (this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
  },

  methods: {
    hide(){
      PopupManager.close(this.$el);
    },
    
    show() {
      document.body.appendChild(this.$el);
      
      this.$el.style.display = null;

      PopupManager.show(this.$el.children[0], {
        showClassName: 'show',
        animateClassName: 'au',
        cancelClose: true, // this.cancelClose,
        modal: true, // fecha com click fora do popup
        parentModal: this.$el,
        animator: animator,
        // onShow: callback,
        onHide: () => {
          // this.element.classList.remove('ui-menu-show');
          this.$el.style.display = '';
        }
      });
    }
  }
})

// <element action="showModal"></element>
Action.register('click', 'showModal', (event, value, target) => {
  let element = document.querySelector(`[name="${value}"]`);
  
  if (element && element.__vue__ && element.__vue__.show){
    element.__vue__.show();
  }
})
