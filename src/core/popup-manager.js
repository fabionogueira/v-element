import backbutton from 'browser-back-button';
import Action from './action';
import DOM from './dom';

let showInProgress = false;
// let popupZIndex = 3000;
let activePopups = [];
let popupIndex = 0;
let DEFAULT_OPTIONS = {
    cancelClose: true,
    modal: false,
    parentModal: null
};

function targetIs(target, element) {
    let t = target;

    while (t.parentNode) {
        if (t == element) return true;
        t = t.parentNode;
    }

    return false;
}

const PopupManager = {
    show(element, options) {
        let el, ref;
        
        options = Object.assign({}, DEFAULT_OPTIONS, options);

        // retorna daqui se o elemento não existe
        if (!element) return;

        showInProgress = true;

        // retorna daqui se já é um popup visível
        el = element;
        if (el._popup && el._popup._visible) {
            return setTimeout(() => { showInProgress = false; }, 1);
        }

        el._popup = options;

        options._visible = true;
        options._popupId = `popup-${popupIndex++}`;

        element.setAttribute('is-popup', '');
        
        // adiciona o elemento na lista de popups ativos
        activePopups.push(element);

        backbutton.on(options._popupId, () => {
            this.hide(element);
        });

        // posiciona
        if (options.beforeDisplay){
            options.beforeDisplay(element);
        }
        if (options.rectBase && options.rectBase.target) {
            ref = DOM(element).posref({
                origin: options.rectBase.target,
                position: options.rectBase.position,
                offsetX: options.offsetX || 0,
                offsetY: options.offsetY || 0
            });
            
            element.setAttribute('is-popup', ref.str_xy);

            DOM(element).css({
                left: `${ref.left || ref.x}px`,
                top:  `${ref.top || ref.y}px`
            });
        }
        
        // adiciona no final do body
        // element.style.zIndex = popupZIndex++;
        if (options.beforeAppend){
            options.beforeAppend(element);
        } else {
            document.body.appendChild(element);
        }

        if (options.display) {
            options.display('show', element);
        } else if (options.animateCls) {
            DOM(element).animate('enter', options.animateCls, {
                complete: options.onShow
            });
        } else {
            element.style.display = 'block';
            if (options.onShow) options.onShow();
        }

        setTimeout(() => { showInProgress = false; }, 1);
    },

    hide (element) {
        let options;
        let el = element;

        // retorna se p elemento não existe
        if (!element) return;

        // retorna se o elemento não é um popup ou se é um popup e não está visível
        options = el._popup;
        if (!options || (options && !options._visible)) return;

        // anula o evento do botão voltar
        backbutton.off(options._popupId);
        delete (el._popup);

        // remove o elemento da lista de popups ativos
        activePopups.remove(element);

        // dispara evento informando aos componentes filhos que a janela fechou
        // Utils.callChildMethod(element, 'parentClosed');

        element.removeAttribute('is-popup');

        if (options.onHide) options.onHide(element);
        if (options.onBeforeHide) options.onBeforeHide(element);

        if (options.display){
            options.display('hide', element);
        } else if (options.animateCls) {
            DOM(element).animate('leave', options.animateCls, {
                complete: options.onHide
            });
        } else {
            element.style.display = 'none';
        }

    }
};

// Tenta fechar a janela de diálogo ativa caso exista, quando pressionada a tecla ESC
Action.register('keydown', '*', (event) => {
    let options, element;

    if (event.keyCode == 27) {
        element = activePopups[activePopups.length - 1];
        options = element ? element._popup : null;

        if (options && options.cancelClose) {
            return PopupManager.hide(element);
        }
    }
});

// Fecha popups modal
Action.register('mousedown', '*', (event) => {
    let a, options;
    let target = DOM(event.target).closest('[is-popup]');

    // se o evento não foi sobre um popup
    if (!target && !showInProgress) {
        a = [];

        activePopups.forEach(el => {
            options = el ? el._popup : null;

            if (options && options.modal) {
                if (options.parentModal && targetIs(event.target, options.parentModal)) return;
                a.push(el);
            }
        });

        a.forEach(el => {
            PopupManager.hide(el);
        });
    }
});

// <element action="showPopup:element-name:position"></element>
Action.register('click', 'showPopup', (event, target, name, position) => {
    let element = document.querySelector(`[name="${name}"]`);
    let opt;
    
    if (element){
        
        if (position){
            opt = DOM(target).posref({
                origin: target,
                position: position
            });
        
            DOM(element).css({
                left: `${opt.left || opt.x}px`,
                top:  `${opt.top || opt.y}px`
            });
        }

        document.body.appendChild(element);
        
        element.style.display = null;

        PopupManager.show(element, {
            // showClassName: 'show',
            // animateClassName: 'au',
            cancelClose: true,
            modal: true, // fecha com click fora do popup
            // parentModal: element,
            // onShow: callback,
            onHide: () => {
                // this.element.classList.remove('ui-menu-show');
                element.style.display = 'none';
            }
        });
    }
});

export default PopupManager;
