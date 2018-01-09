import Vue from 'vue'
import view from './appView.html'
import './appStyle.css'

import './components/header/dri-header'
import './components/footer/dri-footer'

export default Vue.component('user-query', {
  template: view,

  created() {
    // this.$store.state.title = 'Home';
  }

})
