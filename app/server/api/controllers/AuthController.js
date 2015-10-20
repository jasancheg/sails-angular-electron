/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request'),
    passport = require('passport');

function resolveResponse(req, user, success, summary) {
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
                displayName: '',
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

        var picture,
            Gravatar = require('machinepack-gravatar'),
            successData,
            io = sails.io,
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

                // Build the URL of a gravatar image for a particular email address.
                picture = Gravatar.getImageUrl({
                    emailAddress: cUserEmail,
                    gravatarSize: 50,
                    defaultImage: 'http://inideaweb.com/projects/2015/smile_128x128.png',
                    rating: 'g',
                    useHttps: true,
                }).execSync();
                
                successData = resolveResponse(req, user, 'E_AUTH', '200 ok');
                successData.data.picture = picture;
                io.sockets.emit('sessionstate', {msg: 'session has started'});
                console.log("successData login: ", successData);
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
        Authentification.google(req, res, sails.io, resolveResponse, updateUserlastLoggedIn);
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
