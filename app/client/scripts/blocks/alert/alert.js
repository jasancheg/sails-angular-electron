/**
 * @ngDoc service
 * @name blocks:alert
 * @description
 * # alert with toast(tooltip) notifications
 */

(function() {
    'use strict';

    angular
        .module('blocks.alert')
        .service('alert', alert);

    /* @ngInject */
    function alert($rootScope, $timeout, $log) {
        
        var alertTimeout,
            service = alert;

        // make the alert as global service too
        dataOs.alert = service;
        
        return service;
        /////////////////////

        function alert(type, title, message, timeout) {
            $rootScope.alert = {
                hasBeenShown: true,
                show: true,
                type: type,
                message: message,
                title: title
            };
            $timeout.cancel(alertTimeout);
            alertTimeout = $timeout(function() {
                $rootScope.alert.show = false;
            }, timeout || 2000);
        
            $log.error('Error: ' + message, $rootScope.alert);
            $log.warn('Warning: ' + message, $rootScope.alert);
            $log.info('Notifications: ' + message, $rootScope.alert);
        }

    }
}());
