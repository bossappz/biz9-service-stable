var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'order':'ping'});
    res.end();
});
//- CART PROCESSING - START - //
//9_cart_add
router.post("/cart_add/:item_data_type/:item_tbl_id/:customer_id/:quantity",function(req, res){
    /*--default_start */
    var helper = biz9.get_helper(req);
    /*--default_end */
    helper.cart_item = biz9.get_new_item(DT_CART_ITEM,0);
    helper.item = biz9.get_new_item(helper.item_data_type,helper.item_tbl_id);
    helper.select_option_item_list=[];
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            sql = {top_data_type:helper.item.data_type};
            sort={};
            biz9.get_sql(db,DT_ITEM,sql,sort,function(error,data_list) {
                helper.option_item_list=data_list;
                call();
            });
        },
        function(call){
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
            call();
        },
        function(call){
            c=1;
            for(a=0;a<helper.select_option_item_list.length;a++){
                for(b=0;b<helper.option_item_list.length;b++){
                    if(helper.select_option_item_list[a] == helper.option_item_list[b].tbl_id){
                        helper.cart_item['item_option_'+c+'_tbl_id'] = helper.option_item_list[b].tbl_id;
                        helper.cart_item['item_option_'+c+'_title'] = helper.option_item_list[b].title;
                        helper.cart_item['item_option_'+c+'_top_data_type'] = helper.option_item_list[b].top_data_type;
                        helper.cart_item['item_option_'+c+'_top_tbl_id'] = helper.option_item_list[b].top_tbl_id;
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
                if(helper.cart_item.cart_note=='Invalid date'){
                    helper.cart_item.cart_note='Invalid date ' + helper.cart_item.start_date+ " " +helper.cart_item.start_time;
                }
            }else if(helper.cart_item.parent_data_type==DT_EVENT){
                helper.cart_item.website=helper.item.website;
                helper.cart_item.meeting_link=helper.item.meeting_link;
                helper.cart_item.location=helper.item.location;
                helper.cart_item.start_date=helper.item.start_date;
                helper.cart_item.start_time=helper.item.start_time;
                var event_str='';
                event_str=biz9.get_date_time_str(helper.item.start_date,helper.item.start_time);
                if(helper.cart_item.website){
                    event_str= event_str + ", "+ helper.cart_item.website;
                }
                if(helper.cart_item.location){
                    event_str= event_str + ", "+ helper.cart_item.location;
                }
                helper.cart_item.cart_note=event_str;
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
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
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
    /*--default_start */
    var helper = biz9.get_helper(req);
    /*--default_end */
    helper.item = biz9.set_item_data(DT_CART_ITEM,helper.cart_item_tbl_id,req.body);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_cart_remove
router.post("/cart_remove/:customer_id/:cart_item_tbl_id", function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    /*--default_end */
    helper.cart_item = biz9.get_new_item(DT_CART_ITEM,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_cart_get
router.get('/cart_get/:customer_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_cart_get
router.get('/cart_summary/:customer_id',function(req, res) {
    /*--default-start */
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.primary= biz9.get_new_item(DT_BLANK,0);
    helper.footer= biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    helper.page_title = APP_TITLE +': Shopping Cart Checkout';
    /*--default-end */
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            title_url='primary';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.primary=page;
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_cart_detail 9_detail
router.get('/cart_detail/:customer_id',function(req, res) {
    /*--default-start */
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.primary= biz9.get_new_item(DT_BLANK,0);
    helper.footer= biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    helper.page_title = APP_TITLE +': Shopping Cart Checkout';
    /*--default-end */
    helper.render='order_cart_detail';
    helper.render_menu='li_product';
    /*--default_end */
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
                call();
            });
        },
        function(call){
            title_url='primary';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.primary=page;
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
            title_url='footer';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.footer=page;
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_cart_checkout
router.get('/cart_checkout/:customer_id',function(req, res) {
    /*--default-start */
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.primary= biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    helper.footer = biz9.get_new_item(DT_BLANK,0);
    helper.page_title = APP_TITLE +': Shopping Cart Checkout';
    /*--default-end */
    helper.render_menu='li_product';
    helper.render='order_checkout';
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            title_url='footer';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.footer=page;
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//- CART PROCESSING - END - //
//9_cashapp
router.post('/checkout/cashapp/:customer_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    var customer=biz9.get_new_item(DT_BLANK,0);
    var shipping=biz9.get_new_item(DT_BLANK,0);
    var billing=biz9.get_new_item(DT_BLANK,0);
    var mail_notification=biz9.get_new_item(DT_BLANK,0);
    var brevo_obj=biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            customer=set_order_customer(helper);
            shipping=set_order_shipping(helper);
            billing=set_order_billing(helper);
            mail_notification=set_order_mail_notification(helper.info,customer);
            call();
        },
        function(call){
            sql={customer_id:helper.customer_id};
            biz9.get_cart(db,sql,function(error,cart) {
                helper.cart=cart;
                call();
            });
        },
        function(call){
            cart_checkout_order_add(helper,cart,function(error,data) {
                order=data;
                call();
            });
        },
        function(call){
            biz9.get_order(db,order.order_id,function(error,data) {
                helper.order=data;
                call();
            });
        },
        function(call){
            get_order_send_mail_notification(customer,shipping,billing,cart,helper.order,mail_notification,function(_brevo_obj){
                brevo_obj=_brevo_obj;
                call();
            });
        },
        function(call){
            biz9.send_brevo_mail(helper.info.brevo_key,brevo_obj,function(error,data) {
                if(error){
                    helper.validation_message=error;
                }
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_zelle
router.post('/checkout/zelle/:customer_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    var customer=biz9.get_new_item(DT_BLANK,0);
    var shipping=biz9.get_new_item(DT_BLANK,0);
    var billing=biz9.get_new_item(DT_BLANK,0);
    var mail_notification=biz9.get_new_item(DT_BLANK,0);
    var brevo_obj=biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            customer=set_order_customer(helper);
            shipping=set_order_shipping(helper);
            billing=set_order_billing(helper);
            mail_notification=set_order_mail_notification(helper.info,customer);
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
            cart_checkout_order_add(helper,cart,function(error,data) {
                helper.order=data;
                call();
            });
        },
        function(call){
            get_order_send_mail_notification(customer,shipping,billing,cart,helper.order,mail_notification,function(_brevo_obj){
                brevo_obj=_brevo_obj;
                call();
            });
        },
        function(call){
            biz9.send_brevo_mail(helper.info.brevo_key,brevo_obj,function(error,data) {
                if(error){
                    helper.validation_message=error;
                }
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/checkout/payondelivery/:customer_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    var customer=biz9.get_new_item(DT_BLANK,0);
    var shipping=biz9.get_new_item(DT_BLANK,0);
    var billing=biz9.get_new_item(DT_BLANK,0);
    var mail_notification=biz9.get_new_item(DT_BLANK,0);
    var brevo_obj=biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            customer=set_order_customer(helper);
            shipping=set_order_shipping(helper);
            billing=set_order_billing(helper);
            mail_notification=set_order_mail_notification(helper.info,customer);
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
            cart_checkout_order_add(helper,cart,function(error,data) {
                order=data;
                call();
            });
        },
        function(call){
            biz9.get_order(db,order.order_id,function(error,data) {
                helper.order=data;
                call();
            });
        },
        function(call){
            get_order_send_mail_notification(customer,shipping,billing,cart,helper.order,mail_notification,function(_brevo_obj){
                brevo_obj=_brevo_obj;
                call();
            });
        },
        function(call){
            biz9.send_brevo_mail(helper.info.brevo_key,brevo_obj,function(error,data) {
                if(error){
                    helper.validation_message=error;
                }
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/checkout/stripecard/:customer_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    var customer=biz9.get_new_item(DT_BLANK,0);
    var shipping=biz9.get_new_item(DT_BLANK,0);
    var billing=biz9.get_new_item(DT_BLANK,0);
    var mail_notification=biz9.get_new_item(DT_BLANK,0);
    var brevo_obj=biz9.get_new_item(DT_BLANK,0);
    var stripe_token=null;
    var stripe_charge=null;
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            customer=set_order_customer(helper);
            shipping=set_order_shipping(helper);
            billing=set_order_billing(helper);
            mail_notification=set_order_mail_notification(helper.info,customer);
            call();
        },
        function(call){
            //- process card
            stripe_key=helper.info.business_stripe_key;
            credit_card={
                number:billing.card_number,
                exp_month:billing.card_exp_month,
                exp_year:billing.card_exp_year,
                cvc:billing.card_cvc
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
            if(!helper.validation_message){
                cart_checkout_order_add(helper,cart,function(error,data) {
                    helper.order=data;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            if(!helper.validation_message){
                get_order_send_mail_notification(customer,shipping,billing,cart,helper.order,mail_notification,function(_brevo_obj){
                    brevo_obj=_brevo_obj;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            if(!helper.validation_message){
                biz9.send_brevo_mail(helper.info.brevo_key,brevo_obj,function(error,data) {
                    if(error){
                        helper.validation_message=error;
                    }
                    call();
                });
            }else{
                console.log('STRIPE_CARD_ERROR')
                console.log(helper.validation_message);
                call();
            }
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/checkout/stripecard/:customer_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    var customer=biz9.get_new_item(DT_BLANK,0);
    var shipping=biz9.get_new_item(DT_BLANK,0);
    var billing=biz9.get_new_item(DT_BLANK,0);
    var mail_notification=biz9.get_new_item(DT_BLANK,0);
    var brevo_obj=biz9.get_new_item(DT_BLANK,0);
    var stripe_token=null;
    var stripe_charge=null;
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            customer=set_order_customer(helper);
            shipping=set_order_shipping(helper);
            billing=set_order_billing(helper);
            mail_notification=set_order_mail_notification(helper.info,customer);
            call();
        },
        function(call){
            //- process card
            stripe_key=helper.info.business_stripe_key;
            credit_card={
                number:billing.card_number,
                exp_month:billing.card_exp_month,
                exp_year:billing.card_exp_year,
                cvc:billing.card_cvc
            };
            biz9.get_stripe_card_token(helper.info.business_stripe_key,credit_card.number,credit_card.exp_month,credit_card.exp_year,credit_card.cvc,function(err,data) {
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
                biz9.get_stripe_card_charge(helper.info.business_stripe_key,stripe_token,stripe_card_charge.amount,stripe_card_charge.description,function(err,data) {
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
            if(!helper.validation_message){
                cart_checkout_order_add(helper,cart,function(error,data) {
                    helper.order=data;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            if(!helper.validation_message){
                get_order_send_mail_notification(customer,shipping,billing,helper.order,mail_notification,function(_brevo_obj){
                    brevo_obj=_brevo_obj;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            if(!helper.validation_message){
                biz9.send_brevo_mail(helper.info.brevo_key,brevo_obj,function(error,data) {
                    if(error){
                        helper.validation_message=error;
                    }
                    call();
                });
            }else{
                console.log('STRIPE_CARD_ERROR')
                console.log(helper.validation_message);
                call();
            }
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_stripe
router.post('/checkout/striperedirecturl/:customer_id',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    helper.order = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            var customer=set_order_customer(helper);
            var shipping=set_order_shipping(helper);
            var billing=set_order_billing(helper);
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
            cart_checkout_order_add(helper,cart,function(error,data) {
                helper.order=data;
                call();
            });
        },
        function(call){
            retail_line_items=[];
            for(a=0;a<cart.item_list.length;a++){
                if(!cart.item_list[a].sub_note){
                    cart.item_list[a].sub_note= ' ';
                }
                retail_line_items.push({
                    name:cart.item_list[a].title,
                    quantity:cart.item_list[a].quantity,
                    description:cart.item_list[a].sub_note,
                    price:cart.price.cents,
                    images:[cart.item_list[a].photo_obj.mid_url],
                });
            }
            call();
        },
        function(call){
            stripe_key=helper.info.business_stripe_key;
            stripe_config={key:stripe_key,success_url:G_URL+'/order/checkout/striperedirecturlsuccess/'+helper.order.order_id,cancel_url:G_URL+'/order/cart_detail/'+helper.customer_id};
            biz9.get_stripe_redirect_url(stripe_config,retail_line_items,function(error,data) {
                if(error){
                    helper.validation_message=error;
                    stripe_redirect_url='error';
                }
                console.log(error);
                console.log(data);
                helper.stripe_redirect_url=data;
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_stripe_success_b
router.get('/checkout/striperedirecturlsuccess/:order_id',function(req, res) {
    /*--default_start */
    var helper = biz9.get_helper(req);
    helper.mobile = biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default_end */
    var order=biz9.get_new_item(DT_BLANK,0);
    var customer=biz9.get_new_item(DT_BLANK,0);
    var brevo_obj=biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
            biz9.get_order(db,helper.order_id,function(error,data) {
                helper.order=data;
                call();
            });
        },
        function(call){
            customer=set_order_customer({customer_name:helper.order.shipping_first_name + " " +helper.order.shipping_last_name,customer_email:helper.order.customer_email,customer_id:helper.order.customer_id});
            shipping=set_order_shipping(helper.order);
            billing=set_order_billing(helper.order);
            mail_notification=set_order_mail_notification(helper.info,customer);
            call();
        },
        function(call){
            get_order_send_mail_notification(customer,shipping,billing,helper.order,mail_notification,function(_brevo_obj){
                brevo_obj=_brevo_obj;
                call();
            });
        },
        function(call){
            biz9.send_brevo_mail(helper.info.brevo_key,brevo_obj,function(error,data) {
                if(error){
                    biz9.o('error_message',error);
                    helper.validation_message=error;
                    call();
                }
                call();
            });
        },
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.redirect('/order/checkout/success/'+helper.order.order_id);
            res.end();
        });
});
//9_checkout_success//9_success
router.get('/checkout/success/:order_id',function(req, res) {
    /*--default-start */
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.primary= biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    /*--default-end */
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});

//9_checkout_success//9_success
router.get('/checkout/success_detail/:order_id',function(req, res) {
    /*--default-start */
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK,0);
    helper.primary= biz9.get_new_item(DT_BLANK,0);
    helper.info = biz9.get_new_item(DT_BLANK,0);
    helper.page_title = APP_TITLE +': Shopping Cart Checkout Success';
    /*--default-end */
    helper.render='order_cart_success';
    helper.render_menu='li_product';
    /*--default_end */
    helper.cart = biz9.get_new_item(DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.render(helper.render,{helper:helper});
            res.end();
        });

});
set_order_mail_notification=function(info,customer){
    mail_notification={};

    mail_notification.subject=info.brevo_order_send_subject;
    mail_notification.template_id=info.brevo_order_send_template_id;

    mail_notification.copyright='Copyright @ '+info.business_name;
    mail_notification.sender={name:info.business_name,email:info.business_email};
    mail_notification.replyTo={name:info.business_name,email:info.business_email};
    mail_notification.to_list=[];
    mail_notification.to_list.push({name:customer.name,email:customer.email});
    mail_notification.to_list.push({name:info.business_name,email:info.business_email});
    return mail_notification;
}
set_order_customer=function(item){
    customer = biz9.get_new_item(DT_BLANK,0);
    customer.name=item.customer_name ? (item.customer_name) : "customer";
    customer.id=item.customer_id;
    customer.email=item.customer_email ? (item.customer_email) : "email_not_found@gmail.com";
    return customer;
}
set_order_shipping=function(item){
    shipping = biz9.get_new_item(DT_BLANK,0);
    shipping.first_name=item.shipping_first_name ? (item.shipping_first_name) : "n/a";
    shipping.last_name=item.shipping_last_name ? (item.shipping_last_name) : "n/a";
    shipping.company=item.shipping_company ? (item.shipping_company) : "n/a";
    shipping.address=item.shipping_address ? (item.shipping_address) : "n/a";
    shipping.city=item.shipping_city ? (item.shipping_city) : "n/a";
    shipping.phone=item.shipping_phone ? (item.shipping_phone) : "n/a";
    shipping.state=item.shipping_state ? (item.shipping_state) : "n/a";
    shipping.country=item.shipping_country ? (item.shipping_country) : "n/a";
    shipping.zip=item.shipping_zip ? (item.shipping_zip) : "n/a";
    return shipping;
}
set_order_billing=function(item){
    billing = biz9.get_new_item(DT_BLANK,0);
    billing.payment_type=item.billing_payment_type ? (item.billing_payment_type) : "n/a";
    billing.note=item.billing_note ? (item.billing_note) : "n/a";
    billing.link=item.billing_link ? (item.billing_link) : "n/a";
    billing.card_number=item.billing_card_number ? (item.billing_card_number) : "n/a";
    billing.card_exp_month=item.billing_card_month ? (item.billing_card_month) : "n/a";
    billing.card_exp_year=item.billing_card_year ? (item.billing_card_year) : "n/a";
    billing.card_cvc=item.billing_card_cvc ? (item.billing_card_cvc) : "n/a";
    return billing;
}
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
            order.billing_payment_type = checkout_form.billing_payment_type;
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
                order_item.sub_note=cart.item_list[a].sub_note;
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
            biz9.get_client_db(function(error,_client_db){
                client_db=_client_db;
                db = client_db.db(helper.app_title_id);
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
        function(call){
            biz9.close_client_db(client_db,function(error){
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
get_order_send_mail_notification=function(customer,shipping,billing,cart,order,mail,callback){
    var item_list=[];
    async.series([
        function(call){
            for(a=0;a<cart.item_list.length;a++){
                item_list.push({
                    title:cart.item_list[a].title,
                    sub_total:cart.item_list[a].sub_total,
                    shipping_total:cart.item_list[a].shipping_total,
                    grand_total:cart.item_list[a].grand_total,
                    category:cart.item_list[a].category,
                    note:cart.item_list[a].note,
                    option_note:cart.item_list[a].option_note,
                    quantity:cart.item_list[a].quantity,
                    photo_url:cart.item_list[a].photo_obj.square_mid_url,
                });
            }
            call();
        },
        function(call){
            brevo_obj=
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
                        "order_date":order.date_obj.full_date_create + " " + order.date_obj.time_create,
                        "order_id":order.order_id,
                        "order_status":biz9.get_order_status(order.status_id),
                        "copyright":mail.copyright,
                        "shipping_name":shipping.first_name + " " +shipping.last_name,
                        "shipping_company_name":shipping.company,
                        "shipping_address":shipping.address,
                        "shipping_city":shipping.city,
                        "shipping_state":shipping.state,
                        "shipping_zip":shipping.zip,
                        "shipping_phone":shipping.phone,
                        "shipping_country":shipping.country,
                        "billing_type":billing.payment_type,
                        "billing_note":billing.note,
                        "cart_shipping_total":cart.price.shipping_total,
                        "cart_sub_total":cart.price.sub_total,
                        "cart_grand_total":cart.price.grand_total,
                        "product_list":item_list,
                    }
                }
            call();
        }
    ],
        function(err, result){
            callback(brevo_obj);
        });
}
module.exports = router;
