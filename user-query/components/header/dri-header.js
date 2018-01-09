import Vue from 'vue'
import Utils from '../../../../ui-vue/core/utils'
import './dri-header.css'

// registra o ícone dri
Utils.setIcons({
  'dri-header-icon': {
    viewBox: '0 0 24 24',
    content: `<path d="m 18.901821,1.6163628 4.716693,8.4021052 -2.984032,0 -4.620434,8.402098 -7.6525792,0 L 4.5110985,12.071252 9.3240602,3.8123683 8.0726894,1.5686194 z" />
              <path d="M 23.691458,11.680374 18.558348,22.455299 6.2388855,22.50378 0.25769384,12.414122 6.283518,1.5968194 l 1.2051633,2.134356 -4.8206606,8.5859306 4.6421165,8.100853 9.7305908,-0.04848 4.47897,-8.835941 z" />`
  }
})

export default Vue.component('dri-header', {
  template: require('./dri-header.html'),
  
  props:{
    title: {
      default: 'header dri title'
    } 
  }

})
