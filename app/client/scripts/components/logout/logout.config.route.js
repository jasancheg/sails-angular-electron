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
        .module('app.components.logout')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/logout',
                config: {
                    controller: 'LogoutCtrl',
                    settings: {
                        type:'admin',
                        nav: 5,
                        content: '<i class="fa fa-logout"></i> Logout'
                    }
                }
            }
        ];
    }
})();
