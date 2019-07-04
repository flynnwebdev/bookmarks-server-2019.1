// dependencies
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

// import custom middleware
const {
  initializePassport,
  requireJwt
} = require('./middleware/auth')

// new express server + plug in middleware
const app = express()

app.use(morgan('dev')) // logging
app.use(bodyParser.json()) // parse json
app.use(initializePassport) // connect Passport to Express
app.use(cors()) // allow CORS

// connect to MongoDB


// routes
app.use('/auth', require('./routes/auth'))
app.use('/bookmarks', requireJwt, require('./routes/bookmarks'))

// start the server!
app.listen(3000, () => console.log('Listening on http://localhost:3000'))