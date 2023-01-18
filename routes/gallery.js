var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-gallery':'ping'});
    res.end();
});
//9_gallery_list
//9_list
router.get('/get_gallery_list/:category:/page_current',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_GALLERY,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            if(!helper.category||helper.category=='all'){
                sql={};
            }else{
                sql={category:helper.category};
            }
            sort={date_create:1};
            page_size=9;
            biz9.get_galleryz(db,sql,sort,helper.page_current,page_size,function(error,data_list,total_count,page_page_count) {
                helper.gallery_list = data_list;
                helper.total_count=total_count;
                helper.page_page_count=page_page_count;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_gallery_detail
////9_detail
router.get('/get_gallery/:title_url',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_GALLERY,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
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

module.exports = router;
