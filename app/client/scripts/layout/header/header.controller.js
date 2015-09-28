/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('HeaderNavCtrl', HeaderNavCtrl);

    function HeaderNavCtrl ($route, routehelper, logger) {
        
        var vm = this,
            routes = routehelper.getRoutes({settings:{type: 'mainnav'}});
        
        vm.isActive = isActive;
        vm.headerReady = function(){console.log('done animating menu')}; // example
        
        activate();
        logger.success('header nav loaded!', null);

        function activate() { getNavRoutes(); }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isActive(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
        }

    }

})();