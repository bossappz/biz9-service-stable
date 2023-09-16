var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
	res.send({'biz9-service':'admin'});
	res.end();
});
router.post('/update_system', function(req, res, next) {
	//DEV_BOX='staging';
	//testing--
	/*
	DEV_BOX='testing';
	BIZ_LIST_SIZE_CATEGORY_LIST=9;
	BIZ_LIST_SIZE_ITEM_LIST=10;
	BIZ_LIST_SIZE_PHOTO_LIST=12;
	BIZ_LIST_SIZE_SUB_ITEM_LIST=5;
	*/
	//testing--
	//staging--
	DEV_BOX='staging';
	BIZ_LIST_SIZE_CATEGORY_LIST=2;
	BIZ_LIST_SIZE_ITEM_LIST=2;
	BIZ_LIST_SIZE_PHOTO_LIST=4;
	BIZ_LIST_SIZE_SUB_ITEM_LIST=3;
	//staging--


	//-stripe-start
	//-stripe-end
	BIZ_STRIPE_KEY="sk_test_51MCo2HGRzqmjqRkc7RoZvsnPnDW4tUHpi0n8a73PDUcw7dWJo41nYfjWhTLtGVpeT7uTmxtMB7mhwYf1zwKkWvHO00R9xKHKdz";
	//-stripe-end
	//-default-start
	var helper = biz9.get_helper(req);
	helper.primary = biz9.get_new_item(DT_ITEM_MAP,0);
	helper.user = biz9.set_item_data(DT_USER,0,req.body);
	//-default-end
	helper.photofilename_list=[
"73cce38f-6ae3-4e30-a9dc-8a03939b7c8c.png",
"549d9166-0a89-4614-9d6e-deb39d302882.png",
"008223a1-07d4-468a-aa03-82e9be73e3ed.png",
"afe0e3de-874e-4ddc-908d-608b261c9eaf.png",
"300159b6-c1c2-4cd1-900c-6e2f27f936f6.png",
"e4fe50b7-78aa-49ce-a006-1363a4934192.png",
"885e3beb-da47-428d-8dee-e470376d78f4.png",
"52e6035f-2de1-49d9-b630-14bd03725779.png",
"74e62b43-1d0b-487c-9f58-00d32c67df90.png",
"cf1dd697-d37f-40ae-a77f-9802efc9bbd5.png",
"60236f9b-907c-4ef2-8d52-380a34e180ce.png",
"7b247506-0c0e-44c0-a142-51f5d434087b.png",
"b6c54ea3-11e6-4054-9ada-da57fbce20d4.png",
"5dfe4530-b575-42b6-ba84-d5256fc6d6ca.png",
"03f688a5-c12f-4b78-9f19-cedb4cba7959.png",
"372dfd7f-a229-4a7c-bf7c-d2fc0ec6e77a.png",
"5ee3b526-8ef2-4a88-9c61-4efc4db372e2.png",
"a5cc6013-e8c2-42a6-8fbc-33a0ba57f881.png",
"54801ff0-299e-46aa-93df-1d48e9a0184e.png",
"2f85b103-4b56-4e8a-bf03-e1ea9ad7f347.png",
"ff9f2301-5504-4c8d-89f7-2c58d632a83d.png",
"4c2b337f-7165-4ab4-8815-ca1a8c475659.png",
"a84e005f-f141-4304-93a0-a2347c98af71.png",
"6a79879d-76f5-42de-b17e-fd4ef48c354a.png",
"9f58a937-7fbc-4ca0-b8d0-fb2d8f1cdb82.png",
"63ba8d4d-7d00-41d5-9c85-f83a3efaecef.png",
"9d48d9e6-fcbe-403f-b0d9-4881ab70e13d.png",
"202929a5-c6d4-4bb2-bf57-5b0f330e0852.png",
"3af66336-3479-44f8-838c-bd1c8492b81a.png",
"45ccc53c-25bd-4dc7-904c-10883411a260.png",
"c6b01bd9-e5a8-478e-93dc-3ca41ea9f7b8.png",
"cc2b299b-4fae-45c4-83df-58ba20fb7956.png",
"eb80f2e0-7e27-455e-888e-480b3f49bf39.png"
	];//nba

	helper.photo_text_list=[
"Accept yourself",
"Act justly",
"Aim high",
"Alive & well",
"Amplify hope",
"Baby steps",
"Be awesome",
"Be colorful",
"Be fearless",
"Be honest",
"Be kind",
"Be spontaneous",
"Be still",
"Be yourself",
"Beautiful chaos",
"Breathe deeply",
"Carpe diem",
"Cherish today",
"Chill out",
"Come back",
"Crazy beautiful",
"Dance today",
"Don’t panic",
"Don’t stop",
"Dream big",
"Dream bird",
"Enjoy life",
"Enjoy today",
"Explore magic",
"Fairy dust",
"Fear not",
"Feeling groowy",
"Find balance",
"Follow through",
"For real",
"Forever free",
"Forget this",
"Friends forever",
];



	//helper.photofilename_list=[
	//];
	//default = header, sub_note, paragrap
	//item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
				call();
			});
		},
		function(call){
			helper.user.first_name=biz9.get_id(99999) + "_first_name";
			helper.user.last_name=biz9.get_id(99999) + "_last_name";
			helper.user.customer_id=biz9.get_id(9999);
			helper.user.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			biz9.update_item(db,helper.user.data_type,helper.user,function(error,data) {
				helper.user=data;
				call();
			});
		},
		/*
		function(call){
			biz9.account_validate_password(helper.user.password,function(error,data){
				helper.validation_message=data;
				call();
			});
		},
		function(call){
			biz9.account_validate_email(db,helper.user.data_type,helper.user.tbl_id,helper.user.email,function(error,data){
				helper.validation_message=error;
				call();
			});
		},
		*/
		//item_store_info
		function(call){
			helper.store_info=biz9.get_new_item(DT_ITEM,0);
			helper.store_info.title='Info';
			helper.store_info.title_url=biz9.get_title_url(helper.store_info.title);
			helper.store_info.order='1';
			helper.store_info.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			//-business-start
			helper.store_info.business_name=biz9.get_id()+"_business_name_";
			helper.store_info.business_email=biz9.get_id()+"_business_email@gmail.com";
			helper.store_info.business_phone=biz9.get_id()+"_business_phone";
			helper.store_info.business_country='US';
			helper.store_info.business_address1=biz9.get_id()+"_business_address1";
			helper.store_info.business_address2=biz9.get_id()+"_business_address2";
			helper.store_info.business_city=biz9.get_id()+"_business_city";
			helper.store_info.business_state='FL';
			helper.store_info.business_zip=biz9.get_id()+"_business_zip";
			helper.store_info.business_cashapp=biz9.get_id()+"_business_cashapp";
			//business-end
			//social-start
			helper.store_info.social_website=biz9.get_id()+"_social_website";
			helper.store_info.social_facebook=biz9.get_id()+"_social_facebook";
			helper.store_info.social_instagram=biz9.get_id()+"_social_instagram";
			helper.store_info.social_twitter=biz9.get_id()+"_social_twitter";
			helper.store_info.social_youtube=biz9.get_id()+"_social_youtube";
			//business-end
			//stripe-start
			helper.store_info.business_stripe_key=BIZ_STRIPE_KEY;
			//stripe-end
			biz9.update_item(db,DT_ITEM,helper.store_info,function(error,data) {
				helper.store_info=data;
				call();
			});
		},
		//item_store_paper
		function(call){
			helper.store_paper=biz9.get_new_item(DT_ITEM,0);
			helper.store_paper.title='Paper';
			helper.store_paper.title_url=biz9.get_title_url(helper.store_paper.title);
			helper.store_paper.order='1';
			helper.store_paper.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			biz9.update_item(db,DT_ITEM,helper.store_paper,function(error,data) {
				helper.store_paper=data;
				call();
			});
		},
		//info_store_cms
		function(call){
			helper.store_cms=biz9.get_new_item(DT_ITEM,0);
			helper.store_cms.title='CMS';
			helper.store_cms.title_url=biz9.get_title_url(helper.store_cms.title);
			helper.store_cms.order='1';
			helper.store_cms.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			biz9.update_item(db,DT_ITEM,helper.store_cms,function(error,data) {
				helper.store_cms=data;
				call();
			});
		},
		//item_map_mobile
		function(call){
			helper.mobile=biz9.get_new_item(DT_ITEM_MAP,0);
			helper.mobile.title='Mobile';
			helper.mobile.title_url=biz9.get_title_url(helper.mobile.title);
			helper.mobile.order='1';
			helper.mobile.visible=true;
			helper.mobile.delete_protection=true;
			biz9.update_item(db,DT_ITEM_MAP,helper.mobile,function(error,data) {
				helper.mobile=data;
				call();
			});
		},
		//mobile sub_item
		//-- primary
		//---
		function(call){
			helper.primary=biz9.get_new_item(helper.mobile.title_url,0);
			helper.primary.title='Primary';
			helper.primary.title_url=biz9.get_title_url(helper.primary.title);
			helper.primary.visible='true';
			helper.primary.delete_protection=true;
			helper.primary.order='1';
			helper.primary.parent_tbl_id=helper.mobile.tbl_id;
			helper.primary.parent_data_type=helper.mobile.data_type;
			helper.primary.top_tbl_id=helper.mobile.tbl_id;
			helper.primary.top_data_type=helper.mobile.data_type;
			helper.primary.app_title=biz9.get_id()+"_app_title";
			helper.primary.app_color='gradient-4';
			helper.primary.app_theme='light-mode';
			helper.primary.button_color='bg-highlight';
			helper.primary=biz9.convert_biz_item(helper.primary,['app_title','app_color','button-color'])
			biz9.update_item(db,helper.mobile.title_url,helper.primary,function(error,data) {
				helper.primary=data;
				call();
			});
		},
		//mobile sub_item
		//-- left_nav
		//---
		function(call){
			helper.left_nav=biz9.get_new_item(helper.mobile.title_url,0);
			helper.left_nav.title='Left Nav';
			helper.left_nav.title_url=biz9.get_title_url(helper.left_nav.title);
			helper.left_nav.visible='true';
			helper.left_nav.delete_protection=true;
			helper.left_nav.order='1';
			helper.left_nav.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.left_nav.parent_tbl_id=helper.mobile.tbl_id;
			helper.left_nav.parent_data_type=helper.mobile.data_type;
			helper.left_nav.top_tbl_id=helper.mobile.tbl_id;
			helper.left_nav.top_data_type=helper.mobile.data_type;
			helper.left_nav.left_nav_header=biz9.get_id()+"_header";
			helper.left_nav.left_nav_sub_note=biz9.get_test_sub_note();
			helper.left_nav.left_nav_bar_title="Stay Connected";
			helper.left_nav.left_nav_bar_social="Contact Us";
			helper.left_nav.left_nav_copyright=biz9.get_id()+"_copyright";
			helper.left_nav=biz9.convert_biz_item(helper.left_nav,['left_nav_header','left_nav_sub_note','left_nav_bar_title','left_nav_bar_social','left_nav_copyright'])
			biz9.update_item(db,helper.mobile.title_url,helper.left_nav,function(error,data) {
				helper.left_nav=data;
				call();
			});
		},
		//mobile sub_item
		//-- home
		//---
		function(call){
			helper.home=biz9.get_new_item(DT_ITEM_MAP,0);
			helper.home.title='Home';
			helper.home.title_url=biz9.get_title_url(helper.home.title);
			helper.home.visible='true';
			helper.home.order='1';
			helper.home.delete_protection=true;
			helper.home.card_banner_visible='true';
			helper.home.card_banner_data_type=DT_PRODUCT;
			helper.home.card_banner_order='category';
			helper.home.card_banner_category=DT_PRODUCT;
			helper.home.card_popular_visible='true';
			helper.home.card_popular_data_type=DT_PRODUCT;
			helper.home.card_category_visible='true';
			helper.home.card_category_data_type=DT_PRODUCT;
			helper.home.card_buy_visible='true';
			helper.home.card_buy_data_type=DT_PRODUCT;
			helper.home.card_buy_category=DT_PRODUCT;
			helper.home.card_double_visible='true';
			helper.home.card_double_data_type=DT_PRODUCT;
			helper.home.card_double_category=DT_PRODUCT;
			helper.home.biz_list="card_banner_visible,card_banner_data_type,card_banner_order,card_banner_category,card_popular_visible,card_popular_data_type,card_category_visible,card_category_data_type,  \card_buy_visible,card_buy_data_type,card_double_visible,card_double_data_type,card_double_category"
			biz9.update_item(db,DT_ITEM_MAP,helper.home,function(error,data) {
				helper.home=data;
				call();
			});
		},
		//mobile sub_item
		//-- about
		//---
		function(call){
			helper.about=biz9.get_new_item(DT_ITEM_MAP,0);
			helper.about.title='About';
			helper.about.title_url=biz9.get_title_url(helper.about.title);
			helper.about.visible='true';
			helper.about.order='1';
			helper.about.delete_protection=true;
			helper.about.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.about.header=biz9.get_id()+"_header";
			helper.about.sub_note=biz9.get_test_sub_note();
			helper.about.note=biz9.get_test_note();
			helper.about=biz9.convert_biz_item(helper.about,['header','sub_note'])
			biz9.update_item(db,DT_ITEM_MAP,helper.about,function(error,data) {
				helper.about=data;
				call();
			});
		},
		//mobile sub_item
		//-- contact
		//---
		function(call){
			helper.contact=biz9.get_new_item(DT_ITEM_MAP,0);
			helper.contact.title='Contact';
			helper.contact.title_url=biz9.get_title_url(helper.contact.title);
			helper.contact.visible='true';
			helper.contact.order='1';
			helper.contact.delete_protection=true;
			helper.contact.form_header="Contact Us Form";
			helper.contact.form_sub_note="We would love to be in touch with you!";
			helper.contact.social_header="Additional Contact Information";
			helper.contact.social_sub_note="Follow our social media sites";
			helper.contact=biz9.convert_biz_item(helper.contact,['form_header','form_sub_note','social_header','social_sub_note'])
			biz9.update_item(db,DT_ITEM_MAP,helper.contact,function(error,data) {
				helper.contact=data;
				call();
			});
		},
		//mobile sub_item
		//-- page_list //---
		function(call){
			helper.page_list=biz9.get_new_item(helper.mobile.title_url,0);
			helper.page_list.title='Page List';
			helper.page_list.title_url=biz9.get_title_url(helper.page_list.title);
			helper.page_list.visible='true';
			helper.page_list.order='1';
			helper.page_list.delete_protection=true;
			helper.page_list.top_tbl_id=helper.mobile.tbl_id;
			helper.page_list.top_data_type=helper.mobile.data_type;
			helper.page_list.parent_tbl_id=helper.mobile.tbl_id;
			helper.page_list.parent_data_type=helper.mobile.data_type;
			biz9.update_item(db,helper.mobile.title_url,helper.page_list,function(error,data) {
				helper.page_list=data;
				call();
			});
		},
		//mobile sub_item
		//-- page_list_sub_item_blog
		//---
		function(call){
			helper.blog_post=biz9.get_new_item(helper.mobile.title_url,0);
			helper.blog_post.title='News';
			helper.blog_post.title_url=biz9.get_title_url(helper.blog_post.title);
			helper.blog_post.visible='true';
			helper.blog_post.order='1';
			helper.blog_post.top_tbl_id=helper.mobile.tbl_id;
			helper.blog_post.top_data_type=helper.mobile.data_type;
			helper.blog_post.parent_tbl_id=helper.page_list.tbl_id;
			helper.blog_post.parent_data_type=helper.page_list.data_type;
			helper.blog_post.sub_note="Latest news and highlights";
			helper.blog_post.type=DT_BLOG_POST;
			helper.blog_post.title_type='Blog Post';
			helper.blog_post.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.blog_post=biz9.convert_biz_item(helper.blog_post,['sub_note','type','title_type'])
			biz9.update_item(db,helper.mobile.title_url,helper.blog_post,function(error,data) {
				helper.blog_post=data;
				call();
			});
		},
		//mobile sub_item
		//-- page_list_sub_item_event
		//---
		function(call){
			helper.event=biz9.get_new_item(helper.mobile.title_url,0);
			helper.event.title='Events';
			helper.event.title_url=biz9.get_title_url(helper.event.title);
			helper.event.visible='true';
			helper.event.order='1';
			helper.event.top_tbl_id=helper.mobile.tbl_id;
			helper.event.top_data_type=helper.mobile.data_type;
			helper.event.parent_tbl_id=helper.page_list.tbl_id;
			helper.event.parent_data_type=helper.page_list.data_type;
			helper.event.sub_note="Purchase tickets to upcoming events";
			helper.event.type=DT_EVENT;
			helper.event.title_type='Event';
			helper.event.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.event=biz9.convert_biz_item(helper.event,['sub_note','type','title_type'])
			biz9.update_item(db,helper.mobile.title_url,helper.event,function(error,data) {
				helper.event=data;
				call();
			});
		},
		//mobile sub_item
		//-- page_list_sub_item_gallery
		//---
		function(call){
			helper.gallery=biz9.get_new_item(helper.mobile.title_url,0);
			helper.gallery.title='Galleries';
			helper.gallery.title_url=biz9.get_title_url(helper.gallery.title);
			helper.gallery.visible='true';
			helper.gallery.order='1';
			helper.gallery.top_tbl_id=helper.mobile.tbl_id;
			helper.gallery.top_data_type=helper.mobile.data_type;
			helper.gallery.parent_tbl_id=helper.page_list.tbl_id;
			helper.gallery.parent_data_type=helper.page_list.data_type;
			helper.gallery.header=biz9.get_id()+"_header";
			helper.gallery.sub_note="View recent media from our gallery";
			helper.gallery.type=DT_GALLERY;
			helper.gallery.title_type='Gallery';
			helper.gallery.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.gallery=biz9.convert_biz_item(helper.gallery,['header','sub_note','type','title_type'])
			biz9.update_item(db,helper.mobile.title_url,helper.gallery,function(error,data) {
				helper.gallery=data;
				call();
			});
		},
		//mobile sub_item
		//-- page_list_sub_item_product
		//---
		function(call){
			helper.product=biz9.get_new_item(helper.mobile.title_url,0);
			helper.product.title='Products';
			helper.product.title_url=biz9.get_title_url(helper.product.title);
			helper.product.visible='true';
			helper.product.order='1';
			helper.product.top_tbl_id=helper.mobile.tbl_id;
			helper.product.top_data_type=helper.mobile.data_type;
			helper.product.parent_tbl_id=helper.page_list.tbl_id;
			helper.product.parent_data_type=helper.page_list.data_type;
			helper.product.sub_note="View recent media from our gallery";
			helper.product.type=DT_PRODUCT;
			helper.product.title_type='Product';
			helper.product.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.product=biz9.convert_biz_item(helper.product,['sub_note','title_type'])
			biz9.update_item(db,helper.mobile.title_url,helper.product,function(error,data) {
				helper.product=data;
				call();
			});
		},
		//mobile sub_item
		//-- page_list_sub_item_service
		//---
		function(call){
			helper.service=biz9.get_new_item(helper.mobile.title_url,0);
			helper.service.title='Services';
			helper.service.title_url=biz9.get_title_url(helper.service.title);
			helper.service.visible='true';
			helper.service.order='1';
			helper.service.top_tbl_id=helper.mobile.tbl_id;
			helper.service.top_data_type=helper.mobile.data_type;
			helper.service.parent_tbl_id=helper.page_list.tbl_id;
			helper.service.parent_data_type=helper.page_list.data_type;
			helper.service.sub_note="Listing of professional service we offer";
			helper.service.type=DT_SERVICE;
			helper.service.title_type='Service';
			helper.service.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.service=biz9.convert_biz_item(helper.service,['sub_note','type','title_type'])
			biz9.update_item(db,helper.mobile.title_url,helper.service,function(error,data) {
				helper.service=data;
				call();
			});
		},
		//mobile sub_item
		//-- page_list_sub_item_event_1
		//---
		function(call){
			helper.event=biz9.get_new_item(helper.mobile.title_url,0);
			helper.event.title='Events';
			helper.event.title_url=biz9.get_title_url(helper.service.title);
			helper.event.visible='true';
			helper.event.order='1';
			helper.event.top_tbl_id=helper.mobile.tbl_id;
			helper.event.top_data_type=helper.mobile.data_type;
			helper.event.parent_tbl_id=helper.page_list.tbl_id;
			helper.event.parent_data_type=helper.page_list.data_type;
			helper.event.sub_note="Purchase tickets to upcoming events";
			helper.event.type=DT_EVENT;
			helper.event.title_type='Event';
			helper.event.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.event=biz9.convert_biz_item(helper.event,['sub_note','type','title_type'])
			biz9.update_item(db,helper.mobile.title_url,helper.event,function(error,data) {
				helper.event=data;
				call();
			});
		},
		//mobile sub_item
		//-- page_list_sub_item_team
		//---
		function(call){
			helper.team=biz9.get_new_item(helper.mobile.title_url,0);
			helper.team.title='Team';
			helper.team.title_url=biz9.get_title_url(helper.team.title);
			helper.team.visible='true';
			helper.team.order='1';
			helper.team.top_tbl_id=helper.mobile.tbl_id;
			helper.team.top_data_type=helper.mobile.tbl_id;
			helper.team.parent_tbl_id=helper.page_list.tbl_id;
			helper.team.parent_data_type=helper.page_list.data_type;
			helper.team.sub_note="Meet our executive team";
			helper.team.type=DT_MEMBER;
			helper.team.title_type='Member';
			helper.team.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
			helper.team=biz9.convert_biz_item(helper.team,['sub_note','type','title_type'])
			biz9.update_item(db,helper.mobile.title_url,helper.team,function(error,data) {
				helper.team=data;
				call();
			});
		},
		//member_category
		//-- member_category_list
		//---
		function(call){
			helper.member_category_list=[];
			len =1;
			for(a=0;a<len;a++){
				var member_category=biz9.get_new_item(DT_CATEGORY,0);
				member_category.title='Executive Team';
				member_category.type=DT_MEMBER;
				member_category.title_url=biz9.get_title_url(member_category.title);
				member_category.visible='true';
				member_category.order=a;
				member_category.visible='true';
				member_category.sub_note="The core team which is responsible for providing strategic and operational leadership for the company.";
				member_category.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.member_category_list.push(member_category);
			}
			biz9.update_list(db,helper.member_category_list,function(error,data_list) {
				helper.member_category_list=data_list;
				call();
			});
		},
		//member
		//-- member_list
		//---
		function(call){
			helper.member_list=[];
			len =BIZ_LIST_SIZE_ITEM_LIST;
			for(a=0;a<len;a++){
				var member=biz9.get_new_item(DT_MEMBER,0);
				member.first_name='First Name '+ a;
				member.last_name='Last Name '+ a;
				member.title_url=biz9.get_title_url(member.first_name);
				member.visible='true';
				member.order=a;
				member.position='CEO'
				member.location='City and or State';
				member.bio=biz9.get_test_sub_note();
				member.category=helper.member_category_list[biz9.get_id(helper.member_category_list.length)-1].title;
				member.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.member_list.push(member);
			}
			biz9.update_list(db,helper.member_list,function(error,data_list) {
				helper.member_list=data_list;
				call();
			});
		},
		//blog_post
		//gallery
		//product
		//service
		//blog_post_category
		//-- blog_post_category_list
		//---
		function(call){
			helper.blog_post_category_list=[];
			blog_cat_list=[];
			if(DEV_BOX!='testing'){
			blog_cat_list = [
				{title:'Latest News',sub_note:"See what's happening"},
				{title:'Highlights',sub_note:"Recent showcases"},
			];
			}else{
			for(a=0;a<BIZ_LIST_SIZE_CATEGORY_LIST;a++){
							blog_cat_list.push({title:biz9.get_id()+'_title category',sub_note:biz9.get_id()+'_sub_note'});
				}
			}
			for(a=0;a<blog_cat_list.length;a++){
				var blog_post_category=biz9.get_new_item(DT_CATEGORY,0);
				blog_post_category.title=blog_cat_list[a].title;
				blog_post_category.type=DT_BLOG_POST;
				blog_post_category.title_url=biz9.get_title_url(blog_post_category.title);
				blog_post_category.visible='true';
				blog_post_category.order=a;
				blog_post_category.visible='true';
				blog_post_category.sub_note=blog_cat_list[a].sub_note;
				blog_post_category.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.blog_post_category_list.push(blog_post_category);
			}
			biz9.update_list(db,helper.blog_post_category_list,function(error,data_list) {
				helper.blog_post_category_list=data_list;
				call();
			});
		},
		//blog_post
		//-- blog_post_list
		//---
		function(call){
			helper.blog_post_list=[];
			for(a=0;a<helper.blog_post_category_list.length;a++){
				for(b=0;b<BIZ_LIST_SIZE_ITEM_LIST;b++){
					var blog_post=biz9.get_new_item(DT_BLOG_POST,0);
					blog_post.title='Blog Post Title '+ a + " " + b;
					blog_post.title_url=biz9.get_title_url(blog_post.title);
					blog_post.visible='true';
					blog_post.order=b;
					blog_post.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					blog_post.sub_note=biz9.get_test_sub_note();
					blog_post.author='PR Team';
					blog_post.note=biz9.get_test_note();
					blog_post.category=helper.blog_post_category_list[a].title;
					blog_post.youtube_url='https://youtu.be/lXoLJLBPU-Q';
					blog_post=biz9.convert_biz_item(blog_post,['youtube_url'])
					helper.blog_post_list.push(blog_post);
				}
			}
			biz9.update_list(db,helper.blog_post_list,function(error,data_list) {
				helper.blog_post_list=data_list;
				call();
			});
		},
		//blog_post_photo_list
		//-- blog_post_photo_list
		//---
		function(call){
			helper.blog_post_photo_list=[];
			top_len=helper.blog_post_list.length;
			for(b=0;b<top_len;b++){
				len=2;
				for(a=0;a<len;a++){
					var blog_post_photo=biz9.get_new_item(DT_PHOTO,0);
					blog_post_photo.visible='true';
					blog_post_photo.order=a;
					blog_post_photo.text=helper.photo_text_list[biz9.get_id(helper.photo_text_list.length-1)];
					blog_post =helper.blog_post_list[b];
					blog_post_photo.parent_tbl_id=blog_post.tbl_id;
					blog_post_photo.parent_data_type=blog_post.data_type;
					blog_post_photo.top_tbl_id=blog_post.tbl_id;
					blog_post_photo.top_data_type=blog_post.data_type;
					blog_post_photo.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					helper.blog_post_photo_list.push(blog_post_photo);
				}
			}
			biz9.update_list(db,helper.blog_post_photo_list,function(error,data_list) {
				helper.blog_post_photo_list=data_list;
				call();
			});
		},
		//event_category
		//-- event_category_list
		//---
		function(call){
			helper.event_category_list=[];
			event_cat_list = [];
			if(DEV_BOX!='testing'){
			event_cat_list = [
				{title:'Pop Up Shops',sub_note:"Retail spaces open for a short period of time."},
				{title:'Training Seminars',sub_note:"Learn new professional business and industry practices."},
			];
			}else{
				for(a=0;a<BIZ_LIST_SIZE_CATEGORY_LIST;a++){
						event_cat_list.push({title:biz9.get_id()+'_title category',sub_note:biz9.get_id()+'_sub_note'});
				}
			}
			for(a=0;a<event_cat_list.length;a++){
				var event_category=biz9.get_new_item(DT_CATEGORY,0);
				event_category.title=event_cat_list[a].title;
				event_category.type=DT_EVENT;
				event_category.title_url=biz9.get_title_url(event_category.title);
				event_category.visible='true';
				event_category.order=a;
				event_category.sub_note=event_cat_list[a].sub_note;
				event_category.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.event_category_list.push(event_category);
			}
			biz9.update_list(db,helper.event_category_list,function(error,data_list) {
				helper.event_category_list=data_list;
				call();
			});
		},
		//event
		//-- event_list
		//---
		function(call){
			helper.event_list=[];
			for(a=0;a<helper.event_category_list.length;a++){
				for(b=0;b<BIZ_LIST_SIZE_ITEM_LIST;b++){
					var event=biz9.get_new_item(DT_EVENT,0);
					event.title='Event Title '+ a + " " + b;
					event.title_url=biz9.get_title_url(event.title);
					event.visible=biz9.get_id(3);
					event.order=b;
					event.sub_note=biz9.get_test_sub_note();
					event.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					event.author='Author '+ biz9.get_id(45444);
					event.website='website '+ biz9.get_id(45444);
					event.meeting_link='meeting_link '+ b;
					event.location='location '+ b;
					//event.start_date=(biz9.get_id(100)+2023)+"-"+biz9.get_id(12)+"-"+biz9.get_id(25);
					event.start_date="2023"+"-"+parseInt(biz9.get_id(12) )+"-"+biz9.get_id(25);
					event.start_time=biz9.get_id(23)+":"+biz9.get_id(58);
					event.start_date_time = event.start_date + " " + event.start_time;
					event.price=parseFloat(250);
					event.old_price=parseFloat(500);
					event.note=biz9.get_test_note();
					event.category=helper.event_category_list[a].title;
					event.youtube_url='https://youtu.be/lXoLJLBPU-Q';
					event=biz9.convert_biz_item(event,['youtube_url'])
					helper.event_list.push(event);
				}
			}
			biz9.update_list(db,helper.event_list,function(error,data_list) {
				helper.event_list=data_list;
				call();
			});
		},
		//event_photo_list
		//-- event_photo_list
		//---
		function(call){
			helper.event_photo_list=[];
			top_len=helper.event_list.length;
			for(b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_PHOTO_LIST;
				for(a=0;a<len;a++){
					var event_photo=biz9.get_new_item(DT_PHOTO,0);
					event_photo.visible='true';
					event_photo.order=a;
					event_photo.text=helper.photo_text_list[biz9.get_id(helper.photo_text_list.length-1)];
					event =helper.event_list[b];
					event_photo.parent_tbl_id=event.tbl_id;
					event_photo.parent_data_type=event.data_type;
					event_photo.top_tbl_id=event.tbl_id;
					event_photo.top_data_type=event.data_type;
					event_photo.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					helper.event_photo_list.push(event_photo);
				}
			}
			biz9.update_list(db,helper.event_photo_list,function(error,data_list) {
				helper.event_photo_list=data_list;
				call();
			});
		},

		//event_item_size_list
		//-- event_item_size_list
		//---
		function(call){
			helper.event_item_size_list=[];
			len=helper.event_list.length-1;
			for(a=0;a<len;a++){
				var event_item_size=biz9.get_new_item(DT_ITEM,0);
				event_item_size.title='Sizes';
				event_item_size.title_url=biz9.get_title_url(event_item_size.title);
				event_item_size.visible='true';
				event_item_size.order=a;
				event =helper.event_list[a];
				event_item_size.parent_tbl_id=event.tbl_id;
				event_item_size.parent_data_type=event.data_type;
				event_item_size.top_tbl_id=event.tbl_id;
				event_item_size.top_data_type=event.data_type;
				event_item_size.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.event_item_size_list.push(event_item_size);
			}
			biz9.update_list(db,helper.event_item_size_list,function(error,data_list) {
				helper.event_item_size_list=data_list;
				call();
			});
		},
		//event_item_size_item_list
		//-- event_item_size_item_list
		//---
		function(call){
			helper.event_item_size_item_list=[];
			top_len=helper.event_item_size_list.length;
			for(b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var event_item_size_item=biz9.get_new_item(DT_ITEM,0);
					event_item_size_item.title='Size Title '+a;
					event_item_size_item.title_url=biz9.get_title_url(event_item_size_item.title);
					event_item_size_item.visible='true';
					event_item_size_item.order=a;
					event_item_size =helper.event_item_size_list[b];
					event_item_size_item.parent_tbl_id=event_item_size.tbl_id;
					event_item_size_item.parent_data_type=event_item_size.data_type;
					event_item_size_item.top_tbl_id=event_item_size.top_tbl_id;
					event_item_size_item.top_data_type=event_item_size.top_data_type;
					event_item_size_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					event_item_size_item.price=parseInt(biz9.get_id(9))*10;
					event_item_size_item=biz9.convert_biz_item(event_item_size_item,['price'])
					helper.event_item_size_item_list.push(event_item_size_item);
				}
			}
			biz9.update_list(db,helper.event_item_size_item_list,function(error,data_list) {
				helper.event_item_size_item_list=data_list;
				call();
			});
		},
		//event_item_color_list
		//-- event_item_color_list
		//---
		function(call){
			helper.event_item_color_list=[];
			len=helper.event_list.length-1;
			for(var a=0;a<len;a++){
				var event_item_color=biz9.get_new_item(DT_ITEM,0);
				event_item_color.title='Colors';
				event_item_color.title_url=biz9.get_title_url(event_item_color.title);
				event_item_color.visible='true';
				event_item_color.order=a;
				var event =helper.event_list[a];
				event_item_color.parent_tbl_id=event.tbl_id;
				event_item_color.parent_data_type=event.data_type;
				event_item_color.top_tbl_id=event.tbl_id;
				event_item_color.top_data_type=event.data_type;
				event_item_color.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];

				helper.event_item_color_list.push(event_item_color);
			}
			biz9.update_list(db,helper.event_item_color_list,function(error,data_list) {
				helper.event_item_color_list=data_list;
				call();
			});
		},
		//event_item_color_item_list
		//-- event_item_color_item_list
		//---
		function(call){
			helper.event_item_color_item_list=[];
			top_len=helper.event_item_color_list.length;
			for(var b=0;b<top_len;b++){
				var len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(var a=0;a<len;a++){
					var event_item_color_item=biz9.get_new_item(DT_ITEM,0);
					event_item_color_item.title='Color Title '+a;
					event_item_color_item.title_url=biz9.get_title_url(event_item_color_item.title);
					event_item_color_item.visible='true';
					event_item_color_item.order=a;
					var event_item_color =helper.event_item_color_list[b];
					event_item_color_item.parent_tbl_id=event_item_color.tbl_id;
					event_item_color_item.parent_data_type=event_item_color.data_type;
					event_item_color_item.top_tbl_id=event_item_color.top_tbl_id;
					event_item_color_item.top_data_type=event_item_color.top_data_type;
					event_item_color_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					event_item_color_item.price=parseInt(biz9.get_id(9))*10;
					event_item_color_item=biz9.convert_biz_item(event_item_color_item,['price'])
					helper.event_item_color_item_list.push(event_item_color_item);
				}
			}
			biz9.update_list(db,helper.event_item_color_item_list,function(error,data_list) {
				helper.event_item_color_item_list=data_list;
				call();
			});
		},
		//event_item_brand_list
		//-- event_item_brand_list
		//---
		function(call){
			helper.event_item_brand_list=[];
			len=helper.event_list.length-1;
			for(a=0;a<len;a++){
				var event_item_brand=biz9.get_new_item(DT_ITEM,0);
				event_item_brand.title='Brands';
				event_item_brand.title_url=biz9.get_title_url(event_item_brand.title);
				event_item_brand.visible='true';
				event_item_brand.order=a;
				var event =helper.event_list[a];
				event_item_brand.parent_tbl_id=event.tbl_id;
				event_item_brand.parent_data_type=event.data_type;
				event_item_brand.top_tbl_id=event.tbl_id;
				event_item_brand.top_data_type=event.data_type;
				event_item_brand.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.event_item_brand_list.push(event_item_brand);
			}
			biz9.update_list(db,helper.event_item_brand_list,function(error,data_list) {
				helper.event_item_brand_list=data_list;
				call();
			});
		},
		//event_item_brand_item_list
		//-- event_item_brand_item_list
		//---
		function(call){
			helper.event_item_brand_item_list=[];
			top_len=helper.event_item_brand_list.length;
			for(var b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var event_item_brand_item=biz9.get_new_item(DT_ITEM,0);
					event_item_brand_item.title='Brand Title '+a;
					event_item_brand_item.title_url=biz9.get_title_url(event_item_brand_item.title);
					event_item_brand_item.visible='true';
					event_item_brand_item.order=a;
					var event_item_brand =helper.event_item_brand_list[b];
					event_item_brand_item.parent_tbl_id=event_item_brand.tbl_id;
					event_item_brand_item.parent_data_type=event_item_brand.data_type;
					event_item_brand_item.top_tbl_id=event_item_brand.top_tbl_id;
					event_item_brand_item.top_data_type=event_item_brand.top_data_type;
					event_item_brand_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					event_item_brand_item.price=parseInt(biz9.get_id(9))*10;
					event_item_brand_item=biz9.convert_biz_item(event_item_brand_item,['price'])
					helper.event_item_brand_item_list.push(event_item_brand_item);
				}
			}
			biz9.update_list(db,helper.event_item_brand_item_list,function(error,data_list) {
				helper.event_item_brand_item_list=data_list;
				call();
			});
		},
		//event_item_shipping_list
		//-- event_item_shipping_list
		//---
		function(call){
			helper.event_item_shipping_list=[];
			len=helper.event_list.length-1;
			for(a=0;a<len;a++){
				var event_item_shipping=biz9.get_new_item(DT_ITEM,0);
				event_item_shipping.title='Shipping';
				event_item_shipping.title_url=biz9.get_title_url(event_item_shipping.title);
				event_item_shipping.visible='true';
				event_item_shipping.order=a;
				event =helper.event_list[a];
				event_item_shipping.parent_tbl_id=event.tbl_id;
				event_item_shipping.parent_data_type=event.data_type;
				event_item_shipping.top_tbl_id=event.tbl_id;
				event_item_shipping.top_data_type=event.data_type;
				event_item_shipping.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.event_item_shipping_list.push(event_item_shipping);
			}
			biz9.update_list(db,helper.event_item_shipping_list,function(error,data_list) {
				helper.event_item_shipping_list=data_list;
				call();
			});
		},
		//event_item_shipping_item_list
		//-- event_item_shipping_item_list
		//---
		function(call){
			helper.event_item_shipping_item_list=[];
			top_len=helper.event_item_shipping_list.length;
			for(b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var event_item_shipping_item=biz9.get_new_item(DT_ITEM,0);
					event_item_shipping_item.title='Shipping Title '+a;
					event_item_shipping_item.title_url=biz9.get_title_url(event_item_shipping_item.title);
					event_item_shipping_item.visible='true';
					event_item_shipping_item.order=a;
					event_item_shipping =helper.event_item_shipping_list[b];
					event_item_shipping_item.parent_tbl_id=event_item_shipping.tbl_id;
					event_item_shipping_item.parent_data_type=event_item_shipping.data_type;
					event_item_shipping_item.top_tbl_id=event_item_shipping.top_tbl_id;
					event_item_shipping_item.top_data_type=event_item_shipping.top_data_type;
					event_item_shipping_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					event_item_shipping_item.price=parseInt(biz9.get_id(9))*10;
					event_item_shipping_item=biz9.convert_biz_item(event_item_shipping_item,['price'])
					helper.event_item_shipping_item_list.push(event_item_shipping_item);
				}
			}
			biz9.update_list(db,helper.event_item_shipping_item_list,function(error,data_list) {
				helper.event_item_shipping_item_list=data_list;
				call();
			});
		},
		//gallery_category
		//-- gallery_category_list
		//---
		function(call){
			helper.gallery_category_list=[];
			gallery_cat_list=[];
		if(DEV_BOX!='testing'){
			gallery_cat_list = [
				{title:'Highlights',sub_note:"Outstanding moments from a recent experience."},
				{title:'Artwork',sub_note:"Check out our company designs and material."},
			];
			}else{
				for(a=0;a<BIZ_LIST_SIZE_CATEGORY_LIST;a++){
						gallery_cat_list.push({title:biz9.get_id()+'_category_title',sub_note:biz9.get_id()+'_sub_note'});
				}
			}
			for(a=0;a<gallery_cat_list.length;a++){
				var gallery_category=biz9.get_new_item(DT_CATEGORY,0);
				gallery_category.title=gallery_cat_list[a].title;
				gallery_category.type=DT_GALLERY;
				gallery_category.title_url=biz9.get_title_url(gallery_category.title);
				gallery_category.visible='true';
				gallery_category.order=a;
				gallery_category.sub_note=gallery_cat_list[a].sub_note;
				gallery_category.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.gallery_category_list.push(gallery_category);
			}
			biz9.update_list(db,helper.gallery_category_list,function(error,data_list) {
				helper.gallery_category_list=data_list;
				call();
			});
		},
		//gallery
		//-- gallery_list
		//---
		function(call){
			helper.gallery_list=[];
			for(a=0;a<helper.gallery_category_list.length;a++){
				for(b=0;b<BIZ_LIST_SIZE_ITEM_LIST;b++){
					var gallery=biz9.get_new_item(DT_GALLERY,0);
					gallery.title='Gallery Title '+ a + " " + b;
					gallery.title_url=biz9.get_title_url(gallery.title);
					gallery.visible='true';
					gallery.order=b;
					gallery.sub_note=gallery_cat_list[a].sub_note;
					gallery.note=biz9.get_test_note();
					gallery.youtube_url='https://youtu.be/lXoLJLBPU-Q';
					gallery.category=helper.gallery_category_list[a].title;
					gallery.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					gallery=biz9.convert_biz_item(gallery,['youtube_url'])
					helper.gallery_list.push(gallery);
				}
			}
			biz9.update_list(db,helper.gallery_list,function(error,data_list) {
				helper.gallery_list=data_list;
				call();
			});
		},
		//gallery_photo_list
		//-- gallery_photo_list
		//---
		function(call){
			helper.gallery_photo_list=[];
			top_len=helper.gallery_list.length;
			for(b=0;b<top_len;b++){
				len=2
				for(a=0;a<len;a++){
					var gallery_photo=biz9.get_new_item(DT_PHOTO,0);
					gallery_photo.visible='true';
					gallery_photo.order=a;
					gallery_photo.text=helper.photo_text_list[biz9.get_id(helper.photo_text_list.length-1)];
					gallery =helper.gallery_list[b];
					gallery_photo.parent_tbl_id=gallery.tbl_id;
					gallery_photo.parent_data_type=gallery.data_type;
					gallery_photo.top_tbl_id=gallery.tbl_id;
					gallery_photo.top_data_type=gallery.data_type;
					gallery_photo.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					//gallery_photo=biz9.convert_biz_item(gallery_photo,['text'])
					helper.gallery_photo_list.push(gallery_photo);
				}
			}
			biz9.update_list(db,helper.gallery_photo_list,function(error,data_list) {
				helper.gallery_photo_list=data_list;
				call();
			});
		},
		//video_category
		//-- video_category_list
		//---
		/*
		function(call){
			helper.video_category_list=[];
			len =BIZ_LIST_SIZE_CATEGORY_LIST;
			for(a=0;a<len;a++){
				var video_category=biz9.get_new_item(DT_CATEGORY,0);
				video_category.title='Video Category Title '+ a;
				video_category.type=DT_VIDEO;
				video_category.title_url=biz9.get_title_url(video_category.title);
				video_category.visible='true';
				video_category.order=a;
				video_category.sub_note=biz9.get_test_sub_note();
				video_category.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.video_category_list.push(video_category);
			}
			biz9.update_list(db,helper.video_category_list,function(error,data_list) {
				helper.video_category_list=data_list;
				call(); });
		},
		//video
		//-- video_list
		//---
		function(call){
			helper.video_list=[];
			len =BIZ_LIST_SIZE_ITEM_LIST;
			for(a=0;a<len;a++){
				var video=biz9.get_new_item(DT_VIDEO,0);
				video.title='Video Title '+ a;
				video.title_url=biz9.get_title_url(video.title);
				video.visible='true';
				video.order=a;
				video.sub_note=biz9.get_test_sub_note();
				video.note=biz9.get_test_note();
				video.category=helper.video_category_list[biz9.get_id(2)-1].title;
				video.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.video_list.push(video);
			}
			biz9.update_list(db,helper.video_list,function(error,data_list) {
				helper.video_list=data;
				call();
			});
		},
		*/
		//product_category
		//-- product_category_list
		//---
		function(call){
			helper.product_category_list=[];
			product_cat_list=[];
		if(DEV_BOX!='testing'){
			product_cat_list = [
				{title:'T-shirts',sub_note:"short-sleeved or sleeveless undershirt."},
				{title:'Hoodies',sub_note:"Hooded sweatshirt and or jacket."},
			];
			}else{
				for(a=0;a<BIZ_LIST_SIZE_CATEGORY_LIST;a++){
						product_cat_list.push({title:biz9.get_id()+'_category_title',sub_note:biz9.get_id()+'_sub_note'});
				}
			}
			for(a=0;a<product_cat_list.length;a++){
				var product_category=biz9.get_new_item(DT_CATEGORY,0);
				product_category.title=product_cat_list[a].title;
				product_category.type=DT_PRODUCT;
				product_category.title_url=biz9.get_title_url(product_category.title);
				product_category.visible='true';
				product_category.order=a;
				product_category.sub_note=product_cat_list[a].sub_note;
				product_category.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.product_category_list.push(product_category);
			}
			biz9.update_list(db,helper.product_category_list,function(error,data_list) {
				helper.product_category_list=data_list;
				call();
			});
		},
		//product
		//-- product_list
		//---
		function(call){
			helper.product_list=[];
			for(a=0;a<helper.product_category_list.length;a++){
				for(b=0;b<BIZ_LIST_SIZE_ITEM_LIST;b++){
					var product=biz9.get_new_item(DT_PRODUCT,0);
					product.title='Product Title '+ a + " " + b;
					product.title_url=biz9.get_title_url(product.title);
					product.visible=biz9.get_id(5);
					product.order=b;
					product.sub_note=biz9.get_test_sub_note();
					product.price=parseFloat(250);
					product.old_price=parseFloat(500);
					product.note=biz9.get_test_note();
					product.category=helper.product_category_list[a].title;
					product.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					product.youtube_url='https://youtu.be/lXoLJLBPU-Q';
					product=biz9.convert_biz_item(product,['youtube_url'])
					helper.product_list.push(product);
				}
			}
			biz9.update_list(db,helper.product_list,function(error,data_list) {
				helper.product_list=data_list;
				call();
			});
		},
		//product_photo_list
		//-- product_photo_list
		//---
		function(call){
			helper.product_photo_list=[];
			top_len=helper.product_list.length;
			for(b=0;b<top_len;b++){
				len=2;
				for(a=0;a<len;a++){
					var product_photo=biz9.get_new_item(DT_PHOTO,0);
					product_photo.visible='true';
					product_photo.order=a;
					product_photo.text=helper.photo_text_list[biz9.get_id(helper.photo_text_list.length-1)];
					var product =helper.product_list[b];
					product_photo.parent_tbl_id=product.tbl_id;
					product_photo.parent_data_type=product.data_type;
					product_photo.top_tbl_id=product.tbl_id;
					product_photo.top_data_type=product.data_type;
					product_photo.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					helper.product_photo_list.push(product_photo);
				}
			}
			biz9.update_list(db,helper.product_photo_list,function(error,data_list) {
				helper.product_photo_list=data_list;
				call();
			});
		},
		//product_item_size_list
		//-- product_item_size_list
		//---
		function(call){
			helper.product_item_size_list=[];
			len=helper.product_list.length-1;
			for(a=0;a<len;a++){
				var product_item_size=biz9.get_new_item(DT_ITEM,0);
				product_item_size.title='Sizes';
				product_item_size.title_url=biz9.get_title_url(product_item_size.title);
				product_item_size.visible='true';
				product_item_size.order=a;
				var product =helper.product_list[a];
				product_item_size.parent_tbl_id=product.tbl_id;
				product_item_size.parent_data_type=product.data_type;
				product_item_size.top_tbl_id=product.tbl_id;
				product_item_size.top_data_type=product.data_type;
				product_item_size.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.product_item_size_list.push(product_item_size);
			}
			biz9.update_list(db,helper.product_item_size_list,function(error,data_list) {
				helper.product_item_size_list=data_list;
				call();
			});
		},
		//product_item_size_item_list
		//-- product_item_size_item_list
		//---
		function(call){
			helper.product_item_size_item_list=[];
			top_len=helper.product_item_size_list.length;
			for(b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var product_item_size_item=biz9.get_new_item(DT_ITEM,0);
					product_item_size_item.title='Size Title '+a;
					product_item_size_item.title_url=biz9.get_title_url(product_item_size_item.title);
					product_item_size_item.visible='true';
					product_item_size_item.order=a;
					product_item_size =helper.product_item_size_list[b];
					product_item_size_item.parent_tbl_id=product_item_size.tbl_id;
					product_item_size_item.parent_data_type=product_item_size.data_type;
					product_item_size_item.top_tbl_id=product_item_size.top_tbl_id;
					product_item_size_item.top_data_type=product_item_size.top_data_type;
					product_item_size_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					product_item_size_item.price=parseInt(biz9.get_id(9))*10;
					product_item_size_item=biz9.convert_biz_item(product_item_size_item,['price'])
					helper.product_item_size_item_list.push(product_item_size_item);
				}
			}
			biz9.update_list(db,helper.product_item_size_item_list,function(error,data_list) {
				helper.product_item_size_item_list=data_list;
				call();
			});
		},
		//product_item_color_list
		//-- product_item_color_list
		//---
		function(call){
			helper.product_item_color_list=[];
			len=helper.product_list.length-1;
			for(var a=0;a<len;a++){
				var product_item_color=biz9.get_new_item(DT_ITEM,0);
				product_item_color.title='Colors';
				product_item_color.title_url=biz9.get_title_url(product_item_color.title);
				product_item_color.visible='true';
				product_item_color.order=a;
				var product =helper.product_list[a];
				product_item_color.parent_tbl_id=product.tbl_id;
				product_item_color.parent_data_type=product.data_type;
				product_item_color.top_tbl_id=product.tbl_id;
				product_item_color.top_data_type=product.data_type;
				product_item_color.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.product_item_color_list.push(product_item_color);
			}
			biz9.update_list(db,helper.product_item_color_list,function(error,data_list) {
				helper.product_item_color_list=data_list;
				call();
			});
		},
		//product_item_color_item_list
		//-- product_item_color_item_list
		//---
		function(call){
			helper.product_item_color_item_list=[];
			top_len=helper.product_item_color_list.length;
			for(var b=0;b<top_len;b++){
				var len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(var a=0;a<len;a++){
					var product_item_color_item=biz9.get_new_item(DT_ITEM,0);
					product_item_color_item.title='Color Title '+a;
					product_item_color_item.title_url=biz9.get_title_url(product_item_color_item.title);
					product_item_color_item.visible='true';
					product_item_color_item.order=a;
					var product_item_color =helper.product_item_color_list[b];
					product_item_color_item.parent_tbl_id=product_item_color.tbl_id;
					product_item_color_item.parent_data_type=product_item_color.data_type;
					product_item_color_item.top_tbl_id=product_item_color.top_tbl_id;
					product_item_color_item.top_data_type=product_item_color.top_data_type;
					product_item_color_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					product_item_color_item.price=parseInt(biz9.get_id(9))*10;
					product_item_color_item=biz9.convert_biz_item(product_item_color_item,['price'])
					helper.product_item_color_item_list.push(product_item_color_item);
				}
			}
			biz9.update_list(db,helper.product_item_color_item_list,function(error,data_list) {
				helper.product_item_color_item_list=data_list;
				call();
			});
		},
		//product_item_brand_list
		//-- product_item_brand_list
		//---
		function(call){
			helper.product_item_brand_list=[];
			len=helper.product_list.length-1;
			for(a=0;a<len;a++){
				var product_item_brand=biz9.get_new_item(DT_ITEM,0);
				product_item_brand.title='Brands';
				product_item_brand.title_url=biz9.get_title_url(product_item_brand.title);
				product_item_brand.visible='true';
				product_item_brand.order=a;
				var product =helper.product_list[a];
				product_item_brand.parent_tbl_id=product.tbl_id;
				product_item_brand.parent_data_type=product.data_type;
				product_item_brand.top_tbl_id=product.tbl_id;
				product_item_brand.top_data_type=product.data_type;
				product_item_brand.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.product_item_brand_list.push(product_item_brand);
			}
			biz9.update_list(db,helper.product_item_brand_list,function(error,data_list) {
				helper.product_item_brand_list=data_list;
				call();
			});
		},
		//product_item_brand_item_list
		//-- product_item_brand_item_list
		//---
		function(call){
			helper.product_item_brand_item_list=[];
			top_len=helper.product_item_brand_list.length;
			for(var b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var product_item_brand_item=biz9.get_new_item(DT_ITEM,0);
					product_item_brand_item.title='Brand Title '+a;
					product_item_brand_item.title_url=biz9.get_title_url(product_item_brand_item.title);
					product_item_brand_item.visible='true';
					product_item_brand_item.order=a;
					var product_item_brand =helper.product_item_brand_list[b];
					product_item_brand_item.parent_tbl_id=product_item_brand.tbl_id;
					product_item_brand_item.parent_data_type=product_item_brand.data_type;
					product_item_brand_item.top_tbl_id=product_item_brand.top_tbl_id;
					product_item_brand_item.top_data_type=product_item_brand.top_data_type;
					product_item_brand_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					product_item_brand_item.price=parseInt(biz9.get_id(9))*10;
					product_item_brand_item=biz9.convert_biz_item(product_item_brand_item,['price'])
					helper.product_item_brand_item_list.push(product_item_brand_item);
				}
			}
			biz9.update_list(db,helper.product_item_brand_item_list,function(error,data_list) {
				helper.product_item_brand_item_list=data_list;
				call();
			});
		},
		//product_item_shipping_list
		//-- product_item_shipping_list
		//---
		function(call){
			helper.product_item_shipping_list=[];
			len=helper.product_list.length-1;
			for(a=0;a<len;a++){
				var product_item_shipping=biz9.get_new_item(DT_ITEM,0);
				product_item_shipping.title='Shipping';
				product_item_shipping.title_url=biz9.get_title_url(product_item_shipping.title);
				product_item_shipping.visible='true';
				product_item_shipping.order=a;
				var product =helper.product_list[a];
				product_item_shipping.parent_tbl_id=product.tbl_id;
				product_item_shipping.parent_data_type=product.data_type;
				product_item_shipping.top_tbl_id=product.tbl_id;
				product_item_shipping.top_data_type=product.data_type;
				product_item_shipping.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.product_item_shipping_list.push(product_item_shipping);
			}
			biz9.update_list(db,helper.product_item_shipping_list,function(error,data_list) {
				helper.product_item_shipping_list=data_list;
				call();
			});
		},
		//product_item_shipping_item_list
		//-- product_item_shipping_item_list
		//---
		function(call){
			helper.product_item_shipping_item_list=[];
			top_len=helper.product_item_shipping_list.length;
			for(b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var product_item_shipping_item=biz9.get_new_item(DT_ITEM,0);
					product_item_shipping_item.title='Shipping Title '+a;
					product_item_shipping_item.title_url=biz9.get_title_url(product_item_shipping_item.title);
					product_item_shipping_item.visible='true';
					product_item_shipping_item.order=a;
					product_item_shipping =helper.product_item_shipping_list[b];
					product_item_shipping_item.parent_tbl_id=product_item_shipping.tbl_id;
					product_item_shipping_item.parent_data_type=product_item_shipping.data_type;
					product_item_shipping_item.top_tbl_id=product_item_shipping.top_tbl_id;
					product_item_shipping_item.top_data_type=product_item_shipping.top_data_type;
					product_item_shipping_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					product_item_shipping_item.price=parseInt(biz9.get_id(9))*10;
					product_item_shipping_item=biz9.convert_biz_item(product_item_shipping_item,['price'])
					helper.product_item_shipping_item_list.push(product_item_shipping_item);
				}
			}
			biz9.update_list(db,helper.product_item_shipping_item_list,function(error,data_list) {
				helper.product_item_shipping_item_list=data_list;
				call();
			});
		},
		//service_category
		//-- service_category_list
		//---
		function(call){
			helper.service_category_list=[];
			service_cat_list=[];
				if(DEV_BOX!='testing'){

			service_cat_list = [
				{title:'Professional',sub_note:"Core quality expert advice."},
				{title:'Educational Trainings',sub_note:"Expert teachings helping others develop skills."},
			];
				}else{
				for(a=0;a<BIZ_LIST_SIZE_CATEGORY_LIST;a++){
						service_cat_list.push({title:biz9.get_id()+'_title category',sub_note:biz9.get_id()+'_sub_note'});
				}
				}

			for(a=0;a<service_cat_list.length;a++){
				var service_category=biz9.get_new_item(DT_CATEGORY,0);
				service_category.title=service_cat_list[a].title;
				service_category.type=DT_SERVICE;
				service_category.title_url=biz9.get_title_url(service_category.title);
				service_category.visible='true';
				service_category.order=a;
				service_category.sub_note=service_cat_list[a].sub_note;
				service_category.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.service_category_list.push(service_category);
			}
			biz9.update_list(db,helper.service_category_list,function(error,data_list) {
				helper.service_category_list=data_list;
				call();
			});
		},
		//service
		//-- service_list
		//---
		function(call){
			helper.service_list=[];
			if(DEV_BOX!='testing'){
			servive_cat_list = [
				{title:'Professional',sub_note:"Core quality expert advice."},
				{title:'Trannings',sub_note:"Expert teaching or developing quality skills."},
			];
			}else{
				for(a=0;a<BIZ_LIST_SIZE_ITEM_LIST;a++){
					service_cat_list.push({title:biz9.get_id()+'_title',sub_note:biz9.get_id()+'_sub_note'});
				}
			}
			for(a=0;a<helper.service_category_list.length;a++){
					for(b=0;b<BIZ_LIST_SIZE_ITEM_LIST;b++){
				var service=biz9.get_new_item(DT_SERVICE,0);
					service.title='Service Title '+ a + " " + b;
					service.title_url=biz9.get_title_url(service.title);
					service.visible=biz9.get_id(3);
					service.order=b;
					service.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					service.sub_note=biz9.get_test_sub_note();
					service.price=parseFloat(250);
					service.old_price=parseFloat(500);
					service.note=biz9.get_test_note();
					service.category=helper.service_category_list[a].title;
					service.youtube_url='https://youtu.be/lXoLJLBPU-Q';
					service=biz9.convert_biz_item(service,['youtube_url'])
					helper.service_list.push(service);
				}
			}
			biz9.update_list(db,helper.service_list,function(error,data_list) {
				helper.service_list=data_list;
				call();
			});
		},
		//service_photo_list
		//-- service_photo_list
		//---
		function(call){
			helper.service_photo_list=[];
			top_len=helper.service_list.length;
			for(b=0;b<top_len;b++){
				len=2;
				for(a=0;a<len;a++){
					var service_photo=biz9.get_new_item(DT_PHOTO,0);
					service_photo.visible='true';
					service_photo.order=a;
					service_photo.text=helper.photo_text_list[biz9.get_id(helper.photo_text_list.length-1)];
					service =helper.service_list[b];
					service_photo.parent_tbl_id=service.tbl_id;
					service_photo.parent_data_type=service.data_type;
					service_photo.top_tbl_id=service.tbl_id;
					service_photo.top_data_type=service.data_type;
					service_photo.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					helper.service_photo_list.push(service_photo);
				}
			}
			biz9.update_list(db,helper.service_photo_list,function(error,data_list) {
				helper.service_photo_list=data_list;
				call();
			});
		},
		//service_item_size_list
		//-- service_item_size_list
		//---
		function(call){
			helper.service_item_size_list=[];
			len=helper.service_list.length-1;
			for(a=0;a<len;a++){
				var service_item_size=biz9.get_new_item(DT_ITEM,0);
				service_item_size.title='Sizes';
				service_item_size.title_url=biz9.get_title_url(service_item_size.title);
				service_item_size.visible='true';
				service_item_size.order=a;
				service =helper.service_list[a];
				service_item_size.parent_tbl_id=service.tbl_id;
				service_item_size.parent_data_type=service.data_type;
				service_item_size.top_tbl_id=service.tbl_id;
				service_item_size.top_data_type=service.data_type;
				service_item_size.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.service_item_size_list.push(service_item_size);
			}
			biz9.update_list(db,helper.service_item_size_list,function(error,data_list) {
				helper.service_item_size_list=data_list;
				call();
			});
		},
		//service_item_size_item_list
		//-- service_item_size_item_list
		//---
		function(call){
			helper.service_item_size_item_list=[];
			top_len=helper.service_item_size_list.length;
			for(b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var service_item_size_item=biz9.get_new_item(DT_ITEM,0);
					service_item_size_item.title='Size Title '+a;
					service_item_size_item.title_url=biz9.get_title_url(service_item_size_item.title);
					service_item_size_item.visible='true';
					service_item_size_item.order=a;
					service_item_size =helper.service_item_size_list[b];
					service_item_size_item.parent_tbl_id=service_item_size.tbl_id;
					service_item_size_item.parent_data_type=service_item_size.data_type;
					service_item_size_item.top_tbl_id=service_item_size.top_tbl_id;
					service_item_size_item.top_data_type=service_item_size.top_data_type;
					service_item_size_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					service_item_size_item.price=parseInt(biz9.get_id(9))*10;;
					service_item_size_item=biz9.convert_biz_item(service_item_size_item,['price'])
					helper.service_item_size_item_list.push(service_item_size_item);
				}
			}
			biz9.update_list(db,helper.service_item_size_item_list,function(error,data_list) {
				helper.service_item_size_item_list=data_list;
				call();
			});
		},
		//service_item_color_list
		//-- service_item_color_list
		//---
		function(call){
			helper.service_item_color_list=[];
			len=helper.service_list.length-1;
			for(var a=0;a<len;a++){
				var service_item_color=biz9.get_new_item(DT_ITEM,0);
				service_item_color.title='Colors';
				service_item_color.title_url=biz9.get_title_url(service_item_color.title);
				service_item_color.visible='true';
				service_item_color.order=a;
				var service =helper.service_list[a];
				service_item_color.parent_tbl_id=service.tbl_id;
				service_item_color.parent_data_type=service.data_type;
				service_item_color.top_tbl_id=service.tbl_id;
				service_item_color.top_data_type=service.data_type;
				service_item_color.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];

				helper.service_item_color_list.push(service_item_color);
			}
			biz9.update_list(db,helper.service_item_color_list,function(error,data_list) {
				helper.service_item_color_list=data_list;
				call();
			});
		},
		//service_item_color_item_list
		//-- service_item_color_item_list
		//---
		function(call){
			helper.service_item_color_item_list=[];
			top_len=helper.service_item_color_list.length;
			for(var b=0;b<top_len;b++){
				var len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(var a=0;a<len;a++){
					var service_item_color_item=biz9.get_new_item(DT_ITEM,0);
					service_item_color_item.title='Color Title '+a;
					service_item_color_item.title_url=biz9.get_title_url(service_item_color_item.title);
					service_item_color_item.visible='true';
					service_item_color_item.order=a;
					var service_item_color =helper.service_item_color_list[b];
					service_item_color_item.parent_tbl_id=service_item_color.tbl_id;
					service_item_color_item.parent_data_type=service_item_color.data_type;
					service_item_color_item.top_tbl_id=service_item_color.top_tbl_id;
					service_item_color_item.top_data_type=service_item_color.top_data_type;
					service_item_color_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					service_item_color_item.price=parseInt(biz9.get_id(9))*10;
					service_item_color_item=biz9.convert_biz_item(service_item_color_item,['price'])
					helper.service_item_color_item_list.push(service_item_color_item);
				}
			}
			biz9.update_list(db,helper.service_item_color_item_list,function(error,data_list) {
				helper.service_item_color_item_list=data_list;
				call();
			});
		},
		//service_item_brand_list
		//-- service_item_brand_list
		//---
		function(call){
			helper.service_item_brand_list=[];
			len=helper.service_list.length-1;
			for(a=0;a<len;a++){
				var service_item_brand=biz9.get_new_item(DT_ITEM,0);
				service_item_brand.title='Brands';
				service_item_brand.title_url=biz9.get_title_url(service_item_brand.title);
				service_item_brand.visible='true';
				service_item_brand.order=a;
				var service =helper.service_list[a];
				service_item_brand.parent_tbl_id=service.tbl_id;
				service_item_brand.parent_data_type=service.data_type;
				service_item_brand.top_tbl_id=service.tbl_id;
				service_item_brand.top_data_type=service.data_type;
				service_item_brand.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.service_item_brand_list.push(service_item_brand);
			}
			biz9.update_list(db,helper.service_item_brand_list,function(error,data_list) {
				helper.service_item_brand_list=data_list;
				call();
			});
		},
		//service_item_brand_item_list
		//-- service_item_brand_item_list
		//---
		function(call){
			helper.service_item_brand_item_list=[];
			top_len=helper.service_item_brand_list.length;
			for(var b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var service_item_brand_item=biz9.get_new_item(DT_ITEM,0);
					service_item_brand_item.title='Brand Title '+a;
					service_item_brand_item.title_url=biz9.get_title_url(service_item_brand_item.title);
					service_item_brand_item.visible='true';
					service_item_brand_item.order=a;
					var service_item_brand =helper.service_item_brand_list[b];
					service_item_brand_item.parent_tbl_id=service_item_brand.tbl_id;
					service_item_brand_item.parent_data_type=service_item_brand.data_type;
					service_item_brand_item.top_tbl_id=service_item_brand.top_tbl_id;
					service_item_brand_item.top_data_type=service_item_brand.top_data_type;
					service_item_brand_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					service_item_brand_item.price=parseInt(biz9.get_id(9))*10;
					service_item_brand_item=biz9.convert_biz_item(service_item_brand_item,['price'])
					helper.service_item_brand_item_list.push(service_item_brand_item);
				}
			}
			biz9.update_list(db,helper.service_item_brand_item_list,function(error,data_list) {
				helper.service_item_brand_item_list=data_list;
				call();
			});
		},

		//service_item_feature_list
		//-- service_item_feature_list
		//---
		function(call){
			helper.service_item_feature_list=[];
			len=helper.service_list.length-1;
			for(a=0;a<len;a++){
				var service_item_feature=biz9.get_new_item(DT_ITEM,0);
				service_item_feature.title='Features';
				service_item_feature.title_url=biz9.get_title_url(service_item_feature.title);
				service_item_feature.visible='true';
				service_item_feature.order=a;
				var service =helper.service_list[a];
				service_item_feature.parent_tbl_id=service.tbl_id;
				service_item_feature.parent_data_type=service.data_type;
				service_item_feature.top_tbl_id=service.tbl_id;
				service_item_feature.top_data_type=service.data_type;
				service_item_feature.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.service_item_feature_list.push(service_item_feature);
			}
			biz9.update_list(db,helper.service_item_feature_list,function(error,data_list) {
				helper.service_item_feature_list=data_list;
				call();
			});
		},
		//service_item_feature_item_list
		//-- service_item_feature_item_list
		//---
		function(call){
			helper.service_item_feature_item_list=[];
			top_len=helper.service_item_feature_list.length;
			for(var b=0;b<top_len;b++){
				len=BIZ_LIST_SIZE_SUB_ITEM_LIST;
				for(a=0;a<len;a++){
					var service_item_feature_item=biz9.get_new_item(DT_ITEM,0);
					service_item_feature_item.title='Feature Title '+a;
					service_item_feature_item.title_url=biz9.get_title_url(service_item_feature_item.title);
					service_item_feature_item.visible='true';
					service_item_feature_item.order=a;
					var service_item_feature =helper.service_item_feature_list[b];
					service_item_feature_item.parent_tbl_id=service_item_feature.tbl_id;
					service_item_feature_item.parent_data_type=service_item_feature.data_type;
					service_item_feature_item.top_tbl_id=service_item_feature.top_tbl_id;
					service_item_feature_item.top_data_type=service_item_feature.top_data_type;
					service_item_feature_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
					service_item_feature_item.price=parseInt(biz9.get_id(9))*10;
					service_item_feature_item=biz9.convert_biz_item(service_item_feature_item,['price'])
					helper.service_item_feature_item_list.push(service_item_feature_item);
				}
			}
			biz9.update_list(db,helper.service_item_feature_item_list,function(error,data_list) {
				helper.service_item_feature_item_list=data_list;
				call();
			});
		},
		//service_item_shipping_list
		//-- service_item_shipping_list
		//---
		/*
		function(call){
			helper.service_item_shipping_list=[];
			len=helper.service_list.length-1;
			for(a=0;a<len;a++){
				var service_item_shipping=biz9.get_new_item(DT_ITEM,0);
				service_item_shipping.title='Shipping';
				service_item_shipping.title_url=biz9.get_title_url(service_item_shipping.title);
				service_item_shipping.visible='true';
				service_item_shipping.order=a;
				service =helper.service_list[a];
				service_item_shipping.parent_tbl_id=service.tbl_id;
				service_item_shipping.parent_data_type=service.data_type;
				service_item_shipping.top_tbl_id=service.tbl_id;
				service_item_shipping.top_data_type=service.data_type;
				service_item_shipping.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				helper.service_item_shipping_list.push(service_item_shipping);
			}
			biz9.update_list(db,helper.service_item_shipping_list,function(error,data_list) {
				helper.service_item_shipping_list=data_list;
				call();
			});
		},
		//service_item_shipping_item_list
		//-- service_item_shipping_item_list
		//---
		function(call){
			helper.service_item_shipping_item_list=[];
			 top_len=helper.service_item_shipping_list.length;
				for(b=0;b<top_len;b++){
				len=5;
				for(a=0;a<len;a++){
			   var service_item_shipping_item=biz9.get_new_item(DT_ITEM,0);
				service_item_shipping_item.title='Shipping Title '+a;
				service_item_shipping_item.title_url=biz9.get_title_url(service_item_shipping_item.title);
				service_item_shipping_item.visible='true';
				service_item_shipping_item.order=a;
				service_item_shipping =helper.service_item_shipping_list[b];
				service_item_shipping_item.parent_tbl_id=service_item_shipping.tbl_id;
				service_item_shipping_item.parent_data_type=service_item_shipping.data_type;
				service_item_shipping_item.top_tbl_id=service_item_shipping.top_tbl_id;
				service_item_shipping_item.top_data_type=service_item_shipping.top_data_type;
				service_item_shipping_item.photofilename=helper.photofilename_list[biz9.get_id(helper.photofilename_list.length-1)];
				service_item_shipping_item.price=biz9.get_id(99)+"."+biz9.get_id(99);
				service_item_shipping_item=biz9.convert_biz_item(service_item_shipping_item,['price'])
				helper.service_item_shipping_item_list.push(service_item_shipping_item);
			}
			}
			biz9.update_list(db,helper.service_item_shipping_item_list,function(error,data_list) {
				helper.service_item_shipping_item_list=data_list;
				call();
			});
		},
		*/
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
module.exports = router;
