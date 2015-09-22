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

    function SideBarDrtv () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'scripts/layout/sidebar/sidebar.html',
            controller: 'SideBarCtrl',
            link: function (scope, element, attrs, ctrl) {
                console.log("side nav directive");
            }
        };
    }

    angular
        .module('app.layout')
        .directive('sideBar', SideBarDrtv);

})();