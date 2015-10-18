var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Passwords = require('machinepack-passwords'),

    localStrategy,
    strategyOptions = {
        usernameField: 'email'
    };

function findById(id, fn) {
    User.findOne(id).exec(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

// Passport session setup.
// To support persistent login sessions, Passport needs to be able to
// serialize users into and deserialize users out of the session. Typically,
// this will be as simple as storing the user ID when serializing, and finding
// the user by ID when deserializing.
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
 
passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

localStrategy = {
    login: new LocalStrategy(strategyOptions, function (email, password, done) {

        var searchUser = {
            email: email
        };

        User.findOne(searchUser).exec(function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) { 
                return done(null, false, {
                    message: 'Wrong email/password'
                });
            }

            Passwords.checkPassword({
                passwordAttempt: password,
                encryptedPassword: user.password
            }).exec({
                error: function (err) {
                    return done(err);
                },
                incorrect: function () {
                    return done(null, false, {
                        message: 'Wrong email/password'
                    });
                },
                success: function () {
                    return done(null, user, {
                        message: 'Logged In Successfully'
                    });
                }
            });
        })
    }),

    register: new LocalStrategy(strategyOptions, function (email, password, done) {

        var searchUser = {
            email: email
        };

        User.findOne(searchUser).exec(function (err, user) {
            if (err) return done(err);

            if (user) return done(null, false, {
                message: 'email already exists'
            });

            User.create({
                email: email,
                password: password
            }, function (err, newUser) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser, {
                    message: 'Account successfully created'
                });
            });
        });
    })
};

passport.use('local-register', localStrategy.register);
passport.use('local-login', localStrategy.login);

module.exports = localStrategy;
