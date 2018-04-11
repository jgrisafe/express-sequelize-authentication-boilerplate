const express = require('express');

const router = express.Router();

// grab the User model from the models folder, the sequelize
// index.js file takes care of the exporting for us and the
// syntax below is called destructuring, its an es6 feature
const { User, AuthToken } = require('../models');

/* Register Route
========================================================= */
router.post('/register', (req, res) => {
  // create a user with the sequelize create method, passing it
  // the request body, which should contain the username,
  // email, and password
  User.create({ ...req.body })

    // we use an async function here so that we can wait on the
    // auth token generation with user.authorize()
    .then(async (user) => {
      await user.authorize();

      // send back the new user and auth token to the client
      res.json(user);
    })
    .catch((err) => { res.send(err.errors); });
});

/* Login Route
========================================================= */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // if the username / password is missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!username || !password) {
    return res.status(400).send('Request missing username or password param');
  }

  // try to find a user with the same username and password
  // as sent by the request body. If it's found we are going
  // to give it a fresh auth token and send it back
  User.findOne({ where: { username, password } })
    .then(async (user) => {
      if (!user) { res.status(404).send('User not found.'); }
      await user.authorize();
      res.json(user);
    })
    .catch((err) => { res.send(err.errors); });
});

/* Logout Route
========================================================= */
router.delete('/logout', (req, res) => {
  const { username } = req.user;

  // if the username missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!username) {
    return res.status(400).send('Request Missing username param');
  }

  // try to find a user with the same username
  // as sent by the request body. If it's found we are going
  // to delete the associated auth tokens so that this user
  // is completely logged out of all devices. Sometimes this
  // might not be the desired functionality so you can adjust
  // this method as needed
  User.findOne({ where: { username } })
    .then(async (user) => {
      if (!user) { res.status(404).send('User not found.'); }
      await user.logout();
      res.json(user);
    })
    .catch((err) => { res.send(err.errors); });
});

router.get('/me', (req, res) => {
  if (req.user) {
    return res.send(req.user);
  }
  res.status(404).send({ errors: [{ message: 'missing auth token' }] });
});

// export the router so we can pass the routes to our server
module.exports = router;

