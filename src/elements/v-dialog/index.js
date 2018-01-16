import Vue from 'vue';
import VDialog from './src/v-dialog';

import './src/v-dialog-icon';
import './src/v-dialog-action';
import './src/v-dialog.css';

Vue.config.ignoredElements.push('v-dialog-header');
Vue.config.ignoredElements.push('v-dialog-body');
Vue.config.ignoredElements.push('v-dialog-footer');

export default VDialog;
