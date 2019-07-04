const passport = require('passport')
const User = require('../models/user')

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy())

module.exports = {
    initializePassport: passport.initialize(),
    login: passport.authenticate('local', {
        session: false
    })
}
