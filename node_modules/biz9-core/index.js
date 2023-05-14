/* Copyright (C) 2021 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core
 */
module.exports = function(app_config,data_config){
    async = require('async');
    arraySort = require('array-sort');
    aws = require('aws-sdk');
    exec = require('child_process').exec;
    fs = require('fs-extra');
    path = require('path');
    request = require('request');
    moment = require('moment');
    prettydate = require("pretty-date");
    redis = require('redis');
    sharp = require('sharp');
    format = require('format-duration');
    SibApiV3Sdk = require('sib-api-v3-sdk');
    MONGO_FULL_URL=data_config.mongo_url;
    mongo_client = require('mongodb').MongoClient;
    data_mon = require('./dataz/lib/mongo_db.js')();
    cache_red = require('./dataz/lib/redis_cache.js')();
    appz = require('./appz/index.js')(app_config);
    orderz = require('./orderz/index.js')(app_config);
    statz = require('./statz/index.js')();
    dataz = require('./dataz/index.js')(data_config);
    utilityz = require('./utilityz/index.js')();
    awz = require('./awz/index.js')();
    send_in_blue = require('./send_in_blue/index.js')();
    stripe = require('./stripe/index.js')();
    mailz = require('./mailz/index.js')();
    redis_url = data_config.redis_url;
    redis_port = data_config.redis_port;
    ///////////////// DATA START //////////////////////////////////////////
    module.get_connect_db=function(db_name,callback){
        dataz.get_mongo_connect_db(db_name,function(error,db)
            {
                callback(error,db);
            });
    }
    module.set_close_db=function(db,callback){
        dataz.set_close_db(db,function()
            {
                callback();
            });
    }
    module.update_item=function(db,data_type,data_item,callback){
        dataz.update_cache_item(db,data_type,data_item,function(error,data)
            {
                callback(error,data);
            });
    }
    module.update_list=function(db,data_item_list,callback){
        dataz.update_list(db,data_item_list,function(error,data_list)
            {
                callback(error,data_list);
            });
    }
    module.get_item=function(db,data_type,tbl_id,callback){
        dataz.get_cache_item(db,data_type,tbl_id,function(error,data)
            {
                callback(error,appz.set_biz_item(data));
            });
    }
    module.get_sql=function(db,data_type,sql_obj,sort_by,callback){
        dataz.get_sql_cache(db,data_type,sql_obj,sort_by,function(error,data_list)
            {
                callback(error,data_list);
            });
    }
    module.get_sql_paging=function(db,data_type,sql_obj,sort_by,page_current,page_size,callback){
        dataz.get_sql_paging_cache(db,data_type,sql_obj,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.delete_item=function(db,data_type,tbl_id,callback){
        dataz.delete_cache_item(db,data_type,tbl_id,function(error,data)
            {
                callback(error,data);
            });
    }
    module.delete_sql=function(db,data_type,sql_obj,callback){
        dataz.delete_sql(db,data_type,sql_obj,function(error,data)
            {
                callback(error,data);
            });
    }
    module.delete_list = function(db,data_type,data_item_list,callback){
        dataz.delete_cache_list(db,data_type,data_item_list,function(error,data)
            {
                callback(error,data);
            });
    }
    module.count=function(db,data_type,sql,callback){
        dataz.count(db,data_type,sql,function(error,data)
            {
                callback(error,data);
            });
    }
    module.drop=function(db,data_type,callback){
        dataz.drop(db,data_type,function(error,data)
            {
                callback(error,data);
            });
    }
    ///////////////// DATA END //////////////////////////////////////////
    ///////////////// STRIPE START //////////////////////////////////////////
    module.get_stripe_redirect_url=function(stripe_config,retail_line_items,callback){
        stripe.get_stripe_redirect_url(stripe_config,retail_line_items,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_stripe_card_token=function(stripe_key,number,exp_month,exp_year,cvc,callback){
        stripe.get_stripe_card_token(stripe_key,number,exp_month,exp_year,cvc,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_stripe_card_charge=function(stripe_key,stripe_token,amount,description,callback){
        stripe.get_stripe_card_charge(stripe_key,stripe_token,amount,description,function(error,data)
            {
                callback(error,data);
            });
    }
    ///////////////// STRIPE END //////////////////////////////////////////
    ///////////////// SEND IN BLUE START //////////////////////////////////////////
    module.send_mail=function(send_in_blue_key,send_in_blue_obj,callback){
        send_in_blue.send_mail(send_in_blue_key,send_in_blue_obj,function(error,data)
            {
                callback(error,data);
            });
    }
    ///////////////// SEND IN BLUE END //////////////////////////////////////////
    ///////////////// AWZ START //////////////////////////////////////////
    module.set_biz_item=function(item){
        return appz.set_biz_item(item);
    }
    module.get_bucket_data=function(bucket,key,callback){
        awz.get_bucket_data(bucket,key,function(error,data)
            {
                callback(error,data);
            });
    }
    module.update_bucket=function(title,callback){
        awz.update_bucket(title,function(error,data)
            {
                callback(error,data);
            });
    }
    module.update_bucket_file=function(aws_config,bucket,file_path,key,content_type,callback){
        awz.update_bucket_file(aws_config,bucket,file_path,key,content_type,function(error,data)
            {
                callback(error,data);
            });
    }
    ///////////////// AWZ END //////////////////////////////////////////
    ///////////////// STATZ START //////////////////////////////////////////
    module.update_item_view_count = function(db,item_data_type,item_tbl_id,customer_id,callback) {
        statz.update_item_view_count(db,item_data_type,item_tbl_id,customer_id,function(error,data)
            {
                callback(error,data);
            });
    }
    ///////////////// STATZ START //////////////////////////////////////////
    ///////////////// APPZ START //////////////////////////////////////////
    module.set_item_data = function(data_type,tbl_id,item_data) {
        return appz.set_item_data(data_type,tbl_id,item_data);
    }
    module.get_new_item = function(data_type,tbl_id) {
        return appz.get_new_item(data_type,tbl_id);
    }
    module.get_new_biz_item = function(data_type,tbl_id) {
        return appz.get_new_biz_item(data_type,tbl_id);
    }
    module.get_test_user = function(){
        return appz.get_test_user();
    }
    module.get_test_item = function(date_type,tbl_id){
        return appz.get_test_item(date_type,tbl_id);
    }
    module.get_item_not_found=function(date_type,tbl_id) {
        return appz.get_item_not_found(date_type,tbl_id);
    }
    module.check_user = function(req,res,next){
        appz.check_user(req,res,next);
    }
    module.check_admin = function(req,res,next){
        appz.check_admin(req,res,next);
    }
    module.check_customer = function(req,res,next){
        appz.check_customer(req,res,next);
    }
    module.get_user = function(req){
        return appz.get_user(req);
    }
    module.save_user=function(req,user){
        appz.save_user(req,user);
    }
    module.del_user=function(req){
        appz.del_user(req);
    }
    module.get_cookie=function(req,title){
        return appz.get_cookie(req,title);
    }
    module.save_cookie=function(req,title,obj){
        appz.save_cookie(req,title,obj);
    }
    module.del_cookie=function(req,title){
        appz.del_cookie(req,title);
    }
    module.account_validate_password=function(password,callback){
        appz.account_validate_password(password,function(error,data)
            {
                callback(error,data);
            });
    }
    module.account_validate_email=function(db,data_type,tbl_id,email,callback){
        appz.account_validate_email(db,data_type,tbl_id,email,function(error,data)
            {
                callback(error,data);
            });
    }
    module.account_validate_user_name=function(db,data_type,tbl_id,user_name,callback){
        appz.account_validate_user_name(db,data_type,tbl_id,user_name,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_helper=function(req) {
        return appz.get_helper(req);
    }
    module.get_helper_user=function(req) {
        return appz.get_helper_user(req);
    }
    module.old_set_new_sub_item_parent=function(data_type,org_item){
        return appz.set_new_sub_item_parent(data_type,org_item);
    }
    module.set_new_sub_item=function(data_type,org_item){
        return appz.set_new_sub_item(data_type,org_item);
    }
    module.set_new_member=function(data_type,org_item){
        return appz.set_new_member(data_type,org_item);
    }
    module.set_new_blog_post=function(data_type,org_item){
        return appz.set_new_blog_post(data_type,org_item);
    }
    module.set_new_project=function(data_type,org_item){
        return appz.set_new_project(data_type,org_item);
    }
    module.set_new_service=function(data_type,org_item){
        return appz.set_new_service(data_type,org_item);
    }
    module.set_new_event=function(data_type,org_item){
        return appz.set_new_event(data_type,org_item);
    }
    module.set_new_product=function(data_type,org_item){
        return appz.set_new_product(data_type,org_item);
    }
    module.set_new_category=function(data_type,org_item){
        return appz.set_new_category(data_type,org_item);
    }
    module.get_key_sort_type=function(key){
        return appz.get_key_sort_type(key)
    }
    module.get_test_sub_note=function(){
        return appz.get_test_sub_note();
    }
    module.get_test_note=function(){
        return appz.get_test_note();
    }
    module.convert_biz_item=function(item,item_list){
        return appz.convert_biz_item(item,item_list);
    }
    module.get_category_title_list=function(){
        return appz.get_category_title_list();
    }
    module.get_blog_post=function(db,title_url,setting,callback){
        appz.get_blog_post(db,title_url,setting,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_member=function(db,tbl_id,setting,callback){
        appz.get_member(db,tbl_id,setting,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_memberz=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_member_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_product=function(db,title_url,callback){
        appz.get_product(db,title_url,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_event=function(db,title_url,setting,callback){
        appz.get_event(db,title_url,setting,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_eventz=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_event_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_videoz=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_video_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_productz=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_product_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
   module.get_category_biz_list=function(db,data_type,sort_by,page_current,page_size,callback){
        appz.get_category_biz_list(db,data_type,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.copy_photo_list=function(db,parent_tbl_id,new_parent_tbl_id,callback){
        appz.copy_photo_list(db,parent_tbl_id,new_parent_tbl_id,function(error,data_list)
            {
                callback(error,data_list);
            });
    }
    module.get_item_biz_review=function(db,item_tbl_id,callback){
        appz.get_item_biz_review(db,item_tbl_id,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_product_visible_option_list = function() {
        return appz.get_product_visible_option_list();
    }
    module.get_service_visible_option_list = function() {
        return appz.get_service_visible_option_list();
    }
    module.get_event_visible_option_list = function() {
        return appz.get_event_visible_option_list();
    }
    ///////////////// APPZ END //////////////////////////////////////////
    ///////////////// ORDER START //////////////////////////////////////////
    module.get_orderz=function(db,sql,sort_by,page_current,page_size,callback){
        orderz.get_order_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_cart_itemz=function(db,sql,callback){
        orderz.get_cart_item_list(db,sql,function(error,data_list)
            {
                callback(error,data_list);
            });
    }
    module.get_order=function(db,order_id,callback){
        orderz.get_order(db,order_id,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_order_by_tbl_id=function(db,tbl_id,callback){
        orderz.get_order_by_tbl_id(db,tbl_id,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_order_status=function(status_id){
        return orderz.get_order_status(status_id);
    }
    module.get_cart=function(db,sql,callback){
        orderz.get_cart(db,sql,function(error,data)
            {
                callback(error,data);
            });
    }
    module.set_cart=function(item_list,callback){
        orderz.set_cart(item_list,function(error,data)
            {
                callback(error,data);
            });
    }
    ///////////////// ORDER END //////////////////////////////////////////
    module.get_reviewz=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_review_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_servicez=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_service_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
  module.get_service=function(db,title_url,callback){
        appz.get_service(db,title_url,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_projectz=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_project_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_project=function(db,title_url,callback){
        appz.get_project(db,title_url,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_galleryz=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_gallery_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_gallery=function(db,title_url,callback){
        appz.get_gallery(db,title_url,function(error,data)
            {
                callback(error,data);
            });
    }
     module.get_item_biz_list=function(db,data_type,sql,sort_by,page_current,page_size,callback){
        appz.get_item_biz_list(db,data_type,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_blog_postz=function(db,sql,sort_by,page_current,page_size,callback){
        appz.get_blog_post_list(db,sql,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_categoryz=function(db,data_type,sort_by,page_current,page_size,callback){
        appz.get_category_list(db,data_type,sort_by,page_current,page_size,function(error,data_list,item_count,page_count)
            {
                callback(error,data_list,item_count,page_count);
            });
    }
    module.get_category=function(db,title_url,callback){
        appz.get_category(db,title_url,function(error,data)
            {
                callback(error,data);
            });
    }
   module.get_item_map_page=function(db,item_map_title_url,page_title_url,setting,callback){
        appz.get_item_map_page(db,item_map_title_url,page_title_url,setting,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_page=function(db,title_url,setting,callback){
        appz.get_page(db,title_url,setting,function(error,data)
            {
                callback(error,data);
            });
    }

    module.get_sub_page=function(db,page_title_url,sub_page_title_url,setting,callback){
        appz.get_sub_page(db,page_title_url,sub_page_title_url,setting,function(error,data)
            {
                callback(error,data);
            });
    }
    ///////////////// APP END //////////////////////////////////////////
    ///////////////// UTILITY START //////////////////////////////////////////
    module.o = function(title,str){
        utilityz.o(title,str);
    }
    module.get_guid=function(){
        return utilityz.get_guid();
    }
    module.get_title_url=function(title){
        return utilityz.get_title_url(title);
    }
    module.get_id=function(max){
        return utilityz.get_id(max);
    }
    module.get_query=function(window)
    {
        return utilityz.get_query(window);
    }
    module.get_date_time_str=function(date,time) {
        return utilityz.get_date_time_str(date,time);
    }
    module.get_date_str=function(date) {
        return utilityz.get_date_str(date);
    }
    module.get_time_str=function(date) {
        return utilityz.get_time_str(date);
    }
    module.get_date_time_obj=function(date) {
        return utilityz.get_date_time_obj(date);
    }
    module.get_date_time_pretty=function(date) {
        return utilityz.get_date_time_pretty(date);
    }
    module.get_iso_str_by_date_time=function(date,time) {
        return utilityz.get_iso_str_by_date_time(date,time);
    }
    module.get_slug=function(str){
        return utilityz.get_slug(str);
    }
    module.get_money=function(n) {
        return utilityz.get_money(n);
    }
    module.get_money_obj=function(n) {
        return appz.get_money_obj(n);
    }
    module.get_visible_product_obj=function(n) {
        return appz.get_visible_product_obj(n);
    }
    module.get_visible_service_obj=function(n) {
        return appz.get_visible_service_obj(n);
    }
    module.get_visible_event_obj=function(n) {
        return appz.get_visible_event_obj(n);
    }
    module.remove_money=function(n) {
        return utilityz.remove_money(n);
    }
    module.get_currency = function(amount) {
        return utilityz.get_currency(amount);
    }
    module.get_cents = function(number) {
        return utilityz.get_cents(number);
    }
    module.get_contains=function(value,searchFor){
        return utilityz.get_contains(value,searchFor);
    }
    module.remove_html_str=function(str){
        return utilityz.remove_html_str(str);
    }
    module.get_month_title_short=function(d){
        return utilityz.get_month_title_short(d);
    }
    module.get_month_title=function(d){
        return utilityz.get_month_title(d); }

    module.get_ip_address=function(callback){
        return utilityz.get_ip_address();
    }
    module.get_ip_address=function(callback){
        utilityz.get_ip_address(function(error,data)
            {
                callback(error,data);
            });
    }
    module.text_truncate=function(str,length,ending){
        return utilityz.text_truncate(str,length,ending);
    }
    module.get_file_ext=function(_file_path){
        return utilityz.get_file_ext(_file_path);
    }
    module.set_file_upload=function(req,file_path,callback){
        utilityz.set_file_upload(req,file_path,function(data)
            {
                callback(data);
            });
    }
    module.set_resize_photo_file=function(new_size,file_path,org_filename,new_filename,callback){
        utilityz.set_resize_photo_file(new_size,file_path,org_filename,new_filename,function(error,data)
            {
                callback(error,data);
            });
    }
    module.set_resize_square_photo_file=function(new_size,file_path,org_filename,new_filename,callback){
        utilityz.set_resize_square_photo_file(new_size,file_path,org_filename,new_filename,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_file_buffer=function(file_path,filename,callback){
        utilityz.get_file_buffer(file_path,filename,function(error,data)
            {
                callback(error,data);
            });
    }
    module.set_photo_file=function(file_path,org_filename,new_filename,callback){
        utilityz.set_photo_file(file_path,org_filename,new_filename,function(error,data)
            {
                callback(error,data);
            });
    }
    module.get_mp3_duration=function(secs){
        return utilityz.get_mp3_duration(secs);
    }
    module.validate_email=function(email){
        return utilityz.validate_email(email);
    }
    module.get_paging_list=function(data_list,page_current,page_size,callback){
        utilityz.get_paging_list(data_list,page_current,page_size,function(new_data_list,item_count,page_count)
            {
                callback(new_data_list,item_count,page_count);
            });
    }
    ///////////////// UTILITY END //////////////////////////////////////////
    return module;
}
