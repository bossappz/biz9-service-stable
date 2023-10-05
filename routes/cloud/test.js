var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.test = 'crud test ping';
    res.send({helper:helper});
    res.end();
});
router.get('/report', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            helper.item.field_1=biz9.get_id();
            helper.item.field_2=biz9.get_id();
            helper.item.field_3=biz9.get_id();
            biz9.update_item(db,DT_BLANK,helper.item,function(error,data) {
                helper.item=data;
                biz9.o('DB_FIELD_BLANK_SET',helper.item);
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_BLANK,helper.item.tbl_id,function(error,data) {
                helper.item=data;
                biz9.o('DB_FIELD_BLANK_GET',helper.item);
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/bucket_update', function(req, res, next) {
    var helper = biz9.get_helper(req);
    awz_obj={aws_key:AWS_KEY,aws_secret:AWS_SECRET};
    helper.item = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.update_bucket(awz_obj,helper.title,function(error, data) {
                helper.error=error;
                helper.item.buket_data=data;
                helper.item.bucket_title=helper.title;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/bucket_file_update', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    test_file=path.join(__dirname,'../../public/images/no_image.png');;
    re_test_file='re_test_file.png'
    async.series([
        function(call){
            biz9.update_bucket_file(helper.title,test_file,re_test_file,function(error,data) {
                helper.error=error;
                helper.item.buket_data=data;
                helper.item.bucket_title=helper.title;
                helper.item.photofilename=re_test_file;
                helper.item.filename=test_file;
                helper.item = biz9.set_biz_item(helper.item);
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/bucket_get_data', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.re_test_file='re_test_file.png'
    async.series([
        function(call){
            biz9.get_bucket_data(helper.bucket_title,helper.re_test_file,function(error,data) {
                helper.error=error;
                helper.data=data;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/write_file', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    test_file=path.join(__dirname,'../../public/images/no_image.png');;
    re_test_file=path.join(__dirname,'../../public/images/no_image_test.png');;
    async.series([
        function(call){
            sharp(test_file)
                .toFile(re_test_file,(error,info)=> {
                    helper.error=error;
                    helper.data=info;
                    call();
                });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/send_mail', function(req, res, next) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            mail={};
            mail.subject ='Test Server Send Email';
            mail.from = EMAIL_FROM;
            mail.to = helper.email;
            str = "<b>Test Email</b>: "+helper.email+"<br/>";
            mail.body = str;
            call();
        },
        function(call){
            biz9.send_mail(mail,function(error,_data) {
                biz9.o('server_send_mail_response',_data);
                helper.error='Thanks! We will respond within 24hrs. Have a wonderful day!';
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/uptime', function(req, res, next) {
    var helper = biz9.get_helper(req);
    var exec = require('child_process').exec;
    helper.item = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
