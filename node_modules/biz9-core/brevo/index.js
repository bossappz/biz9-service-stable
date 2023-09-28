/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Brevo
 */
module.exports = function(){
    module.send_mail=function(brevo_key,brevo_obj,callback){
        var r_error=null;
        async.series([
            function(call){
                var defaultClient = brevo_lib.ApiClient.instance;
                // Configure API key authorization: api-key
                var apiKey = defaultClient.authentications['api-key'];
                apiKey.apiKey =brevo_key;
                var apiInstance = new brevo_lib.TransactionalEmailsApi();
                apiInstance.sendTransacEmail(brevo_obj).then(function(data) {
                    call();
                }, function(error) {
                    if(error){
                        r_error='BREVO_ERROR '+ error.response.error.text;
                        biz9.o('brevo_obj',brevo);
                        biz9.o('send_mail_error',error);
                    }
                });
            },
        ],
            function(err, result){
                callback(r_error,0);
            });
    }
    return module;
}
