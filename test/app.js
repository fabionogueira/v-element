import Vue from 'vue';
import view from './app.html';
import AuthClient from '@/core/auth-client';
import {types} from './global';

import './modules/module-login/login';
import './app.css';

let App = Vue.component('app', {
    template: view,
    
    mounted(){
      
        AuthClient
            .addEventListener('sign', () => {
                console.log('sign');
                this.$store.commit(types.AUTH, true);
            })
            .addEventListener('requireAuth', () => {
                console.log('requireAuth');
                // this.$store.commit(types.AUTH, false);
            });

    },

    data() {
        return {
            // state: this.$store.state
        };
    }
});

export default App;
