import Vue from 'vue';
import view from './login.html';
// import {types} from '../../global'
import AuthClient from '@/core/auth-client';

import './login.css';

export default Vue.component('module-login', {
    template: view,
    
    data(){
        return {
            // state: this.$store.state
        };
    },

    methods:{
        doLogin(){
            AuthClient.sign({
                success:true, 
                payload:{
                    token: '123',
                    user:{
                        permissions:{},
                        memberOf:[]
                    }
                }
            });
            // this.$store.commit(types.AUTH, true);
        }
    }

});
