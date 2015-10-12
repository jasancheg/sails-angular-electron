/* global angular */

/**
 * @ngdoc Module
 * @name app.components
 * @description
 * # module
 * define module of the app
 */

angular
    .module('app.components', [
        'app.components.login',
        'app.components.logout',
        'app.components.register',
        'app.components.avengers',
        'app.components.dashboard',
        'app.components.home'
    ]);