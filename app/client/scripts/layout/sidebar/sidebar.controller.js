/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('SideBarCtrl', SideBarCtrl);

    function SideBarCtrl ($route, routehelper, logger) {
        
        logger.success('Side Bar loaded!', null);
    
        var vm = this;
        var routesAdmin = routehelper.getRoutes({settings:{type: 'admin'}});
        var routesMain = routehelper.getRoutes({settings:{type: 'mainnav'}});

        vm.isCurrent = isCurrent;
        vm.sidebarReady = function(){console.log('done animating menu')}; // example
        console.log('done animating menu')

        
        activate();

        function activate() { getNavRoutes(); }

        function getNavRoutes() {
            vm.mainNavRoutes = routesMain.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
            vm.adminNavRoutes = routesAdmin.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

    }
})();

