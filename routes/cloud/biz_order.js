module.exports = function(){
	async = require('async');
	module.set_order_customer=function(item){
		customer = biz9.get_new_item(DT_BLANK,0);
		customer.name=item.customer_name ? (item.customer_name) : " ";
		customer.id=item.customer_id;
		customer.email=item.customer_email;
		return customer;
	}
module.set_order_shipping=function(item){
		shipping = biz9.get_new_item(DT_BLANK,0);
		shipping.first_name=item.shipping_first_name;
		shipping.last_name=item.shipping_last_name;
		shipping.company=item.shipping_company;
		shipping.address=item.shipping_address;
		shipping.city=item.shipping_city;
		shipping.phone=item.shipping_phone;
		shipping.state=item.shipping_state;
		shipping.country=item.shipping_country;
		shipping.zip=item.shipping_zip;
		return shipping;
	}
	module.set_order_service=function(item){
		service = biz9.get_new_item(DT_BLANK,0);
		service.date=item.date;
		service.time=item.time;
		service.date_time=item.date_time;
		return service;
	}
	module.set_order_billing=function(item){
		billing = biz9.get_new_item(DT_BLANK,0);
		billing.payment_type=item.billing_payment_type;
		billing.sub_note=item.billing_sub_note;
		billing.note=item.billing_note;
		billing.link=item.billing_link;
		billing.card_number=item.billing_card_number;
		billing.card_exp_month=item.billing_card_month;
		billing.card_exp_year=item.billing_card_year;
		billing.card_cvc=item.billing_card_cvc;
		billing.card_country=item.billing_card_country;
		return billing;
	}
	module.set_order_service=function(item){
		service = biz9.get_new_item(DT_BLANK,0);
		service.date=item.service_date;
		service.time=item.service_time;
		service.date_time=item.service_date_time;
		service.date=item.date;
		service.time=item.time;
		service.date_time=item.date_time;
		return service;
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
		sb_order={id:order.id,date:order.date_obj.full_create,status:biz9.get_order_status(order.status_id)};
		sb_shipping={name:shipping.first_name+" "+shipping.last_name,company:shipping.company,address:shipping.address,city:shipping.city,state:shipping.state,zip:shipping.zip,phone:shipping.phone};
		sb_cart={sub_total:cart.price.sub_total,grand_total:cart.price.grand_total,shipping_total:cart.price.shipping_total},
			item_list=[];
		for(a=0;a<cart.item_list.length;a++){
			item_list.push({
				title:cart.item_list[a].title,
				sub_total:cart.item_list[a].sub_total,
				shipping_total:cart.item_list[a].shipping_total,
				grand_total:cart.item_list[a].grand_total,
				category:cart.item_list[a].category,
				sub_note:cart.item_list[a].sub_note,
				option_note:cart.item_list[a].option_note,
				quantity:cart.item_list[a].quantity,
				photo_url:cart.item_list[a].photo_obj.square_mid_url,
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
