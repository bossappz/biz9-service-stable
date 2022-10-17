var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
	res.send({'biz9-web':'ping'});
	res.end();
});
//9_service_all
router.get('/',function(req, res) {
	res.redirect('/service/all/1');
});
//9_edit_home_slideshow_photo_list
router.get('/get_slideshow',function(req, res) {
	var helper = biz9.get_helper(req);
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
			title_url='slideshow';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.parent_tbl_id=page.tbl_id;
				helper.slideshow=page;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_product_category
router.get('/get_product_category/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.product_category = biz9.get_new_item(DT_CATEGORY,0);
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
			if(helper.title_url!=0){
				sql = {type:'product',title_url:helper.title_url};
				sort={};
				biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
					if(data_list.length>0){
						helper.product_category=data_list[0];
						call();
					}
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
//9_blog_post_category
router.get('/get_blog_post_category/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.blog_post_category = biz9.get_new_item(DT_CATEGORY,0);
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
			if(helper.title_url!=0){
				sql = {type:'blog_post',title_url:helper.title_url};
				sort={};
				biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
					if(data_list.length>0){
						helper.blog_post_category=data_list[0];
						call();
					}
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
//9_service_category_detail//9_detail//9_get_service_category
router.get('/get_service_category/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.service_category = biz9.get_new_item(DT_CATEGORY,0);
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
			if(helper.title_url!=0){
				sql = {type:'service',title_url:helper.title_url};
				sort={};
				biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
					if(data_list.length>0){
						helper.service_category=data_list[0];
						call();
					}
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
//9_document_list
router.get('/get_document_list/:document_type',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(DT_DOCUMENT,0);
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
			sql={document_type:helper.document_type};
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
//9_gallery_category_detail//9_detail//9_get_gallery_category
router.get('/get_gallery_category/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.gallery_category = biz9.get_new_item(DT_CATEGORY,0);
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
			if(helper.title_url!=0){
				sql = {type:'gallery',title_url:helper.title_url};
				sort={};
				biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
					if(data_list.length>0){
						helper.gallery_category=data_list[0];
						call();
					}
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
//9_gallery_category_list
router.get('/get_gallery_category_list/',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.gallery_category_list = biz9.get_new_item(DT_CATEGORY,0);
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
			sql = {type:'gallery'};
			sort={title:1};
			biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
				helper.gallery_category_list=data_list;
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
	helper.gallery_list = biz9.get_new_item(DT_GALLERY,0);
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
			sort={title:1};
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
//9_blog_post_category_list
router.get('/get_blog_post_category_list/',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.blog_post_category_list = biz9.get_new_item(DT_CATEGORY,0);
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
//9_product_category_list
router.get('/get_product_category_list/',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.product_category_list = biz9.get_new_item(DT_CATEGORY,0);
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
			sql = {type:'product'};
			sort={title:1};
			biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
				helper.product_category_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_service_category_list
router.get('/get_service_category_list/',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.category_list = biz9.get_new_item(DT_CATEGORY,0);
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
			sql = {type:'service'};
			sort={title:1};
			biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
				helper.service_category_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_product_list
router.get('/get_product_list',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(DT_PRODUCT,0);
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
			sql = {};
			sort={title:1};
			page_current=1;
			page_size=50;
			biz9.get_sql_paging(db,DT_PRODUCT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.product_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_service_list
router.get('/get_service_list',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.service_list = biz9.get_new_item(DT_SERVICE,0);
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
			sql = {};
			sort={title:1};
			page_current=1;
			page_size=50;
			biz9.get_sql_paging(db,DT_SERVICE,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.service_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_edit_home_comment_section
router.get('/get_comment',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.comment = biz9.get_new_item(DT_BLANK,0);
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
			title_url='comment';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.comment=page;
				call();
			});
		},
		function(call){
			sql = {};
			sort={date_create:-1};
			page_current=1;
			page_size=50;
			biz9.get_sql_paging(db,DT_COMMENT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.comment_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_document_detail//9_detail//9_get_document
router.get('/get_document/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.page = biz9.get_new_item(DT_DOCUMENT,0);
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
			if(helper.title_url!=0){
				biz9.get_document(db,helper.title_url,function(error,data) {
					helper.page=data;
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
//9_gallery_detail//9_detail//9_get_gallery
router.get('/get_gallery/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.gallery = biz9.get_new_item(DT_GALLERY,0);
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
			sql = {type:'gallery'};
			sort={title:1};
			biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
				helper.gallery_category_list=data_list;
				call();
			});
		},
		function(call){
			if(helper.title_url!=0){
				biz9.get_gallery(db,helper.title_url,function(error,data) {
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
//9_service_detail//9_detail
router.get('/get_service/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.service = biz9.get_new_item(DT_SERVICE,0);
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
			sql = {type:'service'};
			sort={title:1};
			biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
				helper.service_category_list=data_list;
				call();
			});
		},
		function(call){
			biz9.get_service(db,helper.title_url,function(error,data) {
				helper.service=data;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_product_detail//9_detail
router.get('/get_product/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.product = biz9.get_new_item(DT_PRODUCT,0);
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
			sql = {type:'product'};
			sort={title:1};
			biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
				helper.product_category_list=data_list;
				call();
			});
		},
	    function(call){
			biz9.get_product(db,helper.title_url,function(error,data) {
				helper.product=data;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_page_detail//9_detail_page 9_page_edit 9_get_page
router.get('/get_page/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.page = biz9.get_new_item(DT_BLANK,0);
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
			biz9.get_page(db,title_url,{},function(error,page){
				helper.pages=page;
				call();
			});
		},


		function(call){
			if(helper.title_url!=0){
				title_url='pages';
				sub_title=helper.title_url;
				biz9.get_sub_page(db,title_url,sub_title,{},function(error,page){
					helper.page=page;
					call();
				});
			}else{
				helper.page.data_type='pages';
				call();
			}
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});

//9_get_user
router.get('/get_user/:email',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.user = biz9.get_new_item(DT_USER,0);
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
			sql = {email:helper.email};
			sort={};
			biz9.get_sql(db,DT_USER,sql,sort,function(error,data_list){
				if(data_list.length>0){
					helper.user=data_list[0];
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
//9_about
router.get('/get_about',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.about = biz9.get_new_item(DT_BLANK,0);
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
router.get('/get_comment',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.comment = biz9.get_new_item(DT_BLANK,0);
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
			title_url='comment';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.comment=page;
				call();
			});
		},
		function(call){
			sql = {};
			sort={date_create:-1};
			page_current=1;
			page_size=14;
			biz9.get_sql_paging(db,DT_COMMENT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.comment_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
router.get('/get_welcome',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.welcome = biz9.get_new_item(DT_BLANK,0);
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
			sql = {};
			sort={date_create:-1};
			page_current=1;
			page_size=25;
			biz9.get_sql_paging(db,DT_GALLERY,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_page_count){
				helper.gallery_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
router.post('/update_system', function(req, res, next) {
	var helper = biz9.get_helper(req);
	helper.primary = biz9.get_new_item(DT_ITEM_MAP,0);
	helper.user = biz9.set_item_data(DT_USER,0,req.body);
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
				call();
			});
		},
		function(call){
			biz9.update_item(db,DT_USER,helper.user,function(error,data) {
				helper.user=data;
				call();
			});
		},
		function(call){
			helper.primary.title='primary';
			helper.primary.title_url='primary';
			biz9.update_item(db,helper.primary.data_type,helper.primary,function(error,data) {
				helper.primary=data;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
router.get('/get_blog_post_list',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.blog_post_list = biz9.get_new_item(DT_BLOG_POST,0);
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
	helper.blog_post = biz9.get_new_item(DT_BLOG_POST,0);
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
		function(call){
			biz9.get_blog_post(db,helper.title_url,function(error,data) {
				helper.blog_post=data;
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
	helper.team_list = biz9.get_new_item(DT_TEAM,0);
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
			sql = {};
			sort={title:1};
			biz9.get_sql(db,DT_TEAM,sql,sort,function(error,data_list) {
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
//9_team//9_detail//9_get_team
router.get('/get_team/:title_url',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.team = biz9.get_new_item(DT_TEAM,0);
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
			if(helper.title_url!=0){
				sql = {title_url:helper.title_url};
				sort={};
				biz9.get_sql(db,DT_TEAM,sql,sort,function(error,data_list) {
					if(data_list.length>0){
						helper.team=data_list[0];
						call();
					}
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
//9_photo
router.get('/get_photo/:tbl_id',function(req, res) {
	var helper = biz9.get_helper(req);
	helper.item = biz9.get_new_item(DT_PHOTO,helper.tbl_id);
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
            biz9.get_item(db,DT_PHOTO,helper.tbl_id, function(error,data) {
                helper.item =data;
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
