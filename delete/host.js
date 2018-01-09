/* global APP_VERSION */

let hostName;
let appVersion;

export default {
    /**
     * Retorna o nome do tipo de host
     * Usa a função global getHostName caso esta tenha sido definida
     */
    name() {
        let aSearch, name;

        if (hostName) {
            return hostName;
        }

        if (typeof (window.getHostName) == 'function') {
            hostName = window.getHostName();
            return hostName;
        }

        name = 'browser';
        aSearch = (location.search ? (location.search.split('?')[1] || '') : '').split('=');

        // se forçado o tipo de host na url http://myapp.co/?host=browser|standalone|native
        if (aSearch.length == 2 && aSearch[0] == 'host' && ['browser', 'standalone', 'native'].indexOf(aSearch[1]) > -1) {
            name = aSearch[1];
        } else if (window.navigator.standalone) {
            // modo standalone no ios
            name = 'standalone';
        }

        hostName = name;

        return name;
    },

    getVersion() {
        if (appVersion) {
            return appVersion;
        }

        if (typeof (window.getAppVersion) == 'function') {
            appVersion = window.getAppVersion();
            return appVersion;
        }

        return APP_VERSION || '1.0.0';
    },

    setVersion(version) {
        appVersion = version;
    }
};
