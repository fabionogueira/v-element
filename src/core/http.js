import AuthClient from './auth-client';
import Listeners from './listeners';

let Http, refreshTokenUrl;
let refreshTokenInProgress = false;
let listeners = new Listeners();
let waits = [];

function waitRefreshToken(fn) {
    waits.push(fn);
}

function waitRefreshTokenComplete(error = null) {
    waits.forEach(fn => {
        fn(error);
    });
    
    waits = [];
}

/**
 * Cria um objeto HttpClient que contenha o token atual no cabeçalho da solicitação
 */
function createHttpClient() {
    let client = new window.HttpClient().configure(instructions => {
        instructions.withInterceptor({
            response(response) {
                if (response.responseType == 'json') {
                    try {
                        response.response = JSON.parse(response.response);
                    } catch (_e) {
                        response.response = null;
                    }
                }
    
                return response;
            }
        });
  
        // instructions.withHeader('AppHostClient', Host.getName());
        // instructions.withHeader('AppClientVersion', Host.getAppVersion());
        instructions.withHeader('Authorization', AuthClient.getToken());
    });
  
    return client;
}

/**
 * Despacha a função de rejeição da Promise
 */
function nextResponseCatch(reject, errorObject) {
    reject({
        name: 'net::ERR',
        message: 'Server connection error',
        payload: {
            statusCode: errorObject.statusCode,
            statusText: errorObject.statusText,
            responseType: errorObject.responseType,
            response: errorObject.response
        }
    });
}
  
// Analisa a resposta recebida do servidor
/**
 * 
 * @param {Function} responseSuccess Função a ser chamada caso a análise do resultado seja considerado sucesso
 * @param {Function} responseError Função a ser chamada caso a análise do resultado seja considerado erro
 * @param {Function} responseTokenRefreshed Função a ser chamada caso durante a análise do resultado o token tenha sido renovado
 * @param {Boolean} ignoreRenew Define se o token deve ser renovado caso o servidor solicite renovação.
 */
function ResponseAnaliser(responseSuccess, responseError, responseTokenRefreshed, ignoreRenew = false) {
    return (HttpResponseMessage) => {
        let response = HttpResponseMessage.response;
        
        function doResponse() {
            if (!response.success) {
                // se token expirado, tenta renovar
                if (response.name == 'TokenExpiredError' && !ignoreRenew && response.payload && response.payload.refreshToken) {
                    refreshTokenInProgress = true;
        
                    return Http.refreshToken(response.payload.refreshToken)
                        .then((newResponse) => {
                            refreshTokenInProgress = false;
                            AuthClient.sign(newResponse);
                            responseTokenRefreshed();
                            waitRefreshTokenComplete();
                        })
                        .catch((error) => {
                            refreshTokenInProgress = false;
                            AuthClient.signout();
                            responseError(error);
                            waitRefreshTokenComplete(error);
                        });
                } else {
                    return responseError(response);
                }
            }
    
            responseSuccess(response);
        }

        response.payload = response.payload || {};
        
        // se a renovação de token está em andamento, aguarda.
        if (refreshTokenInProgress && HttpResponseMessage.requestMessage.url != refreshTokenUrl) {
            waitRefreshToken((error) => {
                if (error) {
                    responseError(error);
                } else {
                    responseTokenRefreshed();
                }
            });
        } else {
            doResponse();
        }
    };
}

Http = {
    /**
     * Envia uma requisição para o servidor adicionando no header o token,
     * converte a resposta para JSON e tenta renovar o token quando expira.
     */
    send(method, url, data = null, ignoreRenew = false) {
        return new Promise((resolve, reject) => {
            let responseAnaliser, httpClient;

            // função a ser chamada pelo ResponseAnaliser caso o token tenha sido renovado
            responseAnaliser = ResponseAnaliser(
                // resposta sucesso
                (response) => {
                    resolve(response);
                },

                // resposta de erro
                (erro) => {
                    reject(erro);
                },

                // resposta de token renovado, refaz a consulta ignorando uma nova renovação de token
                () => {
                    this.send(method, url, data, true)
                        .then(resolve)
                        .catch(reject);
                },

                ignoreRenew
            );

            httpClient = createHttpClient();

            httpClient[method](url, data)
                .then(responseAnaliser)
                .catch((errorObject) => {
                    nextResponseCatch(reject, errorObject);
                });
        });
    },

    setRefreshTokenUrl(url) {
        refreshTokenUrl = url;
    },

    post(url, data) {
        return this.send('post', url, data);
    },

    get(url) {
        return this.send('get', url);
    },

    refreshToken(key) {
        let data = {
            'token': AuthClient.getToken(),
            'key': key
        };

        if (!refreshTokenUrl) {
            throw new Error('refreshTokenUrl undefined, use Http.setRefreshTokenUrl(url) method');
        }

        return this.send('post', refreshTokenUrl, data, true);
    },

    addEventListener(eventName, callback, context = null) {
        listeners.addEventListener(eventName, callback, context);
    }
};

export default Http;
