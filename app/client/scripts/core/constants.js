/* global toastr:false, moment:false, dataOs:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('API_URL', 'http://localhost:1337/')
        // 'os' grouped global information from rendered process
        .constant('os', dataOs);
})();
