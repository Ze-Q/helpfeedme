$(document).ready(function() {
   $("#formAddUser").on('submit', function(e){
       event.preventDefault();
        event.stopImmediatePropagation();
        var postData = $(this).serializeArray();
        var formURL = $(this).attr("action");
        $.ajax(
        {
            url : formURL,
            type: "POST",
            data : postData,
            success:function(data, textStatus, jqXHR) 
            {
                console.log(data);
                $('#btnSubmit').after('<img src="data:image/png;base64,' + data + '" />');
                $.notify("Account Creation Successful!", "success");
            },
            error: function(jqXHR, textStatus, errorThrown) 
            {
                $.notify("Account Creation Error!", "error");   
            }
        });
   }); 
});

 