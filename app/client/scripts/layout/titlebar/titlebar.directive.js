/* global angular */

/**
 * TitleBar Directive
 *
 * Directive use:
 * @uses 1 - to use add <titlebar></titlebar> to html file.
 * @uses 2 - Optional parameters:
 * @parameter xxxx              [string :: Add filter by 'type xxxx' value]
 * @example   <titlebar xxxx='test'></titlebar>
 */

(function () {

    'use strict';

    function TitlebarDrtv () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'scripts/layout/titlebar/titlebar.html',
            controller: 'TitlebarCtrl',
            scope: {
                xxxx: '@'
            },
            link: function (scope, element, attrs, ctrl) {
                console.log("titlebar directive");
            }
        };
    }

    angular
        .module('app.layout')
        .directive('titlebar', TitlebarDrtv);

})();