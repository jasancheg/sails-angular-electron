var moment = require('moment'),
    jwt = require('jwt-simple');

module.exports = {
    /**
     * @description createToken a token
     * @return      {[string]} token [generated token]
     */
    createToken: function (user) {
        var payload = {
                //iss: 'localhost',
                sub: user.id,
                exp: moment().add(10, 'days').unix()
            };
        return jwt.encode(payload, "shhh..");
    }
}