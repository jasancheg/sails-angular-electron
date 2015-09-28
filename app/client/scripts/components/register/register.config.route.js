(function() {
    'use strict';

    angular
        .module('app.components.register')
        .run(appRun);

    /* @ngInject */
    function appRun(routehelper) {
        routehelper.configureRoutes(getRoutes());
    }

    function getRoutes() {
        return [
            {
                url: '/register',
                config: {
                    templateUrl: 'scripts/components/register/register.html',
                    controller: 'RegisterCtrl',
                    controllerAs: 'vm',
                    title: 'Register',
                    settings: {
                        type:'admin',
                        nav: 5,
                        content: '<i class="fa fa-home"></i> Register'
                    }
                }
            }
        ];
    }
})();
