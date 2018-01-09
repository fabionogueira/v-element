import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const types = {
    TITLE: 'TITLE',
    HTML: 'HTML',
    JS: 'JS',
    AUTH: 'AUTH'
};

const state = {
    title: 'demo',
    htmlCode: '',
    jsCode: '',
    auth: false,
    develop: process.env.NODE_ENV !== 'production'
};

const mutations = {
    [types.TITLE](state, title){
        state.title = title;
    },
    [types.HTML](state, html){
        state.htmlCode = html;
    },
    [types.JS](state, js){
        state.jsCode = js;
    },
    [types.AUTH](state, auth){
        state.auth = auth;
    }
};

const vuex = new Vuex.Store({
    state,
    mutations
});

export default vuex;
export {vuex, types};
