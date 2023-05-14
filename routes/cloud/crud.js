var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
router.post("/delete/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.delete_item(db,helper.data_type,helper.tbl_id,function(error,data) {
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/update/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(helper.data_type,helper.tbl_id,req.body);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.update_item(db,helper.data_type,helper.item,function(error,data) {
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
router.post("/update_biz/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(helper.data_type,helper.tbl_id,req.body);
    async.series([
        function(call){
            biz9.o('my_item_',helper);
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            helper.item=biz9.convert_biz_item(helper.item,helper.biz_list.split(","));
            biz9.o('my_item',helper.item);
            biz9.update_item(db,helper.data_type,helper.item,function(error,data) {
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
router.get("/get/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.data_type,helper.tbl_id, function(error,data) {
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
router.get("/get_product/:title_url", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_product(db,helper.title_url,function(error,data) {
                helper.product=data;
                call();
            });
        },
        function(call){
            if(helper.product.title_url){
                biz9.update_item_view_count(db,DT_PRODUCT,helper.product.tbl_id,helper.customer_id,function(error,data) {
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
router.get("/get_service/:title_url", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_service(db,helper.title_url,function(error,data) {
                helper.service=data;
                call();
            });
        },
        function(call){
            if(helper.service.title_url){
                biz9.update_item_view_count(db,DT_SERVICE,helper.service.tbl_id,helper.customer_id,function(error,data) {
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
router.get("/get_event/:title_url", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_event(db,helper.title_url,function(error,data) {
                helper.event=data;
                call();
            });
        },
        function(call){
            if(helper.event.title_url){
                biz9.update_item_view_count(db,DT_EVENT,helper.event.tbl_id,helper.customer_id,function(error,data) {
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
router.get("/get_blog_post/:title_url", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_event(db,helper.title_url,function(error,data) {
                helper.blog_post=data;
                call();
            });
        },
        function(call){
            if(helper.blog_post.title_url){
                biz9.update_item_view_count(db,DT_BLOG_POST,helper.event.tbl_id,helper.customer_id,function(error,data) {
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
router.get("/get_gallery/:title_url", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_event(db,helper.title_url,function(error,data) {
                helper.gallery=data;
                call();
            });
        },
        function(call){
            if(helper.gallery.title_url){
                biz9.update_item_view_count(db,DT_GALLERY,helper.gallery.tbl_id,helper.customer_id,function(error,data) {
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
module.exports = router;
