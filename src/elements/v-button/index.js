import Vue from 'vue';
import iconManager from '@/core/icon-manager';
import theme from '@/core/theme';

import './index.css';

const menuIconName = 'menu-arrow-down';

if (!theme.iconIsRegistered(menuIconName)){
    iconManager.register(menuIconName, {
        viewBox: '0 0 24 24',
        content: '<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />'
    });
}

Vue.component('v-button', {
    template: `<button class="v-element v-button themable"><slot></slot><icon v-if="withMenu" class="v-button-icon-menu" name="${menuIconName}"></icon></button>`,
    data(){
        return {
            withMenu: false
        };
    },
    mounted(){
        let childNodes = this.$el.childNodes;

        if (childNodes.length > 2) {
            if (childNodes[0].nodeName == 'svg') childNodes[0].classList.add('v-button-icon-left');
            if (childNodes[1].nodeName == 'svg') childNodes[1].classList.add('v-button-icon-right');
        }

        this.withMenu = !!this.$attrs.menu;

        if (this.$theme.name == 'material'){

        }
    }
});

