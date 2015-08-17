'use strict';

/**
 * @ngdoc function
 * @name angularsailsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularsailsApp
 */
angular.module('angularsailsApp')
    .controller('MainCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'SailsJS',
            'Electron Atom',
            'Karma'
        ];
    });
