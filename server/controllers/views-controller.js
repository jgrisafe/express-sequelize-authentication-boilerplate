const express  = require('express');
const router = express.Router();

// home route for demonstrating user auth
router.get('/', (req, res) => res.render('home'));

module.exports = router;