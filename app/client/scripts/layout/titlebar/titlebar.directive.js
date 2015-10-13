/**
 * TitleBar Directive
 *
 */

(function () {

    'use strict';

    function TitlebarDrtv () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'scripts/layout/titlebar/titlebar.html',
            controller: 'TitlebarCtrl',
            controllerAs: 'vm',
            scope: {},
            link: function (scope, element, attrs, ctrl) {
                // console.log("titlebar directive");
            }
        };
    }

    angular
        .module('app.layout')
        .directive('titlebar', TitlebarDrtv);

})();