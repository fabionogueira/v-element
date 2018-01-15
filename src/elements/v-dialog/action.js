import action from '@/core/action';
import DOM from '@/core/dom';

// <element action="modal:modal1"></element>
action.register('mousedown', 'modal', (event, target, value) => {
    let dialog = DOM.vue(`[name="${value}"]`);
    
    function show(){
        dialog.show();
    }

    if (dialog){
        
        if (dialog._show){
            dialog.hide();
            setTimeout(function(){ show(); }, 20);
        } else {
            show();
        }
    }

});

// <element action="dialog-close"></element>
action.register('click', 'dialog-close', (event, target) => {
    let element = DOM(target).closest('.v-dialog');
    let dialog = DOM(element).vue();

    if (dialog && dialog.isVisible()){
        dialog.hide();
    }

});
