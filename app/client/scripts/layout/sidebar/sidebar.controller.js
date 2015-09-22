/* global angular */

(function () {

    'use strict';

    function SideBarCtrl ($scope, $window) {
        console.log("sideBar controller");

       
    }

    angular
        .module('app.layout')
        .controller('SideBarCtrl', SideBarCtrl);

})();