/* Copyright (C) 2021 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Order
 */
module.exports = function(){
    module.cart_checkout_product_order_add=function(db,customer,shipping,billing,cart,callback){
        var error=null;
        async.series([
            function(call){
                //- order
                order = biz9.get_new_item(DT_ORDER,0);
                order.shipping_first_name=shipping.first_name;
                order.shipping_last_name=shipping.last_name;
                order.shipping_company=shipping.company;
                order.shipping_address=shipping.address;
                order.shipping_city=shipping.city;
                order.shipping_state=shipping.state;
                order.shipping_country=shipping.country;
                order.shipping_zip=shipping.zip;
                order.customer_id=customer.id;
                order.customer_name=customer.name;
                order.customer_email=customer.email;
                order.sub_total = cart.price.sub_total;
                order.grand_total = cart.price.grand_total;
                order.shipping_total = cart.price.shipping_total;
                order.discount_total = cart.price.discount_total;
                order.billing_payment_type=billing.payment_type;
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
                    order_item.order_tbl_id=order.tbl_id;
                    order_item.parent_tbl_id=cart.item_list[a].parent_tbl_id;
                    order_item.parent_data_type=cart.item_list[a].parent_data_type;
                    order_item.price=cart.item_list[a].price;
                    order_item.discount=cart.item_list[a].discount;
                    order_item.old_price=cart.item_list[a].old_price;
                    order_item.title=cart.item_list[a].title;
                    order_item.title_url=cart.item_list[a].title_url;
                    order_item.sub_note=cart.item_list[a].sub_note;
                    order_item.category=cart.item_list[a].category;
                    order_item.photofilename=cart.item_list[a].photofilename;
                    order_item.sub_total=cart.item_list[a].sub_total;
                    order_item.grand_total=cart.item_list[a].grand_total;
                    order_item.shipping_total=cart.item_list[a].shipping_total;
                    order_item.option_note=cart.item_list[a].option_note;
                    order_item.quantity=cart.item_list[a].quantity;
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
    module.set_order_customer=function(item){
        customer = biz9.get_new_item(DT_BLANK,0);
        customer.id=item.customer_id;
        customer.email=item.customer_email;
        customer.first_name=item.customer_first_name;
        customer.last_name=item.customer_last_name;
        customer.company=item.customer_company;
        customer.city=item.customer_city;
        customer.country=item.customer_country;
        customer.state=item.customer_state;
        customer.address=item.customer_address;
        customer.zip=item.customer_zip;
        customer.phone=item.customer_phone;
        return customer;
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
    return module;
}
