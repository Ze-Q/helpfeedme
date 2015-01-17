var express = require('express');
var https = require('https');
var querystring = require('querystring');
var request = require("request");
var router = express.Router();


/* POST to get a quote for delivery price */
router.post('/getquote', function(req, res) {

    var username = 'b057c44b-bfb6-4275-b3ef-a279fdd00fac'; // our postmates account
    var auth = "Basic " + new Buffer(username + ":").toString("base64");
    var loc = req.body.loc; // user location

    console.log(loc);

    data = querystring.stringify({
        'dropoff_address' : loc, 
        'pickup_address' : '3330 Walnut Street, Philadelphia, PA 19104'});

    options = {
        // hostname :'api.postmates.com',
        // path : '/v1/customers/cus_KAbGWjljT7QI7-/delivery_quotes',
        url: 'https://api.postmates.com/v1/customers/cus_KAbGWjljT7QI7-/delivery_quotes',
        method : 'POST',
        headers: {
            'Content-Length': data.length,
            'Authorization' : auth
        },
        form: data
    }

    // var post = https.request(options, function(res){
    //     res.on('data', function (chunk) {
    //         res.setEncoding('utf8');
    //         console.log('Response: ' + chunk);
    //     });
    //     res.on('error', function(e) {
    //         console.log('problem with request: ' + e.message);
    //     });
    // });

    // console.log(data);
    //post.write(data);
    // post.end();
    request(options, function(error, response, body){
        console.log(body);
    });

});

module.exports = router;