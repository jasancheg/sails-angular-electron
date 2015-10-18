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
    function RegisterCtrl($log, $auth, $location, logger, alert, User) {

        var vm = this;

        vm.title = 'Register';

        if($auth.isAuthenticated()) {
            logger.info('the user is logged in');
            alert('info','STATUS: ', 'the user is logged in');
        }

        vm.submit = function () {
            $auth
                .signup({
                    email: vm.email, 
                    password: vm.password
                })
                .then(function (res) {
                    $auth.setToken(res.data.token);
                    User.setUser(JSON.stringify(res.data));
                    alert(
                        'success', 
                        'Account Created!', 
                        'Welcome, ' + res.data.data.email + '! Please email activate your account in the next several days.'
                    );
                    $location.path('/');
                })
                .catch(handleError);
        };

        function handleError(err) {
            // check type: for email exist or bad request
            var errorMsg = err.status === 409 ? err.data.data.email[0].message : err.message;
            $log.error('Error: ', errorMsg);
            alert('warning', 'Unable to create account: ', errorMsg);
        }

        /**
         * log module init
         */
        logger.info('Activated Register View');
    }
})(); 
