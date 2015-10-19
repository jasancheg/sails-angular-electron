/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('SideBarCtrl', SideBarCtrl);

    function SideBarCtrl ($q, $timeout, $route, $auth, $sails, routehelper, logger, User) {

        var vm = this,
            routesAdmin = routehelper.getRoutes({settings:{type: 'admin'}}),
            routesMain = routehelper.getRoutes({settings:{type: 'mainnav'}}),
            routesLogout = routehelper.getRoutes({settings:{type: 'logout'}});

        vm.isCurrent = isCurrent;
        vm.isAuthenticated = isAuthenticated;
        
        activate();

        /**
         * controller init
         * @return {[asynchronously execution]} activate
         */
        function activate() { 
            return $q.all([getNavRoutes(), updateUserInfo()]).then(function() {
                logger.success('Side Bar loaded!', {vm:vm});
            });
        }

        function getNavRoutes() {
            vm.mainNavRoutes = routesMain.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
            vm.adminNavRoutes = routesAdmin.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
            vm.logoutNavRoutes = routesLogout.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function isCurrent(route) {
            if (!route.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }

        function updateUserInfo(){
            if(User.isAuthenticated()) {
                var user = User.getUser();
                vm.username = user.displayName;
                vm.picture = user.picture;
            } else {
                vm.username = 'Please sign in';
                vm.picture = 'assets/images/smile_128x128.png';
            }
        }

        /**
         * [isAuthenticated description]
         * @return {Boolean} [description]
         */
        function isAuthenticated() {
            //console.log('$auth.isAuthenticated: ', $auth.isAuthenticated());
            return $auth.isAuthenticated();
        }

        // update user info on change session
        $sails.on('sessionstate', function(message){
            console.log("LA SESSION HA CAMBIADO DE NUEVO: ", User.getUser());
            $timeout(function() {
                updateUserInfo();
            }, 200);
        });
    }
})();

