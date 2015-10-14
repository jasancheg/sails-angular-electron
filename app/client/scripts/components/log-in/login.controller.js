/**
 * @ngdoc function
 * @name app.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the app
 */

(function() {
    'use strict';

    angular
        .module('app.components.login')
        .controller('LoginCtrl', LoginCtrl);

    function LoginCtrl(logger, alert, auth) {

        var vm = this;

        vm.title = 'Please Sign in';
        vm.breadcrumbs = [{
            text:'Log in',
            cls: 'active',
            url: '/login'
        }];

        vm.submit = function () {
            auth
                .login(vm.email, vm.password)
                .then(function (res) {
                    var message = 'Thanks for coming back ' + res.data.data.email + '!';

                    if (!res.data.data.active) {
                        message = 'Just a reminder, please activate your account soon :)';
                    }

                    alert('success', 'Welcome', message);
                })
                .catch(handleError);
        };

        vm.authenticate = function (provider) {
            // $auth.authenticate(provider).then(function (res) {
            //     alert('success', 'Welcome', 'Thanks for coming back ' + res.data.user.displayName + '!');
            // }, handleError);
        }

        function handleError(err) {
            alert('warning', 'Something went wrong :(', err.message);
        }

        logger.info('Activated Log in View');
    }
})(); 
