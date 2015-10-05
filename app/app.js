'use strict';
var app = require('app'),
    BrowserWindow = require('browser-window'),
    ipc = require('ipc'),
    globalShortcut = require('global-shortcut');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// path to load on create window
var pathToLoad = '/client/loading.html';

// set frame false for Mac OS and windows
const frame = process.platform !== 'win32' && process.platform !== 'darwin';

function createMainWindow () {

    var win = new BrowserWindow({
        title: 'Web App',
        width: 800,
        height: 600,
        center: true,
        show: false,
        frame: frame,
        resizable: true,
        'min-width': 600,
        'min-height': 500,
        'web-preferences': {
            'overlay-scrollbars': true
        },
        'enable-larger-than-screen': true,
        transparent: true

    });

    win.loadUrl('file://' + __dirname + pathToLoad);

    if(process.env.NODE_ENV === "devtools") {
        win.openDevTools({detach: true});
    }

    win.on('closed', onClosed);

    return win;
}

function onClosed() {
    // deref the window
    // for multiple windows store them in an array
    mainWindow = null;
}

// listen for 'page forward' event
ipc.on('history-back', function () {
    if(mainWindow.webContents.canGoBack()) {
        mainWindow.webContents.goBack();
    }
});

// listen for 'page forward' event
ipc.on('history-forward', function () {
    if(mainWindow.webContents.canGoForward()) {
        mainWindow.webContents.goForward();
    }
});

// listen for 'history check' event
ipc.on('history', function () {
    mainWindow.webContents.send('history', { 
        canGoBack: mainWindow.webContents.canGoBack(),
        canGoForward: mainWindow.webContents.canGoForward() 
    });
});

// listen when the web content is loaded.
ipc.on('ready', function () {
    mainWindow.show();
    // Register a 'ctrl+n+i' shortcut listener.
    var showNotification = false,
        ret = globalShortcut.register('ctrl+n+i', function() {
            // toggle state
            if(showNotification){
                showNotification = false;
            } else {
                showNotification = true;
            }

            mainWindow.webContents.send('dev-notifications', { 
                showNotification: showNotification 
            });
        })

    if (!ret) {
        console.log('registration failed');
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('ctrl+n+i'));
});

// listen to dev tools events from rendered process
ipc.on('toggle-dev-tools', function () {
    mainWindow.toggleDevTools();
});

if(process.platform !== 'linux') {

    // close app on windows and to hide on Mac OS
    ipc.on('close', function () {
        console.log("window close");
        if(process.platform !== 'darwin') {
            app.quit();
        } else {
            mainWindow.hide();
            mainWindow.minimize();
        }

    });

    ipc.on('minimize', function () {
        console.log("window minimize");
        mainWindow.minimize();
    });

    ipc.on('maximize', function () {
        console.log("window toggle maximize");
        if (mainWindow.isMaximized() && process.platform !== 'darwin') {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();    
        }
    });

    ipc.on('resize', function (e, message) {
        console.log("window resize");
        if (mainWindow.isMaximized()) return;
        var wid = message.wid | 800;
        var hei = message.hei | 600;
        mainWindow.setSize(wid, hei);
    });

    ipc.on('enter-full-screen', function () {
        console.log("window enter-full-screen");
        mainWindow.setFullScreen(true);
    });

    ipc.on('exit-full-screen', function () {
        console.log("window exit-full-screen");
        mainWindow.setFullScreen(false);
        mainWindow.show();
    });

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
    pathToLoad = '/client/index.html';
    mainWindow.loadUrl('file://' + __dirname + pathToLoad);
    // clear the browser history
    mainWindow.webContents.clearHistory();

    // if app is working on one of the development modes (prebuilt|server)
    if(process.env.GRUNT_ENV) {
        enableGruntTasks();
    } else {
        // disconned from socket comunication
        io.socket.disconnect();
    }
});

// 
/**
 * Grunt tasks: it runs only in prebuilt environment
 * @return {[false]}
 */
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
