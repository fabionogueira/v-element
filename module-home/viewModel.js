import Vue from 'vue'
import view from './view.html'

import './style.css'
// .highlightignore
import viewCode from 'raw-loader!./view.html'
import viewModelCode from 'raw-loader!./viewModel.js'
// import viewCssCode from 'raw-loader!./style.css'
// .end
export default Vue.component('module-home', {
  template: view,

// .highlightignore
  created() {
    this.$store.state.htmlCode = viewCode;
    this.$store.state.jsCode = viewModelCode;

    this.$store.state.title = 'Home';
  }
// .end

})
