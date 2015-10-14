/**
 * AvengersController
 *
 * @description :: Server-side logic for managing avengers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/**
     * @description Return Avengers's Info
     * @constructor /api/avengers/show
     * @method      GET
     * @return      {[json]} data:object [App Object Info object]
     */
    showInfo: function (req, res) {
        
        var token,
            payload,
            appObjInfo,
            appObj
            jwt = require('jwt-simple');

        // check if user is logged in 
        if(!req.headers.authorization) {
            return res.json({msg: 'you have not authorization'});
        } else {
            token = req.headers.authorization.split(' ')[1];
            payload = jwt.decode(token, 'shhh..');
            
            if(!payload.sub){
                appObj = {
                    msg: "Authorization failed"
                };
            } else {
                appObjInfo = Utils.avengersInfo();
                appObj = {
                   success:'E_Retrieve',
                   status: 200,
                   summary: 'App info',
                   model: 'App',
                   data: appObjInfo
                };
            } 

            return res.json(appObj);
        }
    }
};

