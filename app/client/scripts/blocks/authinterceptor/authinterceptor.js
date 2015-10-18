(function() {
    'use strict';

    angular
        .module('blocks.authInterceptor')
        .factory('authInterceptor', authInterceptor);

    /* @ngInject */
    function authInterceptor(authToken) {
        return {
            request: function(config) {
                var token = authToken.getToken();

                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },
            response: function(response) {
                return response;
            }
        };
    }
})();
