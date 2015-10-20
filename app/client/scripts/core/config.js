/* jshint camelcase: false */
/* global angular */

(function () {

    'use strict';

    var core = angular.module('app.core'),

        config = {
            appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
            appTitle: 'Sails Angular Modular Demo',
            version: '1.0.0'
        };

    core.value('config', config);

    /* @ngInject */
    function toastrOptions(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }
    core.config(toastrOptions);

    /* @ngInject */
    function SailsRestServicesProviders ($sailsProvider, RestangularProvider, API_URL) {
        RestangularProvider.setBaseUrl(API_URL);
        $sailsProvider.url = API_URL;
    }
    core.config(SailsRestServicesProviders);

    /* @ngInject */
    function httpAutherntificationProviders ($httpProvider, $authProvider, API_URL, Config) {
        // http authentification interceptors
        $httpProvider.interceptors.push('authInterceptor');

        // set config of authentification providers 
        $authProvider.loginUrl = API_URL + 'api/auth/login';
        $authProvider.signupUrl = API_URL + 'api/auth/register';
        $authProvider.google({
            clientId: Config.GOOGlE_CLIENT_ID,
            url: API_URL + Config.GOOGLE_REDIRECT_URL,
            redirectUri: API_URL + Config.GOOGLE_REDIRECT_URL
        });
        $authProvider.facebook({
            clientId: Config.FACEBOOK_CLIENT_ID,
            url: API_URL + Config.FACEBOOK_REDIRECT_URL,
            redirectUri: API_URL + Config.FACEBOOK_REDIRECT_URL//,
            //scope: ['user_about_me', 'email', 'user_photos']
        });
    }
    core.config(httpAutherntificationProviders);

    /* @ngInject */
    function configure ($logProvider, $routeProvider, routehelperConfigProvider, exceptionHandlerProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }

        // Configure the common route provider
        routehelperConfigProvider.config.$routeProvider = $routeProvider;
        routehelperConfigProvider.config.docTitle = 'NG-Modular: ';
        
        // Configure the common exception handler
        exceptionHandlerProvider.configure(config.appErrorPrefix);

        var resolveAlways = { 
            /* @ngInject */
            ready: function(RestFactory) {
                return RestFactory.ready();
            }
        };
        routehelperConfigProvider.config.resolveAlways = resolveAlways;
    }
    core.config(configure);

})();
