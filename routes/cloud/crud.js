var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    res.send({'t':'tinysmall'});
    res.end();
});
router.get("/get_page/:page_key", function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_page(db,helper.page_key,{},function(error,data) {
                helper.page_key_data = data;
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get("/get_sub_page/:item_map_title_url/:page_key/:page_sub_key", function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_sub_page(db,helper.page_key,helper.page_sub_key,function(error,data) {
                helper.page_sub_key_data = data;
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/delete_item_by_tbl_id/:data_type/:tbl_id", function(req, res) {
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
router.post("/update_item/:data_type/:tbl_id", function(req, res) {
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
router.get("/get_item_by_tbl_id/:data_type/:tbl_id", function(req, res) {
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
router.get("/list_by_data_type/:data_type/", function(req, res) {
    var helper = biz9.get_helper(req);
    var sql = {};
    var sort_by = {};
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_sql(db_name,helper.data_type,sql,sort_by,function(error,data) {
                helper.data=data.data;
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
