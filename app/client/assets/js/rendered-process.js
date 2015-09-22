'use strict';

function runScriptsInRenderedProcess() {

    // adding jquery through of 'require'
    // to know more about what is this, refer to the issue https://github.com/atom/electron/issues/254
    window.$ = window.jQuery = require('jquery');

    var titleDOM,
        ipc = require('ipc'),
        remote = require('remote'),
        Menu = remote.require('menu'),
        MenuItem = remote.require('menu-item'),
        // create main bar menu
        //titlebar = require('titlebar')(),
        //$$ = require('dombo'),
        // create a context menu
        menu = new Menu(),
        // flag
        isFullscreen = false,
        onfullscreentoggle = function (e) {

            if (!isFullscreen && e.shiftKey) {
                ipc.send('resize', {
                //width: media.width,
                //height: media.height,
                //ratio: media.ratio
                });
                return
            }

            if (isFullscreen) {
                isFullscreen = false
                //$('#titlebar')[0].style.display = 'block';
                ipc.send('exit-full-screen');
            } else {
                isFullscreen = true;
                //$('#titlebar')[0].style.display = 'none';
                ipc.send('enter-full-screen');
            }

        };

    // active context menu
    menu.append(new MenuItem({ label: 'Toggle Dev Tools', click: function() { ipc.send('toggle-dev-tools'); } }));
    window.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        menu.popup(remote.getCurrentWindow());
    }, false);

    // append custom header frame to page on PC and Mac
    if (process.platform !== 'linux') {
        // console.log(titlebar);    
        // titleDOM = document.getElementById('titlebar').append(titlebar);
        // titleDOM.appendChild(titlebar);
        //titlebar.appendTo('#titlebar');
    }

    // titlebar.on('close', function () {
    //     ipc.send('close');
    // });

    // titlebar.on('minimize', function () {
    //     ipc.send('minimize');
    // });

    // titlebar.on('maximize', function () {
    //     ipc.send('maximize');
    // });

    // titlebar.on('fullscreen', onfullscreentoggle);

    

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
