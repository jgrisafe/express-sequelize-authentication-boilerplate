const express = require('express');

const router = express.Router();

const { User } = require('../models');

router.post('/register', (req, res) => {
  User.create({ ...req.body })
    .then(async (user) => {
      await user.authorize();
      res.json(user);
    })
    .catch((err) => { res.send(err.errors); });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // if the username or password is missing, we use the status code 400
  // indicating a bad request was made and send back a message
  if (!username || !password) {
    return res.status(400).send('Missing username or password');
  }

  User.findOne({ where: { username, password } })
    .then(async (user) => {
      if (!user) { res.status(404).send('User not found.'); }
      await user.authorize();
      res.json(user);
    })
    .catch((err) => { res.send(err.errors); });
});

router.delete('/logout', (req, res) => {
  const { username } = req.user;

  // if the username missing, we use the status code 400
  // indicating a bad request was made and send back a message
  if (!username) {
    return res.status(400).send('Missing username or password');
  }

  return User.findOne({ where: { username } })
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

module.exports = router;

