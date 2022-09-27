$('#btn_subscribe').click(function(event){
    event.preventDefault();
    form_title= 'Client Newsletter Subscribe';
    email= $('#tb_item_subscribe_email').val();

    if(!validate_email(email)){
        alert('Please enter a valid email.');
    }else{
        $.ajax({
            type: "POST",
            url: "/cloud/mail/sendmailform",
            enctype: 'multipart/form-data',
            data: {form_title:form_title,_email:email},
            success: function(data){
                alert('Thank you for subscribing to our Newsletter and have a wondeful day!');
            }
        });
        return false;
    }
});

$('#btn_contact_submit').click(function(event){
    event.preventDefault();
    form_title= 'CLIENT Contact Form';
    first_name= $('#tb_item_first_name').val();
    last_name= $('#tb_item_last_name').val();
    email= $('#tb_item_email').val();
    subject= $('#tb_item_subject').val();
    message= $('#tb_item_message').val();

    if(!validate_email(email)){
        alert('Please enter a valid email.');
    }else{
        $.ajax({
            type: "POST",
            url: "/cloud/mail/sendmailform",
            enctype: 'multipart/form-data',
            data: {form_title:form_title,_email:email,_first_name:first_name,_last_name:last_name,_email:email,_phone:phone,_subject:subject,_message:message },
            success: function(data){
                alert('Thank you for your message. We will respond within 24hrs. Thank you for your time.');
            }
        });
        return false;
    }

});

$('#btn_forgotpassword').click(function(event){
    event.preventDefault();
    email= $('#tb_item_forgot_password_email').val();
    if(!validate_email(email)){
        alert('Please enter a valid email.');
    }else{
        $.ajax({
            type: "POST",
            url: "/cloud/mail/forgotpasswordsend",
            enctype: 'multipart/form-data',
            data: {email:email},
            success: function(data){
                alert(data.helper.validation_message);
            }
        });
        return false;
    }
});

function validate_email(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
