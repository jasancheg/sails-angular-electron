(function() {
    'use strict';

    angular
        .module('app.components.home')
        .controller('HomeCtrl', HomeCtrl);

    function HomeCtrl($q, dataservice, logger) {

        var vm = this;

        vm.news = {
            title: 'Marvel Avengers',
            description: 'Marvel Avengers 2 is now in production!'
        };
        vm.avengerCount = 0;
        vm.avengers = [];
        vm.title = 'Home';
        
        vm.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'SailsJS',
            'Electron Atom',
            'Karma'
        ];

        logger.info('Activated Home View');

    }
})();
