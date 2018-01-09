import Vue from 'vue';

let registeredIcons = {};

/**
 * @method
 * @description register svg icons: {
 *      "icon-name": {
 *          viewBox:"0 0 width height", // the viewBox svg attribute
 *          content:'svg content' // svg without <svg> tag
 *      }
 * }
 */
function registerIcon(name, definition) {
    registeredIcons[name] = definition;
}
    
function getIcon(name) {
    return registeredIcons[name];
}

function getIcons(){
    return registeredIcons;
}

function createSvgIcon(attr) {
    let dataSize = attr.size;
    let dataName = attr.name;
    let cls = attr.class || '';
    let fill, css;
    let r = {};
    let data = getIcon(dataName);

    // busca diretamente do svg: <svg><defs><symbol id="icon-symbol"><path/></symbol> ...
    if (data) {
        // busca do tema
        if (data) {
            r.innerHTML = data.content;
            r.viewBox = data.viewBox;
            r.class = cls;
            if (dataSize) {
                r.cssText = `width:${dataSize}px;height:${dataSize}px;line-height:${dataSize}px;`;
            }
        }
    } else {
        fill = attr['data-color'];
        css = dataSize ? `width:${dataSize}px;height:${dataSize}px;` : '';

        fill = fill ? `fill:${fill}` : '';

        r.class = `${cls} icon-svg icon-${dataSize || ''}`;
        r.style = `${css}${fill}`;
        r.innerHTML = `<use xlink:href="#${dataName}"></use>`;
        // `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="icon-svg" style="${css}${fill}"><use xlink:href="#${dataId}"></use></svg>`;
    }

    r.icon = dataName;

    return r;
}

function createSvgIconByName(name, cls){
    let div = document.createElement('div');
    
    div.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="icon-svg"><use xlink:href="#${name}"></use></svg>`;
    div.className = cls;
    
    return div;
}

/**
 * @attribute icon
 * @version 1.0.0
 * @example:
 *      <icon src="icon-link"></icon>
 */
Vue.component('icon', {
    render: function (createElement) {
        let r = createSvgIcon(this.$attrs);

        return createElement('svg', {
            attrs: {
                'xmlns': 'http://www.w3.org/2000/svg',
                'xmlns:xlink': 'http://www.w3.org/1999/xlink',
                'style': r.style,
                'class': r.class,
                'viewBox': r.viewBox,
                'data-icon': r.icon
            },
            domProps: {
                innerHTML: r.innerHTML
            }
        });
    },
    mounted: function () {
        // createSvgIcon(this.$el);
    }
});

// Vue.directive('icon', {
//     inserted: function (el) {
//         // createSvgIcon(el);
//     }
// });

export default {
    register: registerIcon,
    getIcon: getIcon,
    getIcons: getIcons,
    svg: createSvgIconByName
};
