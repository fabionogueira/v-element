import Vue from 'vue';
import theme from '@/core/theme';
import PopupManager from '@/core/popup-manager';
import DOM from '@/core/dom';

import './action';
import './index.css';

const DEFAULT_OPTIONS = {
    closeButton: true,
    closeEsc: true,
    closeBack: true,
    closeOut: false,
    modal: false,
    onClose: null
};

theme.registerIcon('dialog-close', {
    viewBox: '0 0 24 24',
    content: '<path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />'
});

Vue.component('v-dialog', {
    template: require('./index.html'),
    props:{
        closeButton: {
            default: true,
            type: Boolean
        },
        modal:{
            default: false,
            type: Boolean
        }
    },
    data(){
        return {
            clsbase: 'v-element v-dialog themable'
        };
    },
    mounted(){
        let el = this.$el;

        el.children[0].setAttribute('style', el.getAttribute('style'));
        el.removeAttribute('style');
        el.setAttribute('style', 'display:none');
    },
    destroyed(){
        DOM(this.$el).remove();
    },
    methods:{
        isVisible(){
            return this.$el._show === true;
        },
        show(options){
            let me = this;

            if (this.$el._show){
                return;
            }

            options = Object.assign({}, DEFAULT_OPTIONS, options);

            this.$el._show = true;            
            this.closeButton = options.closeButton
            this.modal = options.modal;
            
            // exibe
            PopupManager.show(this.$el, {
                closeEsc: options.closeEsc,
                closeBack: options.closeBack,
                closeOut: options.closeOut,
                rectBase:{
                    target: options.reference,
                    position: options.position || 'in-left|bottom in-right|top'
                },
                offsetY: options.offsetY || 0,
                offsetX: options.offsetX || 0,
                animateCls: 'dialog',
                onBeforeShow(element){
                    element.style.display = 'block';
                },
                onShow(element){
                    me.$emit('show');
                    if (options.onShow) options.onShow(element);
                },
                onHide(element){
                    element._show = false;
                    element.style.display = 'none';
                    
                    if (options.onHide) {
                        options.onHide(element);
                    }

                    return false;
                }
            });
        },
        hide(){
            if (this.isVisible()){
                if (this._events.hide){
                    this.$emit('hide', () => {
                        PopupManager.hide(this.$el);
                    });
                } else {
                    PopupManager.hide(this.$el);
                }
            }
        }
    }
    
});

Vue.config.ignoredElements.push('v-dialog-header');
Vue.config.ignoredElements.push('v-dialog-body');
Vue.config.ignoredElements.push('v-dialog-footer');
