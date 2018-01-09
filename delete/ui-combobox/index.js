import Vue from 'vue';
import DomManager from '../../core/dom-manager'
import PopupManager from '../../core/popup-manager'
import Utils from '../../core/utils'

import './index.scss'

Vue.component('ui-combobox', {
  template: require('./index.html'),

  mounted() {
    let option;
    
    this._createChildren();

    option = (this.divPopup.querySelector('option[selected]')) || this.dataValue;
    this.setValue(option);
  },

  destroyed(){
    this._destroyChildren();
  },

  methods: {
    onButtonClick() {
      this.showPopup();
    },

    onOptionClick(event) {
      this.setValue(DomManager.getParent(event.target, 'option'));
      this.hidePopup();
    },

    hidePopup(){
      PopupManager.close(this.divPopup);
    },
    
    showPopup() {
      let opt;

      this._createChildren();

      opt = Utils.getElementPositionByRef(this.divPopup, {
        origin: this.$el,
        position: 'bottom|left'
      });

      Utils.css(this.divPopup, {
        left: `${opt.left || opt.x}px`,
        top: `${opt.top || opt.y}px`,
        width: `${opt.refRect.width}px`
      });

      PopupManager.show(this.divPopup, {
        showClassName: 'ui-combobox-options ui-combobox-options-show',
        animateClassName: '',
        cancelClose: true, // this.cancelClose,
        modal: true, // fecha com click fora do popup
        parentModal: this.$el,
        // animator: animator,
        // onShow: callback,
        onHide: () => {
          // this.element.classList.remove('ui-menu-show');
          this.$el.style.display = '';
        }
      });
    },

    setValue(valueOrOptionsElement) {
      let option
      let value = this.dataValue;

      if (valueOrOptionsElement && this.inputText) {
        option = valueOrOptionsElement.nodeName ? valueOrOptionsElement : this.divPopup.querySelector(`option[value="${valueOrOptionsElement}"]`);

        if (option) {
          this.inputText.value = option.innerHTML;
          this.dataValue = option.getAttribute('value');

          if (value != this.dataValue) {
            // Utils.emit(this.element, 'change', value);
          }
        }
      }
    },

    dataValueChanged(value) {
      this.setValue(value);
    },

    dataListChanged(value) {
      this.loadData(value);
    },

    // Return the loaded data
    getData() {
      // return this.doMethod('getData');
    },

    // Set the combobox value array
    setValues(values) {
      // return this.doMethod('setValues', values);
    },

    // Load locale list data
    loadData(data) {
      // return this.doMethod('loadData', data);
    },

    _createChildren() {
      if (this.divPopup) return;

      this.divPopup = this.$el.querySelector('.ui-combobox-options');
      this.inputHidden = this.$el.querySelector('input[type=hidden]');
      this.inputText = this.$el.querySelector('input[type=text]');

      document.body.appendChild(this.divPopup);
    },

    _destroyChildren() {
      this.divPopup.parentNode.removeChild(this.divPopup);
      this.divPopup = this.inputHidden = this.inputText = null;
    }
  }
})
