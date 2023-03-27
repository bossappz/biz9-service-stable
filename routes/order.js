var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'order':'ping'});
    res.end();
});
//- CART PROCESSING - START - //
//9_cart_add
router.post("/cart_add/:item_data_type/:item_tbl_id/:customer_id/:quantity", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.cart_item = biz9.get_new_item(DT_CART_ITEM,0);
    helper.item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.get_item(db,helper.item_data_type,helper.item_tbl_id,function(error,data) {
                helper.item=data;
                call();
            });
        },
        function(call){
            sql = {top_tbl_id:helper.item_tbl_id};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.option_item_list=data_list;
                call();
            });
        },
        function(call){
            helper.select_option_item_list=[];
            if(helper.option_item_1_tbl_id){
                helper.select_option_item_list.push(helper.option_item_1_tbl_id);
            }
            if(helper.option_item_2_tbl_id){
                helper.select_option_item_list.push(helper.option_item_2_tbl_id);
            }
            if(helper.option_item_3_tbl_id){
                helper.select_option_item_list.push(helper.option_item_3_tbl_id);
            }
            if(helper.option_item_4_tbl_id){
                helper.select_option_item_list.push(helper.option_item_4_tbl_id);
            }
            c=1;
            for(a=0;a<helper.select_option_item_list.length;a++){
                for(b=0;b<helper.option_item_list.length;b++){
                    if(helper.select_option_item_list[a] == helper.option_item_list[b].tbl_id){
                        helper.cart_item['item_option_'+c+'_tbl_id'] = helper.option_item_list[b].tbl_id;
                        helper.cart_item['item_option_'+c+'_title'] = helper.option_item_list[b].title;
                        helper.cart_item['item_option_'+c+'_price'] = biz9.remove_money(helper.option_item_list[b].price);
                        c=c+1;
                        break;
                    }
                }
            }
            call();
        },
        function(call){
            helper.cart_item.customer_id=helper.customer_id;
            helper.cart_item.parent_tbl_id=helper.item.tbl_id;
            helper.cart_item.parent_data_type=helper.item.data_type;
            helper.cart_item.quantity=helper.quantity;
            helper.cart_item.price=biz9.remove_money(helper.item.price);
            helper.cart_item.old_price=biz9.remove_money(helper.item.old_price);
            helper.cart_item.title=helper.item.title;
            helper.cart_item.sub_note=helper.item.sub_note;
            helper.cart_item.category=helper.item.category;
            helper.cart_item.title_url=helper.item.title_url;
            helper.cart_item.photofilename=helper.item.photofilename;
            helper.cart_item.cart_note = ' ' ;
            helper.cart_item.option_note = ' ' ;
            if(helper.cart_item.parent_data_type==DT_SERVICE){
                helper.cart_item.start_date=helper.start_date;
                helper.cart_item.start_time=helper.start_time;
                helper.cart_item.cart_note=biz9.get_date_time_str(helper.cart_item.start_date,helper.cart_item.start_time);
            }else if(helper.cart_item.parent_data_type==DT_EVENT){
                helper.cart_item.website=helper.item.website;
                helper.cart_item.meeting_link=helper.item.meeting_link;
                helper.cart_item.location=helper.item.location;
                helper.cart_item.start_date=helper.item.start_date;
                helper.cart_item.start_time=helper.item.start_time;
                helper.cart_item.cart_note=biz9.get_date_time_str(helper.item.start_date,helper.item.start_time);
            }
            biz9.update_item(db,DT_CART_ITEM,helper.cart_item,function(error,data) {
                helper.cart_item=data;
                call();
            });
        },
        function(call){
            sql={customer_id:helper.customer_id};
            biz9.get_cart(db,sql,function(error,data){
                helper.cart=data;
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_cart_update
router.post("/cart_update/:customer_id/:cart_item_tbl_id/:quantity", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(DT_CART_ITEM,helper.cart_item_tbl_id,req.body);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            helper.item.quantity=helper.quantity;
            biz9.update_item(db,helper.item.data_type,helper.item,function(error,data) {
                helper.item=data;
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
//9_cart_remove
router.post("/cart_remove/:customer_id/:cart_item_tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.cart_item = biz9.get_new_item(DT_CART_ITEM,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.delete_item(db,DT_CART_ITEM,helper.cart_item_tbl_id,function(error,data) {
                helper.cart_item=data;
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
//9_cart_detail
router.get('/cart_detail/:customer_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    var helper = biz9.get_helper(req);
    helper.cart = biz9.get_new_item(DT_BLANK,0);
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

//- CART PROCESSING - END - //
//9_cashapp
router.post('/checkout/cashapp/:customer_id',function(req, res) {
    var helper = biz9.get_helper(req);
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
                if(data_list.length>0){
                    helper.info = data_list[0];
                }
                call();
            });
        },
        function(call){
            sql={customer_id:helper.customer_id};
            biz9.get_cart(db,sql,function(error,cart) {
                cart=cart;
                call();
            });
        },
        function(call){
            cart_checkout_order_add(helper,cart,function(error,data) {
                helper.order=data;
                call();
            });
        },
        /*
        function(call){
        //-prodcut_cart_checkout_email_send_confirmation
            sb_key=helper.info.send_in_blue_key?(helper.info.send_in_blue_key):'send in blue key not found',
            sb_template_id = helper.info.send_in_blue_sender_order_con_template_id;
            sb_subject=helper.info.send_in_blue_sender_order_con_sub;
            sb_copyright='Copyright @ '+helper.info.business_name;
            sb_sender={name:helper.info.business_name,email:helper.info.business_email};
            sb_replyTo={name:helper.info.business_name,email:helper.info.business_email};
            to_list=[];
            to_list.push({name:helper.info.send_in_blue_name,email:helper.info.send_in_blue_email});
            to_list.push({name:customer.name,email:customer.email});
            var mail={key:sb_key,template_id:sb_template_id,subject:sb_subject,copyright:sb_copyright,sender:sb_sender,replyTo:sb_replyTo,to_list:to_list};
            var send_in_blue_obj=biz_order.get_product_cart_checkout_confirmation_send_in_blue(customer,shipping,billing,cart,helper.order,mail);
            biz9.o('aaa',send_in_blue_obj);
            biz9.send_order_confirmation(send_in_blue_obj,function(error,data) {
                if(error){
                    biz9.o('product_cashapp_send_in_blue_error',error);
                }
                biz9.o('send_data',data);
                biz9.o('send_error',error);
                helper.validation_message=error;
//call();
            });
        },
        */
],
    function(err, result){
        res.send({helper:helper});
        res.end();
    });
});
//9_stripe 9_card 9_pay_now
router.post('/checkout/stripecard/:customer_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.o('helper',helper);
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            sql={customer_id:helper.customer_id};
            biz9.get_cart(db,sql,function(error,cart) {
                cart=cart;
                call();
            });
        },
        function(call){
            //- process card
            stripe_key=helper.info.stripe_key;
            credit_card={
                number:helper.billing_card_number,
                exp_month:helper.billing_card_month,
                exp_year:helper.billing_card_year,
                cvc:helper.billing_card_cvc
            };
            biz9.get_stripe_card_token(stripe_key,credit_card.number,credit_card.exp_month,credit_card.exp_year,credit_card.cvc,function(err,data) {
                if(err){
                    helper.validation_message=err;
                    call();
                }else{
                    stripe_token=data;
                    call();
                }
            });
        },
        function(call){
            //- process card 2
            if(!helper.validation_message){
                stripe_card_charge={amount:cart.price.cents,description:helper.info.business_name};
                biz9.get_stripe_card_charge(stripe_key,stripe_token,stripe_card_charge.amount,stripe_card_charge.description,function(err,data) {
                    if(err){
                        helper.validation_message=err;
                        call();
                    }else{
                        stripe_charge=data;
                        call();
                    }
                });
            }else{
                call();
            }
        },
        function(call){
            //- update order
            if(!helper.validation_message){
                helper.billing_sub_note= stripe_charge.brand +" " + stripe_charge.last4;
                //helper.order.stripe_id=stripe_charge.id;
                //helper.order.stripe_brand=stripe_charge.brand;
                //helper.order.stripe_last4=stripe_charge.last4;
                //helper.order.billing_sub_note= stripe_charge.brand +" " + stripe_charge.last4;
                //billing.sub_note=order.billing_sub_note;
                call();
            }else{
                call();
            }
        },
        function(call){
            //- update order 2
            if(!helper.validation_message){
                cart_checkout_order_add(helper,cart,function(error,data) {
                    helper.order=data;
                    call();
                });
            }else{
                call();
            }
        },
        /*
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
            var send_in_blue_obj = biz_order.get_product_cart_checkout_confirmation_send_in_blue(customer,shipping,billing,cart,order,mail);
            biz9.send_order_confirmation(send_in_blue_obj,function(error,data) {
                helper.validation_message=error;
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
//9_pay_on_delivery
router.post('/checkout/payondelivery/:customer_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.order = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(error,_db){
                db=_db;
                call();
            });
        },
        function(call){
            sql={customer_id:helper.customer_id};
            biz9.get_cart(db,sql,function(error,cart) {
                cart=cart;
                call();
            });
        },
        function(call){
            cart_checkout_order_add(helper,cart,function(error,data) {
                helper.order=order;
                call();
            });
        }
        /*
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
            biz9.send_order_confirmation(send_in_blue_obj,function(error,data) {
                helper.validation_message=error;
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
//9_stripe
router.post('/checkout/striperedirecturl',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    helper.order = biz9.get_new_item(DT_BLANK,0);
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
            sql={customer_id:helper.customer_id};
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
            biz9.get_stripe_redirect_url(stripe_config,retail_line_items,function(error,data) {
                if(error){
                    validation_message=error;
                    stripe_redirect_url='error';
                }
                helper.stripe_redirect_url=data;
                call();
            });
        },
        function(call){
            //- order
            billing.link=helper.stripe_redirect_url;
            biz_order.gart_checkout_order_add(customer,shipping,billing,cart,function(error,data) {
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
            sql={customer_id:helper.customer_id};
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
            biz9.send_order_confirmation(send_in_blue_obj,function(error,data) {
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
//9_checkout_success//9_success
router.get('/checkout/success/:order_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.order = biz9.get_new_item(DT_ORDER,0);
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
            biz9.get_order(db,helper.order_id,function(error,data) {
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
cart_checkout_order_add=function(checkout_form,cart,callback){
    var error=null;
    order = biz9.get_new_item(DT_ORDER,0);
    async.series([
        function(call){
            //customer
            order.customer_id = checkout_form.customer_id;
            order.customer_email = checkout_form.customer_email;
            //shipping
            order.shipping_first_name = checkout_form.shipping_first_name;
            order.shipping_last_name = checkout_form.shipping_last_name;
            order.shipping_company = checkout_form.shipping_company;
            order.shipping_address = checkout_form.shipping_address;
            order.shipping_city = checkout_form.shipping_city;
            order.shipping_state = checkout_form.shipping_state;
            order.shipping_zip = checkout_form.shipping_zip;
            order.shipping_country = checkout_form.shipping_country;
            order.shipping_phone = checkout_form.shipping_phone;
            //billing
            order.billing_card_number = checkout_form.billing_card_number;
            order.billing_card_month = checkout_form.billing_card_month;
            order.billing_card_cvc = checkout_form.billing_card_cvc;
            order.billing_card_year = checkout_form.billing_card_year;
            order.billing_card_country = checkout_form.billing_card_country;
            order.billing_payment_type = checkout_form.billing_payment_type;
            order.billing_sub_note = checkout_form.billing_sub_note;
            order.billing_note = checkout_form.billing_note;
            order.billing_link = checkout_form.billing_link;
            //cart
            order.sub_total = cart.price.sub_total;
            order.grand_total = cart.price.grand_total;
            order.shipping_total = cart.price.shipping_total;
            order.discount_total = cart.price.discount_total;
            order.quantity=cart.price.quantity;
            order.cents=cart.price.cents;
            order.order_id=String(biz9.get_id(99999));
            order.status_id=0; //<- 0=open 1=shipped 2=cancelled
            biz9.update_item(db,DT_ORDER,order,function(err,data) {
                order=data;
                call();
            });
        },
        function(call){
            //- order itemz
            order_item_list=[];
            for(a=0;a<cart.item_list.length;a++){
                order_item = biz9.get_new_item(DT_ORDER_ITEM,0);
                order_item.order_id=String(order.order_id);
                order_item.order_tbl_id=order.tbl_id;
                order_item.parent_tbl_id=cart.item_list[a].parent_tbl_id;
                order_item.parent_data_type=cart.item_list[a].parent_data_type;
                order_item.price=cart.item_list[a].price;
                order_item.discount=cart.item_list[a].discount;
                order_item.old_price=cart.item_list[a].old_price;
                order_item.title=cart.item_list[a].title;
                order_item.title_url=cart.item_list[a].title_url;
                order_item.category=cart.item_list[a].category;
                order_item.photofilename=cart.item_list[a].photofilename;
                order_item.sub_total=cart.item_list[a].sub_total;
                order_item.grand_total=cart.item_list[a].grand_total;
                order_item.shipping_total=cart.item_list[a].shipping_total;
                order_item.option_note=cart.item_list[a].option_note;
                order_item.cart_note=cart.item_list[a].cart_note;
                order_item.quantity=cart.item_list[a].quantity;
                if(order_item.parent_data_type==DT_EVENT){
                    order_item.cart_note = order_item.cart_note + "<br/>";
                    if(cart.item_list[a].location){
                        order_item.cart_note = order_item.cart_note + "<b>Location:</b> "+cart.item_list[a].location + "<br/>";
                    }
                    if(cart.item_list[a].meeting_link){
                        order_item.cart_note = order_item.cart_note + "<b>Meeting Link:</b> "+cart.item_list[a].meeting_link + "<br/>";
                    }
                }
                order_item_list.push(order_item);
            }
            biz9.update_list(db,order_item_list,function(err,data_list) {
                call();
            });
        },
        function(call){
            sql={customer_id:order.customer_id};
            biz9.delete_sql(db,DT_CART_ITEM,sql,function(err,data_list) {
                call();
            });
        },
        /*
            function(call){
        //- blue item list
                send_in_blue_item_list=[];
                for(a=0;a<cart.item_list.length;a++){
                    send_in_blue_item_list.push({
                        title:cart.item_list[a].title,
                        discount:cart.item_list[a].discount,
                        sub_total:cart.item_list[a].sub_total,
                        shipping_total:cart.item_list[a].shipping_total,
                        grand_total:cart.item_list[a].grand_total,
                        category:cart.item_list[a].category,
                        sub_note:cart.item_list[a].sub_note,
                        option_note:cart.item_list[a].option_note,
                        quantity:cart.item_list[a].quantity,
                        photo_url:cart.item_list[a].photo_obj.square_mid_url,
                    })
                }
                call();
            },
            */
    ],
        function(err, result){
            callback(error,order);
        });
}
//9_list
router.get('/order_list/:page_current',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    helper.order_list = [];
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
            sql={};
            sort={date_create:-1};
            page_current=helper.page_current;
            page_size=PAGE_SIZE_ITEM_LIST;
            biz9.get_orderz(db,sql,sort,page_current,page_size,function(error,data_list,item_count,page_count) {
                helper.order_list = data_list;
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
module.exports = router;
