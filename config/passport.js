const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const { User } = require('../models')
const validPassword = require('../lib/passwordUtil').validPassword;

const verifyCallback = (username, password, done) => {

    User.findOne({ where: { username } })
        .then((user) => {

            if (!user) { return done(null, false) }

            const isValid = validPassword(password, user.hash, user.salt);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch((err) => {
            done(err);
        });

}

const strategy = new localStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser((userId, done) => {
    User.findOne({ where: { user_id: userId } })
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});