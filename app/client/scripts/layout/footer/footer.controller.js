/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('FooterNavCtrl', FooterNavCtrl);

    function FooterNavCtrl (logger, authToken) {

        var footer = this,
            notificationsState = dataOs.showDevNotifications;

        footer.isAuthenticated = function() {
            return authToken.isAuthenticated;
        }

        footer.notificationsClass = '';
        footer.toggleNotifications = function(e){
            if(notificationsState) {
                notificationsState = false;
                footer.notificationsClass = '';
                logger.notif('Debug notifications deactivated', null);
            } else {
                notificationsState = true;
                footer.notificationsClass = 'activated';
                logger.notif('Debug notifications activated', null);
            }
            dataOs.showDevNotifications = notificationsState;
        }

        // activate online offline notifications envents and DOM state color
        renderedProccessApi.managetOnlineOfflineStatus();

        logger.success('footer nav loaded!', null);
    }

})();