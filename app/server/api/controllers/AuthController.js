/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jwt = require('jwt-simple'),
    Passwords = require('machinepack-passwords');

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
    register: function(req, res, next) {
        
        var successData,
            payload,
            token;

        Passwords.encryptPassword({
            password: req.param('password'),
            difficulty: 10
        }).exec({
            error: function (err) {
                return res.negotiate(err);
            },
            success: function (encryptedPassword) {

                User.create({
                    email: req.param('email'),
                    password: encryptedPassword,
                    lastLoggedIn: new Date()
                }, function (err, newUser) {
                    if (err) {
                        if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {
                            return res.emailInUse();
                        }
                        return res.negotiate(err);
                    }

                    req.session.user = newUser.id;
                    token = createToken(newUser);
                    successData = {
                        success: 'E_CREATION',
                        summary: 'User have been created',//req.__('201Code', {type: 'User'}),
                        model: 'User',
                        data: {
                            id: newUser.id,
                            email: newUser.email,
                            isAdmin: !!newUser.admin,
                            token: token
                        }
                    };

                    return res.ok(successData);
                });
            }
        });

    },

    /**
     * [login description]
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    login: function(req, res, next) {

        var token, 
            successData,
            cUserEmail = req.param('email'),
            errData = {
                error: 'E_AUTH',
                model: 'User',
                data: {
                    username: cUserEmail
                }
            };
        console.log("LOGIN: ", cUserEmail);
        User.findOne({
            email: cUserEmail
        }).exec(function (err, user) {
            if (err) {
                return res.negotiate(err);
            }

            if (!user) {
                errData.summary = '404 user not found';//req.__('404User', cUserName);
                return res.notFound(errData);
            }
            
            Passwords.checkPassword({
                passwordAttempt: req.param('password'),
                encryptedPassword: user.password
            }).exec({
                error: function (err) {
                    return res.negotiate(err);
                },
                incorrect: function () {
                    errData.summary = '403 no authorized';//req.__('403User', cUserName);
                    return res.forbidden(errData);
                },
                success: function () {
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

                    user.save(function (err) {
                        if (err) {
                            return res.negotiate(err);
                        }
                        return res.ok(successData);
                    });
                }
            });
        });
    }
};
