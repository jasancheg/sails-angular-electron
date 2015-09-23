/* global angular */

(function () {

    'use strict';

    function Router ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/app');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'scripts/components/home/home.html',
                data: {
                    requireLogin: true
                }
            })
            .state('app.dashboard', {
                url: '/dashboard/',
                controller: 'DashboardCtrl',
                templateUrl: 'scripts/components/dashboard/dashboard.html',
                data: {
                    sectionTitle: 'Project Dashboard',
                    sectionDescription: ''
                }
            })
            .state('app.avengers', {
                url: '/avengers/',
                controller: 'AvengersCtrl',
                templateUrl: 'scripts/components/avengers/avengers.html',
                data: {
                    sectionTitle: '',
                    sectionDescription: ''
                }
            });
    }

    angular
        .module('blocks.router', [
            // 'app.components.home',
            // 'app.components.dashboard',
            // 'app.components.avengers',
            'ui.router'
        ])
        .config(Router);

})();