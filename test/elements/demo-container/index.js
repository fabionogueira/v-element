import Vue from 'vue';
import './index.css';

Vue.component('demo-container', {
    props:['dataTitle', 'dataDescription'],
    data(){
        return {
            html: '123'
        };
    },
    beforeCreate(){
        let slot = '<slot></slot>';
        let ln = '';
        let code = '';
        let i = 0;
        let l = 0;

        this.$vnode.componentOptions.children.forEach(node => {
            if (node.tag == 'script' && node.data.attrs.type == 'text/code') {
                slot = node.children[0].text;
                
                slot.split('\n').forEach(row => {
                    if (row.trim() != ''){
                        if (i == 0){
                            l = row.length - row.trim().length;
                        }

                        row = row.substring(l);
                        code += (ln + row);
                        ln = '\n';
                        i++;
                    }
                });

                this._self.$$html = code;
            }
        });
        
        this._self.$$render = Vue.compile(
            `<div class="demo-container">
                <table>
                    <tr>
                        <td>
                            <div class="demo-title" v-if="dataTitle != null">{{dataTitle}}</div>
                            <div class="demo-description" v-if="dataDescription != null">{{dataDescription}}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="demo-content">
                                ${slot}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <pre style="background:#f2f3f7; border-radius:4px; padding:10px; overflow-x:auto; width:100%; display:none">{{html}}</pre>
                            <v-button plain onclick="this.previousElementSibling.style.display = this.previousElementSibling.offsetHeight==0 ? 'block' : 'none'">show/hide code</v-button>
                        </td>
                    </tr>
                </table>
            </div>`                
        ).render;
    },
    render(h) {
        this._self.html = this._self.$$html;
        return this._self.$$render(h);
    },
    methods:{
        itemClicked(){
            console.log(99);
        },
        showCode(){
            alert(9);
        }
    }
});
