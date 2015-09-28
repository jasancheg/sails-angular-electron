'use strict';

function runScriptsInRenderedProcess() {

    'use strict';

    var ipc = require('ipc'),
        ALT = 18;

        window.TitleBar = function(options) {
            
            if(!(this instanceof TitleBar)) return new TitleBar(options);

            this._options = options || {};

            var $element = $('#titlebar');

            this.element = $element;

            if(this._options.draggable !== false) $element.addClass('webkit-draggable');

            var self = this,
                isFullscreen = false,
                close = process.platform === 'darwin' ? 'titlebar-close' : 'windows-close',
                minimize = process.platform === 'darwin' ? 'titlebar-minimize' : 'windows-minimize',
                fullscreen = process.platform === 'darwin' ? 'titlebar-fullscreen' : 'windows-toggle-fullscreen';

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

        };
}
// check when it is working on browser mode or if nodejs is not installed
try {
    var rq = require;
    if(rq) {
        runScriptsInRenderedProcess();
    }
} catch (e0) {
    console.info(e0);
}
