'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */

(function() {
    'use strict';

    angular.module('app', [
        /*
         * Everybody has access to these.
         * We could place these under every feature area,
         * but this is easier to maintain.
         */ 
        'app.core',
        'app.layout',
        'app.directives',

        /*
         * Feature areas
         */
        'app.components'
        // 'app.avengers',
        // 'app.dashboard',
        // 'app.layout'
    ]);

})();