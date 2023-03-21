var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
	res.send({'biz9-event-blog-post':'ping'});
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
    helper.popualr_list =[];
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
            page_size=22;
            biz9.get_category_biz_list(db,DT_EVENT,sort,helper.page_current,page_size,function(error,data_list,total_count,page_page_count) {
                helper.category_list = data_list;
                helper.total_count=total_count;
                helper.page_page_count=page_page_count;
                call();
            });
        },
        function(call){
            sql={};
            sort={view_count:-1};
            page_current=1;
            page_size=9;
            biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
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
router.get('/event_list/:category/:page_current',function(req, res) {
 	/*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
	helper.event_list = [];
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
			if(!helper.category||helper.category=='all'){
				sql={};
			}else{
				sql={category:helper.category};
			}
			sort={date_create:1};
			page_size=19;
			biz9.get_eventz(db,sql,sort,helper.page_current,page_size,function(error,data_list,total_count,page_page_count) {
				helper.event_list = data_list;
				helper.total_count=total_count;
				helper.page_page_count=page_page_count;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_event_detail
////9_detail
router.get('/event_detail/:title_url',function(req, res) {
 	/*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
	helper.event = biz9.get_new_item(DT_EVENT,0);
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
			biz9.get_event(db,helper.title_url,function(error,data) {
				helper.event=data;
				call();
			});
		},
		function(call){
			sort={type:-1};
			page_current=helper.page_current;
			page_size=22;
			biz9.get_categoryz(db,DT_EVENT,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.category_list = data_list;
				call();
			});
		},
		function(call){
			if(helper.event.title_url){
				biz9.update_item_view_count(db,DT_EVENT,helper.event.tbl_id,helper.customer_id,function(error,data) {
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
////9_option 9_event_option
router.get('/event_option/:event_tbl_id/:event_option_tbl_id/',function(req, res) {
 	/*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
   	helper.primary = biz9.get_new_item(DT_BLANK,0);
	helper.event = biz9.get_new_item(DT_EVENT,0);
	helper.event_option = biz9.get_new_item(DT_ITEM,0);
	helper.event_option_item_list =[];
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
			biz9.get_item(db,DT_EVENT,helper.event_tbl_id,function(error,data) {
				helper.event=data;
				call();
			});
		},
		function(call){
			biz9.get_item(db,DT_ITEM,helper.event_option_tbl_id,function(error,data) {
				helper.event_option=data;
				call();
			});
		},
		function(call){
			sql = {parent_tbl_id:helper.event_option_tbl_id};
			sort={};
			biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
				helper.event_option_item_list = data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
////9_option 9_event_option
router.get('/event_option_item/:event_tbl_id/:event_option_tbl_id/:event_option_item_tbl_id',function(req, res) {
 	/*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
	helper.event = biz9.get_new_item(DT_EVENT,0);
	helper.event_option = biz9.get_new_item(DT_ITEM,0);
	helper.event_option_item = biz9.get_new_item(DT_ITEM,0);
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
			biz9.get_item(db,DT_EVENT,helper.event_tbl_id,function(error,data) {
				helper.event=data;
				call();
			});
		},
		function(call){
			biz9.get_item(db,DT_ITEM,helper.event_option_tbl_id,function(error,data) {
				helper.event_option=data;
				call();
			});
		},
		function(call){
			biz9.get_item(db,DT_ITEM,helper.event_option_item_tbl_id,function(error,data) {
				helper.event_option_item=data;
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
