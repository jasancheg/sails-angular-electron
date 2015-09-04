'use strict';
var app = require('app'),
    BrowserWindow = require('browser-window'),
    ipc = require('ipc');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow () {

    var win = new BrowserWindow({
        title: 'Web App',
        width: 800,
        height: 600,
        center: true,
        show: false,
        resizable: true,
        'min-width': 600,
        'min-height': 500,
        'web-preferences': {
            'overlay-scrollbars': true
        }
    });

    win.loadUrl('file://' + __dirname + '/client/loading.html');

    if(process.env.NODE_ENV === "devtools") {
        win.openDevTools({detach: true});
    }

    win.on('closed', onClosed);

    // listen when the web content is loaded.
    ipc.on('ready', function () {
        win.show();
    });
    // listen to dev tools events from rendered process
    ipc.on('toggle-dev-tools', function () {
        win.toggleDevTools();
    });

    return win;
}

function onClosed() {
    // deref the window
    // for multiple windows store them in an array
    mainWindow = null;
}

// prevent window being GC'd
let mainWindow;

app.on('ready', function () {
    mainWindow = createMainWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate-with-no-open-windows', function () {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

// app.on('will-quit', function (event) {
//     event.preventDefault();
// });

// init the sails server app
var serverDir = '/server/app.js',
    sapp = require(__dirname + serverDir);

// check sails lifted
var socketIOClient = require('socket.io-client'),
    sailsIOClient = require('sails.io.js');

// Instantiate the socket client (`io`)
var io = sailsIOClient(socketIOClient);

// specify the host and port of the Sails
io.sails.url = 'http://localhost:1337';

// Send a GET request to `http://localhost:1337/` for check if BE is working
io.socket.get('/', function serverResponded (body, JWR) {
    console.log('server loaded: ', io.socket._raw.connected);
    mainWindow.loadUrl('file://' + __dirname + '/client/index.html');

    // if app is working on one of the development modes (prebuilt|server)
    if(process.env.GRUNT_ENV) {
        enableGruntTasks();
    } else {
        // disconned from socket comunication
        io.socket.disconnect();
    }
});

// it runs only in prebuilt environment
function enableGruntTasks() {

    var grunt = require('grunt'),
        fnAppReload =  function(data) {
            // reload browser window
            mainWindow.reload();
        };

    // hear reload socket notifications
    io.socket.on('electronreload', fnAppReload);

    // run before the app quit
    app.on('before-quit', function (event) {
        // uses the flat that was created when the app is run from `grunt start`
        if(process.env.gpid) {
            console.info('stoping grunt process...');
            grunt.tasks('stop:'+process.env.gpid);
        }
    });

    console.log('process.env.GRUNT_ENV: ', process.env.GRUNT_ENV);
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
    console.log('process.env.gpid: ', process.env.gpid);
    console.log('process.pid: ' + process.pid);

}
