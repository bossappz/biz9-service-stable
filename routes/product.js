var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
	res.send({'biz9-service':'ping'});
	res.end();
});
//9_product_category
router.get('/get_product_category_list',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
				call();
			});
		},
		function(call){
			sql = {type:'product'};
			sort={title:1};
			biz9.get_sql(db,DT_CATEGORY,sql,sort,function(error,data_list) {
				helper.product_category_list=data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_product_list
router.get('/get_product_list/:category',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
				call();
			});
		},
		function(call){
			sql={category:helper.category};
			sort={date_create:1};
			page_current=1;
			page_size=15;
			biz9.get_productz(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
				helper.product_list = data_list;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_product_store_links
router.get('/get_product_store_links',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
				call();
			});
		},
		function(call){
			title_url='product';
			sub_page='store_links';
			biz9.get_sub_page(db,title_url,sub_page,{},function(error,page){
				helper.store_links=page;
				call();
			});
		},
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});
//9_product_detail//9_detail
router.get('/get_product/:title_url',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
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
//9_service_checkout_send
router.post("/send_service_checkout",async (req, res) => {
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
            title_url='primary';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.primary=page;
                call();
            });
        },
        function(call){
            if(helper.grand_total && helper.grand_total!='TBD' && helper.payment_type=='pay_now'){
                _amount = biz9.get_cents(helper.grand_total.replace('$',''));
                const run = async function(a, b) {
                    const stripe = require('stripe')(helper.primary.billing_stripe_secret_key);
                    const session = await  stripe.charges.create({
                        amount: _amount,
                        currency: 'usd',
                        description: helper.primary.app_title,
                        source: helper.stripe_token_id,
                    });
                    call();
                }
                run();
            }else{
                call();
            }
        },
        function(call){
            helper.service_cart_list=[];
            if(helper.user_shopping_cart_id!=0){
                sql={user_shopping_cart_id:helper.user_shopping_cart_id};
                sort={};
                page_current=0;
                page_size=20;
                biz9.get_cart_servicez(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
                    helper.service_cart_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.order_id=biz9.get_id();
            for(a=0;a<helper.service_cart_list.length;a++){
                helper.service_cart_list[a].tbl_id=0;
                helper.service_cart_list[a].data_type=DT_SERVICE_ORDER;
                helper.service_cart_list[a].order_id=helper.order_id;
            }
            call();
        },
        function(call){
            biz9.update_list(db,helper.service_cart_list,function(error,data_list) {
                call();
            });
        },
        function(call){
            sql={user_shopping_cart_id:helper.user_shopping_cart_id};
            sort={};
            biz9.delete_sql(db,DT_SERVICE_CART,sql,function(error,data_list) {
                helper.del_service_list=data_list;
                call();
            });
        },
        function(call){
            helper.subtotal=helper.subtotal?(helper.subtotal):"TBD";
            helper.shipping=helper.shipping?(helper.shipping):"TBD";
            helper.grand_total=helper.grand_total?(helper.grand_total):"TBD";
            str = '<b>---Order Confirmed---</b><br/>';
            str = str+ "<b>Order number #: </b>"+helper.order_id +"<br/>";
            str = str+ "<b>Email:</b>"+helper.email +"<br/>";
            str = str+ "<b>Payment Type: </b>"+helper.payment_type +"<br/>";
            str = str+ "<b>SubTotal:</b>"+helper.subtotal +"<br/>";
            str = str+ "<b>Grand Total: </b>"+helper.grand_total +"<br/>";
            str = str+ "<b>Shipping First Name: </b>"+helper.shipping_first_name +"<br/>";
            str = str+ "<b>Shipping Last Name: </b>"+helper.shipping_last_name +"<br/>";
            str = str+ "<b>Shipping Company Name: </b>"+helper.shipping_company_name +"<br/>";
            str = str+ "<b>Shipping Country: </b>"+helper.shipping_country +"<br/>";
            str = str+ "<b>Shipping City: </b>"+helper.shipping_city +"<br/>";
            str = str+ "<b>Shipping State: </b>"+helper.shipping_state +"<br/>";
            str = str+ "<b>Shipping Address: </b>"+helper.shipping_address +"<br/>";
            str = str+ "<b>Shopping Cart ID: </b>"+helper.user_shopping_cart_id +"<br/>";
            str = str+ "<b>Product Orders: </b>";
            for(a=0;a<helper.service_cart_list.length;a++){
                title = helper.service_cart_list[a].title;
                sub1_title=helper.service_cart_list[a].service_sub1_title?(helper.service_cart_list[a].service_sub1_title):" ";
                sub2_title=helper.service_cart_list[a].service_sub2_title?(helper.service_cart_list[a].service_sub2_title):" ";
                shipping_title=helper.service_cart_list[a].service_shipping_title ?  (helper.service_cart_list[a].service_shipping_title) : " " ;
                _full_title = title +" " + sub1_title + " " + " " + sub2_title + " " + shipping_title;
				if(a==0){
					str = str+  " " +helper.service_cart_list[a].quantity + "x "+ _full_title +" ";
				}else{
                str = str +" /--/ "+ helper.service_cart_list[a].quantity + "x "+ _full_title +" ";
				}
            }
            helper.str = str;
            call();
        },
        function(call){
            mail={};
            mail.from = EMAIL_FROM;
            mail.to = helper.primary.billing_notification_email;
            mail.subject='New Order Confirmed';
            mail.body = helper.str;
            call();
        },
        function(call){
            biz9.send_mail(mail,function(error,_data) {
                call();
            });
        },
        function(call){
            mail={};
            mail.from = EMAIL_FROM;
            //mail.to = EMAIL_TO;
            mail.to = helper.email;
            mail.subject='Order Confirmed';
            mail.body = helper.str;
            call();
        },
        function(call){
            biz9.send_mail(mail,function(error,_data) {
                helper.validation_message='Thanks! We will respond within 24hrs. Have a wonderful day!';
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_product_checkout_send
router.post("/send_product_checkout",async (req, res) => {
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
            biz9.o('send_product_checkout',helper);
            title_url='primary';
            biz9.get_page(db,title_url,{},function(error,page){
                helper.primary=page;
                call();
            });
        },
        function(call){
            if(helper.grand_total && helper.grand_total!='TBD' && helper.payment_type=='pay_now'){
                _amount = biz9.get_cents(helper.grand_total.replace('$',''));
                const run = async function(a, b) {
                    const stripe = require('stripe')(helper.primary.billing_stripe_secret_key);
                    const session = await  stripe.charges.create({
                        amount: _amount,
                        currency: 'usd',
                        description: helper.primary.app_title,
                        source: helper.stripe_token_id,
                    });
                    call();
                }
                run();
            }else{
                call();
            }
        },
        function(call){
            helper.product_cart_list=[];
            if(helper.user_shopping_cart_id!=0){
                sql={user_shopping_cart_id:helper.user_shopping_cart_id};
                sort={};
                page_current=0;
                page_size=20;
                biz9.get_cart_productz(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
                    helper.product_cart_list=data_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.order_id=biz9.get_id();
            for(a=0;a<helper.product_cart_list.length;a++){
                helper.product_cart_list[a].tbl_id=0;
                helper.product_cart_list[a].data_type=DT_PRODUCT_ORDER;
                helper.product_cart_list[a].order_id=helper.order_id;
            }
            call();
        },
        function(call){
            biz9.update_list(db,helper.product_cart_list,function(error,data_list) {
                call();
            });
        },
        function(call){
            sql={user_shopping_cart_id:helper.user_shopping_cart_id};
            sort={};
            biz9.delete_sql(db,DT_PRODUCT_CART,sql,function(error,data_list) {
                helper.del_product_list=data_list;
                call();
            });
        },
        function(call){
            helper.subtotal=helper.subtotal?(helper.subtotal):"TBD";
            helper.shipping=helper.shipping?(helper.shipping):"TBD";
            helper.grand_total=helper.grand_total?(helper.grand_total):"TBD";
            str = '<b>---Order Confirmed---</b><br/>';
            str = str+ "<b>Order number #: </b>"+helper.order_id +"<br/>";
            str = str+ "<b>Email:</b>"+helper.email +"<br/>";
            str = str+ "<b>Payment Type: </b>"+helper.payment_type +"<br/>";
            str = str+ "<b>SubTotal:</b>"+helper.subtotal +"<br/>";
            str = str+ "<b>Grand Total: </b>"+helper.grand_total +"<br/>";
            str = str+ "<b>Shipping First Name: </b>"+helper.shipping_first_name +"<br/>";
            str = str+ "<b>Shipping Last Name: </b>"+helper.shipping_last_name +"<br/>";
            str = str+ "<b>Shipping Company Name: </b>"+helper.shipping_company_name +"<br/>";
            str = str+ "<b>Shipping Country: </b>"+helper.shipping_country +"<br/>";
            str = str+ "<b>Shipping City: </b>"+helper.shipping_city +"<br/>";
            str = str+ "<b>Shipping State: </b>"+helper.shipping_state +"<br/>";
            str = str+ "<b>Shipping Address: </b>"+helper.shipping_address +"<br/>";
            str = str+ "<b>Shopping Cart ID: </b>"+helper.user_shopping_cart_id +"<br/>";
            str = str+ "<b>Product Orders: </b>";
            for(a=0;a<helper.product_cart_list.length;a++){
                title = helper.product_cart_list[a].title;
                sub1_title=helper.product_cart_list[a].product_sub1_title?(helper.product_cart_list[a].product_sub1_title):" ";
                sub2_title=helper.product_cart_list[a].product_sub2_title?(helper.product_cart_list[a].product_sub2_title):" ";
                shipping_title=helper.product_cart_list[a].product_shipping_title ?  (helper.product_cart_list[a].product_shipping_title) : " " ;
                _full_title = title +" " + sub1_title + " " + " " + sub2_title + " " + shipping_title;
				if(a==0){
					str = str+  " " +helper.product_cart_list[a].quantity + "x "+ _full_title +" ";
				}else{
                str = str +" /--/ "+ helper.product_cart_list[a].quantity + "x "+ _full_title +" ";
				}
            }
            helper.str = str;
            call();
        },
        function(call){
            mail={};
            mail.from = EMAIL_FROM;
            mail.to = helper.primary.billing_notification_email;
            mail.subject='New Order Confirmed';
            mail.body = helper.str;
            call();
        },
        function(call){
            biz9.send_mail(mail,function(error,_data) {
                call();
            });
        },
        function(call){
            mail={};
            mail.from = EMAIL_FROM;
            //mail.to = EMAIL_TO;
            mail.to = helper.email;
            mail.subject='Order Confirmed';
            mail.body = helper.str;
            call();
        },
        function(call){
            biz9.send_mail(mail,function(error,_data) {
                helper.validation_message='Thanks! We will respond within 24hrs. Have a wonderful day!';
                call();
            });
        }
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
//9_product_checkout_send
router.post('/send_product_checkout',function(req, res) {
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
			title_url='primary';
			biz9.get_page(db,title_url,{},function(error,page){
				helper.primary=page;
				call();
			});
		},
		function(call){
			helper.product_cart_list=[];
			if(helper.user_shopping_cart_id!=0){
				sql={user_shopping_cart_id:helper.user_shopping_cart_id};
				sort={};
				page_current=0;
				page_size=20;
				biz9.get_cart_productz(db,sql,sort,page_current,page_size,function(data_list,total_count,page_page_count) {
					helper.product_cart_list=data_list;
					biz9.o('product_cart_list',data_list);
					call();
				});
			}else{
				call();
			}
		},
		function(call){
			helper.order_id=biz9.get_id();
			for(a=0;a<helper.product_cart_list.length;a++){
				helper.product_cart_list[a].tbl_id=0;
				helper.product_cart_list[a].data_type=DT_PRODUCT_ORDER;
				helper.product_cart_list[a].order_id=helper.order_id;
			}
			call();
		},
		function(call){
			biz9.update_list(db,helper.product_list,function(error,data_list) {
				call();
			});
		},
		function(call){
			sql={user_shopping_cart_id:helper.user_shopping_cart_id};
			sort={};
			biz9.delete_sql(db,DT_PRODUCT_CART,sql,function(error,data_list) {
				helper.del_product_list=data_list;
				call();
			});
		},
		function(call){
			helper.subtotal=helper.subtotal?(helper.subtotal):"TBD";
			helper.shipping=helper.shipping?(helper.shipping):"TBD";
			helper.grand_total=helper.grand_total?(helper.grand_total):"TBD";
			str = '<b>---Order Confirmed---</b><br/>';
			str = str+ "<b>Order number #:</b>"+helper.order_id +"<br/>";
			str = str+ "<b>Email:</b>"+helper.email +"<br/>";
			str = str+ "<b>Payment Type:</b>"+helper.payment_type +"<br/>";
			str = str+ "<b>SubTotal:</b>"+helper.subtotal +"<br/>";
			str = str+ "<b>Grand Total:</b>"+helper.grand_total +"<br/>";
			str = str+ "<b>Shipping First Name:</b>"+helper.shipping_first_name +"<br/>";
			str = str+ "<b>Shipping Last Name:</b>"+helper.shipping_last_name +"<br/>";
			str = str+ "<b>Shipping Company Name:</b>"+helper.shipping_company_name +"<br/>";
			str = str+ "<b>Shipping Country:</b>"+helper.shipping_country +"<br/>";
			str = str+ "<b>Shipping City:</b>"+helper.shipping_city +"<br/>";
			str = str+ "<b>Shipping State:</b>"+helper.shipping_state +"<br/>";
			str = str+ "<b>Shipping Address:</b>"+helper.shipping_address +"<br/>";
			str = str+ "<b>Shopping Cart ID:</b>"+helper.user_shopping_cart_id +"<br/>";
			str = str+ "<b>Product Orders:</b>";
			for(a=0;a<helper.product_cart_list.length;a++){
				title = helper.product_cart_list[a].title;
				sub1_title=helper.product_cart_list[a].product_sub1_title?(helper.product_cart_list[a].product_sub1_title):" ";
				sub2_title=helper.product_cart_list[a].product_sub2_title?(helper.product_cart_list[a].product_sub2_title):" ";
				shipping_title=helper.product_cart_list[a].product_shipping_title ?  (helper.product_cart_list[a].product_shipping_title) : " " ;
				_full_title = title +" " + sub1_title + " " + " " + sub2_title + " " + shipping_title;
				str = str +"/***/ "+ helper.product_cart_list[a].quantity + "x "+ _full_title +" ";
			}
			helper.str = str;
			biz9.o('shop cart info',helper.str);
			call();
		},
		function(call){
			mail={};
			mail.subject='New Order Confirmed';
			mail.from = EMAIL_FROM;
			//mail.to = helper.primary.billing_notification_email;
			mail.to = EMAIL_TO;
			mail.body = helper.str;
			call();
		},
		function(call){
			biz9.send_mail(mail,function(error,_data) {
				call();
			});
		},
		function(call){
			mail={};
			mail.subject='Order Confirmed';
			mail.from = EMAIL_FROM;
			mail.to = EMAIL_TO;
			//mail.to = helper.email;
			mail.body = helper.str;
			call();
		},
		function(call){
			biz9.send_mail(mail,function(error,_data) {
				helper.validation_message='Thanks! We will respond within 24hrs. Have a wonderful day!';
				call();
			});
		}
	],
		function(err, result){
			res.send({helper:helper});
			res.end();
		});
});

//9_checkout 9_product_stripe-create-checkout-token
router.post("/stripe-create-checkout-token",async (req, res) => {
	var helper = biz9.get_helper(req);
	helper.retail_line_items=[];
	helper.cart_price_total=0;
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
				call();
			});
		},

		function(call){
			biz9.o('stripe-cool',helper);
		},

		/*
		function(call){
			if(!helper.validation_message){
				const run = async function(a, b) {
					const stripe = require('stripe')(helper.primary.stripe_key);
					const items = helper.retail_line_items.map((item, a) => {
						return {
							name:helper.retail_line_items[a].name,
							quantity:helper.retail_line_items[a].quantity,
							amount:helper.retail_line_items[a].amount,
							currency:'usd',

						};
					});
					const session = await stripe.checkout.sessions.create({
						line_items: items,
						payment_method_types: [
							'card',
						],
						mode: 'payment',
						success_url: URL+"/shop/checkout/success"+helper.form_url,
						cancel_url: URL+"/shop/checkout"+helper.form_url,
					});
					helper.checkout_redirect_url = session.url;
					call();
				}
				run();
			}else{
				call();
			}
		},
		*/
	],
		function(err, result){
			res.send();
			res.end();
		});
});

//9_checkout 9_product_checkout 9_session
router.post("/create-checkout-session",async (req, res) => {
	var helper = biz9.get_helper(req);
	helper.retail_line_items=[];
	helper.cart_price_total=0;
	async.series([
		function(call){
			biz9.get_connect_db(helper.app_title_id,function(error,_db){
				db=_db;
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
			helper.item_list=[];
			if(helper.user.tbl_id!=0){
				sql={customer_tbl_id:helper.user.tbl_id};
				sort={};
				page_current=1;
				page_size=10;
				biz9.get_cart_productz(db,sql,sort,page_current,page_size,function(error,data_list,total_count,page_page_count) {
					helper.item_list=data_list;
					call();
				});
			}else{
				call();
			}
		},
		function(call){
			for(a=0;a<helper.item_list.length;a++){
				helper.cart_price_total=biz9.get_money((parseFloat(helper.cart_price_total)+parseFloat(helper.item_list[a].item_price)));
				helper.retail_line_items.push({
					name:helper.item_list[a].item_title,
					quantity:helper.item_list[a].item_quanity,
					amount:biz9.get_currency(helper.item_list[a].item_price),
				});
			}
			call();
		},
		function(call){
			helper.form_url='?first_name='+helper.first_name+
				'&last_name='+helper.last_name+
				'&company='+helper.company+
				'&country='+helper.street_address+
				'&state='+helper.state+
				'&email='+helper.email+
				'&note='+helper.note;
			call();
		},
		function(call){
			if(!helper.validation_message){
				const run = async function(a, b) {
					const stripe = require('stripe')(helper.primary.stripe_key);
					const items = helper.retail_line_items.map((item, a) => {
						return {
							name:helper.retail_line_items[a].name,
							quantity:helper.retail_line_items[a].quantity,
							amount:helper.retail_line_items[a].amount,
							currency:'usd',

						};
					});
					const session = await stripe.checkout.sessions.create({
						line_items: items,
						payment_method_types: [
							'card',
						],
						mode: 'payment',
						success_url: URL+"/shop/checkout/success"+helper.form_url,
						cancel_url: URL+"/shop/checkout"+helper.form_url,
					});
					helper.checkout_redirect_url = session.url;
					call();
				}
				run();
			}else{
				call();
			}
		},
	],
		function(err, result){
			if(helper.validation_message){
				res.redirect('/shop/checkout/'+helper.form_url+"&validation_message="+helper.validation_message);
			}else{
				res.redirect(303,helper.checkout_redirect_url);
			}
			res.end();
		});
});
module.exports = router;
