/* global angular */

(function () {

    'use strict';

    var core = angular.module('app.core');

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }
    core.config(toastrConfig);

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Sails Angular Modular Demo',
        version: '1.0.0'
    };
    core.value('config', config);
    
    /* @ngInject */
    function configure ($httpProvider, $logProvider, $routeProvider, 
        routehelperConfigProvider, exceptionHandlerProvider) {

        // http authentification interceptors
        $httpProvider.interceptors.push('authInterceptor');

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

    /* @ngInject */
    function Sails ($sailsProvider, RestangularProvider, API_URL) {
        RestangularProvider.setBaseUrl(API_URL);
        $sailsProvider.url = API_URL;
    }
    core.config(Sails);


    core.run(function ($window) {
        // var params = $window.location.search.substring(1);
        // window.params = params;
        // console.log('params: ', params);
        //console.log('$window.opener: ', $window.opener.location.origin);

        // if (params && $window.opener && $window.opener.location.origin === $window.location.origin) {
        //     var pair = params.split('=');
        //     var code = decodeURIComponent(pair[1]);

        //     $window.opener.postMessage(code, $window.location.origin);
        // }
    });
})();
