/**
 * app.js
 *
 * Is used to run the App without the command `sails lift`
 * To start the server directly run: node ./app/server/app.js'
 * To run server from a file use: require('./app/server/app.js');
 *
 **/

// Ensure that the server App is in the project directory, so relative paths work as expected
// Electron start the App from root directory where is located executable file (.exe|.app)
// `cwd` is set in server repository, asar compilation is currently not working
// because `chdir` does not work into .asar files :(
try {
    // set `chdir` to enable the use of the sails REST API into the Electron aplication
    process.chdir(__dirname);
} catch (e) {
    process.env.LOADSERVER_ERROR = {
        error: e,
        dirname : __dirname,
        cwd: process.cwd()   
    }
    console.error('The App is not available for asar compilation: ', process.env.LOADSERVER_ERROR)
    return;
}

(function() {
    var sails;
    try {
        // Ensure a "sails" can be located
        sails = require('sails');
        // try to get `nedb` dependency
        nedb = require('sails-nedb');
        // Try to get `rc` dependency
        rc = require('rc');
        try {
            rc = require('sails/node_modules/rc');
        } catch (e1) {
            rc = function () { return {}; };
        }
    } catch (e) {
        console.error('Some server depencendies are missing and should be installed in the same directory as the Server App.');
        console.error('To do that, run `npm install` to catch the dependencies on package.json or');
        console.error('run `npm install --save sails rc sails-nedb` to install dependencies manually');
        return;
    }

    // Start server && disable grunt hooks
    sails.lift(rc('sails', {hooks:{grunt:false}}));
})();
