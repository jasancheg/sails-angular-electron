/* global angular */

(function () {

    'use strict';

    function FooterNavCtrl ($scope, $window) {
        console.log("footer nav controller");
    }

    angular
        .module('app.layout')
        .controller('FooterNavCtrl', FooterNavCtrl);

})();