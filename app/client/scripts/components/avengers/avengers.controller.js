(function() {
    'use strict';

    angular
        .module('app.components.avengers')
        .controller('AvengersCtrl', AvengersCtrl);

    /* @ngInject */
    function AvengersCtrl($q, RestFactory, logger) {
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

        function getAvengers() {
            var avengersConnection = RestFactory.getAvengers();
            /**
             * API: /api/avengers/show
             */
            avengersConnection.one('show').get().then(function (response) {
                vm.avengers = response.data[0].data.results;
                return vm.avengers;
            });
        }
    }
})();
