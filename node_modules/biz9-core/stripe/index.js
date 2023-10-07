/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-Stripe
 */
module.exports = function(){
    module.get_stripe_redirect_url= function(stripe_config,retail_line_items,callback){
        var error=null;
        var stripe_redirect_url='';
        async.series([
            function(call){
                async function run() {
                    const stripe = require('stripe')(stripe_config.key);
                    try {
                        const items = retail_line_items.map((item, a) => {
                            return {
                                price_data: {
                                    currency: 'usd',
                                    unit_amount:retail_line_items[a].price,
                                    product_data: {
                                        name:retail_line_items[a].name,
                                        description:retail_line_items[a].description,
                                        images:retail_line_items[a].images,
                                    },
                                },
                                quantity:retail_line_items[a].quantity,
                            };
                        });
                        const session = await stripe.checkout.sessions.create({
                            payment_method_types: ['card'],
                            line_items: items,
                            mode:'payment',
                            success_url:stripe_config.success_url,
                            cancel_url:stripe_config.cancel_url
                        });
                        stripe_redirect_url=session.url;
                    } catch (e) {
                        error = e.message;
                        biz9.o('biz9-core-stripe-get_stripe_redirect-url',error);
                        call();
                    } finally {
                        call();
                    }
                }
                run();
            },
        ],
            function(err, result){
                callback(error,stripe_redirect_url);
            });
    }
    module.get_stripe_card_charge=function(stripe_key,stripe_token,amount,description,callback){
        var error=null;
        var stripe_charge='';
        async.series([
            function(call){
                async function run() {
                    const stripe=require('stripe')(stripe_key);
                    try {
                        const charge = await stripe.charges.create({
                            amount: amount,
                            currency: 'usd',
                            source: stripe_token,
                            description: description,
                        });
                        stripe_charge={id:charge.source.id,
                                      brand:charge.source.brand,
                                      last4:charge.source.last4};
                    } catch (e) {
                        error = e.message;
                        biz9.o('biz9-core-stripe-get_stripe_card-charge',error);
                    } finally {
                        call();
                    }
                }
                run();
            },
        ],
            function(err, result){
                callback(error,stripe_charge);
            });
    }
    module.get_stripe_card_token=function(stripe_key,number,exp_month,exp_year,cvc,callback){
        var error=null;
        var stripe_token='';
        async.series([
            function(call){
                async function run() {
                    const stripe=require('stripe')(stripe_key);
                    try {
                        const token=await stripe.tokens.create({
                            card:{
                                number:number,
                                exp_month:exp_month,
                                exp_year:exp_year,
                                cvc:cvc,
                            },
                        });
                        stripe_token=token.id;
                    } catch (e) {
                        error = e.message;
                        biz9.o('biz9-core-stripe-get_stripe_token-error',error);
                    } finally {
                        call();
                    }
                }
                run();
            },
        ],
            function(err, result){
                callback(error,stripe_token);
            });
    }
    return module;
}
