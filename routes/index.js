const express = require('express');
const router = express.Router();


const config = process.env.TEST_CONFIG;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
