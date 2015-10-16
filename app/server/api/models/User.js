/* global module */

/**
 * User.js
 *
 * @description :: signup rules.
 * @docs        :: http://localhost:?/#!documentation/models
 */

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
        // The encrypted password for the user
        // e.g. asdgh8a249321e9dhgaslcbqn2913051#T(@GHASDGA
        // encryptedPassword: {
        //     type: 'string',
        //     required: true
        // },
        googleId: {
            type: 'string',
            defaultsTo: null
        },
        displayName: {
            type: 'string'
        },
        password: {
            type: 'string'
            //required: true
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
        }
    }
};