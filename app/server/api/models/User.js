/* global module */

/**
 * User.js
 *
 * @description :: signup rules.
 * @docs        :: http://localhost:?/#!documentation/models
 */

var Passwords = require('machinepack-passwords');

module.exports = {
    attributes: {
        // Id of the user
        id: {
            type: 'string',
            primaryKey: true,
            unique: true
        },
        // The username
        // e.g. nikotesla
        // username: {
        //     type: 'string',
        //     required: true,
        //     unique: true
        // },
        // The email
        // e.g. nikotesla@accenture.com
        email: {
            type: 'string',
            required: true
        },
        // The user's first name
        // e.g. Nikola
        // firstName: {
        //     type: 'string',
        //     required: true
        // },
        // The user's last name
        // e.g. Tesla
        // lastName: {
        //     type: 'string',
        //     defaultsTo: ''
        // },
        googleId: {
            type: 'string',
            defaultsTo: null
        },
        facebookId: {
            type: 'string',
            defaultsTo: null
        },
        displayName: {
            type: 'string',
            defaultsTo: ''
        },
        // The encrypted password for the user
        password: {
            type: 'string'
        },
        // Boolean to store admin condition
        // default to []
        isAdmin: {
            type: 'boolean',
            defaultsTo: false
        },
        // The timestamp when the user last logged in
        // (i.e. cached when sent a username and password to the server)
        lastLoggedIn: {
            type: 'date',
            required: true,
            defaultsTo: new Date()
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            //delete obj._csrf;
            return obj;
        }
    },

    /**
     * [beforeCreate description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    beforeCreate: function(values, next) {
        console.log('values: ', values);
        // checks to make sure the password param is present before creating record
        if(!values.password) {
            // password is not required value, social login don't use password, so skip this step
            next();
        } else {
            // Encrypt a string using the BCrypt algorithm.
            Passwords.encryptPassword({
                password: values.password,
                difficulty: 10,
            }).exec({
                // An unexpected error occurred.
                error: function (err) {
                    if(err) return next(err);
                },
                // OK.
                success: function (encryptedPassword) {
                    values.password = encryptedPassword;
                    next();
                }
            });
        }
    }
};