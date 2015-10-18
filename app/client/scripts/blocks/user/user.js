/**
 * @ngDoc service
 * @name blocks:user
 * @description
 * # user with header notifications (Temp: this in progress)
 *   logic will be changed to be a global service
 */

(function() {
    'use strict';

    angular
        .module('blocks.user')
        .service('User', User);

    /* @ngInject */
    function User($log, $window) {

        var storage = $window.localStorage,
            key = 'active_user',
            tokenKey = 'satellizer_token',
            user = {
                setUser: function(user) {
                    storage.setItem(key, user);
                    $log.info('User have been added', key);
                },
                getUser: function() {
                    var item = storage.getItem(key);
                    if(!item){
                        $log.error('Error: no user found');
                    }
                    return JSON.parse(item);
                },
                isAuthenticated: function() {
                    var item = !!storage.getItem(key),
                        token = !!storage.getItem(tokenKey);
                    if(!token) {
                        $log.warn('Warning: User is not uthenticated!');
                        return token;
                    }
                    return item && token;
                },
                removeUser: function() {
                    storage.removeItem(key);
                    $log.info('User have been removed', key);
                }
            }

        return user;
    }
}());
