/* global angular */

(function () {

    'use strict';

    angular
        .module('blocks.router', [
            'app.components',
            'ui.router'
        ])
        .config(Router);

        function Router ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        $stateProvider
            .state('app', {
                url: '/app',
                templateUrl: 'scripts/components/home/home.html'
            })

            .state('app.dashboard', {
                url: '/dashboard',
                controller: 'DashboardCtrl',
                templateUrl: 'scripts/components/dashboard/dashboard.html'
            })
            .state('app.avengers', {
                url: '/avengers',
                controller: 'AvengersCtrl',
                templateUrl: 'scripts/components/avengers/avengers.html'
            });
    }

})();