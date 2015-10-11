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
        .module('app.components.login')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/login',
                config: {
                    templateUrl: 'scripts/components/log-in/login.html',
                    controller: 'LoginCtrl',
                    controllerAs: 'vm',
                    title: 'Log in',
                    settings: {
                        type:'admin',
                        nav: 4,
                        content: '<i class="fa fa-home"></i> Log in'
                    }
                }
            }
        ];
    }
})();
