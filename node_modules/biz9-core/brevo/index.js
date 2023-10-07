/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Brevo
 */
module.exports = function(){
    module.send_mail=function(brevo_key,brevo_obj,callback){
        var error=null;
        async.series([
            function(call){
                var defaultClient = brevo_lib.ApiClient.instance;
                // Configure API key authorization: api-key
                var apiKey = defaultClient.authentications['api-key'];
                apiKey.apiKey =brevo_key;
                var apiInstance = new brevo_lib.TransactionalEmailsApi();
                call();
                apiInstance.sendTransacEmail(brevo_obj).then(function(data) {
                }, function(_error) {
                    if(_error){
                        error='brevo mail error '+ _error.response.error.text;
                        biz9.o('brevo_send_mail_error',error);
                        call();
                    }
                });
            },
        ],
            function(err, result){
                callback(error,0);
            });
    }
    return module;
}
