var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-service':'ping'});
    res.end();
});
//9_home
router.get('/home',function(req, res) {
   /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.card_banner_list = [];
    helper.card_double_list = [];
    helper.card_popular_list = [];
    helper.card_category_list = [];
    helper.card_buy_list = [];
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
        //card_banner
        function(call){
            helper.card_banner_list=[];
            page_current=1;
            page_size=PAGE_SIZE_SLIDE_SHOW_LIST;
            sort={date_create:-1};
            if(helper.mobile.home.card_banner_visible=='true'){
                if(helper.mobile.home.card_banner_order=='category'){
                    sql={category:helper.mobile.home.card_banner_category};
                }else{
                        sql={};
                }
                if(helper.mobile.home.card_banner_data_type==DT_BLOG_POST){
                    biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_banner_data_type==DT_EVENT){
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_banner_data_type==DT_PRODUCT){
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_banner_data_type==DT_SERVICE){
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_banner_data_type==DT_GALLERY){
                    biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_banner_list = data_list;
                        call();
                    });
                }else{
                    call();
                }
            }else{
               call();
            }
        },
        //card_popular
        function(call){
            if(helper.mobile.home.card_popular_visible=='true'){
                sql = {};
                sort={view_count:-1};
                page_current=1;
                page_size=PAGE_SIZE_CATEGORY_POPULAR_LIST;
                if(helper.mobile.home.card_popular_data_type==DT_BLOG_POST){
                    biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_popular_data_type==DT_SERVICE){
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_popular_data_type==DT_EVENT){
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_popular_data_type==DT_PRODUCT){
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_popular_data_type==DT_GALLERY){
                    biz9.get_galleryz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_popular_list = data_list;
                        call();
                    });
                }
                else{
                    call();
                }
            }else{
                call();
            }
        },
        //card_category
        function(call){
            if(helper.mobile.home.card_category_visible=='true'){
                if(!helper.mobile.home.card_category_data_type){
                    helper.mobile.home.card_category_data_type =DT_PRODUCT;
                }
                sql = {};
                sort={view_count:-1};
                page_current=1;
                page_size=PAGE_SIZE_CATEGORY_LIST;
                biz9.get_category_biz_list(db,helper.mobile.home.card_category_data_type,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                        helper.card_category_list = data_list;
                        call();
                    });
            }else{
                call();
            }
        },
        //card_buy
        function(call){
            if(helper.mobile.home.card_buy_visible=='true'){
                if(helper.mobile.home.card_buy_category){
                    sql={category:helper.mobile.home.card_buy_category};
                }else{
                    sql={category:DT_PRODUCT};
                }
                sort={date_create:-1};
                page_current=1;
                page_size=PAGE_SIZE_SLIDE_SHOW_LIST;
                if(helper.mobile.home.card_buy_data_type==DT_SERVICE){
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_buy_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_buy_data_type==DT_EVENT){
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_buy_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_buy_data_type==DT_PRODUCT){
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                        helper.card_buy_list = data_list;
                        call();
                    });
                }
                else{
                    call();
                }
            }else{
                call();
            }
        },
        //card_double
        function(call){
            if(helper.mobile.home.card_double_visible=='true'){
                sql={category:helper.mobile.home.card_double_category};
                sort={date_create:-1};
                page_current=1;
                page_size=PAGE_SIZE_SLIDE_SHOW_LIST;
                if(helper.mobile.home.card_double_data_type==DT_SERVICE){
                    biz9.get_servicez(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_double_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_double_data_type==DT_EVENT){
                    biz9.get_eventz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_double_list = data_list;
                        call();
                    });
                }else if(helper.mobile.home.card_double_data_type==DT_PRODUCT){
                    biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                        helper.card_double_list = data_list;
                        call();
                    });
                }
                else{
                    call();
                }
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
//9_home_edit
router.get('/home_edit',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
      helper.data_type_list = [];
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
            helper.data_type_list.push({title:'Blog Posts',value:DT_BLOG_POST});
            helper.data_type_list.push({title:'Event',value:DT_EVENT});
            helper.data_type_list.push({title:'Gallery',value:DT_GALLERY});
            helper.data_type_list.push({title:'Products',value:DT_PRODUCT});
            helper.data_type_list.push({title:'Services',value:DT_SERVICE});
            call();
        },
       ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_mobile
router.get('/blank',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
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
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
////9_detail
router.get('/page/:title_url',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.page = biz9.get_new_item(DT_BLANK,0);
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
            title_url='mobile';
            sub_page=helper.title_url;
            biz9.get_sub_page(db,title_url,sub_page,{},function(error,page){
                helper.page=page;
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
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            biz9.get_sql(db,DT_BLANK,sql,sort,function(error,data_list) {
                helper.blank_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={date_create:-1};
            page_current=1;
            page_size=12;
            biz9.get_sql_paging(db,DT_PRODUCT,sql,sort,page_current,page_size,function(error,data_list,total_item_count,page_count){
                helper.item_list=data_list;
                helper.total_item_count=total_item_count;
                helper.page_count=page_count;
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_BLANK,helper.item.tbl_id,function(error,data) {
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.item.data_type,helper.item.tbl_id,function(error,data) {
            });
        },
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_setting
router.get('/setting',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav = biz9.get_new_item(DT_BLANK,0);
      helper.data_type_list = [];
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
                if(page){
                helper.mobile=page;
                helper.primary=page.primary;
                helper.left_nav=page.left_nav;
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
       ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});

//9_setting_update
router.post('/setting_update',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav = biz9.get_new_item(DT_BLANK,0);
      helper.data_type_list = [];
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
                if(page){
                helper.mobile=page;
                helper.primary=page.primary;
                helper.left_nav=page.left_nav;
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
            primary_update = biz9.get_new_item(helper.mobile.title_url,helper.primary.tbl_id);
            primary_update.app_title=helper.primary_app_title;
            primary_update.app_color=helper.primary_app_color;
            primary_update.app_theme=helper.primary_app_theme;
            primary_update.button_color=helper.primary_button_color;
            primary_update=biz9.convert_biz_item(primary_update,['app_title','app_color','app_theme','button-color'])
            biz9.update_item(db,helper.mobile.title_url,primary_update,function(error,data) {
                helper.primary_update=data;
                call();
            });
        },
        function(call){
            left_nav_update = biz9.get_new_item(helper.mobile.title_url,helper.left_nav.tbl_id);
            left_nav_update.photofilename=helper.left_nav_photofilename;
            left_nav_update.left_nav_header=helper.left_nav_header;
            left_nav_update.left_nav_sub_note=helper.left_nav_sub_note;
            left_nav_update.left_nav_bar_title=helper.left_nav_bar_title;
            left_nav_update.left_nav_bar_social=helper.left_nav_bar_social;
            left_nav_update.left_nav_copyright=helper.left_nav_copyright;
            left_nav_update=biz9.convert_biz_item(left_nav_update,['left_nav_header','left_nav_sub_note','left_nav_bar_title','left_nav_bar_social','left_nav_copyright'])
            biz9.update_item(db,helper.mobile.title_url,left_nav_update,function(error,data) {
                helper.left_nav_update=data;
                call();
            });
        },
        function(call){
            info_update = biz9.get_new_item(DT_ITEM,helper.info.tbl_id);
            info_update.business_cashapp=helper.business_cashapp;
            info_update.business_stripe_key=helper.business_stripe_key;
            info_update.send_in_blue_name=helper.send_in_blue_name;
   			info_update.send_in_blue_email=helper.send_in_blue_email;
   			info_update.send_in_blue_key=helper.send_in_blue_key;
   			info_update.send_in_blue_order_send_subject=helper.send_in_blue_order_send_subject;
   			info_update.send_in_blue_order_send_template_id=helper.send_in_blue_order_send_template_id;
            info_update.send_in_blue_form_send_subject=helper.send_in_blue_form_send_subject;
   			info_update.send_in_blue_form_send_template_id=helper.send_in_blue_form_send_template_id;
            biz9.update_item(db,DT_ITEM,info_update,function(error,data) {
                helper.info_update=data;
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
