/**
 * @ngdoc function
 * @name app.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the app
 */

(function() {
    'use strict';

    angular
        .module('app.components.register')
        .controller('RegisterCtrl', RegisterCtrl);

    /* @ngInject */
    function RegisterCtrl($scope, $http, $log, logger, alert, authToken) {

        var vm = this;

        vm.title = 'Register';

        if(authToken.isAuthenticated) {
            logger.info('the user is logged in');
            //alert('success','STATUS: ', 'the user is logged in');
        }

        vm.submit = function () {
            var url = 'http://localhost:1337/api/auth/register',
                user = {
                    email: $scope.input_email,
                    password: $scope.password
                };

            $http.post(url, user)
                .success(function(res) {
                    $log.info('success: ', res);
                    alert('success', 'Account Created!', 'Welcome, ' + res.user.email + '! Please email activate your account in the next several days.');
                    authToken.setToken(res.user.token);
                })
                .error(function(err) {
                    $log.error('Error: ', err);
                    alert('warning', 'Unable to create account, ', err.message);
                });

            // $auth.signup({
            //     email: $scope.email,
            //     password: $scope.password
            // })
            //     .then(function (res) {
            //         alert('success', 'Account Created!', 'Welcome, ' + res.data.user.email + '! Please email activate your account in the next several days.');
            //     })
            //     .catch(function (err) {
            //         alert('warning', 'Unable to create account :(', err.message);
            //     });
        };

        logger.info('Activated Register View');
    }
})(); 
