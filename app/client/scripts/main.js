'use strict';

function runScriptsInRenderedProcess() {

    // adding jquery through of 'require'
    // to know more about what is this, refer to the issue https://github.com/atom/electron/issues/254
    window.$ = window.jQuery = require('jquery');

    var ipc = require('ipc');
    var remote = require('remote');
    var Menu = remote.require('menu');
    var MenuItem = remote.require('menu-item');

    // create a context menu
    var menu = new Menu();

    menu.append(new MenuItem({ label: 'Toggle Dev Tools', click: function() { ipc.send('toggle-dev-tools'); } }));

    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        menu.popup(remote.getCurrentWindow());
    }, false);

    // web contens loaded
    setTimeout(function () {
        ipc.send('ready');
    }, 10);

}
// check when it is working on browser mode or if nodejs is not installed
try {
    var rq = require;
    if(rq) {
        runScriptsInRenderedProcess();
    }
} catch (e0) {
    try {
        var isNode = process.versions.node;
        console.info('Probably this is not an error and the application is currently running in Browser mode: \n', e0);      
    } catch(e1){
        // invite user to install nodejs first 
        document.getElementById('loadingServer').style.display = 'none';
        document.getElementById('nodejsInstall').style.display = 'block';
        console.info('No nodejs js detected\n', e1);
    }
}
