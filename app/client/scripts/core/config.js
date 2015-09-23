/* global angular */

(function () {

    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };
    core.value('config', config);
    
    core.config(Config);
    /* @ngInject */
    function Config ($logProvider, $sailsProvider, RestangularProvider, exceptionHandlerProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        RestangularProvider.setBaseUrl('http://localhost:1337/');
        $sailsProvider.url = 'http://localhost:1337/';
    }

})();
