var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
    res.end();
});
//9_photo_list
router.get('/photo_list/:data_type/:tbl_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav_bar = biz9.get_new_item(DT_BLANK,0);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
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
                if(page.tbl_id){
                    helper.primary=page.primary;
                    helper.left_nav_bar=page.left_nav_bar;
                }
                call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.info = data_list[0];
                }
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data){
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:helper.tbl_id};
            sort={};
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
router.get('/photo/:data_type/:tbl_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.primary = biz9.get_new_item(DT_BLANK,0);
    helper.left_nav_bar = biz9.get_new_item(DT_BLANK,0);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
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
                if(page.tbl_id){
                    helper.primary=page.primary;
                    helper.left_nav_bar=page.left_nav_bar;
                } call();
            });
        },
        function(call){
            sql = {title_url:'info'};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.info = data_list[0];
                }
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(error,data){
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
//9_copy_
router.post("/copy_item/:data_type/:tbl_id",function(req, res) {
    var helper = biz9.get_helper_user(req);
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
        function(call){
            for(a=0;a<helper.sub_item_list.length;a++){
                helper.sub_item_list[a].is_parent=false;
                helper.sub_item_list[a].parent_tbl_id=helper.item_copy.tbl_id;//top
                helper.top_sub_item_list.push(biz9.set_new_sub_item(DT_ITEM,helper.sub_item_list[a]));
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
        function(call){
            sql = {};
            sort={date_create:1};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.other_list=data_list;
                call();
            });
        },
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
    var helper = biz9.get_helper(req);
    helper.primary = biz9.get_new_item(DT_BLANK,0);
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
