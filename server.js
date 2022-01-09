const express = require('express');

const keys = require('./config/keys.js');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Setting up the DB
const mongoose = require('mongoose');
mongoose.connect(keys.mongoURI);

// Setup database models
require('./model/AccountDetails');

// Setup the routes
require('./routes/authenticationRoutes')(app);

app.listen(keys.port, () => {
    console.log("Listening on " + keys.port);
});