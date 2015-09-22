/* global angular */

(function () {

    'use strict';

    function HeaderNavCtrl ($scope, $window) {
    
        console.log("headerNav controller");
    }

    angular
        .module('app.layout')
        .controller('HeaderNavCtrl', HeaderNavCtrl);

})();