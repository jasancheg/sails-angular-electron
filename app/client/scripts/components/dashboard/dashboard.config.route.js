(function() {
    'use strict';

    angular
        .module('app.components.dashboard')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/dashboard',
                config: {
                    templateUrl: 'scripts/components/dashboard/dashboard.html',
                    controller: 'DashboardCtrl',
                    controllerAs: 'vm',
                    title: 'dashboard',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-tachometer"></i> Dashboard'
                    }
                }
            }
        ];
    }
})();
