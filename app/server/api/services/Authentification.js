var request = require('request'),
    qs = require('querystring');

module.exports = {

    fb: function (req, res, io, resolveResponse) {
        var accessTokenUrl = 'https://graph.facebook.com/oauth/access_token',
            graphApiUrl = 'https://graph.facebook.com/me',
            params = {
                client_id: Config.FACEBOOK_CLIENT_ID,
                redirect_uri: Config.APP_URL + Config.FACEBOOK_REDIRECT_URL,
                client_secret: Config.FACEBOOK_SECRET,
                code: req.param('code')
            };

        request.get({
            url: accessTokenUrl,
            qs: params
        }, function (err, response, accessToken) {
            accessToken = qs.parse(accessToken);
            // indicate wanted inputs
            accessToken.fields = 'id,name,picture,email';

            request.get({
                url: graphApiUrl,
                qs: accessToken,
                json: true
            }, function (err, response, profile) {
                User.findOne({
                    facebookId: profile.id
                }, function (err, existingUser) {
                    if (existingUser) {
                        return JWT.createToken(existingUser);
                    }

                    User.create({
                        email: profile.email,
                        displayName: profile.name,
                        facebookId: profile.id
                    }, function (err, newUser) {
                        if (err) {
                            return res.negotiate(err);
                        }
                        JWT.createToken(newUser);
                        successData = resolveResponse(req, newUser, 'E_CREATION', 'User have been created');
                        successData.data.displayName = profile.name;
                        successData.data.picture = profile.picture.data.url;
                        // Indicate it is a new user
                        successData.type = 'new';
                        io.sockets.emit('facebookauth', successData);
                        io.sockets.emit('sessionstate', {msg: 'session has started'});
                        return res.view();
                    });

                })
            });
        });
    }

}
