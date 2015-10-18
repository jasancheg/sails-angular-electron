/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request'),
    passport = require('passport');

function resolveResponse(req, user, success, summary) {
    console.log('user: ', user);
    var token = JWT.createToken(user),
        successData = {
            success: success,
            summary: summary,//req.__('201Code', {type: 'User'}),
            model: 'User',
            token: token,
            data: {
                id: user.id,
                email: user.email,
                isAdmin: !!user.admin,
                lastLoggedIn: user.lastLoggedIn,
                displayName: 'aa',
                picture: ''
            }
        };
    // set session variable
    req.session.user = user.id;

    return successData;
}

function updateUserlastLoggedIn(res, user, successData, cb) {
    // update the las login date on DB
    user.lastLoggedIn = new Date();
    // save last login date 
    user.save(function (err) {
        if (err) {
            return res.negotiate(err);
        }
        if(cb){
            cb();
        }
        return res.ok(successData);
    });
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
            token,
            io = sails.io;

        passport.authenticate('local-register', function (err, user, msg) {
            if (err) {
                return res.negotiate(err);
            }
            if(!err && !user) {
                return res.emailInUse();
            }

            io.sockets.emit('sessionstate', {msg: 'session has started for first time'});

            return res.ok(resolveResponse(req, user, 'E_CREATION', 'User have been created'));

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

        var successData,
            io = sails.io,
            cUserEmail = req.param('email'),
            errData = {
                error: 'E_AUTH',
                model: 'User',
                data: {
                    email: cUserEmail
                }
            };

        var Gravatar = require('machinepack-gravatar');

        // Build the URL of a gravatar image for a particular email address.
        // Gravatar.getImageUrl({
        //     emailAddress: cUserEmail,
        //     gravatarSize: 400,
        //     defaultImage: 'http://example.com/images/avatar.jpg',
        //     rating: 'g',
        //     useHttps: true,
        // }).execSync();

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
                
                successData = resolveResponse(req, user, 'E_AUTH', '200 ok');
                io.sockets.emit('sessionstate', {msg: 'session has started'});
                updateUserlastLoggedIn(res, user, successData);
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

            var accesstoken = token.access_token,
                headers = {
                    Authorization: 'Bearer ' + accesstoken
                };
            
            request.get({
                url: apiUrl,
                headers: headers, 
                json: true
            }, function (err, response, profile) {

                var googleSearchUser = {googleId: profile.sub};

                User.findOne(googleSearchUser).exec(function (err, foundUser) {

                    var successData;

                    if (err) {
                        return res.negotiate(err);
                    }
                    if (foundUser) {
                        successData = resolveResponse(req, foundUser, 'E_AUTH', '200 ok');
                        successData.data.displayName = profile.name;
                        successData.data.picture = profile.picture;
                        // Indicates it is a existing user
                        successData.type = 'exist';
                        updateUserlastLoggedIn(res, foundUser, successData, function () {
                            sails.io.sockets.emit('googleauth', successData);
                            sails.io.sockets.emit('sessionstate', {msg: 'session has started'});
                        });
                    } else {
                        User.create({
                            email: profile.email,
                            displayName: profile.name,
                            googleId: profile.sub
                        }, function (err, newUser) {
                            if (err) {
                                return res.negotiate(err);
                            }
                            successData = resolveResponse(req, newUser, 'E_CREATION', 'User have been created');
                            successData.data.displayName = profile.name;
                            successData.data.picture = profile.picture;
                            // Indicate it is a new user
                            successData.type = 'new';
                            io.sockets.emit('googleauth', successData);
                            sails.io.sockets.emit('sessionstate', {msg: 'session has started'});
                            return res.ok(successData);
                        });

                    }
                });
            });

        });

        //res.json({status:'loading...'});
    },

    /**
     * [facebookauth description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    facebookauth: function(req, res) {
        Authentification.fb(req, res, sails.io, resolveResponse);
    },

    /**
     * [logout description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    logout: function(req, res) {
        req.session = null;
        sails.io.sockets.emit('sessionstate', {msg: 'session has ended'});
        return res.ok();
    }

};
