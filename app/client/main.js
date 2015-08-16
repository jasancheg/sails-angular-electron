'use strict';

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
