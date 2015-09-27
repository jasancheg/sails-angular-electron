/* global angular */

/**
 * Header Nav Directive
 *
 * Directive use:
 * @uses 1 - to use add <header-nav></header-nav> to html file.
 * @uses 2 - Optional parameters:
 * @parameter xxxx              [string :: Add filter by 'type xxxx' value]
 * @example   <header-nav xxxx='test'></header-nav>
 */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .directive('appShell', ShellDrtv);

    function ShellDrtv () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'scripts/layout/shell/shell.html',
            controller: 'ShellCtrl',
            controllerAs: 'vm',
            link: function (scope, element, attrs, ctrl) {
                console.log("UI loaded - shell directive");
            }
        };
    }

})();