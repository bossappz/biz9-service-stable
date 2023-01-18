var express = require('express');
var router = express.Router();
var biz_order=require('./cloud/biz_order')();
router.get('/ping',function(req, res) {
    res.send({'order':'ping'});
    res.end();
});
router.get('/get_cart/:customer_id',function(req, res) {
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
            sql={customer_id:helper.customer_id};
            biz9.get_cart(db,sql,function(error,data){
                helper.cart=data;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/get_order/:order_id',function(req, res) {
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
            biz9.get_order(db,helper.order_id,function(error,data){
                helper.order=data;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/checkout/success/:order_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.order = biz9.get_new_item(DT_ORDER,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
			sql = {id:helper.order_id};
			sort={};
			biz9.get_sql(db,DT_ORDER,sql,sort,function(error,data_list) {
                if(data_list.length>0){
				    helper.order=data_list[0];
                }
				call();
			});
		},
        function(call){
            helper.order.status_id='1';
			biz9.update_item(db,DT_ORDER,helper.order,function(error,data) {
				helper.order=data;
				call();
			});
		},
        function(call){
            //- clear-product_cart
            sql={customer_id:customer.id};
            biz9.delete_sql(db,DT_CART_ITEM,sql,function(error,data_list) {
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
