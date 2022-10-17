var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
    res.end();
});
//9_blog_post_detail//9_detail
router.get('/get_blog_post/:title_url',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
				call();
			});
		},
		function(call){
			biz9.get_blog_post(db,helper.title_url,function(error,data) {
				helper.item=data;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_blog_post_category
router.get('/get_blog_post_category_list',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
				call();
			});
		},
		function(call){
			sql = {type:'blog_post'};
			sort={title:1};
			biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
				helper.blog_post_category_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
router.get('/get_blog_post_list/:category',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
				call();
			});
		},
		function(call){
			sql={category:helper.category};
			sort={date_create:-1};
			page_current=1;
			page_size=50;
			biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
				helper.blog_post_list = data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_blog_post_detail//9_detail
router.get('/get_blog_post/:title_url',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
				call();
			});
		},
		function(call){
			biz9.get_blog_post(db,helper.title_url,function(error,data) {
				helper.item=data;
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
