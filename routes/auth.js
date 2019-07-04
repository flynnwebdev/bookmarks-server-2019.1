const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const router = express.Router();
const {
    login,
    signJwtForUser
} = require('../middleware/auth')

router.post('/login', login, signJwtForUser)

router.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200)
});

module.exports = router;