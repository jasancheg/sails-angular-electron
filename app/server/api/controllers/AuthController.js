/**
 * AuthController
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    register: function(req, res, next) {
        
        var successData,
            Passwords = require('machinepack-passwords');

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
                    //encryptedPassword: encryptedPassword,
                    lastLoggedIn: new Date()
                }, function (err, newUser) {
                    if (err) {
                        if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {
                            return res.emailInUse();
                        }
                        return res.negotiate(err);
                    }

                    req.session.user = newUser.id;

                    successData = {
                        success: 'E_CREATION',
                        summary: 'User have been created',//req.__('201Code', {type: 'User'}),
                        model: 'User',
                        user: {
                            id: newUser.id,
                            email: newUser.email,
                            isAdmin: !!newUser.admin
                        }
                    };

                    return res.ok(successData);
                });
            }
        });

    }
};
