/* eslint new-cap:off */

import Vue from 'vue';
import DOM from './dom';
// import Dialog from '../elements/v-dialog';

let instances = [];

const DEFAULT_OPTIONS = {
    closeEsc: true,  // fecha ao pressionar esc
    closeBack: true, // fecha no evento voltar do navegador
    closeOut: true,  // fecha ao clicar fora do popup
    onShow: null,
    onHide: null,
    
    clsClass: '',
    title: '',
    type: '',
    text: '',
    buttons: [
        {
            default: true,
            text: 'OK'
        }
    ]
};

const VMessageCtrl = Vue.component('v-message-box', {
    template: `<v-dialog>
                    <v-dialog-header>
                        {{title}}
                    </v-dialog-header>
                    <v-dialog-body>
                        {{text}}
                    </v-dialog-body>
                    <v-dialog-footer>
                        <v-button @click="hide(index)" :class="button.cls" v-for="(button, index) in buttons">{{button.text}}</v-button>
                    </v-dialog-footer>
               </v-dialog>`,
    data(){
        return {
            buttons: [],
            title: '',
            text: ''
        };
    },
    methods:{
        hide(index){
            this.dialog.$$button = index;
            this.dialog.hide();
        },
        setButtons(buttons){
            this.buttons = buttons;
        },
        setText(text){
            this.text = text;
        },
        setHTML(html){
            console.log(html);
        },
        setTitle(title){
            this.title = title;
        }
    }
});

function getInstance(){
    let i, instance, div;

    for (i = 0; i < instances.length; i++){
        if (!instances[i].dialog.isVisible()){
            return instances[i];
        }
    }

    div = document.body.appendChild(document.createElement('div'));

    instance = new VMessageCtrl();
    instance.$mount(div);
    instance.dialog = instance.$children[0];

    instances.push(instance);

    return instance;
}

export default {
    alert(options){
        let instance;
        let onHide;

        if (typeof (options) == 'string'){
            options = {
                text: options
            };
        }

        options = Object.assign({}, DEFAULT_OPTIONS, options);
        onHide = options.onHide;

        instance = getInstance();
        
        options.buttons.forEach((item, index, array) => {
            if (typeof (item) == 'string'){
                array[index] = {
                    text: item
                };
            }

            array[index].cls = array[index].default ? 'v-button--primary' : '';
        });

        instance.setButtons(options.buttons);
        instance.setTitle(options.title);
        instance.setText(options.text);

        options.onHide = function(element){
            DOM(element).remove();
            if (onHide) {
                onHide(instance.dialog.$$button);
            }
        };

        instance.dialog.$$button = -1;
        instance.dialog.show(options);
    },
    confirm(options){
        options = options || {};
        options.buttons = options.buttons || [
            {
                text: 'Cancel'
            },
            {
                default: true,
                text: 'OK'
            }
        ];

        this.alert(options);
    },
    prompt(options){
        options = options || {};
        options.buttons = options.buttons || [
            {
                text: 'Cancel'
            },
            {
                default: true,
                text: 'OK'
            }
        ];

        this.alert(options);
    }
};

