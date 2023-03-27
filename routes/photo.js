var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
    res.end();
});
//9_photo_list
router.get('/old_photo_list/:data_type/:tbl_id/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.photo_list = [];
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            title_url='mobile';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.mobile=page;
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.info = data_list[0];
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data){
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.tbl_id};
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=3;
            biz9.get_sql_paging(db,DT_PHOTO,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.photo_list=data_list;
                helper.item_count=item_count;
                helper.page_count=page_count;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
// 9_photo 9_edit_photo
router.get('/old_photo_detail/:parent_data_type/:parent_tbl_id/:tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.photo = biz9.get_new_item(DT_PHOTO,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            title_url='mobile';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.mobile=page;
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.info = data_list[0];
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id,function(error,data){
                helper.item=data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_PHOTO,helper.tbl_id,function(error,data){
                helper.photo=data;
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
