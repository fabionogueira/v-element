import Vue from 'vue';
import iconManager from '@/core/icon-manager';
import action from '@/core/action';
import theme from '@/core/theme';
import PopupManager from '@/core/popup-manager';
import DOM from '@/core/dom';

// const beautify = require('js-beautify').js_beautify;

import './index.css';

const menuIconName = 'menu-arrow-right';

if (!theme.iconIsRegistered(menuIconName)){
    iconManager.register(menuIconName, {
        viewBox: '0 0 24 24',
        content: '<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />'
    });
}

function getVueMenuInstance(value){
    let menu = document.querySelector(`[name=${value}]`);

    if (menu && menu.__vue__ && menu.__vue__.show){
        return menu.__vue__;
    }
}

// REVIEW: confuso
function menuItemInit(vMenu, vMenuItem){
    if (vMenuItem.getAttribute('child-menu')){
        vMenuItem.appendChild(iconManager.svg(menuIconName, 'v-menu-arrow'));
    }

    vMenuItem.onmouseover = function(){
        let childMenu = getVueMenuInstance(vMenuItem.getAttribute('child-menu'));
        let parentMenuItem = DOM(event.relatedTarget).closest('v-menu-item');

        if (parentMenuItem == vMenuItem && vMenuItem != event.relatedTarget && vMenuItem.over){
            return;
        }

        vMenuItem.over = true;

        if (vMenuItem.childMenuIsVisible){
            return;
        }

        if (vMenu.activeSubMenu) {
            vMenu.activeSubMenu.activeParentMenu = null;
            vMenu.activeSubMenu.hide();
        }

        if (childMenu){
            vMenuItem.setAttribute('menu-item-active', '');
            vMenuItem.childMenuIsVisible = true;
            vMenu.activeSubMenu = childMenu;
            childMenu.activeParentMenu = vMenu;
            childMenu.show({
                reference: vMenuItem, 
                position:'right|in-top left|in-bottom', 
                offsetY:[4, -4], 
                offsetX:[-4, 4],
                onHide() {
                    vMenuItem.removeAttribute('menu-item-active');
                    vMenuItem.childMenuIsVisible = false;
                }
            });
        }
    };

    vMenuItem.onmouseout = function(){
        vMenuItem.over = false;
    };
}

function menuItemDestroy(vMenuItem){
    vMenuItem.onmouseout = vMenuItem.onmouseover = null;
}

Vue.component('v-menu', {
    template: `<div @click="click($event)" class="v-element v-menu themable"><slot></slot></div>`,
    data(){
        return {
            visible: false
        };
    },
    destroyed(){
        let itens = this.$el.querySelectorAll('v-menu-item');

        itens.forEach(item => {
            menuItemDestroy(item);
        });
        this.activeSubMenu = null;
        this.activeParentMenu = null;

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

            this._show = true;

            // inicializa os itens do menu
            if (!this._initItens){
                this._initItens = true;
                this.$el.querySelectorAll('v-menu-item').forEach(item => {
                    menuItemInit(this, item);
                });
            }

            // exibe
            this._onHide = options.onHide;
            PopupManager.show(this.$el, {
                cancelClose: true,
                modal: true, // fecha com click fora do popup
                rectBase:{
                    target: options.reference,
                    position: options.position || 'in-left|bottom in-right|top'
                },
                offsetY: options.offsetY || 0,
                offsetX: options.offsetX || 0,
                animateCls: 'fade'
            });
        },
        hide(){
            if (!this._show){
                return;
            }

            this._show = false;

            if (this.activeSubMenu){
                this.activeSubMenu.hide();
            }
            this.activeSubMenu = null;

            if (this.activeParentMenu){
                this.activeParentMenu.hide();
            }
            this.activeParentMenu = null;

            this.$el.querySelectorAll('v-menu-item').forEach(item => {
                item.removeAttribute('menu-item-active');
                item.childMenuIsVisible = false;
            });

            PopupManager.hide(this.$el);

            if (this._onHide){
                this._onHide();
            }

            this._onHide = null;
        }
    }
    
});

// <element action="menu:menu1"></element>
action.register('mousedown', 'menu', (event, target, value) => {
    let menu = getVueMenuInstance(value);
    
    function show(){
        menu.show({reference:target});
    }

    if (menu){
        
        if (menu._show){
            menu.hide();
            setTimeout(function(){ show(); }, 20);
        } else {
            show();
        }
    }

});

Vue.config.ignoredElements.push('v-menu-item');
Vue.config.ignoredElements.push('v-menu-item-separator');
