/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jwt = require('jwt-simple'),
    request = require('request'),
    passport = require('passport');

function createToken(user) {
    var payload = {
            iss: 'localhost',
            sub: user.id
        };
    return jwt.encode(payload, "shhh..");
}

module.exports = {
    
    /**
     * [register description]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    register: function(req, res) {
        
        var successData,
            token;

        passport.authenticate('local-register', function (err, user, msg) {
            if (err) {
                return res.negotiate(err);
            }
            if(!err && !user) {
                return res.emailInUse();
            }
            
            token = createToken(user);
            req.session.user = user.id;
            successData = {
                success: 'E_CREATION',
                summary: 'User have been created',//req.__('201Code', {type: 'User'}),
                model: 'User',
                data: {
                    id: user.id,
                    email: user.email,
                    isAdmin: !!user.admin,
                    token: token
                }
            };

            return res.ok(successData);
            
        })(req, res);
    },

    /**
     * [login description]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    login: function(req, res) {

        var token, 
            successData,
            cUserEmail = req.param('email'),
            errData = {
                error: 'E_AUTH',
                model: 'User',
                data: {
                    email: cUserEmail
                }
            };

        passport.authenticate('local-login', function (err, user) {
            if (err) {
                return res.negotiate(err);
            }
            if (!user) {
                errData.summary = '404 user not found';//req.__('404User', cUserName);
                return res.notFound(errData);
            }
            req.login(user, function(err){
                if (err) {
                    return res.negotiate(err);
                }
                token = createToken(user);
                successData = {
                    success: 'E_AUTH',
                    summary: '200 ok',//req.__('200User'),
                    model: 'User',
                    data: {
                        id: user.id,
                        email: user.email,
                        isAdmin: !!user.admin,
                        lastLoggedIn: user.lastLoggedIn,
                        token: token
                    }
                };
                // set session variable
                req.session.user = user.id;
                // update the las login date on DB
                user.lastLoggedIn = new Date();
                // save last login date 
                user.save(function (err) {
                    if (err) {
                        return res.negotiate(err);
                    }
                    return res.ok(successData);
                });
            });
        })(req, res);
    },

    /**
     * [googleauth description]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    googleauth: function(req, res) {
        var io = sails.io,
            reqParams = req.allParams()
            url = 'https://accounts.google.com/o/oauth2/token',
            apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect',
            params = {
                client_id: '124193795163-3me354kp9ujfkmv01pe1acldjpce0spg.apps.googleusercontent.com',
                redirect_uri: 'http://localhost:1337/api/auth/googleauth',
                code: decodeURIComponent(reqParams.code),
                grant_type: 'authorization_code',
                client_secret: 'WwnRnKuD0Lc0o5SvWnOxjOd4' //config.GOOGLE_SECRET
            };

        request.post(url, {
            json: true,
            form: params
        }, function (err, response, token) {

            console.log(token);
            
            var accesstoken = token.access_token,
                headers = {
                    Authorization: 'Bearer ' + accesstoken
                };

            request.get({
                url: apiUrl,
                headers: headers, 
                json: true
            }, function (err, response, profile) {
                console.log(profile);
                io.sockets.emit('googleauth', profile);
            });

        });

        res.json({status:'loading...'});
    }

};
