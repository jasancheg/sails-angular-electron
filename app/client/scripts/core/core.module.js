/**
 * @ngdoc Module
 * @name app.core
 * @description
 * # module
 * define module of the app
 */

(function() {
    'use strict';

    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngRoute', 'ngSanitize',
        /*
         * Our reusable cross app code modules
         */
        'blocks.exception', 'blocks.logger', 'blocks.alert', 'blocks.router',
        'blocks.authToken', 'blocks.authInterceptor',
        /*
         * 3rd Party modules
         */
        'ngplus', 'ngSails', 'restFactory' //, 'ui.router' 
    ]);
})();
