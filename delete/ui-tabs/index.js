import Vue from 'vue';
import DomManager from '../../core/dom-manager'

import './index.scss'

Vue.component('ui-tabs', {
  template: require('./index.html'),

  mounted(){
    let active = 0
    let tabsHTML = '';

    this.$children.forEach((tab, index) => {
      let clsActive = (index == active ? ' ui-tab-active' : '');
      tabsHTML += (`<div tab-index="${index}" class="ui-tab${clsActive}">${tab.$attrs['caption']}</div>`);
      if (index == active) return;
      tab.$el.style.display = 'none';
    })
    
    this.$el.children[0].innerHTML = tabsHTML;
  },

  methods:{
    onHeaderClick(event){
      let target = DomManager.getParent(event.target, '.ui-tab');
      if (target){
        this.setActiveTab(target.getAttribute('tab-index'))
      }
    },

    setActiveTab(active){
      let headers = this.$el.children[0].children;
      
      this.$children.forEach((tab, index) => {
        headers[index].classList.remove('ui-tab-active');
        (index == active ? headers[index].classList.add('ui-tab-active') : null);
        tab.$el.style.display = (index == active ? '' : 'none');
      })
    }
  }
})

Vue.component('ui-tab', {
  template: '<div class="ui-tab-content"><slot/></div>'
})
