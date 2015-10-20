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

    function LoginCtrl($q, $window, $location, $auth, auth, logger, alert, User) {

        var vm = this;

        vm.title = 'Please Sign in';
        vm.breadcrumbs = [{
            text:'Log in',
            cls: 'active',
            url: '/login'
        }];

        vm.submit = function () {
            $auth
                .login({
                    email:vm.email, 
                    password: vm.password
                })
                .then(function (res) {
                    var message = 'Thanks for coming back ' + res.data.data.email + '!';

                    if (!res.data.data.active) {
                        message = 'Just a reminder, please activate your account soon :)';
                    }

                    alert('success', 'Welcome', message);
                    // store active user in localstorage
                    User.setUser(JSON.stringify(res.data));
                    $location.path('/');
                })
                .catch(handleError);
        };

        vm.manualAuth = function (provider) {
            auth.manualAuth(provider).then(function (res) {
                var message = [
                    'Welcome', 
                    'Thanks for coming back ',
                    res.data.displayName + '!'
                ];
                if (res.type && res.type === 'new') {
                    message = [
                        'Account created!', 
                        'Welcome, ' + res.data.displayName + '! Please email activate your account in the next several days.'
                    ];
                }
                if(res.data){
                    // store active user in localstorage
                    User.setUser(JSON.stringify(res.data));
                    alert('success', message[0], message[1]);
                }
            }, handleError);
        }

        vm.authenticate = function (provider) {
            auth.authenticate(provider).then(function (res) {
                var message = [
                    'Welcome', 
                    'Thanks for coming back ',
                    res.data.displayName + '!'
                ];
                if (res.type && res.type === 'new') {
                    message = [
                        'Account created!', 
                        'Welcome, ' + res.data.displayName + '! Please email activate your account in the next several days.'
                    ];
                }
                if(res.data){
                    // store active user in localstorage
                    User.setUser(JSON.stringify(res.data));
                    alert('success', message[0], message[1]);
                }
            }, handleError);
        }

        function handleError(err) {
            alert('warning', 'Something went wrong :(', err.message);
        }

        logger.info('Activated Log in View');
    }
})(); 
