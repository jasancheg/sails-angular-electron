(function() {
    'use strict';

    angular
        .module('app.components.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

    function DashboardCtrl($q, RestFactory, logger) {

        /*jshint validthis: true */
        var vm = this;

        vm.breadcrumbs = [{
            text:'Dashboard',
            cls: 'active',
            url: '/dashboard'
        }];
        
        vm.news = {
            title: 'Marvel Avengers',
            description: 'Marvel Avengers 3 is now in production!'
        };
        
        vm.avengerCount = 0;
        vm.avengers = [];
        vm.title = 'Avengers list';

        activate();

        function activate() {
            var promises = [getAvengerCount(), getAvengersCast()];
            return $q.all(promises).then(function() {
                logger.info('Activated Dashboard View');
            })
            .catch(function(message) {
                exception.catcher('XHR Failed for getAvengers \'getAvengerCount, getAvengersCast\'')(message);
                $location.url('/');
            });

        }

        function getAvengerCount() {
            return RestFactory.getAvengerCount().then(function(data) {
                vm.avengerCount = data;
                return vm.avengerCount;
            });
        }

        function getAvengersCast() {
            return RestFactory.getAvengersCast().then(function(data) {
                vm.avengers = data;
                return vm.avengers;
            });
                
        }
    }
})();
