import Vue from 'vue';
import iconManager from '@/core/icon-manager';
import action from '@/core/action';
import theme from '@/core/theme';
import PopupManager from '@/core/popup-manager';
import DOM from '@/core/dom';

// const beautify = require('js-beautify').js_beautify;

import './index.css';

const dialogCloseIconName = 'dialog-close';
const DEFAULT_OPTIONS = {
    showClose: true,
    autoClose: true,
    onClose: null,
    modal: false
};

if (!theme.iconIsRegistered(dialogCloseIconName)){
    iconManager.register(dialogCloseIconName, {
        viewBox: '0 0 24 24',
        content: '<path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />'
    });
}

function getVueMenuInstance(value){
    let menu = document.querySelector(`[name=${value}]`);

    if (menu && menu.__vue__ && menu.__vue__.show){
        return menu.__vue__;
    }
}

Vue.component('v-dialog', {
    template: `<div class="v-element v-vbox v-dialog themable">
                    <slot></slot>
               </div>`,
    
    destroyed(){
        DOM(this.$el).remove();
    },
    methods:{
        click(event){
            let el = DOM(event.target).closest('v-menu-item');
            
            if (el && !el.getAttribute('disabled') && !el.childMenuIsVisible){
                this.$emit('item-click', { value: el.getAttribute('value') });
                this.hide();
            }
        },
        show(options){
            if (this._show){
                return;
            }

            options = Object.assign({}, DEFAULT_OPTIONS, options);

            this._show = true;

            if (!this.__init){
                this.__init = true;
                this.$el.appendChild(iconManager.svg(dialogCloseIconName, 'v-dialog-close-button'));
                this.$el.modalbg = document.createElement('div');
                this.$el.modalbg.setAttribute('class', 'v-dialog-modal-background');
            }

            // exibe/oculta o botão "fechar"
            this.$el.classList.remove('v-dialog-with-close-button');
            if (options.showClose) this.$el.classList.add('v-dialog-with-close-button');

            // exibe/oculta o background modal
            if (options.modal){
                document.body.appendChild(this.$el.modalbg);
                DOM(this.$el.modalbg).animate('enter', 'fade');
            }

            // exibe
            PopupManager.show(this.$el, {
                cancelClose: true,
                modal: true, // fecha com click fora do popup
                rectBase:{
                    target: options.reference,
                    position: options.position || 'in-left|bottom in-right|top'
                },
                offsetY: options.offsetY || 0,
                offsetX: options.offsetX || 0,
                animateCls: 'fade',
                onHide: options.onHide,
                onShow: options.onShow,
                onBeforeHide(element){
                    DOM(element).animate('leave', 'fade', () => { DOM(element).remove(); });
                }
            });
        },
        hide(){
            if (!this._show){
                return;
            }

            this._show = false;

            PopupManager.hide(this.$el);

            if (this._onHide){
                this._onHide();
            }

            this._onHide = null;
        }
    }
    
});

// <element action="modal:modal1"></element>
action.register('mousedown', 'modal', (event, target, value) => {
    let modal = getVueMenuInstance(value);
    
    function show(){
        modal.show({reference:target});
    }

    if (modal){
        
        if (modal._show){
            modal.hide();
            setTimeout(function(){ show(); }, 20);
        } else {
            show();
        }
    }

});

Vue.config.ignoredElements.push('v-dialog-header');
