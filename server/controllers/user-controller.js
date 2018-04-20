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
router.delete('/logout', async (req, res) => {

  // because the logout request needs to be send with authorization
  // we should have access to the user on the req object, so we will
  // try to find it and call the model method logout
  if (req.user) {
    await req.user.logout();
    return res.status(204).send()
  };

  // if the user missing, we use status code 400
  // indicating a bad request was made and send back a message
  return res.status(400).send('Request Missing username param');
});

router.get('/me', (req, res) => {
  if (req.user) {
    return res.send(req.user);
  }
  res.status(404).send({ errors: [{ message: 'missing auth token' }] });
});

// export the router so we can pass the routes to our server
module.exports = router;

