/* global toastr:false, moment:false, dataOs:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment)
        // 'os' grouped global information from rendered process
        .constant('os', dataOs);
})();
