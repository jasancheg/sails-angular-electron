/**
 * UtilsController
 *
 * @description :: Server-side logic for managing utils
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
     * @description Send socket notification to the main process of the electron App
     * @constructor /electronreload?
     * @required    [gpid]
     * @method      GET
     * @example     /electronreload?gpid=1141
     * @return      {[json]} data:object [status of the socket request]
     */
    electronreload: function (req, res) {

        var io = sails.io,
            gpid = req.param('gpid') || '',
            successData = {
                success: 'S_Notification',
                summary: 'Socket notification have been send to Electron App',
                model: 'Utils',
                data: {
                    gpid: gpid
                }
            };

        io.sockets.emit('electronreload', {gpid: gpid});

        return res.ok(successData);

    }
};
