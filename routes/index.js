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

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    var db = req.db;
    var collection = db.get('usercollection');
    
    var name = req.body.name;
    var phone = req.body.phone;
    var note = req.body.note;

    // Submit to the DB
    collection.insert({
        "name" : name,
        "phone" : phone,
        "note" : note
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;
