const express = require('express');
const router = express.Router();

const { AuthToken, User } = require("../models");

router.post('/register', (req, res) => {
  User.create({ ...req.body })
    .then(async (user) => {
      await user.authorize()
      res.json({ user: user.dataValues })
    })
    .catch(err => { res.send(err.errors) })
})

module.exports = router;

