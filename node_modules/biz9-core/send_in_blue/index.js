/* Copyright (C) 2021 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Send-In-Blue
 */
module.exports = function(){
    module.send_order_confirmation=function(send_in_blue,callback){
        var r_error=null;
        async.series([

            function(call){

                a = {
                        'templateId':parseInt(send_in_blue.template_id),
                        'subject':send_in_blue.subject,
                        'sender' : {'email':send_in_blue.sender.email,'name':send_in_blue.sender.name},
                        'replyTo' : {'email':send_in_blue.replyTo.email,'name':send_in_blue.replyTo.name},
                        'to':send_in_blue.to_list,
                        'params':{
                            "customer_email":send_in_blue.customer.email,
                            "customer_name":send_in_blue.customer.name,
                            "order_date":send_in_blue.order.date,
                            "order_id":send_in_blue.order.id,
                            "order_status":send_in_blue.order.status,
                            "copyright":send_in_blue.copyright,
                            "shipping_name":send_in_blue.shipping.name,
                            "shipping_company_name":send_in_blue.shipping.company,
                            "shipping_address":send_in_blue.shipping.address,
                            "shipping_city":send_in_blue.shipping.city,
                            "shipping_state":send_in_blue.shipping.state,
                            "shipping_zip":send_in_blue.shipping.zip,
                            "shipping_phone":send_in_blue.shipping.phone,
                            "billing_type":send_in_blue.billing.payment_type,
                            "billing_sub_note":send_in_blue.billing.sub_note,
                            "billing_note":send_in_blue.billing.note,
                            "cart_shipping_total":send_in_blue.cart.shipping_total,
                            "cart_sub_total":send_in_blue.cart.sub_total,
                            "cart_grand_total":send_in_blue.cart.grand_total,
                            "product_list":send_in_blue.product_list,
                        }
                    }
                call();

            },

            function(call){
                SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = send_in_blue.key;
                new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail(
                    {
                        'templateId':parseInt(send_in_blue.template_id),
                        'subject':send_in_blue.subject,
                        'sender' : {'email':send_in_blue.sender.email,'name':send_in_blue.sender.name},
                        'replyTo' : {'email':send_in_blue.replyTo.email,'name':send_in_blue.replyTo.name},
                        'to':send_in_blue.to_list,
                        'params':{
                            "customer_email":send_in_blue.customer.email,
                            "customer_name":send_in_blue.customer.name,
                            "order_date":send_in_blue.order.date,
                            "order_id":send_in_blue.order.id,
                            "order_status":send_in_blue.order.status,
                            "copyright":send_in_blue.copyright,
                            "shipping_name":send_in_blue.shipping.name,
                            "shipping_company_name":send_in_blue.shipping.company,
                            "shipping_address":send_in_blue.shipping.address,
                            "shipping_city":send_in_blue.shipping.city,
                            "shipping_state":send_in_blue.shipping.state,
                            "shipping_zip":send_in_blue.shipping.zip,
                            "shipping_phone":send_in_blue.shipping.phone,
                            "billing_type":send_in_blue.billing.payment_type,
                            "billing_sub_note":send_in_blue.billing.sub_note,
                            "billing_note":send_in_blue.billing.note,
                            "cart_shipping_total":send_in_blue.cart.shipping_total,
                            "cart_sub_total":send_in_blue.cart.sub_total,
                            "cart_grand_total":send_in_blue.cart.grand_total,
                            "product_list":send_in_blue.product_list,
                        }
                    }
                ).then(function(data) {
                    //call();
                }, function(error) {
                    if(error){
                        biz9.o('send_in_blue_obj',send_in_blue);
                        biz9.o('send_order_confirmation_error',error);
                        biz9.o('send_order_confirmation_error_22',error.response.error.text);
                        r_error=error.response.error.text;
                        biz9.o('hrer',r_error);
                        //call();
                    }else{
                    //call();
                    }
                });
            },
        ],
            function(err, result){
                callback(r_error,0);
            });
    }
    return module;
}
