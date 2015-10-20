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
    function auth($q, $log, $sails, $window, $location, $auth, API_URL, authToken, Config) {
        var popup,
            // Social auth config data
            authUri = { 
                google: Config.GOOGLE_URL_AUTH
            },
            urlBuilder = {
                google: [
                    'response_type=code',
                    'client_id=' + Config.GOOGlE_CLIENT_ID,
                    'redirect_uri=' + API_URL + Config.GOOGLE_REDIRECT_URL,
                    'scope=profile email'
                ]
            },
            popupOptions = {
                google: [
                    'width=500',
                    'height=500',
                    'left=' + ($window.outerWidth - 500) / 2,
                    'top=' + ($window.outerHeight - 500) / 2.5
                ]
            };

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

            var deferred = $q.defer();
            $window.focus();

            $auth.authenticate(provider)
            //for some reason this callback is not working :P
            .then(function (res) {
                $log.info('RES: ', res);
            }, handleError);

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

        /**
         * [googleAuth description]
         * @param  {[type]} provider [description]
         * @return {[type]}          [description]
         */
        this.manualAuth = function(provider) {

            var options = popupOptions[provider].join(','),
                url = authUri[provider] + "?" + urlBuilder[provider].join('&'),
                deferred = $q.defer();

            popup = $window.open(url, '', options);
            $window.focus();

            /**
             * Init socket to check for updates on the googleauth code
             * @param  {[string]} message [Received google authentification code]
             */
            $sails.on(provider + 'auth', function (data) {
                popup.close();
                authSuccessful(data);
                deferred.resolve(data);
            });

            return deferred.promise;
        }
    }
}());
