import DOM from './dom';

/**
 * @description Calcula a posição "rect" em relação a um elemento referência
 * @param {Object} options default {offsetX:0, offsetY:0, position:'left|bottom'}
 * @example
 *      dom(element).posref({position:"bottom|center"})
 */
DOM.prototype.posref = function (options) {
    let i, j, x, y, xp, yp, a1, a2, css, refRect, popupRect, docRect, referenceElement;
    let element = this[0]; // elemento a ser posicionado
    let arrOffsetX = Array.isArray(options.offsetX) ? options.offsetX : [options.offsetX || 0];
    let arrOffsetY = Array.isArray(options.offsetY) ? options.offsetY : [options.offsetY || 0];
    let offsetX = 0;
    let offsetY = 0;

    referenceElement = options.origin; // elemento refercia para o posicionamento
    xp = yp = '';

    function proximity() {
        // aproximação horizontal
        if (x != undefined && (a1[i].indexOf('top') >= 0 || a1[i].indexOf('bottom') >= 0)) {
            if (x < (docRect.width - x - popupRect.width)) {
                x = 0;
                xp = 'proximity-left';
            } else {
                x = docRect.width - popupRect.width;
                xp = 'proximity-right';
            }
            return true;
        }

        return false;
    }

    if (referenceElement && options.position) {
        // 1. prepara o elemento para ser obtido suas dimensões
        css = element.style.cssText;
        DOM(element).css({
            visibility: 'hidden',
            display: 'block',
            left: 0,
            top: 0
        });

        // 2. calcula a posiçao do popup
        docRect = DOM(document).rect();
        refRect = DOM(referenceElement).rect();
        popupRect = DOM(element).rect();

        a1 = options.position.split(' ');

        for (i = 0; i < a1.length; i++) {
            a2 = a1[i].split('|');

            if (x === undefined){
                offsetX = arrOffsetX[i] || 0;
            }
            if (y === undefined){
                offsetY = arrOffsetY[i] || 0;
            }

            for (j = 0; j < a2.length; j++) {
                switch (a2[j]) {
                case 'left':
                    if (x === undefined) {
                        x = refRect.left - popupRect.width;
                        xp = 'left';
                    }
                    break;
                case 'in-left':
                    if (x === undefined) {
                        x = refRect.left;
                        xp = 'in-left';
                    }
                    break;
                case 'right':
                    if (x === undefined) {
                        x = refRect.left + refRect.width;
                        xp = 'right';
                    }
                    break;
                case 'in-right':
                    if (x === undefined) {
                        x = refRect.left - popupRect.width + refRect.width;
                        xp = 'in-right';
                    }
                    break;
                case 'center':
                    if (x === undefined && (a1[i].indexOf('top') >= 0 || a1[i].indexOf('bottom') >= 0)) {
                        x = refRect.left + (refRect.width / 2) - (popupRect.width / 2);
                        xp = 'center';
                    } else if (y === undefined && (a1[i].indexOf('left') >= 0 || a1[i].indexOf('right') >= 0)) {
                        y = refRect.top + (refRect.height / 2) + (popupRect.height / 2);
                        yp = 'center';
                    }
                    break;

                case 'top':
                    if (y === undefined) {
                        y = refRect.top - popupRect.height;
                        yp = 'top';
                    }
                    break;

                case 'in-top':
                    if (y === undefined) {
                        y = refRect.top;
                        yp = 'in-top';
                    }
                    break;

                case 'bottom':
                    if (y === undefined) {
                        y = refRect.top + refRect.height;
                        yp = 'bottom';
                    }
                    break;
                
                case 'in-bottom':
                    if (y === undefined) {
                        y = refRect.top - popupRect.height + refRect.height;
                        yp = 'bottom';
                    }
                    break;

                }

                // analisa se cabe no ´document.body´ com as coordenadas atuais
                if (x !== undefined) {
                    if ((x + offsetX) + popupRect.width > docRect.width || (x + offsetX) < 0) {
                        if (i == (a1.length - 1)){
                            if (!proximity()) {
                                x = undefined;
                                xp = '';
                            }
                        } else {
                            x = undefined;
                            xp = '';
                        }
                    }
                }
                if (y !== undefined) {
                    if ((y + offsetY) + popupRect.height > docRect.height) {
                        y = undefined;
                        yp = '';
                    }
                }

            }
        }

        // 3. retorna o elemento para as configurações iniciais
        element.style.cssText = css;
    }

    return {
        str_xy: xp !== '' && yp !== '' ? xp + '-' + yp : (xp || yp),
        str_x: xp,
        str_y: yp,
        x: (x === undefined) ? 0 : x + offsetX,
        y: (y === undefined) ? 0 : y + offsetY,
        refRect: refRect,
        popupRect: popupRect
    };
};

export default function(element, options){
    return DOM(element).posref(options);
}
