const express  = require('express');
const router = express.Router();

// home route for demonstrating user auth
router.get('/', (req, res) => {

  console.log(req.cookies) // eslint-disable-line no-console
  res.render('home', { user: req.user })
});
router.get('/register', (req, res) => res.render('home', { user: req.user }));

module.exports = router;