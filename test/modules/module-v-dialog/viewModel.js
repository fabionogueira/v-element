import Vue from 'vue';
// import {MessageBox} from '@/index';
import './style.css';

export default Vue.component('module-v-modal', {
    template: require('./view.html'),
    methods: {
        onConfirm(){
            console.log('confirm');
        },
        onHide(event){ 
            console.log('hide');
            // MessageBox.confirm({
            //     title: 'Confirm',
            //     text: 'This will permanently delete the file. Continue?',
            //     onHide(button){
            //         if (button == 1){
            //             next();
            //         }
            //     }
            // });
        }
    }
});
