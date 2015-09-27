/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('HeaderNavCtrl', HeaderNavCtrl);

    // function HeaderNavCtrl (logger) {
    //     logger.success('header nav loaded!', null);
    // }

    function HeaderNavCtrl ($route, routehelper, logger) {
        
        logger.success('header nav loaded!', null);
    
        var vm = this;
        window.routehelper = routehelper;
        console.log('routehelper: ',routehelper);
        //var routes = routehelper.getRoutes();
        // console.log('routes: ', routes)
        // vm.isCurrent = isCurrent;
        // vm.headerReady = function(){console.log('done animating menu')}; // example
        // console.log('done animating Main menu')
        
        // activate();

        // function activate() { getNavRoutes(); }

        // function getNavRoutes() {
        //     vm.navRoutes = routes.filter(function(r) {
        //         return r.settings && r.settings.nav;
        //     }).sort(function(r1, r2) {
        //         return r1.settings.nav - r2.settings.nav;
        //     });
        // }

        // function isCurrent(route) {
        //     if (!route.title || !$route.current || !$route.current.title) {
        //         return '';
        //     }
        //     var menuName = route.title;
        //     return $route.current.title.substr(0, menuName.length) === menuName ? 'active' : '';
        // }

    }

})();