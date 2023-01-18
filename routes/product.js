var express = require('express');
var router = express.Router();
var biz_order=require('./cloud/biz_order')();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-service':'ping'});
    res.end();
});
//9_product_list
//9_list
router.get('/get_product_list/:category:/page_current',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_PRODUCT,0);
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
            biz9.get_productz(db,sql,sort,helper.page_current,page_size,function(error,data_list,total_count,page_page_count) {
                helper.product_list = data_list;
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
//9_product_detail
////9_detail
router.get('/get_product/:title_url',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_PRODUCT,0);
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
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_product_cart_update
//9_cart_update
router.post("/cart_item/update/", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.product = biz9.get_new_item(DT_PRODUCT,helper.tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_item(db,DT_PRODUCT,helper.item_tbl_id,function(error,data) {
                helper.product=data;
                call();
            });
        },
        function(call){
            helper.cart_item = biz9.get_new_item(DT_CART_ITEM,0);
            helper.cart_item.customer_id=helper.customer_id;
            helper.cart_item.customer_is_guest=helper.customer_is_guest;
            helper.cart_item.item_tbl_id=helper.product.tbl_id;
            helper.cart_item.item_data_type=helper.product.data_type;
            helper.cart_item.item_price=helper.product.price;
            helper.cart_item.item_money_price=biz9.get_money(helper.product.price);
            helper.cart_item.item_title=helper.product.title;
            helper.cart_item.item_quantity=helper.item_quantity;
            helper.cart_item.item_sub_note=helper.product.sub_note;
            helper.cart_item.item_category=helper.product.category;
            helper.cart_item.item_title_url=helper.product.title_url;
            helper.cart_item.item_shipping_title=helper.item_shipping_title;
            helper.cart_item.item_shipping_price=helper.item_shipping_price;
            helper.cart_item.photofilename=helper.product.photofilename;
            biz9.update_item(db,DT_CART_ITEM,helper.cart_item,function(error,data) {
                helper.cart_item=data;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_checkout_cashapp
//9_cashapp
router.post('/checkout/cashapp',function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            //-customer
            var customer=biz_order.set_order_customer(helper);
            //-shipping
            var shipping=biz_order.set_order_shipping(helper);
            //-billing
            var billing=biz_order.set_order_billing(helper);
            call();
        },
        function(call){
            //- cart
            sql={customer_id:customer.id};
            biz9.get_cart(db,sql,function(error,cart) {
                cart=cart;
                call();
            });
        },
        function(call){
            //- order
            biz_order.cart_checkout_order_add(customer,shipping,billing,cart,function(error,data) {
                helper.order=data;
                call();
            });
        },
        function(call){
            //-prodcut_cart_checkout_email_send_confirmation
            var sb_key='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',
                sb_template_id=SEND_IN_BLUE_ORDER_CONFIRMATION_TEMPLATE_ID;
            var sb_subject=SEND_IN_BLUE_ORDER_CONFIRMATION_SUBJECT;
            var sb_copyright='Copyright @ My Company 2023';
            var sb_sender={'Name':'BoSS AppZ',email:'coderz@bossappz.com'};
            var sb_replyTo={'Name':'BoSS AppZ',email:'coderz@bossappz.com'};
            var to_list=[];
            to_list.push({name:SEND_IN_BLUE_ORDER_CONFIRMATION_ADMIN_NAME,email:SEND_IN_BLUE_ORDER_CONFIRMATION_ADMIN_EMAIL});
            to_list.push({name:customer.name,email:customer.email});
            var mail={key:sb_key,template_id:sb_template_id,subject:sb_subject,copyright:sb_copyright,sender:sb_sender,replyTo:sb_replyTo,to_list:to_list};
            var send_in_blue_obj = biz_order.get_product_cart_checkout_confirmation_send_in_blue(customer,shipping,billing,cart,helper.order,mail);
            biz9.send_order_confirmation(send_in_blue_obj,function(err,data) {
                helper.validation_message=error;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_checkout_pay_on_delivery
//9_pay_on_delivery
router.post('/checkout/payondelivery',function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            //-customer
            var customer=biz_order.set_order_customer(helper);
            //-shipping
            var shipping=biz_order.set_order_shipping(helper);
            //-billing
            var billing=biz_order.set_order_billing(helper);
            call();
        },
        function(call){
            //- cart
            sql={customer_id:customer.id};
            biz9.get_cart(db,sql,function(error,cart) {
                cart=cart;
                call();
            });
        },
        function(call){
            //- order
            biz_order.cart_checkout_order_add(customer,shipping,billing,cart,function(error,data) {
                helper.order=order;
                call();
            });
        },
        function(call){
            //-prodcut_cart_checkout_email_send_confirmation
            var sb_key='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',
                sb_template_id=SEND_IN_BLUE_ORDER_CONFIRMATION_TEMPLATE_ID;
            var sb_subject=SEND_IN_BLUE_ORDER_CONFIRMATION_SUBJECT;
            var sb_copyright='Copyright @ My Company 2023';
            var sb_sender={'Name':'BoSS AppZ',email:'coderz@bossappz.com'};
            var sb_replyTo={'Name':'BoSS AppZ',email:'coderz@bossappz.com'};
            var to_list=[];
            to_list.push({name:SEND_IN_BLUE_ORDER_CONFIRMATION_ADMIN_NAME,email:SEND_IN_BLUE_ORDER_CONFIRMATION_ADMIN_EMAIL});
            to_list.push({name:customer.name,email:customer.email});
            var mail={key:sb_key,template_id:sb_template_id,subject:sb_subject,copyright:sb_copyright,sender:sb_sender,replyTo:sb_replyTo,to_list:to_list};
            var send_in_blue_obj = biz_order.get_product_cart_checkout_confirmation_send_in_blue(customer,shipping,billing,cart,helper.order,mail);
            biz9.send_order_confirmation(send_in_blue_obj,function(err,data) {
                helper.validation_message=error;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_checkout_pay_on_stripe_redirect_url
//9_stripe
router.post('/checkout/striperedirecturl',function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            //-customer
            var customer=biz_order.set_order_customer(helper);
            //-shipping
            var shipping=biz_order.set_order_shipping(helper);
            //-billing
            var billing=biz_order.set_order_billing(helper);
            call();
        },
        function(call){
            //- item_cart
            sql={customer_id:customer.id};
            biz9.get_cart(db,sql,function(error,cart) {
                cart=cart;
                call();
            });
        },
        function(call){
            retail_line_items=[];
            for(a=0;a<cart.item_list.length;a++){
                retail_line_items.push({
                    name:cart.item_list[a].item.title,
                    quantity:cart.item_list[a].item.quantity,
                    description:cart.item_list[a].item.sub_note,
                    price:biz9.get_currency(cart.item_list[a].item.price),
                    images:[cart.item_list[a].photo.square_mid_url],
                });
            }
            call();
        },
        function(call){
            stripe_key='sk_test_51MCo2HGRzqmjqRkc7RoZvsnPnDW4tUHpi0n8a73PDUcw7dWJo41nYfjWhTLtGVpeT7uTmxtMB7mhwYf1zwKkWvHO00R9xKHKdz';
            stripe_config={key:stripe_key,success_url:'https://google.com',cancel_url:'https://google.com'};
            biz9.get_stripe_redirect_url(stripe_config,retail_line_items,function(err,data) {
                if(err){
                    validation_message=err;
                    stripe_redirect_url='error';
                }
                helper.stripe_redirect_url=data;
                call();
            });
        },
        function(call){
            //- order
            billing.link=helper.stripe_redirect_url;
            biz_order.cart_checkout_order_add(customer,shipping,billing,cart,function(error,data) {
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
//9_checkout_pay_on_stripe_redirect_url
//9_stripe_redirect
router.post('/checkout/striperedirecturl/success/:order_id',function(req, res) {
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
            //-customer
            var customer=biz_order.set_order_customer(helper.order);
            //-shipping
            var shipping=biz_order.set_order_shipping(helper.order);
            //-billing
            var billing=biz_order.set_order_billing(helper.order);
            call();
        },
        function(call){
            //- item_cart
            sql={customer_id:customer.id};
            biz9.get_cart(db,sql,function(error,cart) {
                cart=cart;
                call();
            });
        },
      function(call){
            //-prodcut_cart_checkout_email_send_confirmation
            var sb_key='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',
                sb_template_id=SEND_IN_BLUE_ORDER_CONFIRMATION_TEMPLATE_ID;
            var sb_subject=SEND_IN_BLUE_ORDER_CONFIRMATION_SUBJECT;
            var sb_copyright='Copyright @ My Company 2023';
            var sb_sender={'Name':'BoSS AppZ',email:'coderz@bossappz.com'};
            var sb_replyTo={'Name':'BoSS AppZ',email:'coderz@bossappz.com'};
            var to_list=[];
            to_list.push({name:SEND_IN_BLUE_ORDER_CONFIRMATION_ADMIN_NAME,email:SEND_IN_BLUE_ORDER_CONFIRMATION_ADMIN_EMAIL});
            to_list.push({name:customer.name,email:customer.email});
            var mail={key:sb_key,template_id:sb_template_id,subject:sb_subject,copyright:sb_copyright,sender:sb_sender,replyTo:sb_replyTo,to_list:to_list};
            var send_in_blue_obj = biz_order.get_product_cart_checkout_confirmation_send_in_blue(customer,shipping,billing,cart,helper.order,mail);
            biz9.send_order_confirmation(send_in_blue_obj,function(err,data) {
                helper.validation_message=error;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_checkout_stripe_card
//9_stripe 9_card
router.post('/checkout/stripecard',function(req, res) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            //-customer
            var customer=biz_order.set_order_customer(helper);
            //-shipping
            var shipping=biz_order.set_order_shipping(helper);
            //-billing
            var billing=biz_order.set_order_billing(helper);
            call();
        },
        function(call){
            //- item_cart
            sql={customer_id:customer.id};
            biz9.get_cart(db,sql,function(error,cart) {
                cart=cart;
                call();
            });
        },
        function(call){
            //- order
            biz_order.cart_checkout_order_add(customer,shipping,billing,cart,function(error,data) {
                helper.order=data;
                call();
            });
        },
        function(call){
            //- process card
            stripe_key='sk_test_51MCo2HGRzqmjqRkc7RoZvsnPnDW4tUHpi0n8a73PDUcw7dWJo41nYfjWhTLtGVpeT7uTmxtMB7mhwYf1zwKkWvHO00R9xKHKdz';
            credit_card={
                number:helper.billing_card_number,
                exp_month:helper.billing_card_month,
                exp_year:helper.billing_card_year,
                cvc:helper.billing_card_cvc
            };
            biz9.get_stripe_card_token(stripe_key,credit_card.number,credit_card.exp_month,credit_card.exp_year,credit_card.cvc,function(err,data) {
                if(err){
                    validation_message=err;
                }
                stripe_token=data;
                call();
            });
        },
        function(call){
            //- process card 2
            stripe_card_charge={amount:cart.price.cents,description:'My Company_'+biz9.get_id(999)};
            biz9.get_stripe_card_charge(stripe_key,stripe_token,stripe_card_charge.amount,stripe_card_charge.description,function(err,data) {
                if(err){
                    helper.validation_message=err;
                }
                stripe_charge=data;
                call();
            });
        },
        function(call){
            //- update order
            if(!helper.validation_message){
                helper.order.stripe_id=stripe_charge.id;
                helper.order.stripe_brand=stripe_charge.brand;
                helper.order.stripe_last4=stripe_charge.last4;
                helper.order.billing_sub_note= stripe_charge.brand +" " + stripe_charge.last4;
                billing.sub_note=order.billing_sub_note;
                call();
            }else{
                call();
            }
        },
        function(call){
            //- update product order 2
            if(!helper.validation_message){
                biz9.update_item(db,DT_ORDER,helper.order,function(err,data) {
                    order=data;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            //-prodcut_cart_checkout_email_send_confirmation
            var sb_key='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',
                sb_template_id=SEND_IN_BLUE_ORDER_CONFIRMATION_TEMPLATE_ID;
            var sb_subject=SEND_IN_BLUE_ORDER_CONFIRMATION_SUBJECT;
            var sb_copyright='Copyright @ My Company 2023';
            var sb_sender={'Name':'BoSS AppZ',email:'coderz@bossappz.com'};
            var sb_replyTo={'Name':'BoSS AppZ',email:'coderz@bossappz.com'};
            var to_list=[];
            to_list.push({name:SEND_IN_BLUE_ORDER_CONFIRMATION_ADMIN_NAME,email:SEND_IN_BLUE_ORDER_CONFIRMATION_ADMIN_EMAIL});
            to_list.push({name:customer.name,email:customer.email});
            var mail={key:sb_key,template_id:sb_template_id,subject:sb_subject,copyright:sb_copyright,sender:sb_sender,replyTo:sb_replyTo,to_list:to_list};
            var send_in_blue_obj = biz_order.get_product_cart_checkout_confirmation_send_in_blue(customer,shipping,billing,cart,helper.order,mail);
            biz9.send_order_confirmation(send_in_blue_obj,function(err,data) {
                helper.validation_message=error;
                call();
            });
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_checkout_success
router.post('/checkout/success/:order_tbl_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_ORDER,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            sql = {order_tbl_id:helper.order_tbl_id};
            sort={};
            biz9.get_sql(db,DT_ORDER,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    helper.order=data_list[0];
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
module.exports = router;
