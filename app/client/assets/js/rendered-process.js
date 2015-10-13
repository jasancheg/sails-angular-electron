(function () {

    'use strict';

    // rendered globals
    var ipc = require('ipc');

    /**
     * define namespace object for rendered process methods and constants
     * @type {Object}
     */
    window.renderedProccessApi = {
        titleBar: TitleBar,
        historyBack: HistoryBack,
        historyForward: HistoryForward,
        historyBtns: HistoryBtns,
        managetOnlineOfflineStatus: ManagetOnlineOfflineStatus
    }

    /**
     * init: check state for [is nodejs installed, is broser mode, is it normal start]
     */
    try {
        var rq = require;
        if(rq) {
            init();
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
            return;
        }
    }

    /**
     * [init description]
     * @return {[false]} asynchronous message to main process
     */
    function init() {
        runScriptsInRenderedProcess();
        //initTracker();
    }

    /**
     * [runScriptsInRenderedProcess description]
     * @return {[false]} asynchronous message to main process
     */
    function runScriptsInRenderedProcess() {
        // adding jquery through of 'require'
        // to know more about what is this, refer to the issue https://github.com/atom/electron/issues/254
        window.$ = window.jQuery = require('jquery');

        var dataOs,
            remote = require('remote'),
            // create a context menu
            Menu = remote.require('menu'),
            MenuItem = remote.require('menu-item'),
            menu = new Menu();

        // active context menu
        menu.append(new MenuItem({ label: 'Toggle Dev Tools', click: function() { ipc.send('toggle-dev-tools'); } }));
        window.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            menu.popup(remote.getCurrentWindow());
        }, false);

        // set flag and set global object with current OS info
        $('html').attr('data-os', dataOs);
        window.dataOs = {
            platform: process.platform,
            history: {
                canGoBack: 'disabled',
                canGoForward: 'disabled'
            },
            showDevNotifications: false
        };

        // web contens loaded
        setTimeout(function () {
            ipc.send('ready');
        }, 10);
    }

    /**
     * initTracker 
     * @return {[false]} asynchronous message to main process
     */
    function initTracker() {
        var webview = document.getElementById("shell"),
            indicator = $("li.indicator"),
            loadstart = function() {
                alert("loading...");
            },
            loadstop = function() {
                alert("-");
            };

        webview.addEventListener("did-start-loading", loadstart);
        webview.addEventListener("did-stop-loading", loadstop);
    }

    /**
     * managetOnlineOfflineStatus send a notification to main process and set footer DOM
     * @return {[false]} asynchronous message to main process
     */
    function ManagetOnlineOfflineStatus() {
        var status = 'offline',
            $wifiElem = $('.footer .right-section .fa-wifi'),
            
            sendOnlineStatus = function() {
                status = navigator.onLine ? 'online' : 'offline';
                ipc.send('online-status-changed', status);
                if(status) {
                    $wifiElem.addClass('ico-success');
                } else {
                    $wifiElem.removeClass('ico-success');
                }
                // it uses global logger to display notification
                dataOs.logger.info('rendered process: ', status);
            };

        window.addEventListener('online',  sendOnlineStatus);
        window.addEventListener('offline',  sendOnlineStatus);

        sendOnlineStatus();
    }

    /**
     * Title var Events
     * @param {[type]} options [description]
     * @return {[false]} asynchronous message to main process 
     */
    function TitleBar(options) {     
        if(!(this instanceof TitleBar)) return new TitleBar(options);

        this._options = options || {};

        var ALT = 18,
            $element = $('#titlebar'),
            self = this,
            isFullscreen = false,
            close = process.platform === 'darwin' ? 'titlebar-close' : 'windows-close',
            minimize = process.platform === 'darwin' ? 'titlebar-minimize' : 'windows-minimize',
            fullscreen = process.platform === 'darwin' ? 'titlebar-fullscreen' : 'windows-toggle-fullscreen';

        this.element = $element;
        if(this._options.draggable !== false) $element.addClass('webkit-draggable');

        $element.on('click', function(e) {
            if(e.target.className.indexOf(close) !== -1) {
                ipc.send('close');
            } else{ 
                if(e.target.className.indexOf(minimize) !== -1){
                    ipc.send('minimize');
                } else {
                    if(e.target.className.indexOf(fullscreen) !== -1 && process.platform !== 'darwin') {
                        ipc.send('maximize');
                    } else {
                        if(e.target.className.indexOf(fullscreen) !== -1) ipc.send('fullscreen');
                    }
                }
            }
        });

        $element.on('dblclick', function(e) {
            if(e.target === close || e.target === minimize || e.target === fullscreen) return;
            ipc.send('maximize');
        });

        $('body').on('keydown', this._onkeydown = function(e) {
            if(e.keyCode === ALT) $element.addClass('alt');
        });

        $('body').on('keyup', this._onkeyup = function(e) {
            if(e.keyCode === ALT) $element.removeClass('alt');
        });
    }

    /**
     * Back Event
     * @return {[false]} asynchronous message to main process 
     */
    function HistoryBack() {
        ipc.send('history-back');
    }

    /**
     * Forward Event
     * @return {[false]} asynchronous message to main process 
     */
    function HistoryForward() {
        ipc.send('history-forward');
    }

    /**
     * check status of back/forward buttons 
     * @return {[false]} asynchronous message to main process 
     */
    function HistoryBtns() {
        ipc.send('history');
    }
    // listen for 'page back/forward' event
    ipc.on('history', function (msg) {
        dataOs.history.canGoBack = msg.canGoBack;
        dataOs.history.canGoForward = msg.canGoForward;
        msg.canGoBack ? $('.header .btn-back').removeClass('disabled') : $('.header .btn-back').addClass('disabled');
        msg.canGoForward ? $('.header .btn-forward').removeClass('disabled') : $('.header .btn-forward').addClass('disabled');
    });

    // listen for 'page back/forward' event
    ipc.on('dev-notifications', function (msg) {
        if(msg.showNotification) {
            dataOs.logger.notif('Debug notifications activated', null);
            $('.footer .right-section .btn-notif').addClass('activated');
        } else {
            dataOs.logger.notif('Debug notifications deactivated', null);
            $('.footer .right-section .btn-notif').removeClass('activated');
        }
        dataOs.showDevNotifications = msg.showNotification;
    });

})();