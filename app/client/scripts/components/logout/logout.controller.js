/**
 * @ngdoc function
 * @name app.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the app
 */

(function() {
    'use strict';

    angular
        .module('app.components.logout')
        .controller('LogoutCtrl', LogoutCtrl);

    function LogoutCtrl($location, logger, authToken) {
        authToken.removeToken();
        logger.info('User has logout');
        // redirect to login page
        $location.path('#/login')
    }
})(); 
