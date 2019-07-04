const passport = require('passport')
const User = require('../models/user')
const PassportJwt = require('passport-jwt')
const JWT = require('jsonwebtoken')

const secret = 'Greetings Programs!'
const algorithm = 'HS256'

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy())

passport.use(new PassportJwt.Strategy({
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    algorithms: [algorithm]
}, async (payload, done) => {
        const user = await User.findById(payload.sub)
        if (user) {
            // Copy token to user so Passport can find it
            user.token = payload
            done(null, user)
        } else {
            done('User not found', false)
        }
}))

// Generate a new token (will be called as middleware after login)
const signJwtForUser = (req, res) => {
    const token = JWT.sign(
        // Payload
        {
            sub: req.user._id.toString(),
            email: req.user.email
        },
        // Secret
        secret,
        // Config
        {
            algorithm,
            expiresIn: '3h'
        }
    )

    res.json({token})
}

// passport.serializeUser(function (user, done) {
//     localStorage.setItem('user', user)
//     done(null, user.id);
// });

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = {
    signJwtForUser,
    initializePassport: passport.initialize(),
    login: passport.authenticate('local', {
        session: false
    }),
    requireJwt: passport.authenticate('jwt', { session: false })
}