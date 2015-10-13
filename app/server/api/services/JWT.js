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

function base64Decode(str) {
    return new Buffer(str, 'base64').toString();
}

function verify(raw, secret, signature) {
    return signature === sign(raw, secret);
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
    },

    /**
     * @description decode token
     * @return      {[string]} token [decoded token]
     */
    decode: function(token, secret){
        var header,
            payload,
            rawSignature,
            segments = token.split('.');
        
        if(segments.length !== 3) {
            throw new Error('Token structure incorrect');
        }

        header = JSON.parse(base64Decode(segments[0]));
        payload = JSON.parse(base64Decode(segments[1]));

        rawSignature = segments[0] + '.' + segments[1];

        if(!verify(rawSignature, secret, segments[2])){
            throw new Error('Verification failed');
        }

        return payload;
    }
}