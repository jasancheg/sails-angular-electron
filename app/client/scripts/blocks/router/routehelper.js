(function() {
    'use strict';

    angular
        .module('blocks.router')
        .provider('routehelperConfig', routehelperConfig)
        .factory('routehelper', routehelper);

    // Must configure via the routehelperConfigProvider
    function routehelperConfig() {

        this.config = {
            // These are the properties we need to set
            $routeProvider: undefined,
            docTitle: '',
            resolveAlways: {ready: function(){}}
        };

        this.$get = function() {
            return {
                config: this.config
            };
        };
    }

    /* @ngInject */
    function routehelper($location, $rootScope, $route, logger, routehelperConfig) {

        var handlingRouteChangeError = false,
            routeCounts = {
                errors: 0,
                changes: 0
            },
            routes = [],
            $routeProvider = routehelperConfig.config.$routeProvider,
            service = {
                routeCounts: routeCounts,
                configureRoutes: configureRoutes,
                getRoutes: getRoutes
            };

        init();

        return service;
        ///////////////
    
        /**
         * service configureRoutes
         * @param  {[type]} routes list of routes
         * @return {[false]}       configure a route
         */
        function configureRoutes(routes) {
            routes.forEach(function(route) {
                route.config.resolve =
                    angular.extend(route.config.resolve || {}, routehelperConfig.config.resolveAlways);
                $routeProvider.when(route.url, route.config);
            });
            $routeProvider.otherwise({redirectTo: '/login'});
        }

        /**
         * get routes by filter
         * @param  {[prop]} filter optional prop value of object
         * @return {[type]}        list of routes
         */
        function getRoutes(filter) {
            
            // if routes was already defined
            if (routes.length) {
                routes = [];
            }

            for (var prop in $route.routes) {
                if ($route.routes.hasOwnProperty(prop)) {
                    var route = $route.routes[prop];
                    var isRoute = !!route.title;
                    if (isRoute) {
                        routes.push(route);
                    }
                }
            }
            
            if (filter) {
                routes = _.filter(routes, filter);
            }

            return routes;
        }

        /**
         * init
         * @return {[type]} [description]
         */
        function init() {
            handleRoutingErrors();
            handleRoutingClasses();
            updateDocTitle();
        }

        /** 
         * handle rounting errors
         * @return {[false]}
         */
        function handleRoutingErrors() {
            // Route cancellation:
            // On routing error, go to the dashboard.
            // Provide an exit clause if it tries to do it twice.
            $rootScope.$on('$routeChangeError',
                function(event, current, previous, rejection) {
                    if (handlingRouteChangeError) {
                        return;
                    }
                    routeCounts.errors++;
                    handlingRouteChangeError = true;
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) ||
                        'unknown target';
                    var msg = 'Error routing to ' + destination + '. ' + (rejection.msg || '');
                    logger.warning(msg, [current]);
                    $location.path('/login');
                }
            );
        }

        /** 
         * check all routes called
         * @return {[false]} manage global class for each page
         */
        function handleRoutingClasses() {
            
            $rootScope.$on('$routeChangeSuccess',
                function(event, current, previous) {
                    var destination = (current && (current.title || current.name || current.loadedTemplateUrl)) || 
                        'unknown target';
                    var msg = 'Sucsses routing to ' + destination;
                    logger.success(msg, [current]);
                    
                    // define stage area elements
                    if($route.current.$$route && $route.current.$$route.settings.type === 'admin'){
                        $('body').addClass('hide-navs');
                    } else {
                        $('body').removeClass('hide-navs');
                    }

                    // manage back/forward buttons
                    renderedProccessApi.historyBtns();
                }
            );
        }

        /**
         * update the global Doc Title [updateDocTitle]
         * @return {[type]} [description]
         */
        function updateDocTitle() {
            $rootScope.$on('$routeChangeSuccess',
                function(event, current, previous) {
                    routeCounts.changes++;
                    handlingRouteChangeError = false;
                    var title = routehelperConfig.config.docTitle + ' ' + (current.title || '');
                    $rootScope.title = title; // data bind to <title>
                }
            );
        }
    }
})();
