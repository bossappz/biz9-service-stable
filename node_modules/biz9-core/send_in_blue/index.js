/* Copyright (C) 2021 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Send-In-Blue
 */
module.exports = function(){
    module.send_mail=function(send_in_blue_key,send_in_blue_obj,callback){
        var r_error=null;
        async.series([
            function(call){
                SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = send_in_blue_key;
                new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(send_in_blue_obj
                ).then(function(data) {
                    call();
                }, function(error) {
                    if(error){
                        biz9.o('send_in_blue_obj',send_in_blue);
                        biz9.o('send_mail_error',error);
                        biz9.o('send_mail_error_2',error.response.error.text);
                        r_error='SEND_IN_BLUE_ERROR '+ error.response.error.text;
                        biz9.o('send_mail_error_3',r_error);
                        call();
                    }
                    else{
                        call();
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
