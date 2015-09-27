/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('MainViewCtrl', MainViewCtrl);

    function MainViewCtrl (logger) {
        logger.success('main view loaded!', null);
    }

})();