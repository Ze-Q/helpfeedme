$('document').ready(function() {
    
// Enable pusher logging - don't include this in production
    Pusher.log = function(message) {
      if (window.console && window.console.log) {
        window.console.log(message);
      }
    };

    var pusher = new Pusher('8c762fb5e85551d78c85');
    var channel = pusher.subscribe('test_channel');
    var notifier = new PusherNotifier(channel);
});