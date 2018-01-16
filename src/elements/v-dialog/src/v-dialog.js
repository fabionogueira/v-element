import Vue from 'vue';
import PopupManager from '@/core/popup-manager';
import DOM from '@/core/dom';

const DEFAULT_OPTIONS = {
    closeButton: true,
    closeEsc: true,
    closeBack: true,
    closeOut: false,
    modal: false,
    onClose: null
};

Vue.component('v-dialog', {
    template: require('./v-dialog.html'),
    props:{
        closeButton: {
            default: true,
            type: Boolean
        },
        modal:{
            default: true,
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
            let event;
            let element = this.$el;

            if (this.isVisible()){
                if (this._events.hide){
                    event = {
                        cancel: false,
                        next(){
                            PopupManager.hide(element);
                        }
                    };
                    
                    this.$emit('hide', event);
                    
                    if (!event.cancel){
                        PopupManager.hide(element);
                    }
                } else {
                    PopupManager.hide(element);
                }
            }
        }
    }
    
});
