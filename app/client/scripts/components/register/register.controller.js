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
    function RegisterCtrl($log, logger, alert, auth, authToken) {

        var vm = this;

        vm.title = 'Register';

        if(authToken.isAuthenticated()) {
            logger.info('the user is logged in');
            alert('info','STATUS: ', 'the user is logged in');
        }

        vm.submit = function () {
            auth
                .register(vm.email, vm.password)
                .then(function (res) {
                    alert(
                        'success', 
                        'Account Created!', 
                        'Welcome, ' + res.data.data.email + '! Please email activate your account in the next several days.'
                    );
                })
                .catch(handleError);
        };

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

        function handleError(err) {
            // check type: for email exist or bad request
            var errorMsg = err.status === 409 ? err.data.data.email[0].message : err.message;
            $log.error('Error: ', errorMsg);
            alert('warning', 'Unable to create account: ', errorMsg);
        }

        logger.info('Activated Register View');
    }
})(); 
