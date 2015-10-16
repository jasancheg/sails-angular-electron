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
    function auth($q, $http, $sails, $window, API_URL, authToken, $location) {
        var popup,
            // google config data
            googleauth,
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
            authToken.setToken(res.data.token);
            $location.path('/');
        }

        this.login = function (email, password) {
            return $http.post(API_URL + 'api/auth/login', {
                email: email,
                password: password
            }).success(authSuccessful);
        }

        this.register = function (email, password) {
            return $http.post(API_URL + 'api/auth/register', {
                email: email,
                password: password
            }).success(authSuccessful);
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
            $sails.on('googleauth', function (token) {
                console.log(token);
                popup.close();
                authSuccessful(token);
                deferred.resolve(token);
            });

            return deferred.promise;
        }

    }
}());



    // this.googleAuth = function () {
    //     var url = "https://accounts.google.com/o/oauth2/auth?" + urlBuilder.join('&');
    //     var options = 'width=500,height=500,left=' + ($window.outerWidth - 500) / 2 + ',top=' + ($window.outerHeight - 500) / 2.5;

    //     var deferred .defer();

    //     var popup = $window.open(url, '', options);
    //     $window.focus();

    //     $window.addEventListener('message', function (event) {
    //         if (event.origin === $window.location.origin) {
    //             var code = event.data;
    //             popup.close();

    //             $http.post(API_URL + 'auth/google', {
    //                 code: code,
    //                 clientId: clientId,
    //                 redirectUri: window.location.origin
    //             }).success(function (jwt) {
    //                 authSuccessful(jwt);
    //                 deferred.resolve(jwt);
    //             });
    //         }
    //     });

    //     return deferred.promise;
    // }
