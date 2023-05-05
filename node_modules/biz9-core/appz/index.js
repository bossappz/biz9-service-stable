/* GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-AppZ
 */
module.exports = function(app_config){
    APP_ID=app_config.app_id;
    APP_TITLE_ID=app_config.app_title_id;
    APP_TITLE=app_config.app_title;
    APP_VERSION=app_config.app_version;
    FILE_URL=app_config.file_url;
    BIZ_MAP=app_config.biz_map;
    DT_ITEM_MAP='item_map_biz';
    DT_ITEM='item_biz';
    DT_BLANK='blank_biz';
    DT_PHOTO='photo_biz';
    DT_USER='user_biz';
    DT_ADMIN='admin_biz';
    DT_PROJECT='project_biz';
    DT_GALLERY='gallery_biz';
    DT_VIDEO='video_biz';
    DT_EVENT='event_biz';
    DT_PRODUCT='product_biz';
    DT_CATEGORY='category_biz';
    DT_CART_ITEM="cart_item_biz";
    DT_ORDER="order_biz";
    DT_ORDER_ITEM="order_item_biz";
    DT_BLOG_POST='blog_post_biz';
    DT_SERVICE='service_biz';
    DT_REVIEW='review_biz';
    DT_STAT='stat_biz';
    module.set_item_data=function(data_type,tbl_id,item_data){
        var item = {};
        for (key in  item_data) {
            item[key] = item_data[key].trim();
        }
        item['tbl_id'] = tbl_id;
        item['data_type'] = data_type;
        return item;
    }
    module.get_new_biz_item=function(data_type,tbl_id) {
        return appz.set_biz_item(appz.get_new_item(data_type,tbl_id));
    }
    module.get_new_item=function(data_type,tbl_id) {
        if(!tbl_id){
            tbl_id=0;
        }
        item = {data_type:data_type,tbl_id:tbl_id};
        return item;
    }
    get_new_review_biz_obj=function() {
        return {rating_avg:'0',review_list:[]}
    }
    module.get_test_item = function(data_type,tbl_id){
        if(!tbl_id){
            tbl_id=0;
        }
        if(!data_type){
            data_type=DT_BLANK;
        }
        item=appz.get_new_item(data_type,tbl_id);
        test_id=utilityz.get_id();
        item.order=test_id;
        item.title='title_'+test_id;
        item.sub_note='sub_note_'+test_id;
        return item;
    }
    module.get_test_user = function(){
        var test_id = utilityz.get_id();
        var item = appz.get_new_item(DT_USER,0);;
        item.email = 'email'+test_id+'@gmail.com';
        item.user_name = 'user_name'+test_id;
        item.first_name = 'firstname'+test_id;
        item.last_name = 'last_name'+test_id;
        item.password = '1234567';
        item.order=test_id;
        item=appz.set_biz_item(item);
        return item;
    }
    module.get_item_not_found=function(date_type,tbl_id) {
        if(!data_type){
            data_type='blank';
        }
        if(!tbl_id){
            tbl_id=0;
        }
        var item=appz.get_new_item(data_type,tbl_id);
        return item;
    }
    module.check_user = function(req,res,next){
        var u = appz.get_user(req);
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
        var u = appz.get_user(req);
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
        var u = appz.get_user(req);
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
        if(!req.session.user){
            user={tbl_id:0,data_type:DT_USER,is_guest:true,customer_id:utilityz.get_id(99999)};
            req.session.user=user;
        }
        return req.session.user;
    }
    module.save_user = function(req,user){
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
        var _error = null;
        async.series([
            function(call){
                if(!password){
                    _error='Passwords must be at least 6 characters.';
                }
                else if(password.length<6){
                    _error='Passwords must be at least 6 characters.';
                }
                call();
            }
        ],
            function(err, result){
                callback(_error,0);
            });
    }
    module.account_validate_user_name=function(db,data_type,tbl_id,user_name,callback) {
        var _error=null;
        async.series([
            function(call){
                // validate user_name length
                if(!user_name){
                    _error='Invalid user name.';
                }
                else if(user_name.length<3){
                    _error='Invalid user name.';
                }
                call();
            },
            // validate user_name owner
            function(call){
                if(_error==null){
                    sql_obj = {user_name:user_name};
                    dataz.get_sql_cache(db,data_type,sql_obj,{},function(data_list){
                        if(data_list.length > 0){
                            // if item add, already exsist
                            if(tbl_id == '0'){
                                _error = "The user name " + user_name+ " already exist.";
                                call();
                            }
                            // check owner of user name
                            else if(tbl_id != data_list[0].tbl_id){
                                _error = "The user name " + user_name+ " already exist.";
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
                callback(_error,0);
            });
    }
    //email
    module.account_validate_email = function(db,data_type,tbl_id,email,callback) {
        var _error=null;
        async.series([
            function(call){
                // validate email length
                if(!email){
                    _error='Invalid email address.';
                }
                else if(email.length<3){
                    _error='Invalid email address.';
                }
                else if(!utilityz.validate_email(email)){
                    _error='Invalid email address.';
                }
                call();
            },
            // validate email owner
            function(call){
                if(_error==null){
                    sql_obj = {email:email};
                    dataz.get_sql_cache(db,data_type,sql_obj,{},function(error,data_list){
                        if(error){
                            _error=error;
                        }
                        if(data_list.length > 0){
                            if(tbl_id == '0'){
                                _error = "The email " + email+ " already exist.";
                                call();
                            }
                            else if(tbl_id != data_list[0].tbl_id){
                                _error = "The email " + _email+ " already exist.";
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
                callback(_error,0);
            });
    }
    module.get_helper = function(req) {
        var helper = {};
        helper.url = req.protocol+"://"+req.headers.host+req.originalUrl;
        helper.validation_message=null;
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
        helper.app_id=APP_ID;
        helper.app_title=APP_TITLE;
        helper.app_version=APP_VERSION;
       if(!helper.app_title_id){
                if(APP_TITLE_ID){
                    helper.app_title_id=APP_TITLE_ID;
                }else if(req.subdomains[0]){
                        helper.app_title_id=req.subdomains[0];
                    }else{
                        helper.app_title_id='notfound';
                }
                }
            return helper;
        }
        module.get_helper_user = function(req) {
            var helper = {};
            helper.url = req.protocol+"://"+req.headers.host+req.originalUrl;
            helper.user = appz.get_user(req);
            helper.validation_message=null;
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
            helper.app_id=APP_ID;
            helper.app_title=APP_TITLE;
            helper.app_version=APP_VERSION;
            if(!helper.app_title_id){
                if(APP_TITLE_ID){
                    helper.app_title_id=APP_TITLE_ID;
                } else if(req.subdomains[0]){
                        helper.app_title_id=req.subdomains[0];
                    }else{
                        helper.app_title_id='notfound';
                }
            }
            return helper;
        }
        module.convert_biz_item=function(item,item_list) {
            max=19;
            for(var a=0;a<=item_list.length;a++){
                if(a!=max){
                    if(!item[item_list[a]]){
                        item[item_list[a]]=' ';
                    }
                    item['field_'+String(parseInt(a)+1)] = item_list[a];
                    item['value_'+String(parseInt(a)+1)] = item[item_list[a]];
                    delete item[item_list[a]];
                }
            }
            return item;
        }
        bind_biz_item = function(item,org_item){
            item.field_1=org_item.field_1;
            item.field_2=org_item.field_2;
            item.field_3=org_item.field_3;
            item.field_4=org_item.field_4;
            item.field_5=org_item.field_5;
            item.field_6=org_item.field_6;
            item.field_7=org_item.field_7;
            item.field_8=org_item.field_8;
            item.field_9=org_item.field_9;
            item.field_10=org_item.field_10;
            item.field_11=org_item.field_11;
            item.field_12=org_item.field_12;
            item.field_13=org_item.field_13;
            item.field_14=org_item.field_14;
            item.field_15=org_item.field_15;
            item.field_16=org_item.field_16;
            item.value_1=org_item.value_1;
            item.value_2=org_item.value_2;
            item.value_3=org_item.value_3;
            item.value_4=org_item.value_4;
            item.value_5=org_item.value_5;
            item.value_6=org_item.value_6;
            item.value_7=org_item.value_7;
            item.value_8=org_item.value_8;
            item.value_9=org_item.value_9;
            item.value_10=org_item.value_10;
            item.value_11=org_item.value_11;
            item.value_12=org_item.value_12;
            item.value_12=org_item.value_12;
            item.value_13=org_item.value_13;
            item.value_14=org_item.value_14;
            item.value_15=org_item.value_15;
            item.value_16=org_item.value_16;
            item.date_1=org_item.date_1;
            item.date_2=org_item.date_2;
            item.date_3=org_item.date_3;
            item.date_value_1=org_item.date_value_1;
            item.date_value_2=org_item.date_value_2;
            item.date_value_3=org_item.date_value_3;
            return item;
        }
        module.set_new_sub_item = function(data_type,org_item){
            var _sub_item = appz.get_new_item(data_type,0);
            if(org_item.is_parent){
                _sub_item.title='_copy_'+org_item.title;
                _sub_item.title_url='_copy_'+org_item.title_url;
            }else{
                _sub_item.title=org_item.title;
                _sub_item.title_url=org_item.title_url;
            }
            _sub_item=bind_biz_item(_sub_item,org_item);
            _sub_item.note=org_item.note;
            _sub_item.html=org_item.html;
            _sub_item.order=org_item.order;
            _sub_item.category=org_item.category;
            _sub_item.visible=org_item.visible;
            _sub_item.photofilename=org_item.photofilename;
            _sub_item.org_tbl_id=org_item.tbl_id;
            _sub_item.parent_data_type=org_item.parent_data_type;
            _sub_item.parent_tbl_id=org_item.parent_tbl_id;
            _sub_item.top_data_type=org_item.top_data_type;
            _sub_item.top_tbl_id=org_item.top_tbl_id;
            return _sub_item;
        }
        module.set_new_member=function(data_type,org_item){
            var _member = appz.get_new_item(data_type,0);
            _member = bind_biz_item(_member,org_item);
            _member.title='_copy_'+org_item.first_name;
            _member.first_name=_member.title;
            _member.last_name=org_item.last_name;
            _member.position=org_item.position;
            _member.location=org_item.location;
            _member.bio=org_item.bio;
            _member.title_url=_member.title;
            _member.photofilename=org_item.photofilename;
            _member.visible=org_item.visible;
            _member.category=org_item.category;
            _member.order=org_item.order;
            _member.note=org_item.note;
            _member.html=org_item.html;
            _member.search=org_item.search;
            return _member;
        }
        module.set_new_blog_post=function(data_type,org_item){
            var _blog_post = appz.get_new_item(data_type,0);
            _blog_post = bind_biz_item(_blog_post,org_item);
            _blog_post.title='_copy_'+org_item.title;
            _blog_post.title_url='_copy_'+org_item.title_url;
            _blog_post.photofilename=org_item.photofilename;
            _blog_post.visible=org_item.visible;
            _blog_post.category=org_item.category;
            _blog_post.order=org_item.order;
            _blog_post.sub_note=org_item.sub_note;
            _blog_post.note=org_item.note;
            _blog_post.tags=org_item.tags;
            _blog_post.html=org_item.html;
            _blog_post.author=org_item.author;
            _blog_post.search=org_item.search;
            return _blog_post;
        }
        module.set_new_event=function(data_type,org_item){
            var _event = appz.get_new_item(data_type,0);
            _event = bind_biz_item(_event,org_item);
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
            _event.old_price=org_item.old_price;
            _event.youtube_url=org_item.youtube_url;
            _event.order=org_item.order;
            _event.note=org_item.note;
            _event.sub_note=org_item.sub_note;
            _event.html=org_item.html;
            _event.tags=org_item.tags;
            _event.search=org_item.search;
            return _event;
        }
        module.set_new_category=function(data_type,org_item){
            var _category = appz.get_new_item(data_type,0);
            _category.title='copy_'+org_item.title;
            _category.title_url='copy_'+org_item.title_url;
            _category.type=org_item.type;
            _category.photofilename=org_item.photofilename;
            _category.visible=org_item.visible;
            _category.order=org_item.order;
            _category.note=org_item.note;
            _category.sub_note=org_item.sub_note;
            _category.html=org_item.html;
            _category=bind_biz_item(_category,org_item);
            return _category;
        }
        module.set_new_product=function(data_type,org_item){
            var _product = appz.get_new_item(data_type,0);
            _product = bind_biz_item(_product,org_item);
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
            _product.type=org_item.type;
            _product.sub_type=org_item.sub_type;
            _product.youtube_url=org_item.youtube_url;
            return _product;
        }
        module.set_new_project=function(data_type,org_item){
            var _project=appz.get_new_item(data_type,0);
            _project = bind_biz_item(_project,org_item);
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
            _project.search=org_item.search;
            return _project;
        }
        module.set_new_service=function(data_type,org_item){
            var _service=appz.get_new_item(data_type,0);
            _service = bind_biz_item(_service,org_item);
            _service.title='copy_'+org_item.title;
            _service.title_url='copy_'+org_item.title_url;
            _service.visible=org_item.visible;
            _service.category=org_item.category;
            _service.sub_note=org_item.sub_note;
            _service.price=org_item.price;
            _service.old_price=org_item.old_price;
            _service.youtube_url=org_item.youtube_url;
            _service.type=org_item.type;
            _service.sub_type=org_item.sub_type;
            _service.order=org_item.order;
            _service.note=org_item.note;
            _service.photofilename=org_item.photofilename;
            _service.tags=org_item.tags;
            _service.html=org_item.html;
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
        get_category_title=function(category_data_type) {
            switch(category_data_type) {
                case DT_BLOG_POST:
                    return  'Blog Post';
                case DT_EVENT:
                    return 'Event';
                case DT_GALLERY:
                    return 'Gallery';
                case DT_PRODUCT:
                    return 'Product';
                case DT_PROJECT:
                    return 'Project';
                case DT_SERVICE:
                    return 'Service';
                case DT_VIDEO:
                    return 'Video';
                case DT_MEMBER:
                    return 'Member';
                default:
                    return 'Blank';
            }
        }
        module.get_category_title_list=function(){
            return[
                {value:DT_BLOG_POST,title:'Blog Post'},
                {value:DT_EVENT,title:'Event'},
                {value:DT_GALLERY,title:'Gallery'},
                {value:DT_PRODUCT,title:'Product'},
                {value:DT_PROJECT,title:'Project'},
                {value:DT_MEMBER,title:'Member'},
                {value:DT_SERVICE,title:'Service'},
                {value:DT_VIDEO,title:'Video'},
            ]
        }
        module.set_biz_item=function(item){
            no_photo_str='/images/no_image.png';
            _photo_size_album='';
            _photo_size_thumb='thumb_size_';
            _photo_size_mid='mid_size_';
            _photo_size_large='large_size_';
            _photo_size_square_thumb='square_thumb_size_';
            _photo_size_square_mid='square_mid_size_';
            _photo_size_square_large='square_large_size_';
            if(!item.photofilename){
                item.photofilename=null;
            }
            item.photo_obj={
                album_url : (item.photofilename) ? FILE_URL+item.photofilename : no_photo_str,
                thumb_url : (item.photofilename) ? FILE_URL+_photo_size_thumb+item.photofilename : no_photo_str,
                mid_url   : (item.photofilename) ? FILE_URL+_photo_size_mid+item.photofilename : no_photo_str,
                large_url : (item.photofilename) ? FILE_URL+_photo_size_large+item.photofilename : no_photo_str,
                thumb_url : (item.photofilename) ? FILE_URL+_photo_size_thumb+item.photofilename : no_photo_str,
                square_thumb_url : (item.photofilename) ? FILE_URL+_photo_size_square_thumb+item.photofilename : no_photo_str,
                square_mid_url   : (item.photofilename) ? FILE_URL+_photo_size_square_thumb+item.photofilename : no_photo_str,
                square_large_url : (item.photofilename) ? FILE_URL+_photo_size_square_thumb+item.photofilename : no_photo_str,
            };
            if(!item.review_count){
                item.review_count='0';
            }
            if(!item.view_count){
                item.view_count='0';
            }
            no_date_str='';
            if(!item.date_create){
                item.date_create=null;
            }
            item.date_obj={
                pretty_create: (item.date_create) ? utilityz.get_date_time_pretty(item.date_create) : no_date_str,
                pretty_update: (item.date_create) ? utilityz.get_date_time_pretty(item.date_save): no_date_str,
                full_date_create: (item.date_create) ? utilityz.get_date_str(item.date_create) : no_date_str,
                full_date_update: (item.date_create) ? utilityz.get_date_str(item.date_save) : no_date_str,
                full_date_time_create: (item.date_create) ? utilityz.get_date_time_str(item.date_create) : no_date_str,
                full_date_time_update: (item.date_create) ? utilityz.get_date_time_str(item.date_save) : no_date_str,
                month_create: (item.date_create) ? biz9.get_month_title_short(1+biz9.get_date_time_obj(item.date_create).month()) : no_date_str,
                month_update: (item.date_create) ? biz9.get_month_title_short(1+biz9.get_date_time_obj(item.date_save).month()) : no_date_str,
                mo_create: (item.date_create) ? (1+biz9.get_date_time_obj(item.date_create).month()) : no_date_str,
                mo_update: (item.date_create) ? (1+biz9.get_date_time_obj(item.date_save).month()) : no_date_str,
                date_create: (item.date_create) ? biz9.get_date_time_obj(item.date_create).date() : no_date_str,
                year_create: (item.date_create) ? biz9.get_date_time_obj(item.date_create).year() : no_date_str,
                year_update: (item.date_create) ? biz9.get_date_time_obj(item.date_save).year() : no_date_str,
                time_create: (item.date_create) ? biz9.get_time_str(item.date_create) : no_date_str,
                time_update: (item.date_create) ? utilityz.get_time_str(item.date_save) : no_date_str,
            }
            if(BIZ_MAP==true){
                if(item.field_1 || item.date_1){
                    if(item.field_1){
                        item[item.field_1]=item.value_1 ? (item.value_1) : '';
                    }
                    if(item.field_2){
                        item[item.field_2]=item.value_2 ? (item.value_2) : '';
                    }
                    if(item.field_3){
                        item[item.field_3]=item.value_3 ? (item.value_3) : '';
                    }
                    if(item.field_4){
                        item[item.field_4]=item.value_4 ? (item.value_4) : '';
                    }
                    if(item.field_5){
                        item[item.field_5]=item.value_5 ? (item.value_5) : '';
                    }
                    if(item.field_6){
                        item[item.field_6]=item.value_6 ? (item.value_6) : '';
                    }
                    if(item.field_7){
                        item[item.field_7]=item.value_7 ? (item.value_7) : '';
                    }
                    if(item.field_8){
                        item[item.field_8]=item.value_8 ? (item.value_8) : '';
                    }
                    if(item.field_9){
                        item[item.field_9]=item.value_9 ? (item.value_9) : '';
                    }
                    if(item.field_10){
                        item[item.field_10]=item.value_10 ? (item.value_10) : '';
                    }
                    if(item.field_11){
                        item[item.field_11]=item.value_11 ? (item.value_11) : '';
                    }
                    if(item.field_12){
                        item[item.field_12]=item.value_12 ? (item.value_12) : '';
                    }
                    if(item.field_13){
                        item[item.field_13]=item.value_13 ? (item.value_13) : '';
                    }
                    if(item.field_14){
                        item[item.field_14]=item.value_14 ? (item.value_14) : '';
                    }
                    if(item.field_15){
                        item[item.field_15]=item.value_15 ? (item.value_15) : '';
                    }
                    if(item.field_16){
                        item[item.field_16]=item.value_16 ? (item.value_16) : '';
                    }
                    if(item.date_1){
                        item[item.date_1]=biz9.get_date_time_obj(item.date_value_1) ? (item.date_value_1) : '';
                    }
                    if(item.date_2){
                        item[item.date_2]=biz9.get_date_time_obj(item.date_value_2) ? (item.date_value_2) : '';
                    }
                    if(item.date_3){
                        item[item.date_3]=biz9.get_date_time_obj(item.date_value_3) ? (item.date_value_3) : '';
                    }
                }
                for (const key in item) {
                    if(item[key] != 'date_create' || 'photofilename'){
                        if(!item[key]){
                            item[key]='';
                        }
                    }
                }
            }
            return item;
        }
        module.get_test_sub_note=function(){
            var str = "sub note " + biz9.get_id(9999)+ " Lorem Ipsum is simply dummy text of the printing and"+
                "typesetting industry. Lorem Ipsum has been the industry's standard "+
                "dummy text ever since the 1500s.";
            return str;
        }
        module.get_test_note=function(){
            var str = "<div>"+
                "<h2> note " + biz9.get_id(9999)+  " What is Lorem Ipsum?</h2>"+
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
        module.get_member=function(db,title_url,callback){
            var member=appz.get_new_item(DT_BLOG_POST,0);
            var full_photo_list=[];
            var other_list=[];
            var error=null;
            async.series([
                function(call){
                    sql = {title_url:title_url};
                    sort={};
                    dataz.get_sql_cache(db,DT_MEMBER,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            if(data_list[0].tbl_id!=0 &&data_list[0]){
                                member=data_list[0];
                                if(!member.first_name==''|| member.first_name=='' ){
                                    member.first_name= ' ';
                                }

                                if(!member.last_name==''|| member.last_name=='' ){
                                    member.last_name= ' ';
                                }


                            }
                        }
                        call();
                    });
                },
                function(call){
                    member.photos=[];
                    member.items=[];
                    call();
                },
                function(call){
                    appz.get_review_obj(db,member.tbl_id,function(error,data){
                        member.review_obj=data;
                        call();
                    });
                },
                function(call){
                    sql = {top_tbl_id:member.tbl_id};
                    sort={};
                    dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            full_photo_list.push(data_list[a]);
                        }
                        call();
                    });
                },
                function(call){
                    sql={parent_tbl_id:member.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                    sql = {top_tbl_id:member.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                        if(member.tbl_id==full_photo_list[a].parent_tbl_id){
                            member.photos.push(full_photo_list[a]);
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
                        member[top_list[a].title_url]=top_list[a];
                        member.items.push(top_list[a]);
                    }
                    call();
                },
            ],
                function(err, result){
                    callback(error,member);
                });
        }
        module.get_blog_post=function(db,title_url,callback){
            var blog_post=appz.get_new_item(DT_BLOG_POST,0);
            var full_photo_list=[];
            var other_list=[];
            var error=null;
            async.series([
                function(call){
                    sql = {title_url:title_url};
                    sort={};
                    dataz.get_sql_cache(db,DT_BLOG_POST,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            if(data_list[0].tbl_id!=0 &&data_list[0]){
                                blog_post=data_list[0];
                            }
                        }
                        call();
                    });
                },
                function(call){
                    blog_post.photos=[];
                    blog_post.items=[];
                    call();
                },
                function(call){
                    if(blog_post.mp3filename){
                        blog_post.mp3_url =FILE_URL+helper.item.mp3filename;
                    }
                    call();
                },
                function(call){
                    appz.get_review_obj(db,blog_post.tbl_id,function(error,data){
                        blog_post.review_obj=data;
                        call();
                    });
                },
                function(call){
                    sql = {top_tbl_id:blog_post.tbl_id};
                    sort={};
                    dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            full_photo_list.push(data_list[a]);
                        }
                        call();
                    });
                },
                function(call){
                    sql={parent_tbl_id:blog_post.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                    sql = {top_tbl_id:blog_post.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
            var comment_list=[];
            var other_list=[];
            var error=null;
            async.series([
                function(call){
                    sql = {title_url:title_url};
                    sort={};
                    dataz.get_sql_cache(db,DT_PRODUCT,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            if(data_list[0].tbl_id!=0 &&data_list[0]){
                                product=data_list[0];
                            }
                        }
                        call();
                    });
                },
                function(call){
                    product.photos=[];
                    product.items=[];
                    product.visible_obj=appz.get_visible_product_obj(product.visible);
                    product.money_obj=appz.get_money_obj(product);
                    call();
                },
                function(call){
                    appz.get_review_obj(db,product.tbl_id,function(error,data){
                        product.review_obj=data;
                        call();
                    });
                },
                function(call){
                    sql = {top_tbl_id:product.tbl_id};
                    sort={};
                    dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            full_photo_list.push(data_list[a]);
                        }
                        call();
                    });
                },
                function(call){
                    sql={parent_tbl_id:product.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                    sql = {top_tbl_id:product.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
        //	paging_return=item_count;
        //	paging_return=page_count;
        module.get_item_map_page=function(db,item_map_title_url,page_title_url,setting,callback){
            var item_map_page=appz.get_new_item(DT_ITEM_MAP,0);
            var page=appz.get_new_item(item_map_title_url,0);
            var item_count=0;
            var page_count=0;
            var full_photo_list=[];
            var top_list=[];
            var other_list=[];
            var error=null;
            async.series([
                function(call){
                    sql = {title_url:page_title_url};
                    sort={};
                    dataz.get_sql_cache(db,item_map_page_title_url,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            item_map_page=data_list[0];
                        }
                        call();
                    });
                },
                function(call){
                    item_map_page.photos=[];
                    item_map_page.items=[];
                    page.title_url=sub_page_title_url;
                    page.photos=[];
                    page.items=[];
                    call();
                },
                function(call){
                    if(item_map_page.tbl_id!=0){
                        sql = {title_url:sub_page_title_url};
                        sort={};
                        dataz.get_sql_cache(db,item_map_page.title_url,sql,sort,function(error,data_list) {
                            if(data_list.length>0){
                                page=data_list[0];
                            }
                            page.photos=[];
                            page.items=[];
                            call();
                        });
                    }else{
                        call();
                    }
                },
                function(call){
                    if(item_map_page.tbl_id!=0&&page.tbl_id!=0){
                        sql = {parent_data_type:item_map_title_url};
                        sort={};
                        dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
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
                    if(item_map_page.tbl_id!=0&&page.tbl_id!=0){
                        sort=appz.get_key_sort_type(page);
                        if(!setting.filter_category){
                            sql={parent_tbl_id:page.tbl_id};
                        }else{
                            sql={parent_tbl_id:page.tbl_id,category:setting.filter_category};
                        }
                        if(setting.filter_search){
                            sql.search=setting.filter_search;
                        }
                        if(setting.count){
                            dataz.get_sql_paging_cache(db,item_map_page.title_url,sql,sort,1,setting.count,function(error,data_list,_item_count,_page_count) {
                                top_list=data_list;
                                item_count=_item_count;
                                page_count=_page_count;
                                call();
                            });
                        }else if(setting.page_size){
                            if(!setting.page_current){
                                setting.page_current=1;
                            }
                            dataz.get_sql_paging_cache(db,item_map_page.title_url,sql,sort,setting.page_current,setting.page_size,function(error,data_list,_item_count,_page_count) {
                                top_list=data_list;
                                item_count=_item_count;
                                page_count=_page_count;
                                call();
                            });
                        }else{
                            dataz.get_sql_cache(db,item_map_page.title_url,sql,sort,function(error,data_list) {
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
                    if(item_map_page.tbl_id!=0&&page.tbl_id!=0){
                        sql = {parent_data_type:item_map_title_url};
                        sort=appz.get_key_sort_type(page);
                        dataz.get_sql_cache(db,item_map_page.title_url,sql,sort,function(error,data_list) {
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
                        if(page.tbl_id==full_photo_list[a].parent_tbl_id){
                            page.photos.push(full_photo_list[a]);
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
                        page[top_list[a].title_url]=top_list[a];
                        page['item_count']=item_count;
                        page['page_count']=page_count;
                        page.items.push(top_list[a]);
                    }
                    call();
                },
                function(call){
                    page.items=appz.get_item_list_sort(page,page.items);
                    call();
                },
                function(call){
                    async.forEachOf(page.items,(top_item,key,go)=>{
                        top_item.items=appz.get_item_list_sort(top_item,top_item.items);
                        async.forEachOf(top_item.items,(sub_item,key,go2)=>{
                            sub_item.items=appz.get_item_list_sort(sub_item,sub_item.items);
                            async.forEachOf(page.items,(item,key,go3)=>{
                                item.items=appz.get_item_list_sort(item,item.items);
                                go3();
                            }, error => {
                                go2();
                            });
                        }, error => {
                            go();
                        });
                    }, error => {
                        call();
                    });
                },
            ],
                function(err, result){
                    callback(error,page);
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
        //	paging_return=item_count;
        //	paging_return=page_count;
        module.get_sub_page=function(db,page_title_url,sub_page_title_url,setting,callback){
            var item_map=appz.get_new_item(DT_ITEM_MAP,0);
            var sub_page=appz.get_new_item(DT_BLANK,0);
            var item_count=0;
            var page_count=0;
            var full_photo_list=[];
            var top_list=[];
            var other_list=[];
            var error=null;
            async.series([
                function(call){
                    sql = {title_url:page_title_url};
                    sort={};
                    dataz.get_sql_cache(db,DT_ITEM_MAP,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            item_map=data_list[0];
                        }
                        call();
                    });
                },
                function(call){
                    item_map.photos=[];
                    item_map.items=[];
                    sub_page.title_url=sub_page_title_url;
                    sub_page.photos=[];
                    sub_page.items=[];
                    call();
                },
                function(call){
                    if(item_map.tbl_id!=0){
                        sql = {title_url:sub_page_title_url};
                        sort={};
                        dataz.get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
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
                        sql = {parent_data_type:page_title_url};
                        sort={};
                        dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
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
                            dataz.get_sql_paging_cache(db,item_map.title_url,sql,sort,1,setting.count,function(error,data_list,_item_count,_page_count) {
                                top_list=data_list;
                                item_count=_item_count;
                                page_count=_page_count;
                                call();
                            });
                        }else if(setting.page_size){
                            if(!setting.page_current){
                                setting.page_current=1;
                            }
                            dataz.get_sql_paging_cache(db,item_map.title_url,sql,sort,setting.page_current,setting.page_size,function(error,data_list,_item_count,_page_count) {
                                top_list=data_list;
                                item_count=_item_count;
                                page_count=_page_count;
                                call();
                            });
                        }else{
                            dataz.get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
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
                        sql = {parent_data_type:page_title_url};
                        sort=appz.get_key_sort_type(sub_page);
                        dataz.get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
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
                        sub_page['item_count']=item_count;
                        sub_page['page_count']=page_count;
                        sub_page.items.push(top_list[a]);
                    }
                    call();
                },
                function(call){
                    sub_page.items=appz.get_item_list_sort(sub_page,sub_page.items);
                    call();
                },
                function(call){
                    async.forEachOf(sub_page.items,(top_item,key,go)=>{
                        top_item.items=appz.get_item_list_sort(top_item,top_item.items);
                        async.forEachOf(top_item.items,(sub_item,key,go2)=>{
                            sub_item.items=appz.get_item_list_sort(sub_item,sub_item.items);
                            async.forEachOf(sub_page.items,(item,key,go3)=>{
                                item.items=appz.get_item_list_sort(item,item.items);
                                go3();
                            }, error => {
                                go2();
                            });
                        }, error => {
                            go();
                        });
                    }, error => {
                        call();
                    });
                },
            ],
                function(err, result){
                    callback(error,sub_page);
                });
        }
        module.get_item_list_sort=function(_item,_list){
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
        module.get_event_list=function(db,sql,sort_by,page_current,page_size,callback) {
            var event_list=[];
            var full_photo_list=[];
            var sub_event_list=[];
            var review_list=[];
            var item_count=0;
            var page_count=0;
            var error=null;
            async.series([
                function(call){
                    dataz.get_sql_paging_cache(db,DT_EVENT,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                        event_list=data_list;
                        item_count=_item_count;
                        page_count=_page_count;
                        call();
                    });
                },
                function(call){
                    for(a=0;a<event_list.length;a++){
                        event_list[a].event_obj=appz.get_event_obj(event_list[a]);
                        event_list[a].money_obj=appz.get_money_obj(event_list[a]);
                        event_list[a].visible_obj=appz.get_visible_event_obj(event_list[a].visible);
                    }
                    call();
                },
            ],
                function(err, result){
                    callback(error,event_list,item_count,page_count);
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
                    dataz.get_sql_cache(db,DT_EVENT,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            if(data_list[0].tbl_id!=0 &&data_list[0]){
                                event=data_list[0];
                            }
                        }
                        call();
                    });
                },
                function(call){
                    event.photos=[];
                    event.items=[];
                    event.visible_obj=appz.get_visible_event_obj(event.visible);
                    event.money_obj=appz.get_money_obj(event);
                    event.event_obj=appz.get_event_obj(event);
                    call();
                },
                function(call){
                    appz.get_review_obj(db,event.tbl_id,function(error,data){
                        event.review_obj=data;
                        call();
                    });
                },
                function(call){
                    sql = {top_tbl_id:event.tbl_id};
                    sort={};
                    dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            full_photo_list.push(data_list[a]);
                        }
                        call();
                    });
                },
                function(call){
                    sql={parent_tbl_id:event.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                    sql = {top_tbl_id:event.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                        if(event.tbl_id==full_photo_list[a].parent_tbl_id){
                            event.photos.push(full_photo_list[a]);
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
                        event[top_list[a].title_url]=top_list[a];
                        event.items.push(top_list[a]);
                    }
                    call();
                },
            ],
                function(err, result){
                    callback(error,event);
                });
        }
        module.get_product_list=function(db,sql,sort_by,page_current,page_size,callback) {
            var product_list=[];
            var full_photo_list=[];
            var sub_product_list=[];
            var review_list=[];
            var item_count=0;
            var page_count=0;
            var error=null;
            async.series([
                function(call){
                    dataz.get_sql_paging_cache(db,DT_PRODUCT,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                        product_list=data_list;
                        item_count=_item_count;
                        page_count=_page_count;
                        call();
                    });
                },
                function(call){
                    for(a=0;a<product_list.length;a++){
                        product_list[a].money_obj = appz.get_money_obj(product_list[a]);
                        product_list[a].visible_obj=appz.get_visible_product_obj(product_list[a].visible);
                    }
                    call();
                },
            ],
                function(err, result){
                    callback(error,product_list,item_count,page_count);
                });
        }
        module.get_category_biz_list=function(db,data_type,sort_by,page_current,page_size,callback) {
            var category_list=[];
            var item_list=[];
            var item_count=0;
            var page_count=0;
            var error=null;
            async.series([
                function(call){
                    if(data_type=='all'){
                        sql={};
                    }else{
                        sql={type:data_type};
                    }
                    dataz.get_sql_paging_cache(db,DT_CATEGORY,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                        category_list=data_list;
                        item_count=_item_count;
                        page_count=_page_count;
                        call();
                    });
                },
                function(call){
                    dataz.get_sql_cache(db,data_type,{},{},function(error,data_list) {
                        item_list=data_list;
                        call();
                    });
                },
                function(call){
                    for(a=0;a<category_list.length;a++){
                        category_list[a].item_count=0;
                        category_list[a].type_title=get_category_title(category_list[a].type);
                        category_list[a].last_item_create=appz.get_new_item(DT_BLANK,0);
                        add=true;
                        for(b=0;b<item_list.length;b++){
                            if(category_list[a].title==item_list[b].category){
                                category_list[a].item_count=category_list[a].item_count+1;
                                if(category_list[a].last_item_create.tbl_id){
                                    //compare
                                    date_1=new Date(item_list[b].date_obj.year_create,item_list[b].date_obj.mo_create,item_list[b].date_obj.date_create)
                                    date_2=new Date(category_list[a].last_item_create.date_obj.year_create,category_list[a].last_item_create.date_obj.mo_create,category_list[a].last_item_create.date_obj.date_create)
                                    update = utilityz.get_older_date(date_1,date_2);
                                    if('date2'==update){
                                        add=true;
                                    }
                                }
                                if(add){
                                    category_list[a].last_item_create = item_list[b];
                                    add=false;
                                }
                            }
                            if(!category_list[a].last_item_create.tbl_id){
                                category_list[a].last_item_create=appz.set_biz_item(category_list[a].last_item_create);
                            }
                        }
                    }
                    call();
                },
            ],
                function(err, result){
                    callback(error,category_list,item_count,page_count);
                });
        }
        module.get_category_list=function(db,data_type,sort_by,page_current,page_size,callback) {
            var category_list=[];
            var item_list=[];
            var item_count=0;
            var page_count=0;
            var error=null;
            async.series([
                function(call){
                    if(data_type=='all'){
                        sql={};
                    }else{
                        sql={type:data_type};
                    }
                    dataz.get_sql_paging_cache(db,DT_CATEGORY,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                        category_list=data_list;
                        item_count=_item_count;
                        page_count=_page_count;
                        call();
                    });
                },
            ],
                function(err, result){
                    callback(error,category_list,item_count,page_count);
                });
        }
        module.get_category=function(db,title_url,callback){
            var category=appz.get_new_item(DT_CATEGORY,0);
            var full_photo_list=[];
            var other_list=[];
            var item_count=0;
            var page_count=0;
            async.series([
                function(call){
                    sql = {title_url:title_url};
                    sort={};
                    dataz.get_sql_cache(db,DT_CATEGORY,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            if(data_list[0].tbl_id!=0 &&data_list[0]){
                                category=data_list[0];
                            }
                        }
                        category.photos=[];
                        category.items=[];
                        call();
                    });
                },
                function(call){
                    sql = {top_tbl_id:category.tbl_id};
                    sort={};
                    dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            full_photo_list.push(data_list[a]);
                        }
                        call();
                    });
                },
                function(call){
                    sql={parent_tbl_id:category.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                    sql = {top_tbl_id:category.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                        if(category.tbl_id==full_photo_list[a].parent_tbl_id){
                            category.photos.push(full_photo_list[a]);
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
                        category[top_list[a].title_url]=top_list[a];
                        category.items.push(top_list[a]);
                    }
                    call();
                },
            ],
                function(err, result){
                    callback(error,category);
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
                    dataz.get_sql_cache(db,DT_SERVICE,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            if(data_list[0].tbl_id!=0 &&data_list[0]){
                                service=data_list[0];
                            }
                        }
                        call();
                    });
                },
                function(call){
                    service.photos=[];
                    service.items=[];
                    service.visible_obj=appz.get_visible_service_obj(service.visible);
                    service.money_obj=appz.get_money_obj(service);
                    call();
                },
                function(call){
                    appz.get_review_obj(db,service.tbl_id,function(error,data){
                        service.review_obj=data;
                        call();
                    });
                },
                function(call){
                    sql = {top_tbl_id:service.tbl_id};
                    sort={};
                    dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            full_photo_list.push(data_list[a]);
                        }
                        call();
                    });
                },
                function(call){
                    sql={parent_tbl_id:service.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                    sql = {top_tbl_id:service.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
        module.get_review_list=function(db,sql,sort_by,page_current,page_size,callback) {
            var review_list=[];
            var item_count=0;
            var page_count=0;
            var error=null;
            async.series([
                function(call){
                    dataz.get_sql_paging_cache(db,DT_REVIEW,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                        review_list=data_list;
                        item_count=_item_count;
                        page_count=_page_count;
                        call();
                    });
                },
            ],
                function(err, result){
                    callback(error,review_list,item_count,page_count);
                });
        }
        module.get_service_list=function(db,sql,sort_by,page_current,page_size,callback) {
            var service_list=[];
            var full_photo_list=[];
            var sub_service_list=[];
            var item_count=0;
            var page_count=0;
            var error=null;
            async.series([
                function(call){
                    dataz.get_sql_paging_cache(db,DT_SERVICE,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                        service_list=data_list;
                        item_count=_item_count;
                        page_count=_page_count;
                        call();
                    });
                },
                function(call){
                    for(a=0;a<service_list.length;a++){
                        service_list[a].money_obj = appz.get_money_obj(service_list[a]);
                        service_list[a].visible_obj=appz.get_visible_service_obj(service_list[a].visible);
                    }
                    call();
                },
            ],
                function(err, result){
                    callback(error,service_list,item_count,page_count);
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
                    dataz.get_sql_cache(db,DT_PROJECT,sql,sort,function(error,data_list) {
                        if(data_list.length>0){
                            if(data_list[0].tbl_id!=0 &&data_list[0]){
                                project=data_list[0];
                            }
                        }
                        project.photos=[];
                        project.items=[];
                        call();
                    });
                },
                function(call){
                    sql = {top_tbl_id:project.tbl_id};
                    sort={};
                    dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                        for(a=0;a<data_list.length;a++){
                            full_photo_list.push(data_list[a]);
                        }
                        call();
                    });
                },
                function(call){
                    sql={parent_tbl_id:project.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                    sql = {top_tbl_id:project.tbl_id};
                    sort={order:1};
                    dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
    var item_count=0;
    var page_count=0;
    var error=null;
    async.series([
        function(call){
            dataz.get_sql_paging_cache(db,DT_PROJECT,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                project_list=data_list;
                item_count=_item_count;
                page_count=_page_count;
                call();
            });
        },
    ],
        function(err, result){
            callback(error,project_list,item_count,page_count);
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
            dataz.get_sql_cache(db,DT_GALLERY,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    if(data_list[0].tbl_id!=0 &&data_list[0]){
                        gallery=data_list[0];
                    }
                }
                call();
            });
        },
        function(call){
            gallery.photos=[];
            gallery.items=[];
            call();
        },
        function(call){
            appz.get_review_obj(db,gallery.tbl_id,function(error,data){
                gallery.review_obj=data;
                call();
            });
        },
        function(call){
            sql = {parent_tbl_id:gallery.tbl_id};
            sort={};
            dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
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
    var item_count=0;
    var page_count=0;
    var error=null;
    async.series([
        function(call){
            dataz.get_sql_paging_cache(db,DT_GALLERY,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                gallery_list=data_list;
                item_count=_item_count;
                page_count=_page_count;
                call();
            });
        },
    ],
        function(err, result){
            callback(error,gallery_list,item_count,page_count);
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
            dataz.get_sql_cache(db,DT_ITEM_MAP,sql,sort,function(error,data_list) {
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
            item_map.photos=[];
            item_map.items=[];
            call();
        },
        function(call){
            sql = {top_tbl_id:item_map.tbl_id};
            sort={};
            dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
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
                dataz.get_sql_paging_cache(db,item_map.title_url,sql,sort,1,setting.count,function(error,data_list,_item_count,_page_count) {
                    top_list=data_list;
                    call();
                });
            }else{
                dataz.get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
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
            sql = {top_tbl_id:item_map.tbl_id};
            sort={order:1};
            dataz.get_sql_cache(db,item_map.title_url,sql,sort,function(error,data_list) {
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
            item_map.items=appz.get_item_list_sort(item_map,item_map.items);;
            call();
        },
        function(call){
            async.forEachOf(item_map.items,(top_item,key,go)=>{
                top_item.items=appz.get_item_list_sort(top_item,top_item.items);
                async.forEachOf(top_item.items,(sub_item,key,go2)=>{
                    sub_item.items=appz.get_item_list_sort(sub_item,sub_item.items);
                    async.forEachOf(sub_item.items,(item,key,go3)=>{
                        item.items=appz.get_item_list_sort(item,item.items);
                        go3();
                    }, error => {
                        go2();
                    });
                }, error => {
                    go();
                });
            }, error => {
                call();
            });
        },
    ],
        function(err, result){
            callback(error,item_map);
        });
}
module.copy_photo_list=function(db,parent_tbl_id,new_parent_tbl_id,callback) {
    var photo_list=[];
    var copy_photo_list=[];
    var error=null;
    async.series([
        function(call){
            sql={parent_tbl_id:parent_tbl_id};
            dataz.get_sql_cache(db,DT_PHOTO,sql,{},function(error,data_list) {
                photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<photo_list.length;a++){
                photo=appz.get_new_item(DT_PHOTO,0);
                photo.parent_tbl_id=new_parent_tbl_id;
                photo.photofilename=photo_list[a].photofilename;
                photo.text=photo_list[a].text;
                photo.parent_data_type=photo_list[a].parent_data_type;
                photo.top_tbl_id=photo_list[a].top_tbl_id;
                photo.top_data_type=photo_list[a].top_data_type;
                copy_photo_list.push(photo);
            }
            call();
        },
        function(call){
            dataz.update_list(db,copy_photo_list,function(error,data_list) {
                copy_photo_list=data_list;
                call();
            });
        },
    ],
        function(err, result){
            callback(error,copy_photo_list);
        });
}
module.get_page_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var page_list=[];
    var full_photo_list=[];
    var sub_page_list=[];
    var item_count=0;
    var page_count=0;
    var error=null;
    async.series([
        function(call){
            dataz.get_sql_paging_cache(db,DT_PAGE,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                page_list=data_list;
                item_count=_item_count;
                page_count=_page_count;
                call();
            });
        },
        function(call){
            sql = {parent_data_type:DT_PAGE};
            sort={};
            dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
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
            callback(error,page_list,item_count,page_count);
        });
}
module.get_video_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var video_list=[];
    var full_photo_list=[];
    var sub_video_list=[];
    var item_count=0;
    var page_count=0;
    var error=null;
    async.series([
        function(call){
            dataz.get_sql_paging_cache(db,DT_VIDEO,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                video_list=data_list;
                item_count=_item_count;
                page_count=_page_count;
                call();
            });
        },
        function(call){
            sql = {parent_data_type:DT_VIDEO};
            sort={};
            dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
                sub_video_list=data_list;
                call();
            });
        },
        function(call){
            sql = {parent_data_type:DT_VIDEO};
            sort={};
            dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                full_photo_list=data_list;
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
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<sub_video_list.length;a++){
                sub_video_list[a].photos=[];
                sub_video_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(sub_video_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        sub_video_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<video_list.length;a++){
                for(b=0;b<sub_video_list.length;b++){
                    if(video_list[a].tbl_id==sub_video_list[b].parent_tbl_id){
                        for(c=0;c<sub_video_list.length;c++){
                            if(sub_video_list[b].tbl_id==sub_video_list[c].parent_tbl_id){
                                for(d=0;d<sub_video_list.length;d++){
                                    if(sub_video_list[c].tbl_id==sub_video_list[d].parent_tbl_id){
                                        sub_video_list[c][sub_video_list[d].title_url]=sub_video_list[d];
                                        sub_video_list[c].items.push(sub_video_list[d]);
                                    }
                                }
                                sub_video_list[b][sub_video_list[c].title_url]=sub_video_list[c];
                                sub_video_list[b].items.push(sub_video_list[c]);
                            }
                        }
                        video_list[a][sub_video_list[b].title_url]=sub_video_list[b];
                        video_list[a].items.push(sub_video_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,video_list,item_count,page_count);
        });
}
module.get_member_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var member_list=[];
    var full_photo_list=[];
    var sub_member_list=[];
    var item_count=0;
    var page_count=0;
    var error=null;
    async.series([
        function(call){
            dataz.get_sql_paging_cache(db,DT_MEMBER,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                member_list=data_list;
                item_count=_item_count;
                page_count=_page_count;
                call();
            });
        },
    ],
        function(err, result){
            callback(error,member_list,item_count,page_count);
        });
}
module.get_member=function(db,tbl_id,callback){
    var member=appz.get_new_item(DT_MEMBER,0);
    var full_photo_list=[];
    var other_list=[];
    var error=null;
    async.series([
        function(call){
            biz9.get_item(db,DT_MEMBER,tbl_id,function(error,data) {
                member=data;
                call();
            });
        },
        function(call){
            member.photos=[];
            member.items=[];
            call();
        },
        function(call){
            appz.get_review_obj(db,member.tbl_id,function(error,data){
                member.review_obj=data;
                call();
            });
        },
        function(call){
            sql = {top_tbl_id:member.tbl_id};
            sort={};
            dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                for(a=0;a<data_list.length;a++){
                    full_photo_list.push(data_list[a]);
                }
                call();
            });
        },
        function(call){
            sql={parent_tbl_id:member.tbl_id};
            sort={order:1};
            dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
            sql = {top_tbl_id:member.tbl_id};
            sort={order:1};
            dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
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
                if(member.tbl_id==full_photo_list[a].parent_tbl_id){
                    member.photos.push(full_photo_list[a]);
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
                member[top_list[a].title_url]=top_list[a];
                member.items.push(top_list[a]);
            }
            call();
        },
    ],
        function(err, result){
            callback(error,member);
        });
}

module.get_blog_post_list=function(db,sql,sort_by,page_current,page_size,callback) {
    var blog_post_list=[];
    var full_photo_list=[];
    var sub_blog_post_list=[];
    var item_count=0;
    var page_count=0;
    var error=null;
    async.series([
        function(call){
            dataz.get_sql_paging_cache(db,DT_BLOG_POST,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                blog_post_list=data_list;
                item_count=_item_count;
                page_count=_page_count;
                call();
            });
        },
    ],
        function(err, result){
            callback(error,blog_post_list,item_count,page_count);
        });
}
module.get_item_biz_list=function(db,data_type,sql,sort_by,page_current,page_size,callback) {
    var item_list=[];
    var full_photo_list=[];
    var sub_item_list=[];
    var item_count=0;
    var page_count=0;
    var error=null;
    async.series([
        function(call){
            dataz.get_sql_paging_cache(db,data_type,sql,sort_by,page_current,page_size,function(error,data_list,_item_count,_page_count) {
                item_list=data_list;
                item_count=_item_count;
                page_count=_page_count;
                call();
            });
        },
        function(call){
            sql = {top_data_type:data_type};
            sort={};
            dataz.get_sql_cache(db,DT_ITEM,sql,sort,function(error,data_list) {
                sub_item_list=data_list;
                call();
            });
        },
        function(call){
            sql = {top_data_type:data_type};
            sort={};
            dataz.get_sql_cache(db,DT_PHOTO,sql,sort,function(error,data_list) {
                full_photo_list=data_list;
                call();
            });
        },
        function(call){
            for(a=0;a<item_list.length;a++){
                item_list[a].photos=[];
                item_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(item_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        item_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<sub_item_list.length;a++){
                sub_item_list[a].photos=[];
                sub_item_list[a].items=[];
                for(b=0;b<full_photo_list.length;b++){
                    if(sub_item_list[a].tbl_id==full_photo_list[b].parent_tbl_id){
                        sub_item_list[a].photos.push(full_photo_list[b]);
                    }
                }
            }
            call();
        },
        function(call){
            for(a=0;a<item_list.length;a++){
                for(b=0;b<sub_item_list.length;b++){
                    if(item_list[a].tbl_id==sub_item_list[b].parent_tbl_id){
                        for(c=0;c<sub_item_list.length;c++){
                            if(sub_item_list[b].tbl_id==sub_item_list[c].parent_tbl_id){
                                for(d=0;d<sub_item_list.length;d++){
                                    if(sub_item_list[c].tbl_id==sub_item_list[d].parent_tbl_id){
                                        sub_item_list[c][sub_item_list[d].title_url]=sub_item_list[d];
                                        sub_item_list[c].items.push(sub_item_list[d]);
                                    }
                                }
                                sub_item_list[b][sub_item_list[c].title_url]=sub_item_list[c];
                                sub_item_list[b].items.push(sub_item_list[c]);
                            }
                        }
                        item_list[a][sub_item_list[b].title_url]=sub_item_list[b];
                        item_list[a].items.push(sub_item_list[b]);
                    }
                }
            }
            call();
        },
    ],
        function(err, result){
            callback(error,item_list,item_count,page_count);
        });
}
module.get_money_obj=function(item) {
    var money_obj={};
    if(item.price){
        money_obj.price=String(item.price).replace('$','');
    }
    if(item.old_price){
        money_obj.old_price=String(item.old_price).replace('$','');
    }
    if(isNaN(item.price)){
        money_obj.price=parseFloat(0.00);
    }
    if(isNaN(item.old_price)){
        money_obj.old_price=parseFloat(0.00);
    }
    discount = money_obj.old_price - money_obj.price;
    money_obj.discount= parseInt(((discount / money_obj.old_price) * 100));
    if(isNaN(money_obj.discount)){
        money_obj.discount="0%";
    }else{
        money_obj.discount=money_obj.discount+"%";
    }
    money_obj.price = biz9.get_money(item.price);
    money_obj.old_price = biz9.get_money(item.old_price);
    return money_obj;
}
function get_google_calendar_link(title,note,isodatetime,location){
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+title+"&details="+note+"&dates="+isodatetime+"&location="+location;
}
function set_biz_rating(comment_list){
    if(comment_list.length>0){
        comment_count=0;
        rating=0;
        for(a=0;a<comment_list.length;a++){
            rating = rating+parseInt(comment_list[a].rating);
        }
        return parseFloat(rating / comment_list.length).toFixed(2);
    }else{
        return 0;
    }
}
module.get_event_obj=function(item){
    var event_obj={};
    event_obj.title=item.title;
    event_obj.sub_note=item.sub_note;
    event_obj.location=item.location;
    event_obj.website=item.website;
    event_obj.metting_link=item.metting_link;
    event_obj.start_date = moment(item.start_date+ " " + item.start_time, 'YYYY-MM-DD h:mm').format("dddd MMMM Do, YYYY");
    event_obj.start_time = moment(item.start_date+ " " + item.start_time, 'YYYY-MM-DD h:mm').format("h:mm a");
    event_obj.start_date_time = moment(item.start_date+ " " + item.start_time, 'YYYY-MM-DD h:mm').format("dddd MMMM Do, YYYY h:mm a");
    event_obj.start_date_month=biz9.get_month_title_short(1+biz9.get_date_time_obj(item.start_date).month());
    event_obj.start_date_date=biz9.get_date_time_obj(item.start_date).date();
    event_obj.start_date_year=biz9.get_date_time_obj(item.start_date).year();
    event_obj.start_iso_date_time=utilityz.get_iso_str_by_date_time(item.start_date,item.start_time);
    event_obj.start_google_calendar_url=get_google_calendar_link(item.title,item.sub_note,'isodatetime',item.location);
    return event_obj;
}
module.get_review_obj=function(db,item_tbl_id,callback){
    var review_obj = get_new_review_biz_obj();
    error=null;
    async.series([
        function(call){
            sql = {parent_tbl_id:item_tbl_id};
            sort={date_create:-1};
            dataz.get_sql_cache(db,DT_REVIEW,sql,sort,function(error,data_list) {
                if(data_list.length>0){
                    review_obj.review_list=data_list;
                }else{
                    review_obj.review_list=[];
                }
                call();
            });
        },
        function(call){
            if(review_obj.review_list.length>0){
                rating_avg=0;
                for(a=0;a<review_obj.review_list.length;a++){
                    rating_avg=parseInt(rating_avg)+parseInt(review_obj.review_list[a].rating);
                }
                review_obj.rating_avg=parseFloat(rating_avg/review_obj.review_list.length).toFixed(2);
                if(isNaN(review_obj.rating_avg)){
                    review_obj.rating_avg=0;
                }
                call();
            }else{
                call();
            }
        },
    ],
        function(err, result){
            callback(error,review_obj);
        });
}
module.get_product_visible_option_list=function(product_visible_id){
    visible_option_list=[];
    for(a=0;a<4;a++){
        visible_option_list.push({text:appz.get_visible_product_obj(a).product_status,value:a});
    }
    return visible_option_list;
}
module.get_service_visible_option_list=function(product_visible_id){
    visible_option_list=[];
    for(a=0;a<2;a++){
        visible_option_list.push({text:appz.get_visible_service_obj(a).service_status,value:a});
    }
    return visible_option_list;
}
module.get_event_visible_option_list=function(){
    visible_option_list=[];
    for(a=0;a<4;a++){
        visible_option_list.push({text:appz.get_visible_event_obj(a).event_status,value:a});
    }
    return visible_option_list;
}
module.get_visible_event_obj=function(event_visible_id){
    var visible_obj={};
    event_status='';
    event_status_short='';
    switch(String(event_visible_id)){
        case '0':
            event_status = 'Sold Out';
            event_status_short='Sold Out';
            break;
        case '1':
            event_status = 'Less than 25 tickets remaining';
            event_status_short='rickets Availble';
            break;
        case '2':
            event_status = 'Less than 10 tickets remaining';
            event_status_short='Tickets Availble';
            break;
        case '3':
            event_status = 'Tickets are availble';
            event_status_short='Tickets Availble';
            break;
        default:
            event_status = 'Sold out';
            event_status_short='Sold Out';
            break;
    }
    visible_obj.event_status=event_status;
    visible_obj.event_visible_id=event_visible_id;
    visible_obj.event_status=event_status;
    visible_obj.event_status_short=event_status_short;
    return visible_obj;
}

module.get_visible_product_obj=function(product_visible_id){
    var visible_obj={};
    var product_status='';
    var product_status_short='';
    switch(String(product_visible_id)){
        case '0':
            product_status = 'Out of stock';
            product_status_short='Sold Out';
            break;
        case '1':
            product_status = 'Only 1 left';
            product_status_short='In Stock';
            break;
        case '2':
            product_status = 'Less than 3 left';
            product_status_short='In Stock';
            break;
        case '3':
            product_status = 'In stock. Ships Immediately.';
            product_status_short='In Stock';
            break;
        default:
            product_status = 'Out of stock.';
            product_status_short='Sold Out';
            break;
    }
    visible_obj.product_visible_id=product_visible_id;
    visible_obj.product_status=product_status;
    visible_obj.product_status_short=product_status_short;
    return visible_obj;
}
module.get_visible_service_obj=function(service_visible_id){
    var visible_obj={};
    var service_status='';
    var service_status_short='';
    switch(String(service_visible_id)){
        case '0':
            service_status = 'No sessions availble';
            service_status_short = 'Not Availble';
            break;
        case '1':
            service_status = 'Ready For Booking';
            service_status_short = 'Open for Business';
            break;
        default:
            service_status = 'No sessions availble';
            service_status_short = 'Not Availble';
            break;
    }
    visible_obj.service_visible_id=service_visible_id;
    visible_obj.service_status=service_status;
    visible_obj.service_status_short=service_status_short;
    return visible_obj;
}
return module;
}
