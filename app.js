// dependencies
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()

// import custom middleware
const {
  initializePassport
} = require('./middleware/auth')

// new express server + plug in middleware
const app = express()
app.use(morgan('dev')) // logging
app.use(bodyParser.json()) // parse json
app.use(initializePassport) // connect Passport to Express
app.use(cors()) // allow CORS

// connect to MongoDB
mongoose.connect(process.env.DB_PATH, (err) => {
  if (err) {
    console.log('Error connecting to database', err)
  } else {
    console.log('Connected to database!')
  }
});

// routes
app.use('/auth', require('./routes/auth'))
app.use('/bookmarks', require('./routes/bookmarks'))

// start the server!
app.listen(4000, () => console.log('Listening on http://localhost:4000'))