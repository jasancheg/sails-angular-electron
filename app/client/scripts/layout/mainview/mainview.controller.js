/* global angular */

(function () {

    'use strict';

    function MainViewCtrl ($scope, $window) {
        console.log("mainView controller");
        'use strict';

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'SailsJS',
            'Electron Atom',
            'Karma'
        ];
    }

    angular
        .module('app.layout')
        .controller('MainViewCtrl', MainViewCtrl);

})();