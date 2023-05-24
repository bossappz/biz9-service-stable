module.exports = function(){
	async = require('async');
	module.cart_checkout_order_add=function(customer,shipping,billing,cart,callback){
		var error=null;
		async.series([
			function(call){
				//- order
				order = biz9.get_new_item(DT_ORDER,0);
				order.shipping_name=shipping.name;
				order.shipping_company=shipping.company;
				order.shipping_address=shipping.address;
				order.shipping_city=shipping.city;
				order.shipping_state=shipping.state;
				order.shipping_zip=shipping.zip;
				order.customer_id=customer.id;
				order.customer_name=customer.name;
				order.customer_email=customer.email;
				order.customer_is_guest=customer.is_guest;
				order.sub_total = cart.price.sub_total;
				order.grand_total = cart.price.grand_total;
				order.billing_type=billing.type;
				order.billing_sub_note=billing.sub_note;
				order.billing_note=billing.note;
				order.billing_link=billing.link;
				order.quantity=cart.price.quantity;
				order.cents=cart.price.cents;
				order.id=biz9.get_id(99999)
				order.status_id=0; //<- 0=open 1=paid 2=canceled
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
					order_item.order_id=order.id;
					order_item.item_tbl_id=cart.item_list[a].item_tbl_id;
					order_item.item_price=cart.item_list[a].item_price;
					order_item.customer_id=cart.item_list[a].customer_id;
            		order_item.customer_is_guest=cart.item_list[a].customer_is_guest;
            		order_item.item_tbl_id=cart.item_list[a].item_tbl_id;
            		order_item.item_data_type=cart.item_list[a].item_data_type;
            		order_item.item_price=cart.item_list[a].item_price;
            		order_item.item_money_price=biz9.get_money(cart.item_list[a].item_price);
            		order_item.item_title=cart.item_list[a].item_title;
            		order_item.item_quantity=cart.item_list[a].item_quantity;
            		order_item.item_sub_note=cart.item_list[a].item_sub_note;
            		order_item.item_category=cart.item_list[a].item_category;
            		order_item.item_title_url=cart.item_list[a].item_title_url;
            		order_item.item_shipping_title=cart.item_list[a].item_shipping_title;
            		order_item.item_shipping_price=cart.item_list[a].item_shipping_price;
            		order_item.photofilename=cart.item_list[a].photofilename;
					order_item_list.push(order_item);
				}
				biz9.update_list(db,order_item_list,function(err,data_list) {
					call();
				});
			},
			function(call){
				//- blue item list
				send_in_blue_item_list=[];
				for(a=0;a<cart.item_list.length;a++){
					send_in_blue_item_list.push({
						title:cart.item_list[a].item.title,
						sub_total:cart.item_list[a].item.sub_total,
						shipping_total:cart.item_list[a].item.shipping_total,
						grand_total:cart.item_list[a].item.grand_total,
						category:cart.item_list[a].item.category,
						sub_note:cart.item_list[a].item.sub_note,
						quantity:cart.item_list[a].item.quantity,
						photo_url:cart.item_list[a].photo.square_mid_url,
						shipping_title:cart.item_list[a].shipping.title,
						shipping_price:cart.item_list[a].shipping.price
					})
				}
				//biz9.o('send_in_blue_item_list',send_in_blue_item_list);
				call();
			},
		],
			function(err, result){
				callback(error,order);
			});
	}
	module.set_order_shipping=function(item){
		shipping = biz9.get_new_item(DT_BLANK,0);
		shipping.name=item.shipping_name;
		shipping.company=item.shipping_company;
		shipping.address=item.shipping_address;
		shipping.city=item.shipping_city;
		shipping.state=item.shipping_state;
		shipping.zip=item.shipping_zip;
		return shipping;
	}
	module.set_order_customer=function(item){
		customer = biz9.get_new_item(DT_BLANK,0);
		customer.name=item.customer_name;
		customer.id=item.customer_id;
		customer.email=item.customer_email;
		customer.is_guest=item.customer_is_guest;
		return customer;
	}
	module.set_order_billing=function(item){
		billing = biz9.get_new_item(DT_BLANK,0);
		billing.type=item.billing_type;
		billing.sub_note=item.billing_sub_note;
		billing.note=item.billing_note;
		billing.link=null;
		return billing;
	}
	module.get_product_cart_checkout_confirmation_send_in_blue=function(customer,shipping,billing,cart,order,mail,callback){
		sb_template_id=mail.template_id;
		sb_subject=mail.subject;
		sb_sender=mail.sender;
		sb_replyTo=mail.replyTo;
		sb_copyright=mail.copyright;
		sb_key=mail.key;
		sb_to_list=mail.to_list;
		sb_customer = customer;
		sb_billing = billing;
		sb_order={id:order.id,date:order.date.full_create,status:biz9.get_order_status(order.status_id)};
		sb_shipping={name:shipping.name,company:shipping.company,address:shipping.address,city:shipping.city,state:shipping.state,zip:shipping.zip};
		sb_cart={sub_total:cart.price.sub_total,grand_total:cart.price.grand_total,shipping_total:cart.price.shipping_total},
		item_list=[];
		for(a=0;a<cart.item_list.length;a++){
			item_list.push({
				title:cart.item_list[a].item.title,
				sub_total:cart.item_list[a].item.sub_total,
				shipping_total:cart.item_list[a].item.shipping_total,
				grand_total:cart.item_list[a].item.grand_total,
				category:cart.item_list[a].item.category,
				sub_note:cart.item_list[a].item.sub_note,
				quantity:cart.item_list[a].item.quantity,
				photo_url:cart.item_list[a].photo.square_mid_url,
				shipping_title:cart.item_list[a].shipping.title,
				shipping_price:cart.item_list[a].shipping.price
			});
		}
		sb_cart.product_list=item_list;
		send_in_blue_obj={
			key:sb_key,
			template_id:sb_template_id,
			subject:sb_subject,
			copyright:sb_copyright,
			sender:sb_sender,
			replyTo:sb_replyTo,
			customer:sb_customer,
			shipping:sb_shipping,
			billing:sb_billing,
			order:sb_order,
			cart:sb_cart,
			product_list:sb_cart.product_list,
			to_list:sb_to_list
		};
		return send_in_blue_obj;
	}
	return module;
}
