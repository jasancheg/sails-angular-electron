/**
 * @ngDoc service
 * @name blocks:logger
 * @description
 * # logger with toast(tooltip) notifications
 */

(function() {
    'use strict';

    angular
        .module('blocks.logger')
        .factory('logger', logger);

    /* @ngInject */
    function logger($log, toastr) {
        var service = {
            showToasts: true,

            error   : error,
            info    : info,
            success : success,
            warning : warning,
            notif   : notifications,

            // straight to console; bypass toastr
            log     : $log.log
        };

        // make the logger as global service too
        dataOs.logger = service;
        
        return service;
        /////////////////////

        function error(message, data, title) {
            if(dataOs.showDevNotifications) {
                toastr.error(message, title);
            }
            $log.error('Error: ' + message, data);
        }

        function info(message, data, title) {
            if(dataOs.showDevNotifications) {
                toastr.info(message, title);
            }
            $log.info('Info: ' + message, data);
        }

        function success(message, data, title) {
            if(dataOs.showDevNotifications){
                toastr.success(message, title);
            }
            $log.info('Success: ' + message, data);
        }

        function warning(message, data, title) {
            if(dataOs.showDevNotifications) {
                toastr.warning(message, title);
            }
            $log.warn('Warning: ' + message, data);
        }

        function notifications(message, data, title) {
            toastr.info(message, title);
            $log.info('Notifications: ' + message, data);
        }

    }
}());
