var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-web':'ping'});
    res.end();
});
//9_gallery_category
router.get('/get_gallery_category_list',function(req, res) {
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
			sql = {type:'gallery'};
			sort={title:1};
			biz9.get_sql(db,G_DT_CATEGORY,sql,sort,function(error,data_list) {
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
router.get('/get_gallery_list/:category',function(req, res) {
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
			sql={category:helper.category};
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
//9_gallery_detail//9_detail
router.get('/get_gallery/:title_url',function(req, res) {
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
//9_gallery_checkout_send
router.post('/send_gallery_checkout',function(req, res) {
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
			mail={};
			mail.subject='Gallery Checkout Success';
			mail.from = G_EMAIL_FROM;
			mail.to = G_EMAIL_TO;
			str="";
			str = "First Name: "+helper.first_name+
				" Last Name: "+helper.last_name  +"<br/>"+
				" Company: "+helper.company  +"<br/>"+
				" Country: "+helper.country  +"<br/>"+
				" City: "+helper.city  +"<br/>"+
				" Full Address: "+helper.full_address  +"<br/>";
			mail.body = str;

			call();
		},
		/*
		function(call){
			biz9.send_mail(mail,function(_data) {
				helper.validation_message='Thanks! We will respond within 24hrs. Have a wonderful day!';
				call();
			});
		}
		*/
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
module.exports = router;
