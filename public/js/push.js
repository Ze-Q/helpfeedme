$('document').ready(function() {
    
// Enable pusher logging - don't include this in production
    Pusher.log = function(message) {
      if (window.console && window.console.log) {
        window.console.log(message);
      }
    };

    var pusher = new Pusher('8c762fb5e85551d78c85');
    var channel = pusher.subscribe('test_channel');
    channel.bind('my_event', function(data){
       $.notify("A new donation just went to a citizen in need!", "success");
    });
});