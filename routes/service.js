var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-web':'ping'});
    res.end();
});
//9_service_category
router.get('/get_service_category_list',function(req, res) {
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
//9_service_list
router.get('/get_service_list/:category',function(req, res) {
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
			sort={date_create:1};
			page_current=1;
			page_size=15;
			biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
				helper.service_list = data_list;
				call();
			});
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
//9_service_checkout_send
router.post('/send_service_checkout',function(req, res) {
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
			mail={};
			mail.subject='Product Checkout Success';
			mail.from = EMAIL_FROM;
			mail.to = EMAIL_TO;
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
				helper.error='Thanks! We will respond within 24hrs. Have a wonderful day!';
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
