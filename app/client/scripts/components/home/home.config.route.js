/**
 * @ngdoc Object
 * @name app.components:appRun
 * @description
 * # routehelper instance
 * extend Route of the app
 */

(function() {
    'use strict';

    angular
        .module('app.components.home')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    templateUrl: 'scripts/components/home/home.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'vm',
                    title: 'home',
                    settings: {
                        type:'mainnav',
                        nav: 1,
                        content: '<i class="fa fa-home"></i> Home'
                    }
                }
            }
        ];
    }
})();
