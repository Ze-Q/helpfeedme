var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Main Page' });
});

/* GET create user page */
router.get('/newuser', function(req, res) {
  res.render('newuser', { title: 'Create User' });
});

module.exports = router;
