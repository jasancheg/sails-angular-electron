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
        alert("yep");
        console.log("XXXXXXXXXXXXXXXXXXXXX si que esta llegando");
        authToken.removeToken();
        logger.info('User has logout');
        $location.path('#/login')
    }
})(); 
