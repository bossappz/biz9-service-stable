var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
	res.send({'biz9-service':'ping'});
	res.end();
});
router.get('/get_contact',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(G_DT_BLANK,0);
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
			title_url='contact';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.contact=page;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
router.get('/get_about',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(G_DT_BLANK,0);
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
			title_url='about';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.about=page;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
router.get('/get_home',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(G_DT_BLANK,0);
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
			title_url='welcome';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.welcome=page;
				call();
			});
		},
		function(call){
			title_url='slideshow';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.slideshow=page;
				call();
			});
		},
		function(call){
			title_url='comment';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.comment=page;
				call();
			});
		},
		function(call){
		helper.home_feature_list=[];
			if(helper.primary.home_feature_type=='product'){
				sql={};
				sort={date_create:1};
				page_current=1;
				page_size=9;
				biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
					helper.home_feature_list=data_list;
					call();
				});
			}else if(helper.primary.home_feature_type=='service'){
				sql={};
				sort={date_create:1};
				page_current=1;
				page_size=9;
				biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
					helper.home_feature_list=data_list;
					call();
				});
			}
			else{
				call();
			}
		},
		function(call){
			sql = {};
			sort={date_create:-1};
			page_current=1;
			page_size=14;
			biz9.get_sql_paging(db,G_DT_COMMENT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.comment_list=data_list;
				call();
			});
		},
		function(call){
			if(helper.welcome.welcome_type=='gallery'){
				biz9.get_gallery(db,helper.welcome.gallery_type,function(error,data) {
					helper.gallery=data;
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
router.get('/get_blank',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(G_DT_BLANK,0);
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
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_gallery_list
router.get('/get_gallery_list/',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(G_DT_BLANK,0);
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
			sql={};
			sort={date_create:1};
			page_current=1;
			page_size=15;
			biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
				helper.gallery_list = data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_gallery_detail/9_detail
router.get('/get_gallery/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.gallery = biz9.get_new_item(G_DT_GALLERY,0);
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
			biz9.get_gallery(db,helper.title_url,function(error,data) {
				helper.gallery=data;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_team_list
router.get('/get_team_list/',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(G_DT_BLANK,0);
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
			title_url='pages';
			sub_page='team';
			biz9.get_sub_page(db,title_url,sub_page,{},function(error,page){
				helper.team=page;
				call();
			});
		},
		function(call){
			sql = {};
			sort={};
			biz9.get_sql(db,G_DT_TEAM,sql,sort,function(error,data_list) {
				helper.team_list=data_list;
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
	helper.user = biz9.get_new_item(G_DT_USER,0);
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
				call();
			});
		},
		function(call){
			sql_obj={email:helper.email,password:helper.password};
			biz9.get_sql(db,G_DT_USER, sql_obj,{}, function(error,data_list) {
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
//9_document_list
router.get('/get_document_list/:document_type',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(G_DT_DOCUMENT,0);
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
			sql={visible:'true',document_type:helper.document_type};
			sort={title:1};
			page_current=1;
			page_size=15;
			biz9.get_documentz(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
				helper.page_list = data_list;
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
	helper.item = biz9.get_new_item(G_DT_BLANK,0);
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
				call();
			});
		},
		function(call){
			sql = {};
			biz9.test_mongo_connection(function(error,data){
				biz9.o('TEST_MONGO_CONNECTION',data);
				call();
			});
		},
		function(call){
			helper.item=biz9.get_test_item(G_DT_BLANK,0);
			biz9.update_item(db,G_DT_BLANK,helper.item,function(error,data) {
				helper.item=data;
				biz9.o('UPDATE_ITEM',helper.item);
				call();
			});
		},
		function(call){
			sql = {};
			sort={};
			biz9.get_sql(db,G_DT_BLANK,sql,sort,function(error,data_list) {
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
			biz9.get_sql_paging(db,G_DT_PRODUCT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.item_list=data_list;
				helper.total_item_count=total_item_count;
				helper.page_page_count=page_page_count;
				call();
			});
		},
		function(call){
			biz9.get_item(db,G_DT_BLANK,helper.item.tbl_id,function(data) {
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
