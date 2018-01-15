import Vue from 'vue';
import {MessageBox} from '@/index';

import './style.css';

export default Vue.component('module-message-box', {
    template: require('./view.html'),
    methods: {
        showAlert(){
            MessageBox.alert({
                title: 'Alert',
                text:'This is text content of alert.',
                onHide(button){
                    console.log(button);
                }
            });
        },

        showConfirm(){
            MessageBox.confirm({
                title: 'Confirm',
                text:'This will permanently delete the file. Continue?',
                onHide(button){
                    console.log(button);
                }
            });
        }
    }
});
