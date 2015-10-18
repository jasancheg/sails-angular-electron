/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('HeaderNavCtrl', HeaderNavCtrl);

    /* @ngInject */
    function HeaderNavCtrl ($q, $route, routehelper, logger) {
        
        var header = this,
            historyCount = 0,
            historyMax = 0,
            routes = routehelper.getRoutes({settings:{type: 'mainnav'}});
        
        header.isActive = isActive;
        header.goForward = goForward;
        header.goBack = goBack;

        activate();

        /**
         * controller init
         * @return {[asynchronously execution]} activate
         */
        function activate() { 
            return $q.all([getNavRoutes()]).then(function() {
                logger.success('header nav loaded!', {header:header});
            });
        }

        /**
         * define routes for main menu by type [mainnav]
         * @return {[obj]} ordered list of routes
         */
        function getNavRoutes() {
            header.navRoutes = routes.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        /**
         * define active tab on menu
         * @param  {[type]}  route [description]
         * @return {Boolean}       [description]
         */
        function isActive(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
        }

        /**
         * history forward
         * @return {[redirection]} get forwart to next page on histroy
         */
        function goForward() {
            renderedProccessApi.historyForward();
            // header.forwardDisplay = dataOs.history.canGoForward;
            // header.backDisplay = dataOs.history.canGoBack;
        }

        /**
         * history back
         * @return {[redirection]} get back to previous page on history
         */
        function goBack() {
            renderedProccessApi.historyBack();   
            // header.forwardDisplay = dataOs.history.canGoForward;
            // header.backDisplay = dataOs.history.canGoBack;
        }

    }

})();