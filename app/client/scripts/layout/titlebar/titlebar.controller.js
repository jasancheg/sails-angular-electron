/* global angular */

(function () {

    'use strict';

    angular
        .module('app.layout')
        .controller('TitlebarCtrl', TitlebarCtrl);

    function TitlebarCtrl (logger, os) {
        
        var vm = this,
            currentBtns,
            titlebar = $('#titlebar');
        
        // add clase for the current OS
        vm.osCls = os.platform;

        if(os.platform === 'win32') {
            currentBtns = [{
                btnCls: "windows-minimize btn btn-default btn-xs",
                icoCls: "fa fa-minus"
            },{
                btnCls: "windows-toggle-fullscreen btn btn-default btn-xs",
                icoCls: "fa fa-clone"
            },{
                btnCls: "windows-close btn btn-danger btn-xs",
                icoCls: "fa fa-times"
            }];
        } else {
            currentBtns = [{
                btnCls: "titlebar-close"
            },{
                btnCls: "titlebar-minimize"
            },{
                btnCls: "titlebar-fullscreen"
            }];
        }

        vm.listBtn = currentBtns;
        
        logger.success('titlebar loaded!', {vm:vm});

        if(!dataOs.showDevNotifications){
            logger.notif('Press " ctrl + n + i " to activate debug notifications', null)
        }
        // activate rendered process envents
        renderedProccessApi.titleBar();
        
    }

})();