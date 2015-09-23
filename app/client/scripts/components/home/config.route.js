(function() {
    'use strict';

    angular
        .module('app.components.home')
        .run(appRun);

    // appRun.$inject = ['routehelper'];

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
                    controller: 'Home',
                    controllerAs: 'vm',
                    title: 'home',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Home'
                    }
                }
            }
        ];
    }
})();
