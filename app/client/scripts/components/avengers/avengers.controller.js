(function() {
    'use strict';

    angular
        .module('app.components.avengers')
        .controller('AvengersCtrl', AvengersCtrl);

    /* @ngInject */
    function AvengersCtrl($location, $q, $routeParams, exception, logger, RestFactory) {
        var vm = this;

        vm.avengers = [];
        vm.title = 'Team';

        vm.breadcrumbs = [{
            text:'Avengers',
            cls: 'active',
            url: '/avengers'
        }];

        activate();

        function activate() {
            return $q.all([getAvengers()]).then(function() {
                logger.info('Activated Avengers View');
            });
        }

        /**
         * API: /api/avengers/show
         */
        function getAvengers() {

            var avengersConnection = RestFactory.getAvengers();
            
            return avengersConnection.one('show').get()
                .then(getAvengersComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getAvengers')(message);
                    $location.url('/');
                });

            function getAvengersComplete(response) {
                vm.avengers = response.data[0].data.results;
                return vm.avengers;
            }

        }
    }
})();
