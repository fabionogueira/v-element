// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './app';
import router from './routers';
import VElement from '@/index';
// import store from '@/global';

// tema do highlight.js
import 'highlight.js/styles/railscasts.css';
import '@/themes/default';

// importação do tema e dos componentes que serão usados na aplicação
import '@/elements/v-button';
import '@/elements/v-menu';
import '@/elements/v-dialog';

import './elements/demo-container';
// import theme from './ui-vue/themes/default'
// import './ui-vue/elements/ui-modal'
// import './ui-vue/elements/ui-tabs'
// import './ui-vue/elements/ui-combobox'
// import './ui-vue/elements/ui-panel'
// import './ui-vue/elements/ui-highlight'
// import './ui-vue/elements/ui-toolbar'

// tema (deve se adicionado após todos os componentes)

// inicialização do VElement
Vue.use(VElement);

Vue.config.productionTip = false;
Vue.config.ignoredElements.push('code-view');

/* eslint-disable no-new */
new Vue({
    el: '#app',
    // store,
    router,
    template: '<App/>',
    components: {
        App
    }
});
