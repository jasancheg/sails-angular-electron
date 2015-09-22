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

    function FooterNavDrtv () {
        return {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'scripts/layout/footer/footer.html',
            controller: 'FooterNavCtrl',
            link: function (scope, element, attrs, ctrl) {
                console.log("footer nav directive");
            }
        };
    }

    angular
        .module('app.layout')
        .directive('footerNav', FooterNavDrtv);

})();