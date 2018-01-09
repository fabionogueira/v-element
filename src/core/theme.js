import icon from './icon-manager';

let registeredsIcons = {};
let themeDefinition;

export default {
    set(definition){
        let i, ic;

        themeDefinition = definition;
        
        for (i in definition.icons){
            ic = definition.icons[i];
            ic.viewBox = ic.viewBox || definition.viewBox || '';

            registeredsIcons[i] = true;
            icon.register(i, ic);
        }
    },

    get(){
        return themeDefinition;
    },

    iconIsRegistered(name){
        return registeredsIcons[name];
    }
};
