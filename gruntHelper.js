'use strict';

var fs = require('fs');
var http = require('http');

module.exports = {
    getElectronAppReload: function (done, gpid) {

        var config = {
            host: 'localhost',
            path: '/electronreload?gpid='+gpid,
            port: '1337'
        }

        return http.get(config, function(res) {

            var parsed,
                body = '';

            res.on('data', function(d) {
                body += d;
            });

            res.on('end', function() {
                parsed = JSON.parse(body);
                console.log('electron reload request status: ', parsed);
                // Tell grunt the async task is complete
                done();
            });

        }).on('error', function(e) {
            console.log("Got error on electronreload: " + e.message);
            // Tell grunt the async task failed
            done(false);
        });
    },
    createNewPackageJson: function(packagejson, done) {

        var str = '',
            jsonStr = packagejson,
            destPath = 'dist/',
            fileName = 'package.json',
            callback = function (err) {
                if (err) throw err;
                // Tell grunt task is complete
                done();
            },
            // To format JSON
            options = {
                spaces: 2
            };

        delete jsonStr.devDependencies;
        delete jsonStr.scripts;

        str = JSON.stringify(jsonStr, null, options.spaces) + '\n';
        //console.log(str);
        fs.writeFile(destPath + fileName, str, callback);
    }
}