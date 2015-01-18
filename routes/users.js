var express = require('express');
var qr = require('qr-image');  
var router = express.Router();

/*
 * Pusher Configuration
 */

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '103545',
  key: 'eb07bb89a17f04cf3f32',
  secret: 'cbccf56cde11fe7a53e5'
});


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
        var code = qr.image(newUser['_id'].toString(), { type: 'png' });
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

function postNotification(message) {
    pusher.trigger('test_channel', 'my_event', {
        "message": message
    });
};

router.get('/testNotification/:message', function(req, res) {
    var message = req.params.message;
    postNotification(message);
});

module.exports = router;
