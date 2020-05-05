const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserController = require('../controllers/UserController');

let opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.APPSETTING_JWT_SALT;
opts.issuer = 'https://shmoogle.world';

passport.use(new JwtStrategy(opts, async (payload, done) => {
    try {
        let obj = await UserController.authenticate(payload.data.email);
        return done(null, obj);
    } catch (err) {
        done(err, false);
    }
}));


module.exports = passport;