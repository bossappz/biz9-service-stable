var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
    res.end();
});
//9_photo_list
router.get('/photo_list/:parent_data_type/:parent_tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.parent_item = biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.photo_list = [];
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
            biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id,function(error,data){
                helper.parent_item=data;
                call();
            });
        },
        function(call){
            if(helper.parent_item.parent_tbl_id==helper.parent_item.top_tbl_id){
                helper.top_item=helper.parent_item;
                call();
            }else{
                biz9.get_item(db,helper.parent_item.top_data_type,helper.top_tbl_id,function(error,data) {
                    helper.top_item=data;
                    call();
                });
            }
        },
        function(call){
            sql = {parent_tbl_id:helper.parent_tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,DT_PHOTO,sql,sort,function(error,data_list) {
                helper.photo_list = data_list;
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_item_detail//9_edit
router.get('/photo_detail/:tbl_id/:parent_data_type/:parent_tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.item = biz9.get_new_item(DT_PHOTO,helper.tbl_id);
    helper.parent_item = biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
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
            biz9.get_item(db,DT_PHOTO,helper.tbl_id,function(error,data){
                helper.photo=data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id,function(error,data){
                helper.parent_item=data;
                call();
            });
        },
        function(call){
            if(helper.parent_item.parent_tbl_id==helper.parent_item.top_tbl_id){
                helper.top_item=helper.parent_item;
                call();
            }else{
                biz9.get_item(db,helper.parent_item.top_data_type,helper.top_tbl_id,function(error,data) {
                    helper.top_item=data;
                    call();
                });
            }
        },

    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_copy_
router.post("/copy_item/:data_type/:tbl_id",function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.sub_item_list = [];
    helper.top_sub_item_list = [];
    helper.p1_org_sub_item_list = [];
    helper.p2_org_sub_item_list = [];
    helper.p3_org_sub_item_list = [];
    helper.p4_org_sub_item_list = [];
    helper.p5_org_sub_item_list = [];
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            if(helper.data_type==DT_PROJECT){
                helper.item_copy=biz9.set_new_project(DT_PROJECT,helper.item);
            }else if(helper.data_type==DT_BLOG_POST){
                helper.item_copy=biz9.set_new_blog_post(DT_BLOG_POST,helper.item);
            }else if(helper.data_type==DT_PRODUCT){
                helper.item_copy=biz9.set_new_product(DT_PRODUCT,helper.item);
            }else if(helper.data_type==DT_CATEGORY){
                helper.item_copy=biz9.set_new_category(DT_CATEGORY,helper.item);
            }else if(helper.data_type==DT_SERVICE){
                helper.item_copy=biz9.set_new_service(DT_SERVICE,helper.item);
            }else if(helper.data_type==DT_EVENT){
                helper.item_copy=biz9.set_new_event(DT_EVENT,helper.item);
            }else if(helper.data_type==DT_MEMBER){
                helper.item_copy=biz9.set_new_member(DT_MEMBER,helper.item);
            }
            biz9.update_item(db,helper.data_type,helper.item_copy,function(error,data) {
                helper.item_copy=data;
                call();
            });
        },
        function(call){
            biz9.copy_photo_list(db,helper.tbl_id,helper.item_copy.tbl_id,function(error,data_list) {
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.tbl_id};
            sort={date_create:1};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.sub_item_list = data_list;
                call();
            });
        },
        //a
        function(call){
            for(a=0;a<helper.sub_item_list.length;a++){
                helper.sub_item_list[a].is_parent=false;
                helper.sub_item_list[a].parent_tbl_id=helper.item_copy.tbl_id;//top
                helper.top_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.sub_item_list[a]));
            }
            call();
        },
        //b
        function(call){
            if(helper.top_sub_item_list.length>0){
                biz9.update_list(db,helper.top_sub_item_list,function(error,data_list) {
                    helper.top_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        //c
        function(call){
            sql = {top_tbl_id:helper.tbl_id};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.other_list=data_list;
                call();
            });
        },
        //d
        function(call){
            for(a=0;a<helper.top_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.top_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.top_sub_item_list[a].tbl_id;
                        helper.p1_org_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        //e
        function(call){
            if(helper.p1_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p1_org_sub_item_list,function(error,data_list) {
                    helper.p1_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        //f
        function(call){
            for(a=0;a<helper.p1_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p1_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p1_org_sub_item_list[a].tbl_id;
                        helper.p2_org_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        //g
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p2_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p2_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p2_org_sub_item_list[a].tbl_id;
                        helper.p3_org_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.p3_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p3_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p3_org_sub_item_list[a].tbl_id;
                        helper.p4_org_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        function(call){
            if(helper.p3_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p3_org_sub_item_list=data_list;
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
//9_item_review_update
router.post('/review_update/:item_data_type/:item_tbl_id',function(req, res) {
    var helper = biz9.get_helper_user(req);
    helper.review_obj = biz9.get_new_item(DT_REVIEW,0);
    helper.review = biz9.set_item_data(DT_REVIEW,0,req.body);
    helper.item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
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
            biz9.update_item(db,DT_REVIEW,helper.review,function(error,data) {
                helper.review=data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.item_data_type,helper.item_tbl_id,function(error,data){
                helper.item=data;
                call();
            });
        },
        function(call){
            appz.get_review_obj(db,helper.item_tbl_id,function(error,data){
                review_obj=data;
                call();
            });
        },
        function(call){
            helper.item.review_count=review_obj.review_list.length;
            helper.item.rating_avg=review_obj.rating_avg;
            biz9.update_item(db,helper.item.data_type,helper.item,function(error,data) {
                helper.item=data;
                helper.item.review_obj=review_obj;
                call();
            });
        },
        function(call){
            customer_review=set_review_customer(helper);
            mail_notification=set_review_update_mail_notification(helper.info,customer);
            call();
        },
        function(call){
            get_new_review_update_send_mail_notification(customer_review,mail_notification,function(_send_in_blue_obj){
                send_in_blue_obj=_send_in_blue_obj;
                call();
              });
        },
        function(call){
            biz9.send_mail(SEND_IN_BLUE_KEY,send_in_blue_obj,function(error,data) {
                if(error){
                    helper.validation_message=error;
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
//9_comment //9_review_list
router.get('/review_list/:page_current',function(req, res) {
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
        function(call){
            sql = {};
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_sql_paging(db,DT_REVIEW,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count){
                helper.review_list=data_list;
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
//9_item_review_delete
router.post('/review_delete/:review_tbl_id/:item_data_type/:item_tbl_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.review_obj = biz9.get_new_item(DT_REVIEW,0);
    helper.review = biz9.set_item_data(DT_REVIEW,0,req.body);
    helper.item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.delete_item(db,DT_REVIEW,helper.review_tbl_id,function(error,data) {
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.item_data_type,helper.item_tbl_id,function(error,data){
                helper.item=data;
                call();
            });
        },
        function(call){
            appz.get_review_obj(db,helper.item_tbl_id,function(error,data){
                review_obj=data;
                call();
            });
        },
        function(call){
            helper.item.review_count=review_obj.review_list.length;
            helper.item.rating_avg=review_obj.rating_avg;
            biz9.update_item(db,helper.item.data_type,helper.item,function(error,data) {
                helper.item=data;
                helper.item.review_obj=review_obj;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_sub_project_edit_list sub_project_edit_list
router.get('/sub_item_list/:data_type/:tbl_id/:parent_data_type/:parent_tbl_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.parent_item=biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.top_item=biz9.get_new_item(DT_BLANK,0);
    helper.item=biz9.get_new_item(DT_ITEM,0);
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
            biz9.get_item(db,helper.data_type,helper.tbl_id, function(error,data) {
                helper.parent_item=data;
                call();
            });
        },
        function(call){
            if(helper.parent_item.parent_tbl_id==helper.parent_item.top_tbl_id){
                helper.top_item=helper.parent_item;
                call();
            }else{
                biz9.get_item(db,helper.parent_item.top_data_type,helper.top_tbl_id,function(error,data) {
                    helper.top_item=data;
                    call();
                });
            }
        },
        function(call){
            sql={parent_tbl_id:helper.parent_item.tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.item_list=data_list;
                call();
            });
        },
        function(call){
            helper.page_title=helper.parent_item.title + ' Sub Items';
            call();
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_edit_sub_item
router.get('/sub_item_detail/:data_type/:tbl_id/:parent_data_type/:parent_tbl_id',function(req,res){
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.sub_item=biz9.get_new_item(helper.data_type,helper.tbl_id);
    helper.parent_item=biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.top_item=biz9.get_new_item(DT_BLANK,0);
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
            biz9.get_item(db,helper.parent_data_type,helper.parent_tbl_id,function(error,data) {
                helper.parent_item=data;
                call();
            });
        },
        function(call){
            if(helper.parent_item.parent_tbl_id){
        biz9.get_item(db,helper.parent_item.parent_data_type,helper.parent_item.parent_tbl_id,function(error,data) {
                    helper.top_item=data;
                    call();
                });
            }else{
                helper.top_item=helper.parent_item;
                call();
            }
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                helper.sub_item=data;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});

//9_sub_item_copy
router.post("/copy_sub_item/:parent_data_type/:parent_tbl_id/:sub_tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper(req);
    helper.parent_item = biz9.get_new_item(helper.parent_data_type,helper.parent_tbl_id);
    helper.sub_item = biz9.get_new_item(DT_ITEM,helper.sub_tbl_id);
    helper.sub_item_list = [];
    helper.top_sub_item_list = [];
    helper.p1_org_sub_item_list = [];
    helper.p2_org_sub_item_list = [];
    helper.p3_org_sub_item_list = [];
    helper.p4_org_sub_item_list = [];
    helper.p5_org_sub_item_list = [];
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.parent_item.data_type,helper.parent_item.tbl_id,function(error,data) {
                helper.parent_item = data;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.sub_item.data_type,helper.sub_item.tbl_id,function(error,data) {
                helper.sub_item = data;
                call();
            });
        },
        function(call){
            if(helper.sub_item.parent_tbl_id==helper.parent_item.tbl_id){
                helper.sub_item.parent_tbl_id=helper.sub_item.parent_tbl_id;
            }else{
                helper.sub_item.parent_tbl_id=helper.sub_item.parent_tbl_id;
            }
            helper.sub_item.is_parent=true;
            helper.sub_item_copy =biz9.set_new_sub_item(helper.sub_item.data_type,helper.sub_item);
            biz9.update_item(db,helper.sub_item.data_type,helper.sub_item_copy,function(error,data) {
                helper.sub_item_copy=data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.sub_item.tbl_id};
            sort={};
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.sub_item_list = data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<helper.sub_item_list.length;a++){
                helper.sub_item_list[a].is_parent=false;
                helper.sub_item_list[a].parent_tbl_id=helper.sub_item_copy.tbl_id;//top
                helper.top_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.sub_item_list[a]));
            }
            call();
        },
        function(call){
            if(helper.top_sub_item_list.length>0){
                biz9.update_list(db,helper.top_sub_item_list,function(error,data_list) {
                    helper.top_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        //H
        function(call){
            sql = {};
            sort={};
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.other_list=data_list;
                call();
            });
        },
        //I
        function(call){
            for(a=0;a<helper.top_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.top_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.top_sub_item_list[a].tbl_id;
                        //helper.other_list[b].is_parent=false;
                        helper.p1_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        //J
        function(call){
            if(helper.p1_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p1_org_sub_item_list,function(error,data_list) {
                    helper.p1_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        //K
        function(call){
            for(a=0;a<helper.p1_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p1_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p1_org_sub_item_list[a].tbl_id;
                        helper.other_list[b].is_parent=false;
                        helper.p2_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        //L
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        //M
        function(call){
            for(a=0;a<helper.p2_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p2_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p2_org_sub_item_list[a].tbl_id;
                        //helper.other_list[b].is_parent=false;
                        helper.p3_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        //N
        function(call){
            if(helper.p2_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p2_org_sub_item_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        //O
        function(call){
            for(a=0;a<helper.p3_org_sub_item_list.length;a++){
                for(b=0;b<helper.other_list.length;b++){
                    if(helper.p3_org_sub_item_list[a].org_tbl_id==helper.other_list[b].parent_tbl_id){
                        helper.other_list[b].parent_tbl_id=helper.p3_org_sub_item_list[a].tbl_id;
                        //helper.other_list[b].is_parent=false;
                        helper.p4_org_sub_item_list.push(biz9.set_new_sub_item(helper.sub_item.data_type,helper.other_list[b]));
                    }
                }
            }
            call();
        },
        //P
        function(call){
            if(helper.p3_org_sub_item_list.length>0){
                biz9.update_list(db,helper.p2_org_sub_item_list,function(error,data_list) {
                    helper.p3_org_sub_item_list=data_list;
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
//9_delete_sub_item
router.post("/delete_sub_item/:data_type/:tbl_id",biz9.check_user,function(req, res) {
    var helper = biz9.get_helper(req);
    helper.sub_item = biz9.get_new_item(DT_ITEM,helper.tbl_id);
    helper.del_list=[];
    helper.copy_sub_item_list = [];
    helper.p1_org_sub_item_list = [];
    helper.p2_org_sub_item_list = [];
    helper.p3_org_sub_item_list = [];
    helper.p4_org_sub_item_list = [];
    helper.p5_org_sub_item_list = [];
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.sub_item.data_type,helper.sub_item.tbl_id,function(error,data) {
                helper.sub_item = data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.sub_item.tbl_id};
            sort={date_create:-1};
            biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                helper.del_list = data_list;
                call();
            });
        },
        function(call){
            async.forEachOf(helper.del_list,function(value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p1_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p1_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p2_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p2_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p3_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p3_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                            helper.p4_org_sub_item_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            async.forEachOf(helper.p4_org_sub_item_list, function (value, key, go)
                {
                    sql = {parent_tbl_id:value.tbl_id};
                    sort={date_create:-1};
                    biz9.get_sql(db,helper.sub_item.data_type,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            helper.del_list.push(data_list[a]);
                        }
                        go();
                    });
                },
                function (err) {
                    call();
                })
        },
        function(call){
            biz9.delete_list(db,helper.sub_item.data_type,helper.del_list,function(error,data) {
                helper.del_list=data;
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.sub_item.data_type,helper.tbl_id,function(error,data) {
                helper.sub_item = data;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
set_review_update_mail_notification=function(info,customer){
    mail_notification={};
    mail_notification.subject= SEND_IN_BLUE_ITEM_REVIEW_UPDATE_SEND_SUBJECT;
    mail_notification.template_id = SEND_IN_BLUE_ITEM_REVIEW_UPDATE_TEMPLATE_ID;
    mail_notification.copyright='Copyright @ '+info.business_name;
    mail_notification.sender={name:info.business_name,email:info.business_email};
    mail_notification.replyTo={name:info.business_name,email:info.business_email};
    mail_notification.to_list=[];
    mail_notification.to_list.push({name:customer.name,email:customer.email});
    mail_notification.to_list.push({name:info.business_name,email:info.business_email});
    return mail_notification;
}

set_review_customer=function(item){
    customer = biz9.get_new_item(DT_BLANK,0);
    customer.name=item.customer_name ? (item.customer_name) : "customer";
    customer.comment=item.comment ? (item.comment) : " ";
    customer.rating=item.rating ? (item.rating) : 1;
    customer.id=item.user.customer_id;
    customer.email=item.email ? (item.email) : "email_not_found@gmail.com";
    return customer;
}

get_new_review_update_send_mail_notification=function(customer_review,mail,callback){
    var item_list=[];
    async.series([
        function(call){
            send_in_blue_obj=
                {
                    'templateId':parseInt(mail.template_id),
                    'subject':mail.subject,
                    'sender' : {'email':mail.sender.email,'name':mail.sender.name},
                    'replyTo' : {'email':mail.replyTo.email,'name':mail.replyTo.name},
                    'to':mail.to_list,
                    'params':{
                        "business_name":mail.sender.name,
                        "customer_email":customer.email,
                        "customer_name":customer.name,
                    }
                }
            call();
        }
    ],
        function(err, result){
            callback(send_in_blue_obj);
        });
}


module.exports = router;
