(function() {
    'use strict';

    angular
        .module('app.components.login')
        .controller('LoginCtrl', LoginCtrl);

    function LoginCtrl(logger) {

        var vm = this;

        vm.title = 'Please Sign in';
        vm.breadcrumbs = [{
            text:'Log in',
            cls: 'active',
            url: '/login'
        }];

        logger.info('Activated Log in View');
    }
})(); 
