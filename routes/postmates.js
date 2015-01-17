var express = require('express');
var querystring = require('querystring');
var request = require("request");
var router = express.Router();


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

module.exports = router;