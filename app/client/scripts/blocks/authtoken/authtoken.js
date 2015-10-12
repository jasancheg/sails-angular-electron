(function() {
    'use strict';

    angular
        .module('blocks.authToken')
        .factory('authToken', authToken);

    /* @ngInject */
    function authToken($window) {
        var storage = $window.localStorage,
            cachedToken,
            userToken = 'userToken',
            isAuthenticated = false,
            authToken = {
                setToken: function(token) {
                    cachedToken = token;
                    storage.setItem(userToken, token);
                    isAuthenticated = true;
                },
                getToken: function() {
                    if (!cachedToken)
                        cachedToken = storage.getItem(userToken);

                    return cachedToken;
                },
                isAuthenticated: function() {
                    return !!authToken.getToken();
                },
                removeToken: function() {
                    cachedToken = null;
                    storage.removeItem(userToken);
                    isAuthenticated = false;
                }
            }

        return authToken;
    }
})();
