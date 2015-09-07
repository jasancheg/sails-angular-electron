/**
 * app.js
 *
 * Use `app.js` to run the App without the command `sails lift`.
 * To start the server: require('./app/server/app.js');
 *
 **/

// Ensure a "sails" can be located:
(function() {
    var sails;
    try {
        sails = require('sails');
    } catch (e) {
        console.error('A version of `sails` should be installed in the same directory as the Server App.');
        console.error('To do that, run `npm install` to catch the dependencies on package.json');
        return;
    }

    // Try to get `rc` dependency
    var rc;
    try {
        rc = require('rc');
    } catch (e0) {
        try {
            rc = require('sails/node_modules/rc');
        } catch (e1) {
            console.error('Could not find dependency: `rc`.');
            console.error('Your `.sailsrc` file(s) will be ignored.');
            console.error('To resolve this, run:');
            console.error('npm install rc --save');
            rc = function () { return {}; };
        }
    }

    // Start server && disable grunt hooks
    sails.lift(rc('sails', {hooks:{grunt:false}}));
})();
