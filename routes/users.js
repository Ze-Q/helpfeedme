var express = require('express');
var qr = require('qr-image');  
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('usercollection').find().toArray(function (err, items) {
        res.json(items);
    });
});


/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    db.collection('usercollection').insert(req.body, function(err, result){
        console.log(result[0]);
        var newUser = result[0];
        console.log(newUser['_id']);
        var code = qr.image(newUser['_id'].toString(), { type: 'png', size: 15 });
        res.type('png');
        code.pipe(res);
    });
});

/*
 * GET user by id
 */
router.get('/getuser/:id', function(req, res) {
    var db = req.db;
    var userToRetrieve = req.params.id;
    db.collection('usercollection').findOne({_id: require('mongoskin').ObjectID(userToRetrieve)},function (err, item) {
        console.log("the error is :" + err);
        console.log("the result is :" + item);
        res.json(item);
    });
});


module.exports = router;
