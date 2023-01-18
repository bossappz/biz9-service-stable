var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
	res.send({'biz9-service':'ping'});
	res.end();
});
router.get('/get_blank',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(DT_BLANK,0);
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
				call();
			});
		},
		function(call){
			title_url='blank';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.blank=page;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
router.get('/login_check', function(req, res, next) {
	var helper = biz9.get_helper(req);
	helper.g_app_title=APP_TITLE;
	helper.user = biz9.get_new_item(DT_USER,0);
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
				call();
			});
		},
		function(call){
			sql_obj={email:helper.email,password:helper.password};
			biz9.get_sql(db,DT_USER, sql_obj,{}, function(error,data_list) {
				if(data_list.length>0){
					helper.user = data_list[0];
				}else{
					helper.validation_message = 'In Correct Login';
				}
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
///9_sql
router.get('/sql',function(req, res) {
	var helper = biz9.get_helper(req, biz9.get_helper(req));
	helper.render='index';
	helper.page_title = APP_TITLE +': Home';
	helper.item = biz9.get_new_item(DT_BLANK,0);
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
				call();
			});
		},
		function(call){
			helper.item=biz9.get_test_item(DT_BLANK,0);
			biz9.update_item(db,DT_BLANK,helper.item,function(error,data) {
				helper.item=data;
				biz9.o('UPDATE_ITEM',helper.item);
				call();
			});
		},
		function(call){
			sql = {};
			sort={};
			biz9.get_sql(db,DT_BLANK,sql,sort,function(error,data_list) {
				helper.blank_list=data_list;
				biz9.o('GET_SQL',data_list);
				call();
			});
		},
		function(call){
			sql = {};
			sort={date_create:-1};
			page_current=helper.page_current;
			page_size=12;
			biz9.get_sql_paging(db,DT_PRODUCT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.item_list=data_list;
				helper.total_item_count=total_item_count;
				helper.page_page_count=page_page_count;
				call();
			});
		},
		function(call){
			biz9.get_item(db,DT_BLANK,helper.item.tbl_id,function(data) {
				biz9.o('GET_ITEM',data);
				call();
			});
		},
		function(call){
			biz9.delete_item(db,helper.item.data_type,helper.item.tbl_id,function(error,data) {
				biz9.o('DELETE_ITEM',data);
				call();
			});
		},
	],
		function(err, result){
			res.render(helper.render,{helper:helper});
			res.end();
		});
});
module.exports = router;
