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

    function LogoutCtrl($location, $http, $auth, $window, logger, authToken, User, API_URL) {
        // check for library and manual remove
        authToken.removeToken();
        $auth.logout();
        // remove user stored in localStorage
        User.removeUser();

        logger.info('User has logout');
        $http.get(API_URL + 'api/auth/logout');
        // redirect to login page
        $location.path('#/login');
    }
})(); 
