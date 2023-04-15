var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-service':'ping'});
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
            sort={date_create:1};
            page_current=1;
            page_size=PAGE_SIZE_CATEGORY_LIST;
            biz9.get_category_biz_list(db,DT_PRODUCT,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                helper.category_list = data_list;
                helper.item_count=item_count;
                helper.page_count=page_count;
                call();
            });
        },
        function(call){
            sql={};
            sort={view_count:-1};
            page_current=1;
            page_size=PAGE_SIZE_CATEGORY_POPULAR_LIST;
           biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.popular_list = data_list;
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
router.get('/product_list/:category/:page_current',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav_bar = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    helper.product_list = [];
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
                if(page.tbl_id){
                    helper.mobile=page;
                }
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
            sort={title:1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                helper.product_list = data_list;
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
//9_product_detail
////9_detail
router.get('/product_detail/:title_url',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav_bar = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    helper.product = biz9.get_new_item(DT_PRODUCT,0);
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
                if(page.tbl_id){
                    helper.mobile=page;
                }
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
             biz9.get_product(db,helper.title_url,function(error,data) {
                helper.product=data;
                call();
            });
            }else{
                call();
            }
        },
        function(call){
            sort={type:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_CATEGORY_LIST;
            biz9.get_categoryz(db,DT_PRODUCT,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.category_list = data_list;
                call();
            });
        },
		function(call){
			helper.product_visible_option_list = biz9.get_product_visible_option_list();
			call();
		},
        function(call){
            if(helper.product.title_url){
                biz9.update_item_view_count(db,DT_PRODUCT,helper.product.tbl_id,helper.customer_id,function(error,data) {
                    call();
                });
            }else{
                call();
            }
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
