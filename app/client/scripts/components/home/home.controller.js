(function() {
    'use strict';

    angular
        .module('app.components.home')
        .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl(logger) {

        var vm = this;

        vm.title = 'The Home View page';
        vm.breadcrumbs = [{
            text:'Home',
            cls: 'active',
            url: '/home'
        }];
        
        vm.awesomeThings = [
            'HTML5 Boilerplate',
            'Bootstrap 3',
            'Fontawesome',
            'jQuery',
            'AngularJS',
            'angular-route',
            'angular-sails',
            'angular-mocha',
            'angular-sanitize',
            'angular.plus',
            'Restangular',
            'Lodash',
            'moment',
            'custom toastr',
            'custom front end logger',
            'custom excepction-handler-provider',
            'NodeJS',
            'SailsJS',
            'Nedb',
            'Electron Atom',
            'autogenerate documentation',
            'client page documentation',
            'server page documentation',
            'Karma',
            'Protractor',
            'Jasmine',
            'Mocha',
            'Nightwatch'
        ];

        logger.info('Activated Home View');
    }
})(); 
