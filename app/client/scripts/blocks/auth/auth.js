/**
 * @ngDoc service
 * @name blocks:auth
 * @description
 * # auth with header notifications (Temp: this in progress)
 *   logic will be changed to be a global service
 */

(function() {
    'use strict';

    angular
        .module('blocks.auth')
        .service('auth', auth);

    /* @ngInject */
    function auth($q, $log, $sails, $window, $location, $auth, API_URL, authToken) {
        var popup,
            // google config data
            authUri = 'https://accounts.google.com/o/oauth2/auth',
            servUri = API_URL + 'api/auth/googleauth',
            clientId = '124193795163-3me354kp9ujfkmv01pe1acldjpce0spg.apps.googleusercontent.com',
            urlBuilder = [
                'response_type=code',
                'client_id=' + clientId,
                'redirect_uri=' + servUri,
                'scope=profile email'
            ], 
            popupOptions = [
                'width=500',
                'height=500',
                'left=' + ($window.outerWidth - 500) / 2,
                'top=' + ($window.outerHeight - 500) / 2.5
            ];

        // helper function: store token in local storage and redirect to the home view
        function authSuccessful(res) {
            $auth.setToken(res.token);
            $location.path('/');
        }

        // helper function: error function callback
        function handleError(err) {
            $log.warn('warning: Something went wrong', err.message);
        }

        /**
         * [authenticate description]
         * @param  {[type]} provider [description]
         * @return {[type]}          [description]
         */
        this.authenticate = function (provider) {

            $log.warn('POR AQUI ANDA: ', provider);

            var deferred = $q.defer();
            $window.focus();

            // $auth.unlink(provider)
            //     .then(function(response) {
            //         // You have unlinked a GitHub account.
            //         $auth.authenticate(provider);
            //     })
            //     .catch(function(response) {
            //         // Handle errors here.
            //         $log.error('UNLINK: ', response);
            //     });

            $auth.authenticate(provider);
            // for some reason this callback is not working :P
            //.then(function (res) {
            //     $log.warn('RES: ', res);
            // }, handleError);

            /**
             * for reason that the promise is no working this socket is used
             * Init socket to check for updates on the googleauth or facebookauth code
             * @param  {[string]} message [Received [google|facebook] authentification code]
             */
            $sails.on(provider + 'auth', function (data) {
                authSuccessful(data);
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.googleAuth = function() {
            var options = popupOptions.join(','),
                url = authUri + "?" + urlBuilder.join('&'),
                deferred = $q.defer();

            popup = $window.open(url, '', options);
            $window.focus();

            /**
             * Init socket to check for updates on the googleauth code
             * @param  {[string]} message [Received google authentification code]
             */
            $sails.on('googleauth', function (data) {
                popup.close();
                authSuccessful(data);
                deferred.resolve(data);
            });

            return deferred.promise;
        }
    }
}());
