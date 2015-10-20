/* jshint camelcase: false */
/* global toastr:false, moment:false, dataOs:false */

var config = {
        FACEBOOK_URL_AUTH: 'https://www.facebook.com/v2.3/dialog/oauth',
        FACEBOOK_CLIENT_ID: '1639177299653724',
        FACEBOOK_REDIRECT_URL: 'api/auth/facebookauth',
        GOOGLE_URL_AUTH: 'https://accounts.google.com/o/oauth2/auth',
        GOOGlE_CLIENT_ID: '124193795163-3me354kp9ujfkmv01pe1acldjpce0spg.apps.googleusercontent.com',
        GOOGLE_REDIRECT_URL: 'api/auth/googleauth'
    };

//"https://www.facebook.com/login.php?skip_api_login=1&api_key=163917729965372…r_description=Permissions+error&error_reason=user_denied#_=_&display=popup"
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('API_URL', 'http://localhost:1337/')
        // 'os' grouped global information from rendered process
        .constant('os', dataOs)
        .constant('Config', config);
})();
