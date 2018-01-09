import './core/array';

import dom from './core/dom';
import action from './core/action';
import auth from './core/auth-client';
import drag from './core/drag-manager';
import http from './core/http';
import icon from './core/icon-manager';
import listeners from './core/listeners';
import popup from './core/popup-manager';
import theme from './core/theme';

import './elements/v-box';

const install = function (Vue, config = {}) {
    let i, ic;
    let div = document.createElement('div');
    let icons = icon.getIcons();
    let svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs>';

    config.theme = config.theme || {};

    // inject svg icons in index.html
    for (i in icons){
        ic = icons[i];
        svg += (`<symbol id="${i}" viewBox="${ic.viewBox}">${ic.content}</symbol>`);
    }
    div.setAttribute('style', 'display:none');
    div.innerHTML = `${svg}</defs></svg>`;
    document.body.appendChild(div);

    Vue.mixin({
        created() {
            this.$theme = config.theme;
        }
    });
};

export default {
    install,
    dom,
    action,
    auth,
    drag,
    http,
    icon,
    listeners,
    popup,
    theme
};
