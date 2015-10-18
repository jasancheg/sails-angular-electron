/* global angular */  
(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('ShellCtrl', ShellCtrl);

    function ShellCtrl ($timeout, config, logger) {
        var vm = this;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.showSplash = true;

        activate();

        function activate() {
            logger.success('UI loaded!', {vm:vm});
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                vm.showSplash = false;
            }, 1000);
        }
    }

})();

