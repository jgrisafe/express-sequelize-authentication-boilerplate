const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// controllers
const userController = require('./controllers/user-controller')

// directory references
const clientDir = path.join(__dirname, '../client');

// set up the Express App
const app = express();
const PORT = process.env.PORT || 8080;

// Express middleware that allows POSTing data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve up the public folder so we can request static
// assets from our html document
app.use(express.static(`${clientDir}/public`));

// hook up our controllers
app.use(userController);

// Requiring our models for syncing
const db = require('./models/index');

// sync our sequelize models and then start server
db.sequelize.sync().then(() => {

  // inside our db sync callback, we start the server.
  // this is our way of making sure the server is not listening
  // to requests if we have not yet made a db connection
  app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });

});