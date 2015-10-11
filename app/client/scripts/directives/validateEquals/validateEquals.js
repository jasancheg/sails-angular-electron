/**
 * @ngDoc directive
 * @name .directive:validateEquals
 * @description
 * # validateEquals
 */

(function() {

    'use strict';

    angular
        .module('app.directives')
        .directive('validateEquals', ValidateEquals);

    /* @ngInject */
    function ValidateEquals() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModelCtrl) {

                // compare values
                function validateEqual(value) {
                    var valid = (value === scope.$eval(attrs.validateEquals));
                    ngModelCtrl.$setValidity('equal', valid);
                    return valid ? value : undefined;
                }

                ngModelCtrl.$parsers.push(validateEqual);
                ngModelCtrl.$formatters.push(validateEqual);

                // watch on target value
                scope.$watch(attrs.validateEquals, function() {
                    validateEqual(ngModelCtrl.$viewValue);
                    ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
                })
            }
        };
    }

})();
