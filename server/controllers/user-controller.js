const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

// grab the User model from the models folder, the sequelize
// index.js file takes care of the exporting for us and the
// syntax below is called destructuring, its an es6 feature
const { User } = require('../models');

/* Register Route
========================================================= */
router.post('/register', async (req, res) => {

  // hash the password provided by the user with bcrypt so that
  // we are never storing plain text passwords. This is crucial
  // for keeping your db clean of sensitive data
  const hash = bcrypt.hashSync(req.body.password, 10);

  try {
    // create a new user with the password hash from bcrypt
    let user = await User.create(
      Object.assign(req.body, { password: hash })
    );

    // data will be an object with the user and it's authToken
    let data = await user.authorize();

    // send back the new user and auth token to the
    // client { user, authToken }
    return res.json(data);

  } catch(err) {
    return res.status(400).send(err);
  }

});

/* Login Route
========================================================= */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // if the username / password is missing, we use status code 400
  // indicating a bad request was made and send back a message
  if (!username || !password) {
    return res.status(400).send(
      'Request missing username or password param'
    );
  }

  try {

    // we will cover the user authenticate method in the next section
    let user = await User.authenticate(username, password)

    return res.json(user);

  } catch (err) {
    return res.status(400).send('invalid username or password');
  }

});

/* Logout Route
========================================================= */
router.delete('/logout', async (req, res) => {

  // because the logout request needs to be send with
  // authorization we should have access to the user
  // on the req object, so we will try to find it and
  // call the model method logout
  const { user, cookies: { auth_token: authToken } } = req

  // we only want to attempt a logout if the user is
  // present in the req object, meaning it already
  // passed the authentication middleware. There is no reason
  // the authToken should be missing at this point, check anyway
  if (user && authToken) {
    await req.user.logout(authToken);
    return res.status(204).send()
  }

  // if the user missing, the user is not logged in, hence we
  // use status code 400 indicating a bad request was made
  // and send back a message
  return res.status(400).send(
    { errors: [{ message: 'not authenticated' }] }
  );
});

/* Me Route - get the currently logged in user
========================================================= */
router.get('/me', (req, res) => {
  if (req.user) {
    return res.send(req.user);
  }
  res.status(404).send(
    { errors: [{ message: 'missing auth token' }] }
  );
});

// export the router so we can pass the routes to our server
module.exports = router;

