/* Copyright (C) 2021 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Order
 */
module.exports = function(){
    module.get_order_status=function(status_id) {
        switch(status_id) {
            case '0':
                return  'Open';
            case '1':
                return 'Shipped';
            default:
                return 'Open';
        }
    }
    module.get_order_list=function(db,sql,sort_by,page_current,page_size,callback) {
        var error=null;
        var order_list=[];
        var order_item_list=[];
        var item_count=0;
        var page_count=0;
        async.series([
            function(call){
                dataz.get_sql_paging_cache(db,DT_ORDER,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                    order_list=data_list;
                    item_count=_item_count;
                    page_count=_page_count;
                    call();
                });
            },
            function(call){
                sql={};
                sort={date_create:-1};
                dataz.get_sql_cache(db,DT_ORDER_ITEM,sql,sort,function(error,data_list) {
                    order_item_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<order_list.length;a++){
                    order_list[a].order_item_list=[];
                    order_list[a].status=orderz.get_order_status(order_list[a].status_id);
                    for(b=0;b<order_item_list.length;b++){
                        if(order_list[a].tbl_id==order_item_list[b].order_tbl_id){
                            order_list[a].order_item_list.push(order_item_list[b]);
                        }
                    }
                }
                call();
            },
        ],
            function(err, result){
                callback(error,order_list,item_count,page_count);
            });
    }
    module.get_cart=function(db,sql,callback) {
        var error=null;
        var cart_list=[];
        async.series([
            function(call){
                dataz.get_sql_cache(db,DT_CART_ITEM,sql,{},function(error,data_list) {
                    cart=caculate_cart(data_list);
                    call();
                });
            },
        ],
            function(err, result){
                callback(error,cart);
            });
    }
    module.set_cart=function(item_list,callback) {
        callback(0,caculate_cart(item_list));
    }
    caculate_cart=function(cart_list){
        var sub_total=0;
        var grand_total=0;
        var shipping_total=0;
        var discount_total=0;
        var quantity=0;
        var cart_checkout_list=[]
        for(var a=0;a<cart_list.length;a++){
            cart_item = set_cart_item(cart_list[a]);
            sub_total = (parseFloat(sub_total)+parseFloat(cart_item.sub_total)).toFixed(2) ;
            shipping_total = (parseFloat(shipping_total)+parseFloat(cart_item.shipping_total)).toFixed(2);
            grand_total = (parseFloat(grand_total)+parseFloat(cart_item.grand_total)).toFixed(2);
            discount_total= parseInt(discount_total)+parseInt(cart_item.discount);
            quantity = parseInt(quantity)+parseInt(cart_item.quantity);
            cart_item.sub_total=biz9.get_money(cart_item.sub_total);
            cart_item.grand_total=biz9.get_money(cart_item.grand_total);
            cart_item.shipping_total=biz9.get_money(cart_item.shipping_total);
            cart_checkout_list.push(biz9.set_biz_item(cart_item));
        }
        if(isNaN(grand_total)){
            grand_total=0;
        }
        discount_total=(parseInt(discount_total/quantity));
        if(isNaN(discount_total)){
            discount_total=0;
        }
        discount_total=String(parseInt(discount_total))+"%";
        cart={item_list:cart_checkout_list,
            price:{
                sub_total:biz9.get_money(sub_total),
                grand_total:biz9.get_money(grand_total),
                shipping_total:biz9.get_money(shipping_total),
                discount_total:discount_total,
                quantity:quantity,
                cents:biz9.get_cents(grand_total),
                cart_count:cart_checkout_list.length
            }
        };
        return cart;
    }
    function set_cart_item(cart_item){
        var has_option=false;
        var r_cart_item = biz9.get_new_item(DT_CART_ITEM,cart_item.tbl_id);
        r_cart_item.sub_total=0;
        r_cart_item.grand_total=0;
        r_cart_item.shipping_total=0;
        //option_note_start
        r_cart_item.option_note=' ';
        for(var a=0;a<6;a++){
            if(cart_item['item_option_'+a+'_tbl_id']){
                if(cart_item['item_option_'+a+'_price']){
                    has_option=true;
                    r_cart_item.sub_total=r_cart_item.sub_total+parseFloat(cart_item['item_option_'+a+'_price']);
                }
                if(cart_item['item_option_'+a+'_title'].toLowerCase().includes('ship')){
                    r_cart_item.shipping_total=r_cart_item.shipping_total + parseFloat(cart_item['item_option_'+a+'_price']);
                }
                r_cart_item.option_note=r_cart_item.option_note+cart_item['item_option_'+a+'_title']+"-"+biz9.get_money(cart_item['item_option_'+a+'_price'])+", ";
            }
        }
        if(r_cart_item.option_note){
            r_cart_item.option_note=r_cart_item.option_note.substr(0,r_cart_item.option_note.length-2);
        }else{
            r_cart_item.option_note=' ';
        }
        if(r_cart_item.cart_note){
            r_cart_item.option_note=r_cart_item.option_note + ' '+ r_cart_item.cart_note;
        }
        r_cart_item.cart_note=cart_item.cart_note ? (cart_item.cart_note): ' ' ;
        //option_note_end
        if(!has_option){
            r_cart_item.sub_total = cart_item.price;
        }
        r_cart_item.shipping_total=(parseFloat(r_cart_item.shipping_total)*parseFloat(cart_item.quantity));
        r_cart_item.grand_total=(parseFloat(r_cart_item.sub_total)*parseFloat(cart_item.quantity))+ r_cart_item.shipping_total ;
        if(!cart_item.customer_id){
            cart_item.customer_id=0;
        }
        r_cart_item.title=cart_item.title;
        r_cart_item.parent_tbl_id=cart_item.parent_tbl_id;
        r_cart_item.sub_note=cart_item.sub_note;
        r_cart_item.parent_data_type=cart_item.parent_data_type;
        r_cart_item.title_url=cart_item.title_url;
        r_cart_item.photofilename=cart_item.photofilename;
        r_cart_item.price=biz9.get_money(cart_item.price);
        r_cart_item.old_price=biz9.get_money(cart_item.old_price);
        r_cart_item.category=cart_item.category;
        r_cart_item.quantity=cart_item.quantity;
        discount = cart_item.old_price - cart_item.price;
        if(!isNaN(discount) || !discount){
           r_cart_item.discount="0%";
        }else{
            r_cart_item.discount= String(parseInt(((discount / cart_item.old_price) * 100)))+"%";
        }
        return r_cart_item;
    }
    module.get_cart_item_list=function(db,sql,callback) {
        var cart_list=[];
        var error=null;
        async.series([
            function(call){
                dataz.get_sql_cache(db,DT_CART_ITEM,sql,{},function(error,data_list) {
                    cart_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<cart_list.length;a++){
                    cart_list[a]=set_cart_item(cart_list[a]);
                }
                call();
            },
        ],
            function(err, result){
                callback(error,caculate_cart(cart_list));
            });
    }
    module.get_order=function(db,order_id,callback) {
        var error=null;
        var order = biz9.get_new_item(DT_ORDER,0);
        async.series([
            function(call){
                sql={order_id:order_id};
                dataz.get_sql_cache(db,DT_ORDER,sql,{},function(error,data_list) {
                    if(data_list.length>0){
                        order=data_list[0];
                        order.status=orderz.get_order_status(order.status_id);
                    }
                    order.order_item_list=[];
                    call();
                });
            },
            function(call){
                sql={order_id:order_id};
                dataz.get_sql_cache(db,DT_ORDER_ITEM,sql,{},function(error,data_list) {
                    order.order_item_list=data_list;
                    call();
                });
            },
        ],
            function(err, result){
                callback(error,order);
            });
    }
    module.get_order_by_tbl_id=function(db,tbl_id,callback) {
        var error=null;
        var order = biz9.get_new_item(DT_ORDER,0);
        async.series([
            function(call){
                biz9.get_item(db,DT_ORDER,tbl_id,function(error,data) {
                    order=data;
                    order.status=orderz.get_order_status(order.status_id);
                    order.order_item_list=[];
                    call();
                });
            },
            function(call){
                sql={order_id:order.order_id};
                biz9.get_sql(db,DT_ORDER_ITEM,sql,{},function(error,data_list) {
                    order.order_item_list=data_list;
                    call();
                });
            },
        ],
            function(err, result){
                callback(error,order);
            });
    }
 return module;
}
