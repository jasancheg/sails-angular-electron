/* global angular */

(function () {

    'use strict';

    function DataService (Restangular, exception, logger) {
        
        var _baseApi = Restangular.one('api'),
            factory = {
                // getBaseApi : getBaseApi,
                // getDashboard: getDashboard,
                // getAvengers: getAvengers
            };

        return factory; 


        /**
         * Log In/Sign Up
         * @return {Restagular Object} [Contains the /api/ connection added to the base url]
         */
        function getBaseApi () {
            return _baseApi;
        };

        /**
         * Project
         * @return {Restagular Object} [Contains the /home/ connection added to the base url]
         */
        function getHome () {
            return _baseApi.one('home');
        };

        /**
         * Project
         * @return {Restagular Object} [Contains the /dashboard/ connection added to the base url]
         */
        function getDashboard () {
            return _baseApi.one('dashboard');
        };

        /**
        * Test Group
        * @param {String} projectId [The Id of the project]
        * @returns {Restagular Object} [Contains the /avengers/ connection added to the base url]
        */
        function getAvengers () {
            return _baseApi.one('avengers');
        };

    }

    angular
        .module('dataService', [
            'restangular'
        ])
        .factory('DataService', DataService);

})();
