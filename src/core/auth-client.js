/**
 * AuthClient.ts
 * @description Controla a autenticação do usuário
 * @author Fábio Nogueira <fabio.bacabal@gmail.com>
 * @version 1.0.0
 */

// Dependências
import Listeners from './listeners';

let token, user;
let storage = sessionStorage;

/**
 * @type AuthClient
 */
let instance;

function AuthGet() {
    let defUser = {
        name: null,
        memberOf: []
    };

    try {
        user = JSON.parse(storage.getItem('user')) || defUser;
    } catch (_e) {
        user = defUser;
    }

    token = storage.getItem('token');

    user.permissions = {};
    user.memberOf.forEach(k => {
        user.permissions[k] = true;
    });
}

function AuthSet(payload) {
    storage.setItem('token', payload.token);
    storage.setItem('user', JSON.stringify(payload.user));

    AuthGet();
}

class AuthClient extends Listeners {
    router(router) {
        if (!this._router) {
            this._router = true;

            router.beforeEach((toRoute, fromRoute, next) => {
                if (toRoute.meta.requiresAuth && !instance.isAuthenticate()) {
                    this.dispatchEvent('requireAuth');
                    return next(false);
                }

                next();
            });

        }

        return this;
    }

    sign(response) {
        if (response.success) {
            AuthSet(response.payload);
            this.dispatchEvent('sign', user);
        }
    }

    signout() {
        storage.removeItem('token');
        storage.removeItem('user');
        AuthGet();
        this.dispatchEvent('signout');
    }

    getToken() {
        return token;
    }

    getUser() {
        return user.name;
    }

    isAuthenticate() {
        return Boolean(token);
    }

    memberOf(group) {
        return user.permissions[group] || false;
    }

    addEventListener(name, callback) {
        super.addEventListener(name, callback);

        switch (name) {
        case 'sign':
            if (this.isAuthenticate()) {
                super.dispatchEvent('sign', user);
            }
            break;

        case 'requireAuth':
            if (this._router && !this.isAuthenticate()) {
                super.dispatchEvent('requireAuth');
            }
            break;

        }

        return this;
    }
    }

if (!instance) {
    instance = new AuthClient();
}

AuthGet();

export default instance;
