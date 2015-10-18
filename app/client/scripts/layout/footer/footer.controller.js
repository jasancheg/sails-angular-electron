/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('FooterNavCtrl', FooterNavCtrl);

    /* @ngInject */
    function FooterNavCtrl ($q, $auth, $route, routehelper, logger) {

        var footer = this,
            notificationsState = dataOs.showDevNotifications,
            routes = routehelper.getRoutes({settings:{type: 'logout'}});
        
        footer.notificationsClass = '';
        footer.isAuthenticated = isAuthenticated;
        footer.toggleNotifications = toggleNotifications; 

        // activate online offline notifications envents and DOM state color
        renderedProccessApi.managetOnlineOfflineStatus();

         activate();

        /**
         * controller init
         * @return {[asynchronously execution]} activate
         */
        function activate() { 
            return $q.all([getNavRoutes()]).then(function() {
                logger.success('footer nav loaded!', {footer:footer});
            });
        }

        /**
         * define routes for main menu by type [mainnav]
         * @return {[obj]} ordered list of routes
         */
        function getNavRoutes() {
            footer.navRoutes = routes.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        /**
         * [isAuthenticated description]
         * @return {Boolean} [description]
         */
        function isAuthenticated() {
            //console.log('$auth.isAuthenticated: ', $auth.isAuthenticated());
            return $auth.isAuthenticated();
        }

        /**
         * [toggleNotifications description]
         * @param  {[type]} e [description]
         * @return {[type]}   [description]
         */
        function toggleNotifications(e){
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

    }

})();