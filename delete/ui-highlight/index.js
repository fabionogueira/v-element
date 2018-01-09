import Vue from 'vue';
import highlight from 'highlight.js'

Vue.component('ui-highlight', {
  template: `<pre class="hljs">{{code}}</pre>`,

  props:['code'],

  watch: {
    code(val) { 
      this.setSource(val);
    }
  },

  methods: {
    setSource(source){
      let a = source.replace('module.exports = "', '').replace(/\\"/g, '"').replace(/\\n/g, '\n').split('// .highlightignore')
      let v = a[0];
      let i;

      if (a.length > 0){
        for (i = 1; i < a.length; i++){
          v += a[i].split('.end\n')[1];
        }
      }

      this.$el.innerHTML = highlight.highlight(this.$attrs['lang'] || 'html', v).value;
    }
  }
})
