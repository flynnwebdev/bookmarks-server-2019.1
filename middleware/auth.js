const passport = require('passport')
const PassportJwt = require('passport-jwt')
const JWT = require('jsonwebtoken')
const User = require('../models/user')


const algorithm = 'HS256'
const secret = 'greetingsprograms'

// Use the User strategy (local-mongoose) for email and password
passport.use(User.createStrategy())

// Additional to the above, we also want generate JWT tokens.
// Happens for every request
passport.use(new PassportJwt.Strategy({
    // Tell Passport where to find the incoming token
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
    algorithms: [algorithm]
}, async (payload, done) => { // Called by Passport on each request, giving the payload
        const user = await User.findById(payload.sub)
        if (user) {
            // Copy token to user so Passport can find it
            user.token = payload
            done(null, user)
        } else {
            done('User not found', false)
        }
    }
))

// Generate a token
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

module.exports = {
    signJwtForUser,
    initializePassport: passport.initialize(),
    // Login through Passport without a session
    login: passport.authenticate('local', { session: false }),
    requireJwt: passport.authenticate('jwt', { session: false })
}
