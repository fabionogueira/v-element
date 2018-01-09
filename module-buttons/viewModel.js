import Vue from 'vue'
import view from './view.html'

import './style.css'
// .highlightignore
import {types} from '@/global'
import viewCode from 'raw-loader!./view.html'
// import viewModelCode from 'raw-loader!./viewModel.js'
// import viewCssCode from 'raw-loader!./style.css'
// .end
export default Vue.component('ui-buttons-main', {
  template: view,
  
  data: () => {
    return {
      btLabel: 'label'
    }
  },
// .highlightignore
  created() {
    this.$store.commit(types.HTML, viewCode);
    // this.$store.state.jsCode = viewModelCode;
    // this.$store.state.title = 'ui-button';
  }
// .end

})
