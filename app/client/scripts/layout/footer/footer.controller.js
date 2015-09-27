/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('FooterNavCtrl', FooterNavCtrl);

    function FooterNavCtrl (logger) {
        logger.success('footer nav loaded!', null);
    }

})();