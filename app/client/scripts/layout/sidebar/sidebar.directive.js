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
        .directive('sideBar', SideBarDrtv);

    function SideBarDrtv () {

        var directive = {
            restrict: 'E',
            replace: 'true',
            templateUrl: 'scripts/layout/sidebar/sidebar.html',
            controller: 'SideBarCtrl',
            controllerAs: 'vm',
            scope: {
                whenDoneAnimating: '&?'
            },
            link: link
        }
        
        return directive;

        function link(scope, element, attrs) {
            console.log("side nav directive");
                
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    $sidebarInner.slideDown(350, scope.whenDoneAnimating);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350, scope.whenDoneAnimating);
                }
            }
        }
    }

})();