'use strict';

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
    }

}