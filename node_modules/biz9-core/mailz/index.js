/* Copyright (C) 2019 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Mail
 */
module.exports = function(){
    module.send_mail = function(mail,callback){
        aws.config.update({accessKeyId:mail.aws_key,secretAccessKey:mail.aws_secret, region:mail.aws_region});
        var ses = new aws.SES();
        var params = {
            Destination: {
                CcAddresses: [
                    String(mail.to)
                ],
                ToAddresses: [
                    String(mail.to)
                ]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: String(mail.body)
                    },
                    Text: {
                        Charset: "UTF-8",
                        Data: String(mail.body)
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: String(mail.subject)
                }
            },
            Source: mail.from,
            ReplyToAddresses: [
                String(mail.to)
            ],
        };
        ses.sendEmail(params, function(error,data){
            callback(error,mail);
        });
    }
    return module;
}

