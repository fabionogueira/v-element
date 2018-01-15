import Vue from 'vue';
import {MessageBox} from '@/index';
import './style.css';

export default Vue.component('module-v-modal', {
    template: require('./view.html'),
    methods: {
        onHide(next){
            MessageBox.confirm({
                title: 'Confirm',
                text: 'This will permanently delete the file. Continue?',
                onHide(button){
                    if (button == 1){
                        next();
                    }
                }
            });
        }
    }
});
