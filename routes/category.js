var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-gallery':'ping'});
    res.end();
});
//9_category_list
router.get('/category_list/:data_type/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.category_list =[];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_CATEGORY_LIST;
            biz9.get_category_biz_list(db,helper.data_type,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                helper.category_list = data_list;
                helper.item_count=item_count;
                helper.page_count=page_count;
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
//9_category_detail
////9_category
router.get('/category_detail/:title_url',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.category = biz9.get_new_item(DT_CATEGORY,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            if(helper.title_url!="0"){
                biz9.get_category(db,helper.title_url,function(error,data) {
                    helper.category=data;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.category_title_list = [
                {value:DT_BLOG_POST,title:'Blog Post'},
                {value:DT_EVENT,title:'Event'},
                {value:DT_GALLERY,title:'Gallery'},
                {value:DT_PRODUCT,title:'Product'},
                {value:DT_SERVICE,title:'Service'},
            ]
            call();
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
