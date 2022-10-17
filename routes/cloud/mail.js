var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.test = 'crud mail ping';
    res.send({helper:helper});
    res.end();
});
router.post('/sendmailform', function(req, res, next) {
    var helper = biz9.get_helper(req);
    upload_files_str = '';
    async.series([
        function(call){
            mail={};
            mail.subject=helper.form_title;
            mail.from = EMAIL_FROM;
            mail.to = EMAIL_TO;

            str='';
            for(item in helper){
               if(item.startsWith('_')){
                    str =str+ "<b>"+jsUcfirst(item.replace('_',''))+ "</b>: "+helper[item]+"<br/>";
                }
            }
            function jsUcfirst(string)
            {
                    return string.charAt(0).toUpperCase() + string.slice(1);
            }

            mail.body = str;
            call();
        },
        function(call){
            biz9.send_mail(mail,function(_data) {
                helper.validation_message='Thanks! We will respond within 24hrs. Have a wonderful day!';
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/forgotpassword',function(req,res){
    var helper = biz9.get_helper(req);
    helper.render='forgot_password';
    helper.page_title = APP_TITLE +': Forgot Password';
    helper.item = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            page_key='primary';
            biz9.get_page_key(db,page_key,{},function(page_key){
                helper.primary=page_key;
                call();
            });
        },
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
router.post('/forgotpasswordsend',function(req,res){
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(DT_USER,0,req.body);
    helper.validation_message =null;
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            sql_obj = {email:helper.item.email};
            biz9.get_sql(db,DT_USER, sql_obj,{}, function(data_list) {
                if(data_list.length>0) {
                    helper.item = data_list[0];
                    call();
                }
                else{
                    helper.validation_message = "The email address " +helper.item.email + " is not found.";
                    call();
                }
            });
        },
        function(call){
            if(!helper.validation_message){
                mail={};
                mail.subject=APP_TITLE+' Forgot password';
                mail.from = EMAIL_FROM;
                mail.to = helper.item.email;
                biz9.send_mail(mail,function(_data) {
                    helper.validation_message='Email and password found. Please check your email found at '+helper.item.email + " for futher instructions.";
                    call();
                });
            }
            else{
                call();
            }
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/update_email_list',function(req,res){
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(DT_EMAIL,0,req.body);
    helper.validation_message =null;
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            helper.email_add='true';
            sql_obj = {email:helper.item.email};
            biz9.get_sql(db,DT_EMAIL, sql_obj,{}, function(data_list) {
                if(data_list.length>0) {
                    helper.email_add='false';
                    helper.validation_message='Email Already Added';
                }
                call();
            });
        },
        function(call){
            if(helper.email_add=='true'){
                biz9.update_item(db,helper.item.data_type,helper.item,function(data) {
                    helper.item=data;
                    call();
                });
            }
            else{
                call();
            }
        },
        function(call){
            mail={};
            mail.subject=APP_TITLE + ' Email List Update';
            mail.from = EMAIL_FROM;
            mail.to = EMAIL_TO;
            str='<b>Email:</b> '+helper.email;
            str=str+'<br/><b>Added To List:</b> '+helper.email_add;
            mail.body = str;
            call();
        },
        function(call){
            biz9.send_mail(mail,function(_data) {
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
