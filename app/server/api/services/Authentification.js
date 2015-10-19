var request = require('request'),
    qs = require('querystring');

module.exports = {

    /**
     * [fb description]
     * @param  {[type]} req             [description]
     * @param  {[type]} res             [description]
     * @param  {[type]} io              [description]
     * @param  {[type]} resolveResponse [description]
     * @return {[type]}                 [description]
     */
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
    },

    /**
     * [google description]
     * @param  {[type]} req                    [description]
     * @param  {[type]} res                    [description]
     * @param  {[type]} io                     [description]
     * @param  {[type]} resolveResponse        [description]
     * @param  {[type]} updateUserlastLoggedIn [description]
     * @return {[type]}                        [description]
     */
    google: function (req, res, io, resolveResponse, updateUserlastLoggedIn) {

        var reqParams = req.allParams()
            url = Config.GOOGLE_URL,
            apiUrl = Config.GOOGLE_APIURL,
            params = {
                client_id: Config.GOOGlE_CLIENT_ID,
                redirect_uri: Config.GOOGLE_REDIRECT_URL,
                code: decodeURIComponent(reqParams.code),
                grant_type: 'authorization_code',
                client_secret: Config.GOOGLE_SECRET
            };

        request.post(url, {
            json: true,
            form: params
        }, function (err, response, token) {

            var accesstoken = token.access_token,
                headers = {
                    Authorization: 'Bearer ' + accesstoken
                };
            
            request.get({
                url: apiUrl,
                headers: headers, 
                json: true
            }, function (err, response, profile) {

                var googleSearchUser = {googleId: profile.sub};

                User.findOne(googleSearchUser).exec(function (err, foundUser) {

                    var successData;

                    if (err) {
                        return res.negotiate(err);
                    }
                    if (foundUser) {
                        successData = resolveResponse(req, foundUser, 'E_AUTH', '200 ok');
                        successData.data.displayName = profile.name;
                        successData.data.picture = profile.picture;
                        // Indicates it is a existing user
                        successData.type = 'exist';
                        updateUserlastLoggedIn(res, foundUser, successData, function () {
                            sails.io.sockets.emit('googleauth', successData);
                            sails.io.sockets.emit('sessionstate', {msg: 'session has started'});
                        });
                    } else {
                        User.create({
                            email: profile.email,
                            displayName: profile.name,
                            googleId: profile.sub
                        }, function (err, newUser) {
                            if (err) {
                                return res.negotiate(err);
                            }
                            successData = resolveResponse(req, newUser, 'E_CREATION', 'User have been created');
                            successData.data.displayName = profile.name;
                            successData.data.picture = profile.picture;
                            // Indicate it is a new user
                            successData.type = 'new';
                            io.sockets.emit('googleauth', successData);
                            sails.io.sockets.emit('sessionstate', {msg: 'session has started'});
                            return res.ok(successData);
                        });
                    }
                });
            });
        });
    }
}
