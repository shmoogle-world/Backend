const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
opts.issuer = 'http://backend.shmoogle.world';
opts.audience = 'http://shmoogle.world';

passport.use(new JwtStrategy(opts, function (payload, done) {

    /**
     * Write sql code here to authenticate 
     * return based on the callback with done.
     */

    function callback(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    };
}));
