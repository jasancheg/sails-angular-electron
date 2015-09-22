/* global angular */

(function () {

    'use strict';

    function TitlebarCtrl ($scope, $window) {
        console.log("titlebar controller");
    }

    angular
        .module('app.layout')
        .controller('TitlebarCtrl', TitlebarCtrl);

})();