var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
    res.end();
});
//9_category_list
router.get('/category_list/:page_current',function(req, res) {
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
            sort={date_create:1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_CATEGORY_LIST;
            biz9.get_category_biz_list(db,DT_GALLERY,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
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
//9_list
router.get('/gallery_list/:category/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.gallery_list = [];
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
            if(!helper.category||helper.category=='all'){
                sql={};
            }else{
                sql={category:helper.category};
            }
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                helper.gallery_list = data_list;
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
//9_gallery_detail
////9_detail
router.get('/gallery_detail/:title_url',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.gallery = biz9.get_new_item(DT_GALLERY,0);
    helper.category_list = [];
    helper.card_double_list = [];
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
                biz9.get_gallery(db,helper.title_url,function(error,data) {
                    helper.gallery=data;
                    call();
                });
            }else{
                call()
            }
        },
        function(call){
            if(helper.gallery.category){
                sql={category:helper.gallery.category};
                sort={date_create:-1};
                page_current=1;
                page_size=PAGE_SIZE_SLIDE_SHOW_LIST;
                biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                    helper.card_double_list = data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            sort={type:-1};
            page_current=1;
            page_size=PAGE_SIZE_CATEGORY_LIST;
            biz9.get_categoryz(db,DT_GALLERY,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.category_list = data_list;
                call();
            });
        },
        function(call){
            if(helper.gallery.title_url){
                biz9.update_item_view_count(db,DT_GALLERY,helper.gallery.tbl_id,helper.customer_id,function(error,data) {
                    call();
                });
            }else{
                call();
            }
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
