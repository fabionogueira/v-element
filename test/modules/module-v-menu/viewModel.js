import Vue from 'vue';
import './style.css';

export default Vue.component('module-v-menu', {
    template: require('./view.html'),
    methods: {
        itemClicked(){
            console.log(9);
        }
    }
});
