/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('TitlebarCtrl', TitlebarCtrl);

    function TitlebarCtrl (logger) {
        logger.success('titlebar loaded!', null);
    }

})();