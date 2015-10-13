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
        // check if user is logged in 
        if(req.headers.authorization) {
            var appObjInfo = Utils.avengersInfo(),
                appObj = {
                   success:'E_Retrieve',
                   status: 200,
                   summary: 'App info',
                   model: 'App',
                   data: appObjInfo
                };
            return res.json(appObj);
        } else {
            return res.json({msg: 'you have not authorization'});
        }
    }
};

