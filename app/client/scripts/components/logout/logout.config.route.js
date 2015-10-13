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
                    template: '',
                    controller: 'LogoutCtrl',
                    title: 'Logout',
                    settings: {
                        type:'logout',
                        nav: 1,
                        icon: '<i class="fa fa-sign-out"></i>'
                    }
                }
            }
        ];
    }
})();
