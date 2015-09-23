(function() {
    'use strict';

    angular
        .module('app.components.home')
        .controller('Home', Home);

    Home.$inject = ['$q', 'dataservice', 'logger'];

    function Home($q, dataservice, logger) {

        /*jshint validthis: true */
        var vm = this;

        vm.news = {
            title: 'Marvel Avengers',
            description: 'Marvel Avengers 2 is now in production!'
        };
        vm.avengerCount = 0;
        vm.avengers = [];
        vm.title = 'Home';
    }
})();
