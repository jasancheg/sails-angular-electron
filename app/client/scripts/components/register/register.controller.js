(function() {
    'use strict';

    angular
        .module('app.components.register')
        .controller('RegisterCtrl', RegisterCtrl);

    function RegisterCtrl(logger) {

        var vm = this;

        vm.title = 'Register';
        vm.breadcrumbs = [{
            text:'Register',
            cls: 'active',
            url: '/register'
        }];

        logger.info('Activated Register View');
    }
})(); 
