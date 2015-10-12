// var jwt = require('jwt-simple'),
//     moment = require('moment');

// module.exports = function (user, res) {

//     var payload = {
//             sub: user.id,
//             exp: moment().add(10, 'days').unix()
//         },
//         token = jwt.encode(payload, "shhh..");

//     res.status(200).send({
//         user: user.toJSON(),
//         token: token
//     });
// }

var crypto = require('crypto');

function sign(str, key) {
    return crypto.createHmac('sha256', key).update(str).digest('base64');
}

function base64Encode(str) {
    return new Buffer(str).toString('base64');
}

module.exports = {
    /**
     * @description encode a token
     * @return      {[string]} token [generated token]
     */
    encode: function(payload, secret){
        var algorithm = 'HS256',
            header = {
                typ:'JWT',
                alg: algorithm
            },
            jwt = base64Encode(JSON.stringify(header)) + 
                '.' + base64Encode(JSON.stringify(payload));
        
        return jwt + '.' + sign(jwt, secret);
    }
}