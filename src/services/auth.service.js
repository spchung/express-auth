const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const config = require('../config/config');

passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
}, (accessToken, refreshToken, profile, cb) => {
    const profileJson = profile._json;
    return cb(null, profileJson);
}));

module.exports = {
    passport,
};