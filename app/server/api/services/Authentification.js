var request = require('request'),
    qs = require('querystring');

module.exports = {

    fb: function (req, res) {
        // var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token',
        //     graphApiUrl = 'https://graph.facebook.com/me';

        // var params = {
        //     client_id: req.param('clientId'),
        //     redirect_uri: req.param('redirectUri'),
        //     client_secret: Config.FACEBOOK_SECRET,
        //     code: req.param('code')
        // };

        // request.get({
        //     url: accessTokenUrl,
        //     qs: params
        // }, function (err, response, accessToken) {
        //     accessToken = qs.parse(accessToken);

        //     request.get({
        //         url: graphApiUrl,
        //         qs: accessToken,
        //         json: true
        //     }, function (err, response, profile) {
        //         User.findOne({
        //             facebookId: profile.id
        //         }, function (err, existingUser) {
        //             if (existingUser)
        //                 return JWT.createToken(existingUser, res);

        //             var newUser = new User();
        //             newUser.facebookId = profile.id;
        //             newUser.displayName = profile.name;
        //             newUser.save(function (err) {
        //                 JWT.createToken(newUser, res);
        //             })

        //         })
        //     });
        // });
    }

}