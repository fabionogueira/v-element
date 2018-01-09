/**
 * listeners.js
 * @description Provê funcionalidade de adicionar,excluir e despachar eventos
 * @author Fábio Nogueira <fabio.bacabal@gmail.com>
 * @version 1.0.0
 */

// Sem dependências

export default class Listeners {
    constructor(){
        this._listeners = {};
    }

    addEventListener (eventName, callback, context) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }

        callback.context = context;
        this._listeners[eventName].push(callback);
    }

    removeEventListener (eventName, callback) {
        if (this._listeners[eventName]) {
            for (let i = 0; i < this._listeners[eventName].length; i++) {
                if (this._listeners[eventName][i] === callback) {
                    delete (callback.context);
                    return this._listeners[eventName].splice(i, 1);
                }
            }
        }
    }

    dispatchEvent (eventName, event) {
        let a;

        if (this._listeners[eventName]) {
            this._listeners[eventName].forEach(fn => {
                a = event ? [event] : [];
                fn.apply(fn.context, a);
            });
        }
    }
}
