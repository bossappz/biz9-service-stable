/* Copyright (C) 2019 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-AppZ
 */
module.exports = function(app_config){
    APP_ID=app_config.app_id;
    APP_TITLE_ID=app_config.app_title_id;
    APP_TITLE=app_config.app_title;
    APP_VERSION=app_config.app_version;
    DT_ITEM_MAP='item_map_biz';
    DT_BLANK='blank_biz';
    DT_PHOTO='photo_biz';
    DT_USER='user_biz';
    DT_TEAM='team_biz';
    DT_ADMIN='admin_biz';
    DT_PROJECT='project_biz';
    DT_SUB_PROJECT='sub_project_biz';
    DT_GALLERY='gallery_biz';
    DT_DOCUMENT='document_biz';
    DT_PRODUCT='product_biz';
    DT_GENRE='genre_biz';
    DT_PRODUCT_CART='product_cart_biz';
    DT_SUB_PRODUCT='sub_product_biz';
    DT_BLOG_POST='blog_post_biz';
    DT_SUB_BLOG_POST='sub_blog_post_biz';
    DT_SERVICE='service_biz';
    DT_SUB_SERVICE='sub_service_biz';
    DT_ARTIST='artist_biz';
    DT_ALBUM='album_biz';
    DT_ALBUM_TRACK='album_tack_biz';
    DT_TRACK='track_biz';
    module.set_item_data = function(data_type,tbl_id,item_data){
        var item = {};
        for (key in  item_data) {
            item[key] = item_data[key].trim();
        }
        item['tbl_id'] = tbl_id;
        item['data_type'] = data_type;
        return item;
    }
    module.get_new_item=function(data_type,tbl_id) {
        return _get_new_item(data_type,tbl_id);
    }
    _get_new_item=function(data_type,tbl_id) {
        if(!tbl_id){
            tbl_id=0;
        }
        item = {data_type:data_type,tbl_id:tbl_id};
        return _set_biz_item(item);
    }
    module.get_test_user = function(){
        return _get_test_user();
    }
    module.get_test_item = function(data_type,tbl_id){
        if(!tbl_id){
            tbl_id=0;
        }
        if(!data_type){
            data_type=DT_BLANK;
        }
        item=_get_new_item(data_type,tbl_id);
        test_id=utilityz.get_id();
        item.order=test_id;
        item.title='title_'+test_id;
        item.sub_note='sub_note_'+test_id;
        return item;
    }
    function _get_test_user(){
        var test_id = utilityz.get_id();
        var item = _get_new_item(DT_USER,0);;
        item.email = 'email'+test_id+'@gmail.com';
        item.user_name = 'user_name'+test_id;
        item.first_name = 'firstname'+test_id;
        item.last_name = 'last_name'+test_id;
        item.password = '1234567';
        item.order=test_id;
        item=_set_biz_item(item);
        return item;
    }
    module.get_item_not_found=function(date_type,tbl_id) {
        return _get_item_not_found(date_type,tbl_id);
    }
    _get_item_not_found=function(data_type,tbl_id) {
        if(!data_type){
            data_type='blank';
        }
        if(!tbl_id){
            tbl_id=0;
        }
        var item=_get_new_item(data_type,tbl_id);
        return item;
    }
    module.check_user = function(req,res,next){
        var u = _get_user(req);
        check_ok=false;
        if(u.tbl_id!=0){
            if(u.data_type==DT_USER||u.data_type==DT_ADMIN){
                check_ok=true;
            }
        }
        if(check_ok){
            next();
        }
        else {
            res.redirect('/login');
        }
    }
    module.check_customer = function(req,res,next){
        var u = _get_user(req);
        check_ok=false;
        if(u.tbl_id!=0){
            if(u.data_type==DT_CUSTOMER||u.data_type==DT_USER||u.data_type==DT_ADMIN){
                check_ok=true;
            }
        }
        if(check_ok){
            next();
        }
        else {
            res.redirect('/login');
        }
    }
    module.check_admin = function(req,res,next){
        var u = _get_user(req);
        check_ok=false;
        if(u.tbl_id!=0){
            if(u.data_type==DT_ADMIN){
                check_ok=true;
            }
        }
        if(check_ok){
            next();
        }
        else {
            res.redirect('/login');
        }
    }
    module.get_user = function(req){
        return _get_user(req);
    }
    function _get_user(req){
        if(req.session.user){
            return _set_biz_item(req.session.user);
        }else{
            return _set_biz_item({tbl_id:0,data_type:DT_USER});
        }
    }
    module.save_user = function(req,user){
        _save_user(req,user);
    }
    function _save_user(req,user){
        req.session.user=user;
    }
    module.del_user = function(req){
        req.session.user=null;
        delete req.session.user;
    }
    module.get_cookie = function(req,title){
        return req.session[title];
    }
    module.save_cookie = function(req,title,obj){
        req.session[title]=obj;
    }
    module.del_cookie = function(req,title){
        req.session[title]=null;
        delete req.session[title];
    }
    module.account_validate_password = function(password,callback) {
        var error = null;
        async.series([
            function(call){
                if(!password){
                    error='Passwords must be at least 6 characters.';
                }
                else if(password.length<6){
                    error='Passwords must be at least 6 characters.';
                }
                call();
            }
        ],
            function(err, result){
                callback(error,0);
            });
    }
    module.account_validate_user_name=function(db,data_type,tbl_id,user_name,callback) {
        var error= null;
        async.series([
            function(call){
                // validate user_name length
                if(!user_name){
                    error='Invalid user name.';
                }
                else if(user_name.length<3){
                    error='Invalid user name.';
                }
                call();
            },
            // validate user_name owner
            function(call){
                if(error==null){
                    sql_obj = {user_name:user_name};
                    dataz.get_sql_cache(db,data_type,sql_obj,{},function(data_list){
                        if(data_list.length > 0){
                            // if item add, already exsist
                            if(tbl_id == '0'){
                                error = "The user name " + user_name+ " already exist.";
                                call();
                            }
                            // check owner of user name
                            else if(tbl_id != data_list[0].tbl_id){
                                error = "The user name " + user_name+ " already exist.";
                                call();
                            }
                            else{
                                // user_name availble
                                call();
                            }
                        }
                        else{
                            // user_name availble
                            call();
                        }
                    });
                }else{
                    call();
                }
            }
        ],
            // last
            function(err, result){
                callback(error,0);
            });
    }
    //email
    module.account_validate_email = function(db,data_type,tbl_id,email,callback) {
        var error = null;
        async.series([
            function(call){
                // validate email length
                if(!email){
                    error='Invalid email address.';
                }
                else if(email.length<3){
                    error='Invalid email address.';
                }
                else if(!utilityz.validate_email(email)){
                    error='Invalid email address.';
                }
                call();
            },
            // validate email owner
            function(call){
                if(error==null){
                    sql_obj = {email:email};
                    dataz.get_sql_cache(db,data_type,sql_obj,{},function(error,data_list){
                        error=error;
                        if(data_list.length > 0){
                            if(tbl_id == '0'){
                                error = "The email " + email+ " already exist.";
                                call();
                            }
                            else if(tbl_id != data_list[0].tbl_id){
                                error = "The email " + email+ " already exist.";
                                call();
                            }
                            else{
                                call();
                            }
                        }
                        else{
                            call();
                        }
                    });
                }else{
                    call();
                }
            }
        ],
            // last
            function(err, result){
                callback(error,0);
            });
    }
    module.get_helper = function(req) {
        var helper = {};
        helper.url =req.headers.host + req.originalUrl;
        helper.error=null;
        if(req.query){
            for (var key in  req.query) {
                helper[key] = req.query[key].trim();
            }
        }
        if(req.body){
            for (var key in  req.body) {
                if(String(req.body[key])){
                    req.body[key] = String(req.body[key]).trim();
                    helper[key] = String(req.body[key]).trim();
                }
            }
        }
        if(req.params){
            for (var key in req.params) {
                helper[key]=req.params[key].trim();
            }
        }
        helper.app_id=app_config.app_id;
        helper.app_title=app_config.app_title;
        helper.app_version=app_config.app_version;
        if(app_config.app_title_id){
            helper.app_title_id=app_config.app_title_id;
        }else{
            helper.app_title_id=helper.app_title_id;
        }
        return helper;
    }
    module.get_helper_user = function(req) {
        var helper = {};
        helper.url =req.headers.host + req.originalUrl;
        helper.user = _get_user(req);
        helper.error=null;
        if(req.query){
            for (var key in  req.query) {
                helper[key] = req.query[key].trim();
            }
        }
        if(req.body){
            for (var key in  req.body) {
                if(String(req.body[key])){
                    req.body[key] = String(req.body[key]).trim();
                    helper[key] = String(req.body[key]).trim();
                }
            }
        }
        if(req.params){
            for (var key in req.params) {
                helper[key]=req.params[key].trim();
            }
        }
        if(app_config.app_title_id){
            helper.app_title_id=app_config.app_title_id;
        }else{
            if(req.subdomains[0]){
                helper.app_title_id=req.subdomains[0];
            }else{
                helper.app_title_id=helper.app_title_id;
            }
        }
        return helper;
    }
    module.set_new_sub_item_parent=function(data_type,org_item){
        var _sub_item = _get_new_item(data_type,0);
        _sub_item.title=org_item.title;
        _sub_item.title_url=org_item.title_url;
        _sub_item.field_1=org_item.field_1;
        _sub_item.field_2=org_item.field_2;
        _sub_item.field_3=org_item.field_3;
        _sub_item.field_4=org_item.field_4;
        _sub_item.field_5=org_item.field_5;
        _sub_item.field_6=org_item.field_6;
        _sub_item.field_7=org_item.field_7;
        _sub_item.field_8=org_item.field_8;
        _sub_item.field_9=org_item.field_9;
        _sub_item.field_10=org_item.field_10;
        _sub_item.field_11=org_item.field_11;
        _sub_item.field_12=org_item.field_12;
        _sub_item.value_1=org_item.value_1;
        _sub_item.value_2=org_item.value_2;
        _sub_item.value_3=org_item.value_3;
        _sub_item.value_4=org_item.value_4;
        _sub_item.value_5=org_item.value_5;
        _sub_item.value_6=org_item.value_6;
        _sub_item.value_7=org_item.value_7;
        _sub_item.value_8=org_item.value_8;
        _sub_item.value_9=org_item.value_9;
        _sub_item.value_10=org_item.value_10;
        _sub_item.value_11=org_item.value_11;
        _sub_item.value_12=org_item.value_12;
        _sub_item.date_1=org_item.date_1;
        _sub_item.date_2=org_item.date_2;
        _sub_item.date_3=org_item.date_3;
        _sub_item.date_value_1=org_item.date_value_1;
        _sub_item.date_value_2=org_item.date_value_2;
        _sub_item.date_value_3=org_item.date_value_3;
        _sub_item.order=org_item.order;
        _sub_item.category=org_item.category;
        _sub_item.sub_note=org_item.sub_note;
        _sub_item.visible=org_item.visible;
        _sub_item.photofilename=org_item.photofilename;
        _sub_item.parent_tbl_id=org_item.parent_tbl_id;
        _sub_item.org_tbl_id=org_item.tbl_id;
        return _sub_item;
    }
    module.set_new_sub_item = function(data_type,org_item){
        var _sub_item = _get_new_item(data_type,0);
        if(org_item.is_parent){
            _sub_item.title='_copy_'+org_item.title;
            _sub_item.title_url='_copy_'+org_item.title_url;
        }else{
            _sub_item.title=org_item.title;
            _sub_item.title_url=org_item.title_url;
        }
        _sub_item.note=org_item.note;
        _sub_item.field_1=org_item.field_1;
        _sub_item.field_2=org_item.field_2;
        _sub_item.field_3=org_item.field_3;
        _sub_item.field_4=org_item.field_4;
        _sub_item.field_5=org_item.field_5;
        _sub_item.field_6=org_item.field_6;
        _sub_item.field_7=org_item.field_7;
        _sub_item.field_8=org_item.field_8;
        _sub_item.field_9=org_item.field_9;
        _sub_item.field_10=org_item.field_10;
        _sub_item.field_11=org_item.field_11;
        _sub_item.field_12=org_item.field_12;
        _sub_item.value_1=org_item.value_1;
        _sub_item.value_2=org_item.value_2;
        _sub_item.value_3=org_item.value_3;
        _sub_item.value_4=org_item.value_4;
        _sub_item.value_5=org_item.value_5;
        _sub_item.value_6=org_item.value_6;
        _sub_item.value_7=org_item.value_7;
        _sub_item.value_8=org_item.value_8;
        _sub_item.value_9=org_item.value_9;
        _sub_item.value_10=org_item.value_10;
        _sub_item.value_11=org_item.value_11;
        _sub_item.value_12=org_item.value_12;
        _sub_item.date_1=org_item.date_1;
        _sub_item.date_2=org_item.date_2;
        _sub_item.date_3=org_item.date_3;
        _sub_item.date_value_1=org_item.date_value_1;
        _sub_item.date_value_2=org_item.date_value_2;
        _sub_item.date_value_3=org_item.date_value_3;
        _sub_item.order=org_item.order;
        _sub_item.category=org_item.category;
        _sub_item.sub_note=org_item.sub_note;
        _sub_item.visible=org_item.visible;
        _sub_item.photofilename=org_item.photofilename;
        _sub_item.org_tbl_id=org_item.tbl_id;
        _sub_item.parent_tbl_id=org_item.parent_tbl_id;
        return _sub_item;
    }
    module.set_new_blog_post=function(data_type,org_item){
        var _blog_post = _get_new_item(data_type,0);
        _blog_post.title='_copy_'+org_item.title;
        _blog_post.title_url='_copy_'+org_item.title_url;
        _blog_post.photofilename=org_item.photofilename;
        _blog_post.visible=org_item.visible;
        _blog_post.category=org_item.category;
        _blog_post.order=org_item.order;
        _blog_post.note=org_item.note;
        _blog_post.tags=org_item.tags;
        _blog_post.html=org_item.html;
        _blog_post.sub_note=org_item.sub_note;
        _blog_post.search=org_item.search;
        _blog_post.field_1=org_item.field_1;
        _blog_post.field_2=org_item.field_2;
        _blog_post.field_3=org_item.field_3;
        _blog_post.field_4=org_item.field_4;
        _blog_post.field_5=org_item.field_5;
        _blog_post.field_6=org_item.field_6;
        _blog_post.field_7=org_item.field_7;
        _blog_post.field_8=org_item.field_8;
        _blog_post.field_9=org_item.field_9;
        _blog_post.field_10=org_item.field_10;
        _blog_post.field_11=org_item.field_11;
        _blog_post.field_12=org_item.field_12;
        _blog_post.date_1=org_item.date_1;
        _blog_post.date_2=org_item.date_2;
        _blog_post.date_3=org_item.date_3;
        _blog_post.date_value_1=org_item.date_value_1;
        _blog_post.date_value_2=org_item.date_value_2;
        _blog_post.date_value_3=org_item.date_value_3;
        _blog_post.value_1=org_item.value_1;
        _blog_post.value_2=org_item.value_2;
        _blog_post.value_3=org_item.value_3;
        _blog_post.value_4=org_item.value_4;
        _blog_post.value_5=org_item.value_5;
        _blog_post.value_6=org_item.value_6;
        _blog_post.value_7=org_item.value_7;
        _blog_post.value_8=org_item.value_8;
        _blog_post.value_9=org_item.value_9;
        _blog_post.value_10=org_item.value_10;
        _blog_post.value_11=org_item.value_11;
        _blog_post.value_12=org_item.value_12;
        return _blog_post;
    }
    module.get_blank_artist=function(){
        var _a = _get_new_item(DT_ARTIST,0);
        _a.artist_name='';
        return _a;
    }
    module.set_new_artist=function(data_type,org_item){
        var _artist = _get_new_item(data_type,0);
        _artist.artist_name='copy_'+org_item.artist_name;
        _artist.title_url='copy_'+org_item.title_url;
        _artist.photofilename=org_item.photofilename;
        _artist.visible=org_item.visible;
        _artist.category=org_item.category;
        _artist.order=org_item.order;
        _artist.note=org_item.note;
        _artist.sub_note=org_item.sub_note;
        _artist.html=org_item.html;
        _artist.tags=org_item.tags;
        _artist.price=org_item.price;
        _artist.sku=org_item.sku;
        _artist.genre_title=org_item.genre_title;
        _artist.city=org_item.city;
        _artist.country=org_item.country;
        _artist.field_1=org_item.field_1;
        _artist.field_2=org_item.field_2;
        _artist.field_3=org_item.field_3;
        _artist.field_4=org_item.field_4;
        _artist.field_5=org_item.field_5;
        _artist.field_6=org_item.field_6;
        _artist.field_7=org_item.field_7;
        _artist.field_8=org_item.field_8;
        _artist.field_9=org_item.field_9;
        _artist.field_10=org_item.field_10;
        _artist.field_11=org_item.field_11;
        _artist.field_12=org_item.field_12;
        _artist.value_1=org_item.value_1;
        _artist.value_2=org_item.value_2;
        _artist.value_3=org_item.value_3;
        _artist.value_4=org_item.value_4;
        _artist.value_5=org_item.value_5;
        _artist.value_6=org_item.value_6;
        _artist.value_7=org_item.value_7;
        _artist.value_8=org_item.value_8;
        _artist.value_9=org_item.value_9;
        _artist.value_10=org_item.value_10;
        _artist.value_11=org_item.value_11;
        _artist.value_12=org_item.value_12;
        _artist.date_1=org_item.date_1;
        _artist.date_2=org_item.date_2;
        _artist.date_3=org_item.date_3;
        _artist.date_value_1=org_item.date_value_1;
        _artist.date_value_2=org_item.date_value_2;
        _artist.date_value_3=org_item.date_value_3;
        _artist.search=org_item.search;
        return _artist;
    }
    module.set_new_video=function(data_type,org_item){
        var _video = _get_new_item(data_type,0);
        _video.title='copy_'+org_item.title;
        _video.title_url='copy_'+org_item.title_url;
        _video.photofilename=org_item.photofilename;
        _video.visible=org_item.visible;
        _video.category=org_item.category;
        _video.order=org_item.order;
        _video.note=org_item.note;
        _video.sub_note=org_item.sub_note;
        _video.html=org_item.html;
        _video.tags=org_item.tags;
        _video.price=org_item.price;
        _video.artist_tbl_id=org_item.artist_tbl_id;
        _video.genre_title=org_item.genre_title;
        _video.year=org_item.year;
        _video.record_label_title=org_item.record_label_title;
        _video.duration=org_item.duration;
        _video.filename=org_item.filename;
        _video.org_filename=org_item.org_filename;
        _video.field_1=org_item.field_1;
        _video.field_2=org_item.field_2;
        _video.field_3=org_item.field_3;
        _video.field_4=org_item.field_4;
        _video.field_5=org_item.field_5;
        _video.field_6=org_item.field_6;
        _video.field_7=org_item.field_7;
        _video.field_8=org_item.field_8;
        _video.field_9=org_item.field_9;
        _video.field_10=org_item.field_10;
        _video.field_11=org_item.field_11;
        _video.field_12=org_item.field_12;
        _video.value_1=org_item.value_1;
        _video.value_2=org_item.value_2;
        _video.value_3=org_item.value_3;
        _video.value_4=org_item.value_4;
        _video.value_5=org_item.value_5;
        _video.value_6=org_item.value_6;
        _video.value_7=org_item.value_7;
        _video.value_8=org_item.value_8;
        _video.value_9=org_item.value_9;
        _video.value_10=org_item.value_10;
        _video.value_11=org_item.value_11;
        _video.value_12=org_item.value_12;
        _video.date_1=org_item.date_1;
        _video.date_2=org_item.date_2;
        _video.date_3=org_item.date_3;
        _video.date_value_1=org_item.date_value_1;
        _video.date_value_2=org_item.date_value_2;
        _video.date_value_3=org_item.date_value_3;
        _video.search=org_item.search;
        return _video;
    }
    module.set_new_video=function(data_type,org_item){
        var _video = _get_new_item(data_type,0);
        _video.title='copy_'+org_item.title;
        _video.title_url='copy_'+org_item.title_url;
        _video.photofilename=org_item.photofilename;
        _video.visible=org_item.visible;
        _video.category=org_item.category;
        _video.order=org_item.order;
        _video.note=org_item.note;
        _video.sub_note=org_item.sub_note;
        _video.html=org_item.html;
        _video.tags=org_item.tags;
        _video.youtube_url=org_item.youtube_url;
        _video.artist_tbl_id=org_item.artist_tbl_id;
        _video.genre_title=org_item.genre_title;
        _video.duration=org_item.duration;
        _video.filename=org_item.filename;
        _video.org_filename=org_item.org_filename;
        _video.field_1=org_item.field_1;
        _video.field_2=org_item.field_2;
        _video.field_3=org_item.field_3;
        _video.field_4=org_item.field_4;
        _video.field_5=org_item.field_5;
        _video.field_6=org_item.field_6;
        _video.field_7=org_item.field_7;
        _video.field_8=org_item.field_8;
        _video.field_9=org_item.field_9;
        _video.field_10=org_item.field_10;
        _video.field_11=org_item.field_11;
        _video.field_12=org_item.field_12;
        _video.value_1=org_item.value_1;
        _video.value_2=org_item.value_2;
        _video.value_3=org_item.value_3;
        _video.value_4=org_item.value_4;
        _video.value_5=org_item.value_5;
        _video.value_6=org_item.value_6;
        _video.value_7=org_item.value_7;
        _video.value_8=org_item.value_8;
        _video.value_9=org_item.value_9;
        _video.value_10=org_item.value_10;
        _video.value_11=org_item.value_11;
        _video.value_12=org_item.value_12;
        _video.date_1=org_item.date_1;
        _video.date_2=org_item.date_2;
        _video.date_3=org_item.date_3;
        _video.date_value_1=org_item.date_value_1;
        _video.date_value_2=org_item.date_value_2;
        _video.date_value_3=org_item.date_value_3;
        _video.search=org_item.search;
        return _video;
    }
    module.set_new_album=function(data_type,org_item){
        var _album = _get_new_item(data_type,0);
        _album.title='copy_'+org_item.title;
        _album.title_url='copy_'+org_item.title_url;
        _album.photofilename=org_item.photofilename;
        _album.visible=org_item.visible;
        _album.category=org_item.category;
        _album.order=org_item.order;
        _album.note=org_item.note;
        _album.sub_note=org_item.sub_note;
        _album.html=org_item.html;
        _album.tags=org_item.tags;
        _album.price=org_item.price;
        _album.artist_tbl_id=org_item.artist_tbl_id;
        _album.genre_title=org_item.genre_title;
        _album.year=org_item.year;
        _album.record_label_title=org_item.record_label_title;
        _album.field_1=org_item.field_1;
        _album.field_2=org_item.field_2;
        _album.field_3=org_item.field_3;
        _album.field_4=org_item.field_4;
        _album.field_5=org_item.field_5;
        _album.field_6=org_item.field_6;
        _album.field_7=org_item.field_7;
        _album.field_8=org_item.field_8;
        _album.field_9=org_item.field_9;
        _album.field_10=org_item.field_10;
        _album.field_11=org_item.field_11;
        _album.field_12=org_item.field_12;
        _album.value_1=org_item.value_1;
        _album.value_2=org_item.value_2;
        _album.value_3=org_item.value_3;
        _album.value_4=org_item.value_4;
        _album.value_5=org_item.value_5;
        _album.value_6=org_item.value_6;
        _album.value_7=org_item.value_7;
        _album.value_8=org_item.value_8;
        _album.value_9=org_item.value_9;
        _album.value_10=org_item.value_10;
        _album.value_11=org_item.value_11;
        _album.value_12=org_item.value_12;
        _album.date_1=org_item.date_1;
        _album.date_2=org_item.date_2;
        _album.date_3=org_item.date_3;
        _album.date_value_1=org_item.date_value_1;
        _album.date_value_2=org_item.date_value_2;
        _album.date_value_3=org_item.date_value_3;
        _album.search=org_item.search;
        return _album;
    }
    module.set_new_event=function(data_type,org_item){
        var _event = _get_new_item(data_type,0);
        _event.title='copy_'+org_item.title;
        _event.title_url='copy_'+org_item.title_url;
        _event.photofilename=org_item.photofilename;
        _event.visible=org_item.visible;
        _event.start_date=org_item.start_date;
        _event.start_time=org_item.start_time;
        _event.location=org_item.location;
        _event.type=org_item.type;
        _event.category=org_item.category;
        _event.price=org_item.price;
        _event.order=org_item.order;
        _event.note=org_item.note;
        _event.sub_note=org_item.sub_note;
        _event.html=org_item.html;
        _event.tags=org_item.tags;
        _event.field_1=org_item.field_1;
        _event.field_2=org_item.field_2;
        _event.field_3=org_item.field_3;
        _event.field_4=org_item.field_4;
        _event.field_5=org_item.field_5;
        _event.field_6=org_item.field_6;
        _event.field_7=org_item.field_7;
        _event.field_8=org_item.field_8;
        _event.field_9=org_item.field_9;
        _event.field_10=org_item.field_10;
        _event.field_11=org_item.field_11;
        _event.field_12=org_item.field_12;
        _event.value_1=org_item.value_1;
        _event.value_2=org_item.value_2;
        _event.value_3=org_item.value_3;
        _event.value_4=org_item.value_4;
        _event.value_5=org_item.value_5;
        _event.value_6=org_item.value_6;
        _event.value_7=org_item.value_7;
        _event.value_8=org_item.value_8;
        _event.value_9=org_item.value_9;
        _event.value_10=org_item.value_10;
        _event.value_11=org_item.value_11;
        _event.value_12=org_item.value_12;
        _event.date_1=org_item.date_1;
        _event.date_2=org_item.date_2;
        _event.date_3=org_item.date_3;
        _event.date_value_1=org_item.date_value_1;
        _event.date_value_2=org_item.date_value_2;
        _event.date_value_3=org_item.date_value_3;
        _event.search=org_item.search;
        return _event;
    }
    module.set_new_playlist=function(data_type,org_item){
        var _playlist = _get_new_item(data_type,0);
        _playlist.title='copy_'+org_item.title;
        _playlist.title_url='copy_'+org_item.title_url;
        _playlist.photofilename=org_item.photofilename;
        _playlist.visible=org_item.visible;
        _playlist.category=org_item.category;
        _playlist.order=org_item.order;
        _playlist.note=org_item.note;
        _playlist.sub_note=org_item.sub_note;
        _playlist.html=org_item.html;
        _playlist.tags=org_item.tags;
        _playlist.field_1=org_item.field_1;
        _playlist.field_2=org_item.field_2;
        _playlist.field_3=org_item.field_3;
        _playlist.field_4=org_item.field_4;
        _playlist.field_5=org_item.field_5;
        _playlist.field_6=org_item.field_6;
        _playlist.field_7=org_item.field_7;
        _playlist.field_8=org_item.field_8;
        _playlist.field_9=org_item.field_9;
        _playlist.field_10=org_item.field_10;
        _playlist.field_11=org_item.field_11;
        _playlist.field_12=org_item.field_12;
        _playlist.value_1=org_item.value_1;
        _playlist.value_2=org_item.value_2;
        _playlist.value_3=org_item.value_3;
        _playlist.value_4=org_item.value_4;
        _playlist.value_5=org_item.value_5;
        _playlist.value_6=org_item.value_6;
        _playlist.value_7=org_item.value_7;
        _playlist.value_8=org_item.value_8;
        _playlist.value_9=org_item.value_9;
        _playlist.value_10=org_item.value_10;
        _playlist.value_11=org_item.value_11;
        _playlist.value_12=org_item.value_12;
        _playlist.date_1=org_item.date_1;
        _playlist.date_2=org_item.date_2;
        _playlist.date_3=org_item.date_3;
        _playlist.date_value_1=org_item.date_value_1;
        _playlist.date_value_2=org_item.date_value_2;
        _playlist.date_value_3=org_item.date_value_3;
        _playlist.search=org_item.search;
        return _track;
    }
    module.set_new_podcast=function(data_type,org_item){
        var _podcast = _get_new_item(data_type,0);
        _podcast.title='copy_'+org_item.title;
        _podcast.title_url='copy_'+org_item.title_url;
        _podcast.photofilename=org_item.photofilename;
        _podcast.visible=org_item.visible;
        _podcast.category=org_item.category;
        _podcast.order=org_item.order;
        _podcast.note=org_item.note;
        _podcast.sub_note=org_item.sub_note;
        _podcast.html=org_item.html;
        _podcast.tags=org_item.tags;
        _podcast.genre_title=org_item.genre_title;
        _podcast.artist_tbl_id=org_item.artist_tbl_id;
        _podcast.duration=org_item.duration;
        _podcast.mp3_filename=org_item.mp3_filename;
        _podcast.org_filename=org_item.org_filename;
        _podcast.field_1=org_item.field_1;
        _podcast.field_2=org_item.field_2;
        _podcast.field_3=org_item.field_3;
        _podcast.field_4=org_item.field_4;
        _podcast.field_5=org_item.field_5;
        _podcast.field_6=org_item.field_6;
        _podcast.field_7=org_item.field_7;
        _podcast.field_8=org_item.field_8;
        _podcast.field_9=org_item.field_9;
        _podcast.field_10=org_item.field_10;
        _podcast.field_11=org_item.field_11;
        _podcast.field_12=org_item.field_12;
        _podcast.value_1=org_item.value_1;
        _podcast.value_2=org_item.value_2;
        _podcast.value_3=org_item.value_3;
        _podcast.value_4=org_item.value_4;
        _podcast.value_5=org_item.value_5;
        _podcast.value_6=org_item.value_6;
        _podcast.value_7=org_item.value_7;
        _podcast.value_8=org_item.value_8;
        _podcast.value_9=org_item.value_9;
        _podcast.value_10=org_item.value_10;
        _podcast.value_11=org_item.value_11;
        _podcast.value_12=org_item.value_12;
        _podcast.date_1=org_item.date_1;
        _podcast.date_2=org_item.date_2;
        _podcast.date_3=org_item.date_3;
        _podcast.date_value_1=org_item.date_value_1;
        _podcast.date_value_2=org_item.date_value_2;
        _podcast.date_value_3=org_item.date_value_3;
        _podcast.search=org_item.search;
        return _podcast;
    }
    module.set_new_track=function(data_type,org_item){
        var _track = _get_new_item(data_type,0);
        _track.title='copy_'+org_item.title;
        _track.title_url='copy_'+org_item.title_url;
        _track.photofilename=org_item.photofilename;
        _track.visible=org_item.visible;
        _track.category=org_item.category;
        _track.order=org_item.order;
        _track.note=org_item.note;
        _track.sub_note=org_item.sub_note;
        _track.html=org_item.html;
        _track.tags=org_item.tags;
        _track.price=org_item.price;
        _track.genre_title=org_item.genre_title;
        _track.artist_tbl_id=org_item.artist_tbl_id;
        _track.duration=org_item.duration;
        _track.mp3_filename=org_item.mp3_filename;
        _track.org_filename=org_item.org_filename;
        _track.field_1=org_item.field_1;
        _track.field_2=org_item.field_2;
        _track.field_3=org_item.field_3;
        _track.field_4=org_item.field_4;
        _track.field_5=org_item.field_5;
        _track.field_6=org_item.field_6;
        _track.field_7=org_item.field_7;
        _track.field_8=org_item.field_8;
        _track.field_9=org_item.field_9;
        _track.field_10=org_item.field_10;
        _track.field_11=org_item.field_11;
        _track.field_12=org_item.field_12;
        _track.value_1=org_item.value_1;
        _track.value_2=org_item.value_2;
        _track.value_3=org_item.value_3;
        _track.value_4=org_item.value_4;
        _track.value_5=org_item.value_5;
        _track.value_6=org_item.value_6;
        _track.value_7=org_item.value_7;
        _track.value_8=org_item.value_8;
        track.value_9=org_item.value_9;
        _track.value_10=org_item.value_10;
        _track.value_11=org_item.value_11;
        _track.value_12=org_item.value_12;
        _track.date_1=org_item.date_1;
        _track.date_2=org_item.date_2;
        _track.date_3=org_item.date_3;
        _track.date_value_1=org_item.date_value_1;
        _track.date_value_2=org_item.date_value_2;
        _track.date_value_3=org_item.date_value_3;
        _track.search=org_item.search;
        return _track;
    }
    module.set_new_product=function(data_type,org_item){
        var _product = _get_new_item(data_type,0);
        _product.title='copy_'+org_item.title;
        _product.title_url='copy_'+org_item.title_url;
        _product.photofilename=org_item.photofilename;
        _product.visible=org_item.visible;
        _product.category=org_item.category;
        _product.order=org_item.order;
        _product.note=org_item.note;
        _product.sub_note=org_item.sub_note;
        _product.html=org_item.html;
        _product.tags=org_item.tags;
        _product.price=org_item.price;
        _product.original_price=org_item.original_price;
        _product.stock=org_item.stock;
        _product.sku=org_item.sku;
        _product.type=org_item.type;
        _product.sub_type=org_item.sub_type;
        _product.field_1=org_item.field_1;
        _product.field_2=org_item.field_2;
        _product.field_3=org_item.field_3;
        _product.field_4=org_item.field_4;
        _product.field_5=org_item.field_5;
        _product.field_6=org_item.field_6;
        _product.field_7=org_item.field_7;
        _product.field_8=org_item.field_8;
        _product.field_9=org_item.field_9;
        _product.field_10=org_item.field_10;
        _product.field_11=org_item.field_11;
        _product.field_12=org_item.field_12;
        _product.value_1=org_item.value_1;
        _product.value_2=org_item.value_2;
        _product.value_3=org_item.value_3;
        _product.value_4=org_item.value_4;
        _product.value_5=org_item.value_5;
        _product.value_6=org_item.value_6;
        _product.value_7=org_item.value_7;
        _product.value_8=org_item.value_8;
        _product.value_9=org_item.value_9;
        _product.value_10=org_item.value_10;
        _product.value_11=org_item.value_11;
        _product.value_12=org_item.value_12;
        _product.date_1=org_item.date_1;
        _product.date_2=org_item.date_2;
        _product.date_3=org_item.date_3;
        _product.date_value_1=org_item.date_value_1;
        _product.date_value_2=org_item.date_value_2;
        _product.date_value_3=org_item.date_value_3;
        _product.search=org_item.search;
        return _product;
    }
    module.set_new_project=function(data_type,org_item){
        var _project=_get_new_item(data_type,0);
        _project.title='copy_'+org_item.title;
        _project.title_url='copy_'+org_item.title_url;
        _project.visible=org_item.visible;
        _project.category=org_item.category;
        _project.sub_note=org_item.sub_note;
        _project.type=org_item.type;
        _project.sub_type=org_item.sub_type;
        _project.order=org_item.order;
        _project.note=org_item.note;
        _project.photofilename=org_item.photofilename;
        _project.tags=org_item.tags;
        _project.html=org_item.html;
        _project.regular_price=org_item.regular_price;
        _project.sale_price=org_item.sale_price;
        _project.field_1=org_item.field_1;
        _project.field_2=org_item.field_2;
        _project.field_3=org_item.field_3;
        _project.field_4=org_item.field_4;
        _project.field_5=org_item.field_5;
        _project.field_6=org_item.field_6;
        _project.field_7=org_item.field_7;
        _project.field_8=org_item.field_8;
        _project.field_9=org_item.field_9;
        _project.field_10=org_item.field_10;
        _project.field_11=org_item.field_11;
        _project.field_12=org_item.field_12;
        _project.value_1=org_item.value_1;
        _project.value_2=org_item.value_2;
        _project.value_3=org_item.value_3;
        _project.value_4=org_item.value_4;
        _project.value_5=org_item.value_5;
        _project.value_6=org_item.value_6;
        _project.value_7=org_item.value_7;
        _project.value_8=org_item.value_8;
        _project.value_9=org_item.value_9;
        _project.value_10=org_item.value_10;
        _project.value_11=org_item.value_11;
        _project.value_12=org_item.value_12;
        _project.date_1=org_item.date_1;
        _project.date_2=org_item.date_2;
        _project.date_3=org_item.date_3;
        _project.date_value_1=org_item.date_value_1;
        _project.date_value_2=org_item.date_value_2;
        _project.date_value_3=org_item.date_value_3;
        _project.search=org_item.search;
        return _project;
    }
    module.set_new_service=function(data_type,org_item){
        var _service=_get_new_item(data_type,0);
        _service.title='copy_'+org_item.title;
        _service.title_url='copy_'+org_item.title_url;
        _service.visible=org_item.visible;
        _service.category=org_item.category;
        _service.sub_note=org_item.sub_note;
        _service.price=org_item.price;
        _service.type=org_item.type;
        _service.sub_type=org_item.sub_type;
        _service.order=org_item.order;
        _service.note=org_item.note;
        _service.photofilename=org_item.photofilename;
        _service.tags=org_item.tags;
        _service.html=org_item.html;
        _service.regular_price=org_item.regular_price;
        _service.sale_price=org_item.sale_price;
        _service.field_1=org_item.field_1;
        _service.field_2=org_item.field_2;
        _service.field_3=org_item.field_3;
        _service.field_4=org_item.field_4;
        _service.field_5=org_item.field_5;
        _service.field_6=org_item.field_6;
        _service.field_7=org_item.field_7;
        _service.field_8=org_item.field_8;
        _service.field_9=org_item.field_9;
        _service.field_10=org_item.field_10;
        _service.field_11=org_item.field_11;
        _service.field_12=org_item.field_12;
        _service.value_1=org_item.value_1;
        _service.value_2=org_item.value_2;
        _service.value_3=org_item.value_3;
        _service.value_4=org_item.value_4;
        _service.value_5=org_item.value_5;
        _service.value_6=org_item.value_6;
        _service.value_7=org_item.value_7;
        _service.value_8=org_item.value_8;
        _service.value_9=org_item.value_9;
        _service.value_10=org_item.value_10;
        _service.value_11=org_item.value_11;
        _service.value_12=org_item.value_12;
        _service.date_1=org_item.date_1;
        _service.date_2=org_item.date_2;
        _service.date_3=org_item.date_3;
        _service.date_value_1=org_item.date_value_1;
        _service.date_value_2=org_item.date_value_2;
        _service.date_value_3=org_item.date_value_3;
        _service.search=org_item.search;
        return _service;
    }
    module.get_key_sort_type=function(key){
        return _get_key_sort_type(key);
    }
    _get_key_sort_type=function(key){
        sort={order:1};
        if(key.setting_sort_type=='order'){
            if(key.setting_sort_order=='asc'){
                sort={order:1};
            }else{
                sort={order:-1};
            }
        }
        else if(key.setting_sort_type=='date_create'){
            if(key.setting_sort_order=='asc'){
                sort={date_create:1};
            }else{
                sort={date_create:-1};
            }
        }
        return sort;
    }
    module.set_biz_item=function(item){
        return _set_biz_item(item);
    }
    _set_biz_item=function(item){
        var no_photo=true;
        _photo_size_album='';
        _photo_size_thumb='thumb_size_';
        _photo_size_mid='mid_size_';
        _photo_size_large='large_size_';
        if(!item){
            biz9.o('_set_biz_item_not_found',item);
        }
        if(item.photofilename){
            no_photo=false;
            item.album_photo_url=app_config.file_url+item.photofilename;
            item.thumb_photo_url=app_config.file_url+_photo_size_thumb+item.photofilename;
            item.mid_photo_url=app_config.file_url+ _photo_size_mid+item.photofilename;
            item.large_photo_url=app_config.file_url+_photo_size_large+item.photofilename;
        }
        if(no_photo){
            str='/images/no_image.png';
            item.album_photo_url=str;
            item.thumb_photo_url=str;
            item.mid_photo_url=str;
            item.large_photo_url=str;
            item.photofilename=null;
        }
        if(item.date_create){
            item.pretty_date_create=utilityz.get_date_pretty(item.date_create);
            item.pretty_date_save=utilityz.get_date_pretty(item.date_save);
            item.full_date_create=utilityz.get_datetime_full(item.date_create);
            item.full_date_save=utilityz.get_datetime_full(item.date_save);
            item.date_obj={short_date:utilityz.get_date_full_obj(item.date_create).date()
,short_month:utilityz.get_month_title_short(utilityz.get_date_full_obj(item.date_create).month()+1)};
        }
        if(app_config.biz_map==true){
            if(item.field_1){
                item[item.field_1]=item.value_1;
            }
            if(item.field_2){
                item[item.field_2]=item.value_2;
            }
            if(item.field_3){
                item[item.field_3]=item.value_3;
            }
            if(item.field_4){
                item[item.field_4]=item.value_4;
            }

            if(item.field_5){
                item[item.field_5]=item.value_5;
            }
            if(item.field_6){
                item[item.field_6]=item.value_6;
            }
            if(item.field_7){
                item[item.field_7]=item.value_7;
            }
            if(item.field_8){
                item[item.field_8]=item.value_8;
            }
            if(item.field_9){
                item[item.field_9]=item.value_9;
            }
            if(item.field_10){
                item[item.field_10]=item.value_10;
            }
            if(item.field_11){
                item[item.field_11]=item.value_11;
            }
            if(item.field_12){
                item[item.field_12]=item.value_12;
            }
            if(item.date_1){
                item[item.date_1]=biz9.get_date_full(item.value_9);
            }
            if(item.date_2){
                item[item.date_2]=biz9.get_date_full(item.value_10);
            }
            if(item.date_3){
                item[item.date_3]=biz9.get_date_full(item.value_11);
            }
            if(item.date_value_1){
                item[item.date_value_1]=biz9.get_date_full(item.date_value_1);
            }
            if(item.date_value_2){
                item[item.date_value_2]=biz9.get_date_full(item.date_value_2);
            }
            if(item.date_value_3){
                item[item.date_value_3]=biz9.get_date_full(item.date_value_3);
            }
        }
        return item;
    }
    module.get_test_note=function(){
        var str = "<div>"+
            "<h2>What is Lorem Ipsum?</h2>"+
            "<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and"+
            "typesetting industry. Lorem Ipsum has been the industry's standard "+
            "dummy text ever since the 1500s, when an unknown printer took a galley "+
            "of type and scrambled it to make a type specimen book. It has survived"+
            "not only five centuries, but also the leap into electronic typesetting, "+
            "remaining essentially unchanged. It was popularised in the 1960s with  "+
            "the release of Letraset sheets containing Lorem Ipsum passages, and more "+
            "recently with desktop publishing software like Aldus PageMaker "+
            "including versions of Lorem Ipsum.</p> "+
            "</div><div> "+
            "<h2>Why do we use it?</h2> "+
            "<p>It is a long established fact that a reader will be distracted by the "+
            "readable content of a page when looking at its layout. The point of  "+
            "using Lorem Ipsum is that it has a more-or-less normal distribution of  "+
            "letters, as opposed to using 'Content here, content here', making it  "+
            "look like readable English. Many desktop publishing packages and web  "+
            "page editors now use Lorem Ipsum as their default model text, and a  "+
            "search for 'lorem ipsum' will uncover many web sites still in their  "+
            "infancy. Various versions have evolved over the years, sometimes by  "+
            "accident, sometimes on purpose (injected humour and the like).</p> "+
            "</div><br><div> "+
            "	injected humour, or non-characteristic words etc.</p>";
        return str;
    }
    module.get_blog_post=function(db,title_url,callback){
        var blog_post=appz.get_new_item(DT_BLOG_POST,0);
        var full_photo_list=[];
        var other_list=[];
        async.series([
            function(call){
                sql = {title_url:title_url};
                sort={};
                _get_sql_cache(db,DT_BLOG_POST,sql,sort,function(error,data_list) {
                    error=error;
                    if(data_list.length>0){
                        if(data_list[0].tbl_id!=0 &&data_list[0]){
                            blog_post=data_list[0];
                            blog_post.month_short_date_create=biz9.get_month_title_short(1+biz9.get_datetime_full_obj(blog_post.date_create).month());
                            blog_post.month_date_create=biz9.get_month_title(1+biz9.get_datetime_full_obj(blog_post.date_create).month());
                            blog_post.date_date_create=biz9.get_datetime_full_obj(blog_post.date_create).date();
                            blog_post.year_date_create=biz9.get_datetime_full_obj(blog_post.date_create).year();
                        }
                    }
                    blog_post.photos=[];
                    blog_post.items=[];
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    for(a=0;a<data_list.length;a++){
                        full_photo_list.push(data_list[a]);
                    }
                    call();
                });
            },
            function(call){
                sql={parent_tbl_id:blog_post.tbl_id};
                sort={order:1};
                _get_sql_cache(db,DT_SUB_BLOG_POST,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    top_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    top_list[a].items=[];
                    top_list[a].photos=[];
                }
                call();
            },
            function(call){
                sql = {};
                sort={order:1};
                _get_sql_cache(db,DT_SUB_BLOG_POST,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    other_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<other_list.length;a++){
                    other_list[a].items=[];
                    other_list[a].photos=[];
                }
                call();
            },
            function(call){
                for(a=0;a<full_photo_list.length;a++){
                    if(blog_post.tbl_id==full_photo_list[a].parent_tbl_id){
                        blog_post.photos.push(full_photo_list[a]);
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    for(b=0;b<full_photo_list.length;b++){
                        if(top_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            top_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<other_list.length;a++){
                    for(b=0;b<full_photo_list.length;b++){
                        if(other_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            other_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    for(b=0;b<other_list.length;b++){
                        if(top_list[a].tbl_id==other_list[b].parent_tbl_id){
                            for(c=0;c<other_list.length;c++){
                                if(other_list[b].tbl_id==other_list[c].parent_tbl_id){
                                    for(d=0;d<other_list.length;d++){
                                        if(other_list[c].tbl_id==other_list[d].parent_tbl_id){
                                            other_list[c][other_list[d].title_url]=other_list[d];
                                            other_list[c].items.push(other_list[d]);
                                        }
                                    }
                                    other_list[b][other_list[c].title_url]=other_list[c];
                                    other_list[b].items.push(other_list[c]);
                                }
                            }
                            top_list[a][other_list[b].title_url]=other_list[b];
                            top_list[a].items.push(other_list[b]);
                        }
                    }
                    blog_post[top_list[a].title_url]=top_list[a];
                    blog_post.items.push(top_list[a]);
                }
                call();
            },
        ],
            function(err, result){
                callback(error,blog_post);
            });
    }
    module.get_product=function(db,title_url,callback){
        var product=appz.get_new_item(DT_PRODUCT,0);
        var full_photo_list=[];
        var other_list=[];
        async.series([
            function(call){
                sql = {title_url:title_url};
                sort={};
                _get_sql_cache(db,DT_PRODUCT,sql,sort,function(error,data_list) {
                    error=error;
                    if(data_list.length>0){
                        if(data_list[0].tbl_id!=0 &&data_list[0]){
                            product=data_list[0];
                        }
                    }
                    product.money_price=utilityz.get_money(product.price);
                    product.photos=[];
                    product.items=[];
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    for(a=0;a<data_list.length;a++){
                        full_photo_list.push(data_list[a]);
                    }
                    call();
                });
            },
            function(call){
                sql={parent_tbl_id:product.tbl_id};
                sort={order:1};
                _get_sql_cache(db,DT_SUB_PRODUCT,sql,sort,function(error,data_list) {
                     if(error){
                        error=error;
                    }
                    top_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    top_list[a]=top_list[a];
                    top_list[a].items=[];
                    top_list[a].photos=[];
                }
                call();
            },
            function(call){
                sql = {};
                sort={order:1};
                _get_sql_cache(db,DT_SUB_PRODUCT,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    other_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<other_list.length;a++){
                    other_list[a]=other_list[a];
                    other_list[a].items=[];
                    other_list[a].photos=[];
                }
                call();
            },
            function(call){
                for(a=0;a<full_photo_list.length;a++){
                    if(product.tbl_id==full_photo_list[a].parent_tbl_id){
                        product.photos.push(full_photo_list[a]);
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    for(b=0;b<full_photo_list.length;b++){
                        if(top_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            top_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<other_list.length;a++){
                    for(b=0;b<full_photo_list.length;b++){
                        if(other_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            other_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    for(b=0;b<other_list.length;b++){
                        if(top_list[a].tbl_id==other_list[b].parent_tbl_id){
                            for(c=0;c<other_list.length;c++){
                                if(other_list[b].tbl_id==other_list[c].parent_tbl_id){
                                    for(d=0;d<other_list.length;d++){
                                        if(other_list[c].tbl_id==other_list[d].parent_tbl_id){
                                            other_list[c][other_list[d].title_url]=other_list[d];
                                            other_list[c].items.push(other_list[d]);
                                        }
                                    }
                                    other_list[b][other_list[c].title_url]=other_list[c];
                                    other_list[b].items.push(other_list[c]);
                                }
                            }
                            top_list[a][other_list[b].title_url]=other_list[b];
                            top_list[a].items.push(other_list[b]);
                        }
                    }
                    product[top_list[a].title_url]=top_list[a];
                    product.items.push(top_list[a]);
                }
                call();
            },
        ],
            function(err, result){
                callback(error,product);
            });
    }
    //setting
    //
    //setting.filter_category
    //setting.filter_search
    //setting.count
    //
    //paging
    //
    //setting.page_size
    //setting.page_current
    //
    //paging_return
    //
    //	paging_return=dt_total;
    //	paging_return=page_page_total;
    module.get_sub_page=function(db,page_title_url,sub_page_title_url,setting,callback){
        var item_map=appz.get_new_item(DT_ITEM_MAP,0);
        var sub_page=appz.get_new_item(DT_BLANK,0);
        sub_page.title_url=sub_page_title_url;
        var dt_total=0;
        var page_page_total=0;
        var full_photo_list=[];
        var top_list=[];
        var other_list=[];
        var error=null;
        async.series([
            function(call){
                sql = {title_url:page_title_url};
                sort={};
                _get_sql_cache(db,DT_ITEM_MAP,sql,sort,function(error,data_list) {
                    error=error;
                    if(data_list.length>0){
                        item_map=data_list[0];
                    }
                    item_map.photos=[];
                    item_map.items=[];
                    call();
                });
            },
            function(call){
                if(item_map.tbl_id!=0){
                    sql = {title_url:sub_page_title_url};
                    sort={};
                    _get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
                        if(error){
                            error=error;
                        }
                        if(data_list.length>0){
                            sub_page=data_list[0];
                        }
                        sub_page.photos=[];
                        sub_page.items=[];
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(item_map.tbl_id!=0&&sub_page.tbl_id!=0){
                    sql = {item_map_tbl_id:item_map.tbl_id};
                    sort={};
                    _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                        if(error){
                            error=error;
                        }
                        for(a=0;a<data_list.length;a++){
                            full_photo_list.push(data_list[a]);
                        }
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(item_map.tbl_id!=0&&sub_page.tbl_id!=0){
                    sort=appz.get_key_sort_type(sub_page);
                    if(!setting.filter_category){
                        sql={parent_tbl_id:sub_page.tbl_id};
                    }else{
                        sql={parent_tbl_id:sub_page.tbl_id,category:setting.filter_category};
                    }
                    if(setting.filter_search){
                        sql.search=setting.filter_search;
                    }
                    if(setting.count){
                        _get_sql_paging_cache(db,item_map.title_url,sql,sort,1,setting.count,function(error,_data_list,_dt_total,_page_page_total) {
                            if(error){
                                error=error;
                            }
                            top_list=_data_list;
                            dt_total=_dt_total;
                            page_page_total=_page_page_total;
                            call();
                        });
                    }else if(setting.page_size){
                        if(!setting.page_current){
                            setting.page_current=1;
                        }
                        _get_sql_paging_cache(db,item_map.title_url,sql,sort,setting.page_current,setting.page_size,function(error,_data_list,_dt_total,_page_page_total) {
                            if(error){
                                error=error;
                            }
                            top_list=_data_list;
                            dt_total=_dt_total;
                            page_page_total=_page_page_total;
                            call();
                        });
                    }else{
                        _get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
                            if(error){
                                error=error;
                            }
                            if(data_list.length>0){
                                top_list=data_list;
                                call();
                            }else{
                                call()
                            }
                        });
                    }
                }else{
                    call();
                }
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    top_list[a].items=[];
                    top_list[a].photos=[];
                }
                call();
            },
            function(call){
                if(item_map.tbl_id!=0&&sub_page.tbl_id!=0){
                    sql = {};
                    sort=appz.get_key_sort_type(sub_page);
                    _get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
                        if(error){
                            error=error;
                        }
                        other_list=data_list;
                        call();
                    });
                }
                else{
                    call();
                }
            },
            function(call){
                for(a=0;a<other_list.length;a++){
                    other_list[a].items=[];
                    other_list[a].photos=[];
                }
                call();
            },
            function(call){
                for(a=0;a<full_photo_list.length;a++){
                    if(sub_page.tbl_id==full_photo_list[a].parent_tbl_id){
                        sub_page.photos.push(full_photo_list[a]);
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    for(b=0;b<full_photo_list.length;b++){
                        if(top_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            top_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<other_list.length;a++){
                    for(b=0;b<full_photo_list.length;b++){
                        if(other_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            other_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<top_list.length;a++){
                    for(b=0;b<other_list.length;b++){
                        if(top_list[a].tbl_id==other_list[b].parent_tbl_id){
                            for(c=0;c<other_list.length;c++){
                                if(other_list[b].tbl_id==other_list[c].parent_tbl_id){
                                    for(d=0;d<other_list.length;d++){
                                        if(other_list[c].tbl_id==other_list[d].parent_tbl_id){
                                            other_list[c][other_list[d].title_url]=other_list[d];
                                            other_list[c].items.push(other_list[d]);
                                        }
                                    }
                                    other_list[b][other_list[c].title_url]=other_list[c];
                                    other_list[b].items.push(other_list[c]);
                                }
                            }
                            top_list[a][other_list[b].title_url]=other_list[b];
                            top_list[a].items.push(other_list[b]);
                        }
                    }
                    sub_page[top_list[a].title_url]=top_list[a];
                    sub_page['dt_total']=dt_total;
                    sub_page['page_page_total']=page_page_total;
                    sub_page.items.push(top_list[a]);
                }
                call();
            },
            function(call){
                sub_page.items=_get_item_list_sort(sub_page,sub_page.items);
                call();
            },
            function(call){
                async.forEachOf(sub_page.items,(top_item,key,go)=>{
                    top_item.items=_get_item_list_sort(top_item,top_item.items);
                    async.forEachOf(top_item.items,(sub_item,key,go2)=>{
                        sub_item.items=_get_item_list_sort(sub_item,sub_item.items);
                        async.forEachOf(sub_page.items,(item,key,go3)=>{
                            item.items=_get_item_list_sort(item,item.items);
                            go3();
                        }, error => {
                            if(error){
                                error=error;
                            }
                            go2();
                        });
                    }, error => {
                        if(error){
                            error=error;
                        }
                        go();
                    });
                }, error => {
                    if(error){
                        error=error;
                    }
                    call();
                });
            },
        ],
            function(err, result){
                callback(error,sub_page);
            });
    }
    _get_item_list_sort=function(_item,_list){
        if(_item.setting_sort_type=='date'){
            sort_type='full_date_create';
        }else if(_item.setting_sort_type=='order'){
            sort_type='order';
        }else{
            sort_type='title';
        }
        if(_item.setting_sort_order=='asc'){
            sort_order=true;
        }else{
            sort_order=false;
        }

        if(sort_type=='order'){
            for(a=0;a<_list.length;a++){
                _list[a].order=parseInt(_list[a].order);
            }
        }
        arraySort(_list,sort_type,{reverse:sort_order});
        return _list;
    }
    module.get_service_cart_list=function(db,sql,sort_by,page_current,page_size,callback) {
        var service_cart_list=[];
        var full_photo_list=[];
        var sub_service_list=[];
        var error=null;
        async.series([
            function(call){
                _get_sql_paging_cache(db,DT_SERVICE_CART,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                    error=error;
                    service_cart_list=_data_list;
                    dt_total=_dt_total;
                    page_page_total=_page_page_total;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                _get_sql_cache(db,DT_SUB_SERVICE,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    sub_service_list=data_list;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    full_photo_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<service_cart_list.length;a++){
                    service_cart_list[a].photos=[];
                    service_cart_list[a].items=[];
                    service_cart_list[a].money_price=utilityz.get_money(service_cart_list[a].item_price);
                    for(b=0;b<full_photo_list.length;b++){
                        if(service_cart_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            service_cart_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<sub_service_list.length;a++){
                    sub_service_list[a].photos=[];
                    sub_service_list[a].items=[];
                    for(b=0;b<full_photo_list.length;b++){
                        if(sub_service_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            sub_service_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<service_cart_list.length;a++){
                    for(b=0;b<sub_service_list.length;b++){
                        if(service_cart_list[a].tbl_id==sub_service_list[b].parent_tbl_id){
                            for(c=0;c<sub_service_list.length;c++){
                                if(sub_service_list[b].tbl_id==sub_service_list[c].parent_tbl_id){
                                    for(d=0;d<sub_service_list.length;d++){
                                        if(sub_service_list[c].tbl_id==sub_service_list[d].parent_tbl_id){
                                            sub_service_list[c][sub_service_list[d].title_url]=sub_service_list[d];
                                            sub_service_list[c].items.push(sub_service_list[d]);
                                        }
                                    }
                                    sub_service_list[b][sub_service_list[c].title_url]=sub_service_list[c];
                                    sub_service_list[b].items.push(sub_service_list[c]);
                                }
                            }
                            service_cart_list[a][sub_service_list[b].title_url]=sub_service_list[b];
                            service_cart_list[a].items.push(sub_service_list[b]);
                        }
                    }
                }
                call();
            },
        ],
            function(err, result){
                callback(error,service_cart_list,dt_total,page_page_total);
            });
    }
    module.get_product_cart_list=function(db,sql,sort_by,page_current,page_size,callback) {
        var product_cart_list=[];
        var full_photo_list=[];
        var sub_product_list=[];
        var error=null;
        async.series([
            function(call){
                _get_sql_paging_cache(db,DT_PRODUCT_CART,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                    error=error;
                    product_cart_list=_data_list;
                    dt_total=_dt_total;
                    page_page_total=_page_page_total;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                _get_sql_cache(db,DT_SUB_PRODUCT,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    sub_product_list=data_list;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    full_photo_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<product_cart_list.length;a++){
                    product_cart_list[a].photos=[];
                    product_cart_list[a].items=[];
                    product_cart_list[a].money_price=utilityz.get_money(product_cart_list[a].item_price);
                    for(b=0;b<full_photo_list.length;b++){
                        if(product_cart_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            product_cart_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<sub_product_list.length;a++){
                    sub_product_list[a].photos=[];
                    sub_product_list[a].items=[];
                    for(b=0;b<full_photo_list.length;b++){
                        if(sub_product_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            sub_product_list[a].photos.push(full_photo_list[b]);
                        }
                    }
                }
                call();
            },
            function(call){
                for(a=0;a<product_cart_list.length;a++){
                    for(b=0;b<sub_product_list.length;b++){
                        if(product_cart_list[a].tbl_id==sub_product_list[b].parent_tbl_id){
                            for(c=0;c<sub_product_list.length;c++){
                                if(sub_product_list[b].tbl_id==sub_product_list[c].parent_tbl_id){
                                    for(d=0;d<sub_product_list.length;d++){
                                        if(sub_product_list[c].tbl_id==sub_product_list[d].parent_tbl_id){
                                            sub_product_list[c][sub_product_list[d].title_url]=sub_product_list[d];
                                            sub_product_list[c].items.push(sub_product_list[d]);
                                        }
                                    }
                                    sub_product_list[b][sub_product_list[c].title_url]=sub_product_list[c];
                                    sub_product_list[b].items.push(sub_product_list[c]);
                                }
                            }
                            product_cart_list[a][sub_product_list[b].title_url]=sub_product_list[b];
                            product_cart_list[a].items.push(sub_product_list[b]);
                        }
                    }
                }
                call();
            },
        ],
            function(err, result){
                callback(error,product_cart_list,dt_total,page_page_total);
            });
    }
    module.get_artist=function(db,title_url,callback){
        var artist=appz.get_new_item(DT_ARTIST,0);
        var full_photo_list=[];
        var error=error;
        async.series([
            function(call){
                sql = {title_url:title_url};
                sort={};
                _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                    error=error;
                    if(data_list.length>0){
                        if(data_list[0].tbl_id!=0 &&data_list[0]){
                            artist=data_list[0];
                        }
                    }
                    artist.photos=[];
                    call();
                });
            },
            function(call){
                sql = {parent_tbl_id:artist.tbl_id};
                sort={};
                _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    for(a=0;a<data_list.length;a++){
                        artist.photos.push(data_list[a]);
                    }
                    call();
                });
            },
        ],
            function(err, result){
                callback(error,artist);
            });
    }
    module.get_artist_list=function(db,sql,sort_by,page_current,page_size,callback) {
        var artist_list=[];
        var full_photo_list=[];
        var error=null;
        async.series([
            function(call){
                _get_sql_paging_cache(db,DT_ARTIST,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                    error=error;
                    artist_list=_data_list;
                    dt_total=_dt_total;
                    page_page_total=_page_page_total;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    full_photo_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<artist_list.length;a++){
                    artist_list[a].photos=[];
                    for(b=0;b<full_photo_list.length;b++){
                        if(artist_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            artist_list[a].photos.push(full_photo_list[b]);
                            break;
                        }
                    }
                }
                call();
            },
        ],
            function(err, result){
                callback(error,artist_list,dt_total,page_page_total);
            });
    }
    module.get_event_list=function(db,sql,sort_by,page_current,page_size,callback) {
        var event_list=[];
        var full_photo_list=[];
        var error=null;
        async.series([
            function(call){
                _get_sql_paging_cache(db,DT_EVENT,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                    error=error;
                    event_list=_data_list;
                    dt_total=_dt_total;
                    page_page_total=_page_page_total;
                    call();
                });
            },
            function(call){
                sql = {};
                sort={};
                _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    full_photo_list=data_list;
                    call();
                });
            },
            function(call){
                for(a=0;a<event_list.length;a++){
                    event_list[a].photos=[];
                    event_list[a].date_full= biz9.get_date_full(event_list[a].start_date);
                    event_list[a].time_full= biz9.get_time_full(event_list[a].start_time);
                    for(b=0;b<full_photo_list.length;b++){
                        if(event_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                            event_list[a].photos.push(full_photo_list[b]);
                            break;
                        }
                    }
                }
                call();
            },
        ],
            function(err, result){
                callback(error,event_list,dt_total,page_page_total);
            });
    }
    module.get_event=function(db,title_url,callback){
        var event=appz.get_new_item(DT_EVENT,0);
        var full_photo_list=[];
        var other_list=[];
        var error=null;
        async.series([
            function(call){
                sql = {title_url:title_url};
                sort={};
                _get_sql_cache(db,DT_EVENT,sql,sort,function(error,data_list) {
                    error=error;
                    if(data_list.length>0){
                        if(data_list[0].tbl_id!=0 &&data_list[0]){
                            event=data_list[0];
                        }
                    }
                    event.photos=[];
                    call();
                });
            },
            function(call){
                sql = {parent_tbl_id:event.tbl_id};
                sort={};
                _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    for(a=0;a<data_list.length;a++){
                        event.photos.push(data_list[a]);
                    }
                    call();
                });
            },
        ],
            function(err, result){
                callback(error,event);
            });
    }
module.get_podcast_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var podcast_list=[];
    var full_photo_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_PODCAST,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                podcast_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_artist_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<podcast_list.length;a++){
                podcast_list[a].photos=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(podcast_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        podcast_list[a].photos.push(full_photo_list[b]);
                        break;
                    }
                }
                for(b=0;b<full_artist_list.length;b++){
                    if(podcast_list[a].artist_tbl_id==full_artist_list[b].tbl_id){
                        podcast_list[a].artist=full_artist_list[b];
                        break;
                    }
                }
                if(!podcast_list[a].artist){
                    podcast_list[a].artist=biz9.get_blank_artist();
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,podcast_list,dt_total,page_page_total);
        });
}
module.get_podcast=function(db,title_url,callback){
    var podcast=appz.get_new_item(DT_PODCAST,0);
    var full_photo_list=[];
    var other_list=[];
    var error=error;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_PODCAST,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        podcast=data_list[0];
                    }
                }
                podcast.photos=[];
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:podcast.tbl_id};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    podcast.photos.push(data_list[a]);
                }
                call();
            });
        },
        function(call){
            sql = {tbl_id:podcast.artist_tbl_id};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                if(data_list.length>0){
                    podcast.artist = data_list[0];
                }else{
                    podcast.artist =biz9.get_blank_artist();
                }
                call();
            });
        },
    ],
        function(err, result){
            callback(error,podcast);
        });
}
module.get_video_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var video_list=[];
    var full_photo_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_VIDEO,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                video_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_artist_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<video_list.length;a++){
                video_list[a].photos=[];
                video_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(video_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        video_list[a].photos.push(full_photo_list[b]);
                        break;
                    }
                }
                for(b=0;b<full_artist_list.length;b++){
                    if(video_list[a].artist_tbl_id==full_artist_list[b].tbl_id){
                        video_list[a].artist=full_artist_list[b];
                        break;
                    }
                }
                if(!video_list[a].artist){
                    video_list[a].artist=biz9.get_blank_artist();
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,video_list,dt_total,page_page_total);
        });
}
module.get_video=function(db,title_url,callback){
    var video=appz.get_new_item(DT_VIDEO,0);
    var full_photo_list=[];
    var other_list=[];
    var error=null;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_VIDEO,sql,sort,function(error,data_list) {
                error=null;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        video=data_list[0];
                    }
                }
                video.photos=[];
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:video.tbl_id};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    video.photos.push(data_list[a]);
                }
                call();
            });
        },
        function(call){
            sql = {tbl_id:video.artist_tbl_id};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                if(data_list.length>0){
                    video.artist = data_list[0];
                }else{
                    video.artist =biz9.get_blank_artist();
                }
                call();
            });
        },
    ],
        function(err, result){
            callback(error,video);
        });
}
module.get_artist_album_list=function(db,artist_title_url,sort_by,page_current,page_size,callback) {
    var artist=appz.get_new_item(DT_ARTIST,0);
    var error=null;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        artist=data_list[0];
                    }
                }
                artist.photos=[];
                artist.album_list=[];
                call();
            });
        },
        function(call){
            sql = {artist_tbl_id:artist.tbl_id};
            sort={};
            _get_sql_cache(db,DT_ALBUM,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                artist.album_list = data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_TRACK,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_track_list = data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<artist.album_list.length;a++){
                for(b=0;b<full_track_list.length;b++){
                    if(artist.album_list[a].tbl_id==full_track_list[b].album_tbl_id){
                        artist.album_list[a].push(full_track_list[b]);
                        break;
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,album_list,dt_total,page_page_total);
        });
}
module.get_album_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var album_list=[];
    var full_photo_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_ALBUM,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                album_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_artist_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<album_list.length;a++){
                album_list[a].photos=[];
                album_list[a].items=[];
                album_list[a].money_price=utilityz.get_money(album_list[a].price);
                for(b=0;b<full_photo_list.length;b++){
                    if(album_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        album_list[a].photos.push(full_photo_list[b]);
                        break;
                    }
                }
                for(b=0;b<full_artist_list.length;b++){
                    if(album_list[a].artist_tbl_id==full_artist_list[b].tbl_id){
                        album_list[a].artist=full_artist_list[b];
                        break;
                    }
                }
                if(!album_list[a].artist){
                    album_list[a].artist=biz9.get_blank_artist();
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,album_list,dt_total,page_page_total);
        });
}
module.get_genre_track_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var error=null;
    async.series([
        function(call){
            sort={};
            _get_sql_cache(db,DT_TRACK,sql,sort,function(error,data_list) {
                error=error;
                track_list=data_list;
                dt_total=data_list.length;
                page_page_total=page_size;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                artist_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<track_list.length;a++){
                for(b=0;b<artist_list.length;b++){
                    if(track_list[a].artist_tbl_id==artist_list[b].tbl_id){
                        track_list[a].artist=artist_list[b];
                    }
                }
                if(!track_list[a].artist){
                    track_list[a].artist=biz9.get_blank_artist();
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,track_list,dt_total,page_page_total);
        });
}
module.get_playlist_trackz=function(db,playlist_tbl_id,sort_by,page_current,page_size,callback){
    var error=null;
    async.series([
        function(call){
            sql = {playlist_tbl_id:playlist_tbl_id};
            sort={};
            _get_sql_cache(db,DT_TRACK,sql,sort,function(error,data_list) {
                error=error;
                track_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                artist_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<track_list.length;a++){
                for(b=0;b<artist_list.length;b++){
                    if(track_list[a].artist_tbl_id==artist_list[b].tbl_id){
                        track_list.artist=artist_list[b];
                        break;
                    }
                }
                if(!track_list[a].artist){
                    track_list.artist=biz9.get_blank_artist();
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,track_list,dt_total,page_page_total);
        });
}
module.get_artist_trackz=function(db,artist_title_url,sort_by,page_current,page_size,callback){
    var error=null;
    async.series([
        function(call){
            sql = {title_url:artist_title_url};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0&&data_list[0]){
                        artist=data_list[0];
                    }
                }
                artist.track_list=[];
                call();
            });
        },
        function(call){
            sql = {artist_tbl_id:artist_tbl_id};
            sort={};
            _get_sql_cache(db,DT_TRACK,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                track_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<track_list.length;a++){
                track_list.artist=artist;
            }
            call();
        },
    ],
        function(err, result){
            callback(error,track_list,dt_total,page_page_total);
        });
}
module.get_album=function(db,title_url,callback){
    var album=appz.get_new_item(DT_ALBUM,0);
    var error =null;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_ALBUM,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        album=data_list[0];
                    }
                }
                album.money_price=utilityz.get_money(album.price);
                album.photos=[];
                album.track_list=[];
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:album.tbl_id};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    album.photos.push(data_list[a]);
                }
                call();
            });
        },
        function(call){
            sql = {tbl_id:album.artist_tbl_id};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                if(data_list.length>0){
                    album.artist = data_list[0];
                }else{
                    album.artist =biz9.get_blank_artist();
                }
                call();
            });
        },
        function(call){
            album_track_list=[];
            sql = {album_tbl_id:album.tbl_id};
            sort={};
            _get_sql_cache(db,DT_ALBUM_TRACK,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                album_track_list = data_list;
                call();
            });
        },
        function(call){
            full_track_list=[];
            sql = {};
            sort={};
            _get_sql_cache(db,DT_TRACK,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_track_list = data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<album_track_list.length;a++){
                for(b=0;b<full_track_list.length;b++){
                    if(album_track_list[a].track_tbl_id==full_track_list[b].tbl_id){
                        album.track_list.push(full_track_list[b]);
                        break;
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,album);
        });
}
module.get_track_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var track_list=[];
    var full_photo_list=[];
    var error=error;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_TRACK,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                track_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_artist_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<track_list.length;a++){
                track_list[a].photos=[];
                track_list[a].items=[];
                track_list[a].money_price=utilityz.get_money(track_list[a].price);
                for(b=0;b<full_photo_list.length;b++){
                    if(track_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        track_list[a].photos.push(full_photo_list[b]);
                    }
                }
                for(b=0;b<full_artist_list.length;b++){
                    if(track_list[a].artist_tbl_id==full_artist_list[b].tbl_id){
                        track_list[a].artist=full_artist_list[b];
                        break;
                    }
                }
                if(!track_list[a].artist){
                    track_list[a].artist=biz9.get_blank_artist();
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,track_list,dt_total,page_page_total);
        });
}
module.get_track=function(db,title_url,callback){
    var track=appz.get_new_item(DT_TRACK,0);
    var full_photo_list=[];
    var other_list=[];
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_TRACK,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        track=data_list[0];
                    }
                }
                track.money_price=utilityz.get_money(track.price);
                track.photos=[];
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:track.tbl_id};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    track.photos.push(data_list[a]);
                }
                call();
            });
        },
        function(call){
            sql = {tbl_id:track.artist_tbl_id};
            sort={};
            _get_sql_cache(db,DT_ARTIST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                if(data_list.length>0){
                    track.artist = data_list[0];
                }else{
                    track.artist =biz9.get_blank_artist();
                }
                call();
            });
        },
    ],
        function(err, result){
            callback(error,track);
        });
}
module.get_product_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var product_list=[];
    var full_photo_list=[];
    var sub_product_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_PRODUCT,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                product_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_SUB_PRODUCT,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                sub_product_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<product_list.length;a++){
                product_list[a].photos=[];
                product_list[a].items=[];
                product_list[a].money_price=utilityz.get_money(product_list[a].price);

                for(b=0;b<full_photo_list.length;b++){
                    if(product_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        product_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<sub_product_list.length;a++){
                sub_product_list[a].photos=[];
                sub_product_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(sub_product_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        sub_product_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<product_list.length;a++){
                for(b=0;b<sub_product_list.length;b++){
                    if(product_list[a].tbl_id==sub_product_list[b].parent_tbl_id){
                        for(c=0;c<sub_product_list.length;c++){
                            if(sub_product_list[b].tbl_id==sub_product_list[c].parent_tbl_id){
                                for(d=0;d<sub_product_list.length;d++){
                                    if(sub_product_list[c].tbl_id==sub_product_list[d].parent_tbl_id){
                                        sub_product_list[c][sub_product_list[d].title_url]=sub_product_list[d];
                                        sub_product_list[c].items.push(sub_product_list[d]);
                                    }
                                }
                                sub_product_list[b][sub_product_list[c].title_url]=sub_product_list[c];
                                sub_product_list[b].items.push(sub_product_list[c]);
                            }
                        }
                        product_list[a][sub_product_list[b].title_url]=sub_product_list[b];
                        product_list[a].items.push(sub_product_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,product_list,dt_total,page_page_total);
        });
}
module.get_service=function(db,title_url,callback){
    var service=appz.get_new_item(DT_SERVICE,0);
    var full_photo_list=[];
    var other_list=[];
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_SERVICE,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        service=data_list[0];
                    }
                }
                service.money_price=utilityz.get_money(service.price);
                service.photos=[];
                service.items=[];
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    full_photo_list.push(data_list[a]);
                }
                call();
            });
        },
        function(call){
            sql={parent_tbl_id:service.tbl_id};
            sort={order:1};
            _get_sql_cache(db,DT_SUB_SERVICE,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                top_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                top_list[a]=top_list[a];
                top_list[a].items=[];
                top_list[a].photos=[];
            }
            call();
        },
        function(call){
            sql = {};
            sort={order:1};
            _get_sql_cache(db,DT_SUB_SERVICE,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                other_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<other_list.length;a++){
                other_list[a]=other_list[a];
                other_list[a].items=[];
                other_list[a].photos=[];
            }
            call();
        },
        function(call){
            for(a=0;a<full_photo_list.length;a++){
                if(service.tbl_id==full_photo_list[a].parent_tbl_id){
                    service.photos.push(full_photo_list[a]);
                }
            }
            call();
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                for(b=0;b<full_photo_list.length;b++){
                    if(top_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        top_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<other_list.length;a++){
                for(b=0;b<full_photo_list.length;b++){
                    if(other_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        other_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                for(b=0;b<other_list.length;b++){
                    if(top_list[a].tbl_id==other_list[b].parent_tbl_id){
                        for(c=0;c<other_list.length;c++){
                            if(other_list[b].tbl_id==other_list[c].parent_tbl_id){
                                for(d=0;d<other_list.length;d++){
                                    if(other_list[c].tbl_id==other_list[d].parent_tbl_id){
                                        other_list[c][other_list[d].title_url]=other_list[d];
                                        other_list[c].items.push(other_list[d]);
                                    }
                                }
                                other_list[b][other_list[c].title_url]=other_list[c];
                                other_list[b].items.push(other_list[c]);
                            }
                        }
                        top_list[a][other_list[b].title_url]=other_list[b];
                        top_list[a].items.push(other_list[b]);
                    }
                }
                service[top_list[a].title_url]=top_list[a];
                service.items.push(top_list[a]);
            }
            call();
        },
    ],
        function(err, result){
            callback(error,service);
        });
}
module.get_service_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var service_list=[];
    var full_photo_list=[];
    var sub_service_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_SERVICE,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                service_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_SUB_SERVICE,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                sub_service_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<service_list.length;a++){
                service_list[a].photos=[];
                service_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(service_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        service_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<sub_service_list.length;a++){
                sub_service_list[a].photos=[];
                sub_service_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(sub_service_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        sub_service_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<service_list.length;a++){
                for(b=0;b<sub_service_list.length;b++){
                    if(service_list[a].tbl_id==sub_service_list[b].parent_tbl_id){
                        for(c=0;c<sub_service_list.length;c++){
                            if(sub_service_list[b].tbl_id==sub_service_list[c].parent_tbl_id){
                                for(d=0;d<sub_service_list.length;d++){
                                    if(sub_service_list[c].tbl_id==sub_service_list[d].parent_tbl_id){
                                        sub_service_list[c][sub_service_list[d].title_url]=sub_service_list[d];
                                        sub_service_list[c].items.push(sub_service_list[d]);
                                    }
                                }
                                sub_service_list[b][sub_service_list[c].title_url]=sub_service_list[c];
                                sub_service_list[b].items.push(sub_service_list[c]);
                            }
                        }
                        service_list[a][sub_service_list[b].title_url]=sub_service_list[b];
                        service_list[a].items.push(sub_service_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,service_list,dt_total,page_page_total);
        });
}
module.get_project=function(db,title_url,callback){
    var project=appz.get_new_item(DT_PROJECT,0);
    var full_photo_list=[];
    var other_list=[];
    var error=null;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_PROJECT,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        project=data_list[0];
                    }
                }
                project.money_price=utilityz.get_money(project.price);
                project.photos=[];
                project.items=[];
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    full_photo_list.push(data_list[a]);
                }
                call();
            });
        },
        function(call){
            sql={parent_tbl_id:project.tbl_id};
            sort={order:1};
            _get_sql_cache(db,DT_SUB_PROJECT,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                top_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                top_list[a]=top_list[a];
                top_list[a].items=[];
                top_list[a].photos=[];
            }
            call();
        },
        function(call){
            sql = {};
            sort={order:1};
            _get_sql_cache(db,DT_SUB_PROJECT,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                other_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<other_list.length;a++){
                other_list[a]=other_list[a];
                other_list[a].items=[];
                other_list[a].photos=[];
            }
            call();
        },
        function(call){
            for(a=0;a<full_photo_list.length;a++){
                if(project.tbl_id==full_photo_list[a].parent_tbl_id){
                    project.photos.push(full_photo_list[a]);
                }
            }
            call();
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                for(b=0;b<full_photo_list.length;b++){
                    if(top_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        top_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<other_list.length;a++){
                for(b=0;b<full_photo_list.length;b++){
                    if(other_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        other_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                for(b=0;b<other_list.length;b++){
                    if(top_list[a].tbl_id==other_list[b].parent_tbl_id){
                        for(c=0;c<other_list.length;c++){
                            if(other_list[b].tbl_id==other_list[c].parent_tbl_id){
                                for(d=0;d<other_list.length;d++){
                                    if(other_list[c].tbl_id==other_list[d].parent_tbl_id){
                                        other_list[c][other_list[d].title_url]=other_list[d];
                                        other_list[c].items.push(other_list[d]);
                                    }
                                }
                                other_list[b][other_list[c].title_url]=other_list[c];
                                other_list[b].items.push(other_list[c]);
                            }
                        }
                        top_list[a][other_list[b].title_url]=other_list[b];
                        top_list[a].items.push(other_list[b]);
                    }
                }
                project[top_list[a].title_url]=top_list[a];
                project.items.push(top_list[a]);
            }
            call();
        },
    ],
        function(err, result){
            callback(error,project);
        });
}
module.get_project_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var project_list=[];
    var full_photo_list=[];
    var sub_project_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_PROJECT,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                project_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<project_list.length;a++){
                project_list[a].photos=[];
                project_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(project_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        project_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,project_list,dt_total,page_page_total);
        });
}
module.get_document=function(db,title_url,callback){
    var document=appz.get_new_item(DT_DOCUMENT,0);
    var full_photo_list=[];
    var error=null;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_DOCUMENT,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        document=data_list[0];
                    }
                }
                document.photos=[];
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:document.tbl_id};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    document.photos.push(data_list[a]);
                }
                call();
            });
        },
    ],
        function(err, result){
            callback(error,document);
        });
}
module.get_document_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var document_list=[];
    var full_photo_list=[];
    var sub_document_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_DOCUMENT,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                document_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<document_list.length;a++){
                document_list[a].photos=[];
                document_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(document_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        document_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,document_list,dt_total,page_page_total);
        });
}
module.get_gallery=function(db,title_url,callback){
    var gallery=appz.get_new_item(DT_GALLERY,0);
    var full_photo_list=[];
    var error=null;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_GALLERY,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        gallery=data_list[0];
                    }
                }
                gallery.photos=[];
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:gallery.tbl_id};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    gallery.photos.push(data_list[a]);
                }
                call();
            });
        },
    ],
        function(err, result){
            callback(error,gallery);
        });
}
module.get_gallery_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var gallery_list=[];
    var full_photo_list=[];
    var sub_gallery_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_GALLERY,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                gallery_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<gallery_list.length;a++){
                gallery_list[a].photos=[];
                gallery_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(gallery_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        gallery_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,gallery_list,dt_total,page_page_total);
        });
}
module.get_page=function(db,title_url,setting,callback){
    var item_map=appz.get_new_item(DT_ITEM_MAP,0);
    var full_photo_list=[];
    var top_list=[];
    var other_list=[];
    var r_item_map=[];
    var error=null;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_ITEM_MAP,sql,sort,function(error,data_list) {
                error=error;
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        item_map=data_list[0];
                    }
                }else{
                    item_map.title_url=title_url;
                }
                item_map.photos=[];
                item_map.items=[];
                call();
            });
        },
        function(call){
            sql = {item_map_tbl_id:item_map.tbl_id};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                for(a=0;a<data_list.length;a++){
                    full_photo_list.push(data_list[a]);
                }
                call();
            });
        },
        function(call){
            sql={parent_tbl_id:item_map.tbl_id};
            sort={order:1};
            if(setting.count){
                _get_sql_paging_cache(db,item_map.title_url,sql,sort,1,setting.count,function(error,data_list,dt_total,page_page_total) {
                    if(error){
                        error=error;
                    }
                    top_list=data_list;
                    call();
                });
            }else{
                _get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
                    if(error){
                        error=error;
                    }
                    top_list=data_list;
                    call();
                });
            }
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                top_list[a].items=[];
                top_list[a].photos=[];
            }
            call();
        },
        function(call){
            sql = {};
            sort={order:1};
            _get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                other_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<other_list.length;a++){
                other_list[a].items=[];
                other_list[a].photos=[];
            }
            call();
        },
        function(call){
            for(a=0;a<full_photo_list.length;a++){
                if(item_map.tbl_id==full_photo_list[a].parent_tbl_id){
                    item_map.photos.push(full_photo_list[a]);
                }
            }
            call();
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                for(b=0;b<full_photo_list.length;b++){
                    if(top_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        top_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<other_list.length;a++){
                for(b=0;b<full_photo_list.length;b++){
                    if(other_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        other_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<top_list.length;a++){
                for(b=0;b<other_list.length;b++){
                    if(top_list[a].tbl_id==other_list[b].parent_tbl_id){
                        for(c=0;c<other_list.length;c++){
                            if(other_list[b].tbl_id==other_list[c].parent_tbl_id){
                                for(d=0;d<other_list.length;d++){
                                    if(other_list[c].tbl_id==other_list[d].parent_tbl_id){
                                        other_list[c][other_list[d].title_url]=other_list[d];
                                        other_list[c].items.push(other_list[d]);
                                    }
                                }
                                other_list[b][other_list[c].title_url]=other_list[c];
                                other_list[b].items.push(other_list[c]);
                            }
                        }
                        top_list[a][other_list[b].title_url]=other_list[b];
                        top_list[a].items.push(other_list[b]);
                    }
                }
                item_map[top_list[a].title_url]=top_list[a];
                item_map.items.push(top_list[a]);
            }
            call();
        },
        function(call){
            item_map.items=_get_item_list_sort(item_map,item_map.items);;
            call();
        },
        function(call){
            async.forEachOf(item_map.items,(top_item,key,go)=>{
                top_item.items=_get_item_list_sort(top_item,top_item.items);
                async.forEachOf(top_item.items,(sub_item,key,go2)=>{
                    sub_item.items=_get_item_list_sort(sub_item,sub_item.items);
                    async.forEachOf(sub_item.items,(item,key,go3)=>{
                        item.items=_get_item_list_sort(item,item.items);
                        go3();
                    }, error => {
                        if(error){
                            error=error;
                        }
                        go2();
                    });
                }, error => {
                    if(error){
                        error=error;
                    }
                    go();
                });
            }, error => {
                if(error){
                    error=error;
                }
                call();
            });
        },
    ],
        function(err, result){
            callback(error,item_map);
        });
}
module.get_page_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var page_list=[];
    var full_photo_list=[];
    var sub_page_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_PAGE,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                page_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<page_list.length;a++){
                page_list[a].photos=[];
                page_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(page_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        page_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,page_list,dt_total,page_page_total);
        });
}
module.get_team_member=function(db,title_url,callback){
    var team_member=appz.get_new_item(DT_TEAM,0);
    var other_list=[];
    var error=null;
    async.series([
        function(call){
            sql = {title_url:title_url};
            sort={};
            _get_sql_cache(db,DT_TEAM,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        team_member=data_list[0];
                    }
                }
                call();
            });
        },
    ],
        function(err, result){
            callback(error,team_member);
        });
}
module.get_teamz=function(db,sql,sort_by,page_current,page_size,callback) {
    var team_list=[];
    var error=error;
    async.series([
        function(call){
            dataz.get_sql_paging_cache(db,DT_TEAM,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                team_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
    ],
        function(err, result){
            callback(error,team_list,dt_total,page_page_total);
        });
}
module.get_blog_post_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var blog_post_list=[];
    var full_photo_list=[];
    var sub_blog_post_list=[];
    var error=null;
    async.series([
        function(call){
            _get_sql_paging_cache(db,DT_BLOG_POST,sql,sort_by,page_current,page_size,function(error,_data_list,_dt_total,_page_page_total) {
                error=error;
                blog_post_list=_data_list;
                dt_total=_dt_total;
                page_page_total=_page_page_total;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_SUB_BLOG_POST,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                sub_blog_post_list=data_list;
                call();
            });
        },
        function(call){
            sql = {};
            sort={};
            _get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                if(error){
                    error=error;
                }
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<blog_post_list.length;a++){
                blog_post_list[a].photos=[];
                blog_post_list[a].items=[];
                blog_post_list[a].month_short_date_create=biz9.get_month_title_short(1+biz9.get_datetime_full_obj(blog_post_list[a].date_create).month());
                blog_post_list[a].month_date_create=biz9.get_month_title(1+biz9.get_datetime_full_obj(blog_post_list[a].date_create).month());
                blog_post_list[a].date_date_create=biz9.get_datetime_full_obj(blog_post_list[a].date_create).date();
                blog_post_list[a].year_date_create=biz9.get_datetime_full_obj(blog_post_list[a].date_create).year();
                for(b=0;b<full_photo_list.length;b++){
                    if(blog_post_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        blog_post_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<sub_blog_post_list.length;a++){
                sub_blog_post_list[a].photos=[];
                sub_blog_post_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(sub_blog_post_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        sub_blog_post_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<blog_post_list.length;a++){
                for(b=0;b<sub_blog_post_list.length;b++){
                    if(blog_post_list[a].tbl_id==sub_blog_post_list[b].parent_tbl_id){
                        for(c=0;c<sub_blog_post_list.length;c++){
                            if(sub_blog_post_list[b].tbl_id==sub_blog_post_list[c].parent_tbl_id){
                                for(d=0;d<sub_blog_post_list.length;d++){
                                    if(sub_blog_post_list[c].tbl_id==sub_blog_post_list[d].parent_tbl_id){
                                        sub_blog_post_list[c][sub_blog_post_list[d].title_url]=sub_blog_post_list[d];
                                        sub_blog_post_list[c].items.push(sub_blog_post_list[d]);
                                    }
                                }
                                sub_blog_post_list[b][sub_blog_post_list[c].title_url]=sub_blog_post_list[c];
                                sub_blog_post_list[b].items.push(sub_blog_post_list[c]);
                            }
                        }
                        blog_post_list[a][sub_blog_post_list[b].title_url]=sub_blog_post_list[b];
                        blog_post_list[a].items.push(sub_blog_post_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,blog_post_list,dt_total,page_page_total);
        });
}
module.get_order_status_by_id = function(status_id){
    switch (status_id) {
        case 0:
            return 'Review';
            break;
        case 1:
            return 'Pending';
            break;
        case 2:
            return 'In-Proccessing';
            break;
        case 3:
            return 'Shipped';
            break;
        case 4:
            return 'Complete';
            break;
        case 5:
            return 'Canceled';
            break;
        case 6:
            return 'Returned';
            break;
        default:
            return 'Review';
    }
}
return module;
}
