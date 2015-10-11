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
        .module('app.components.avengers')
        .run(appRun);

    // appRun.$inject = ['routehelper']

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/avengers',
                config: {
                    templateUrl: 'scripts/components/avengers/avengers.html',
                    controller: 'AvengersCtrl',
                    controllerAs: 'vm',
                    title: 'avengers',
                    settings: {
                        type:'mainnav',
                        nav: 3,
                        content: '<i class="fa fa-star"></i> Avengers'
                    }
                }
            }
        ];
    }
})();
