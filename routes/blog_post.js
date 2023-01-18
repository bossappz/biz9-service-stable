var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-service-blog-post':'ping'});
    res.end();
});
//9_blog_post_list
//9_list
router.get('/get_blog_post_list/:category:/page_current',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLOG_POST,0);
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
            biz9.get_blog_postz(db,sql,sort,helper.page_current,page_size,function(error,data_list,total_count,page_page_count) {
                helper.blog_post_list = data_list;
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
//9_blog_post_detail
////9_detail
router.get('/get_blog_post/:title_url',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLOG_POST,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
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
module.exports = router;
