var express = require('express');
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
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
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
