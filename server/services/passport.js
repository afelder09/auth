const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify email and password
    // Call done with the user if it is the correct email/password
    // Otherwise, call done with false
    const user = User.findOne({ email }, (err, user) => {
        if(err) {return done(err)}
        if(!user) {return done(null, false)}

        // is password == user.password
        user.comparePassword(password, (err, isMatch) => {
            if(err) {return done(err)}
            if(!isMatch) {return done(null, false)}
            return(null,user);
        })
    })
})

// Set up options for jwt strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
}

// Create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the user id in the payload exists in the database
    // If it does, call done
    // If not, call done without user
    User.findById(payload.sub, (err, user) => {
        if(err) {return done(err, false)}

        if(user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    })
})

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin)