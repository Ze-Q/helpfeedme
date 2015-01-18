var express = require('express');
var querystring = require('querystring');
var request = require("request");
var router = express.Router();

/*
 * Pusher Configuration
 */

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '103547',
  key: '8c762fb5e85551d78c85',
  secret: 'ae80b55944e291c09bfa'
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

/* POST to get a quote for delivery price */
router.post('/getquote', function(req, res) {

    var username = 'b057c44b-bfb6-4275-b3ef-a279fdd00fac'; // our postmates account
    var auth = "Basic " + new Buffer(username + ":").toString("base64");
    var loc = req.body.loc; // user location

    data = querystring.stringify({
        'dropoff_address' : loc, 
        'pickup_address' : '3330 Walnut Street, Philadelphia, PA 19104'});

    options = {
        url: 'https://api.postmates.com/v1/customers/cus_KAbGWjljT7QI7-/delivery_quotes',
        method : 'POST',
        headers: {
            'Content-Length': data.length,
            'Authorization' : auth
        },
        form: data
    }

    request(options, function(error, response, body){
        r = JSON.parse(body);
        if(r.kind === "error"){
            res.end("There was an error: "+r.code.toString()+'. '+r.message.toString());
        }
        else
            res.end(r.fee.toString());
    });

});

/* POST to place a delivery order */

router.post('/placeorder', function(req, res) {

    var db = req.db;

    var username = 'b057c44b-bfb6-4275-b3ef-a279fdd00fac'; // our postmates account
    var auth = "Basic " + new Buffer(username + ":").toString("base64");
    var loc = req.body.loc; // user location

    var gift = req.body.gift;

    var user;

    var paid = req.body.paid;

    if( !(paid === "paid") ){ // super maximum ultimate security 
        res.statusCode = 400;
        res.end("{'error' : 'not_paid', 'message' : 'The donor did not pay'}")
        return;
    } 

    db.collection('usercollection').findOne({_id: require('mongoskin').ObjectID(req.body.id)},function (err, item) {
        console.log("the error is :" + err);
        console.log("the result is :" + item);
        user = item;
    
    if (! user){
        res.statusCode = 400;
        res.end("{'error' : 'bad_id', 'message' : 'The user id provided is not associated with a user.'}");
        return;
    }

    message = user.note +"; " + req.body.note;



    var data = querystring.stringify({
        'manifest' : 'Helping Hand Package Order: '+gift,
        'pickup_name' : 'Helping Hands Warehouse',
        'pickup_address' : '3330 Walnut Street, Philadelphia, PA 19104',
        'pickup_phone_number' : '555-555-5555' ,
        'dropoff_name' : user.name,
        'dropoff_address' : loc,
        'dropoff_phone_number' : user.phone,
        'dropoff_notes' : message
    });

    console.log(data);

        options = {
        url: 'https://api.postmates.com/v1/customers/cus_KAbGWjljT7QI7-/deliveries',
        method : 'POST',
        headers: {
            'Content-Length': data.length,
            'Authorization' : auth
        },
        form: data
    }
    postNotification("A NEW DONATION!");
    request(options, function(error, response, body){
        r = JSON.parse(body);
        if(r.kind === "error"){
            res.statusCode = 500;
            console.log(r);
            res.end("ERROR: "+r.code.toString()+'. '+r.message.toString());
        }
        else
            res.end(r.id.toString());
    });

    });


});

router.post('/checkstatus', function(req,res){

    var username = 'b057c44b-bfb6-4275-b3ef-a279fdd00fac'; // our postmates account
    var auth = "Basic " + new Buffer(username + ":").toString("base64");

    var id =  req.body.id;

        options = {
        url: 'https://api.postmates.com/v1/customers/cus_KAbGWjljT7QI7-/deliveries/'+id,
        headers: {
            'Authorization' : auth
        }
    }

    request(options, function(error, response, body){ 
    r = JSON.parse(body);
    console.log(r);
    res.end(querystring.stringify({
         'status' : r.status.toString(),
         'fee' : r.fee.toString(),
         'courier' : 'null'
         }));
});
});


module.exports = router;