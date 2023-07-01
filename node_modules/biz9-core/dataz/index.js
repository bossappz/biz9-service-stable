/* Copyright (C) 2019 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-AWZ
 */
module.exports = function(data_config){
    module.get_mongo_connect_db=async function(db_name,callback){
        const client = new mongo_client(MONGO_FULL_URL);
        var error=null;
        async function run() {
            try {
                await client.connect();
           } catch (e) {
               error=e;
                console.error(error);
                biz9.o('get_mongo_connect_db',error);
                biz9.o('get_mongo_connect_db_db_name',db_name);
                var cmd = "sudo mongod --fork --config /etc/mongod.conf";
                dir = exec(cmd, function(error,stdout,stderr){
                });
                dir.on('exit', function (code) {
                    console.log('SUCCESS LOCAL RESET DB');
                    callback(error,null);
                });
            } finally {
                const db = client.db(db_name);
                db.db_name=db_name;
                callback(error,db);
            }
        }
        run();
    }
    module.get_mongo_connect_db_old=async function(db_name,callback){
        var error=null;
        mongo_client.connect(MONGO_FULL_URL,{useUnifiedTopology:true,useNewUrlParser:true,socketTimeoutMS:360000,connectTimeoutMS:360000,keepAlive:true},function(error,client){
            if(error){
                biz9.o('get_mongo_connect_db',error);
                biz9.o('get_mongo_connect_db_db_name',db_name);
                var cmd = "sudo mongod --fork --config /etc/mongod.conf";
                dir = exec(cmd, function(error,stdout,stderr){
                });
                dir.on('exit', function (code) {
                    console.log('SUCCESS LOCAL RESET DB');
                    callback(error,null);
                });
            }else{
                var db = client.db(db_name);
                db.db_name=db_name;
                callback(error,db);
            }
        });
    }
    module.set_close_db=function(db_name,callback){
        db.close()
        callback();
    }
    module.update_list=function(db,data_item_list,callback){
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                for(a=0;a<data_item_list.length;a++){
                    for(property in data_item_list[a]){
                        if(property!='tbl_id'&&property!='data_type'){
                            if(!data_item_list[a][property]){
                                delete data_item_list[a][property];
                            }
                        }
                    }
                }
                call();
            },
            function(call){
                async.forEachOf(data_item_list,(item,key,go)=>{
                    if(item){
                        item.db_name=db.db_name;
                        data_mon.update(db,item.data_type,item,function(error,data)
                            {
                                item.tbl_id=data.tbl_id;
                                if(data){
                                    cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(db.db_name,item.data_type,data.tbl_id),function(error,data)
                                        {
                                            go();
                                        });
                                }else{
                                    go();
                                }
                            });
                    }else{
                        go();
                    }
                }, error => {
                    call();
                });
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err, result){
                callback(error,data_item_list);
            });
    }
    module.update_cache_item=function(db,data_type,data_item,callback){
        var cache_string_str='';
        var error=null;
        var client_redis = redis.createClient(redis_port,redis_url);
        var set_cache=false;
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                if(data_item.photo_obj){
                    delete data_item.photo_obj;
                }
                if(data_item.date_obj){
                    delete data_item.date_obj;
                }
                data_mon.update(db,data_type,data_item,function(error,data){
                    call();
                });
            },
            function(call){
                cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(db.db_name,data_item.data_type,data_item.tbl_id),function(error,data)
                    {
                        call();
                    });
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err, result){
                callback(error,appz.set_biz_item(data_item));
            });
    }
    module.get_cache_item=function(db,data_type,tbl_id,callback) {
        var data_item = appz.get_new_item(data_type,tbl_id);
        var item_attr_list_str=null;
        var _cache_found=false;
        var cache_key_list=null;
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                cache_red.get_cache_string(client_redis,get_cache_item_attr_list_key(db.db_name,data_type,tbl_id),function(error,data){
                    if(data){
                        cache_key_list=data;
                    }
                    call();
                });
            },
            function(call){
                if(cache_key_list!=null){
                    _list =cache_key_list.split(',');
                }else{
                    _list=[];
                }
                async.forEachOf(_list,(item,key,go)=>{
                    if(item){
                        cache_red.get_cache_string(client_redis,get_cache_item_attr_key(db.db_name,data_type,tbl_id,item),function(error,data){
                            if(data){
                                data_item[item] = data;
                                _cache_found=true;
                            }else{
                                data_item[item] =null;
                            }
                            go();
                        });
                    }
                    else{
                        go();
                    }
                }, error => {
                    if(_cache_found){
                        data_item.source='cache';
                    }
                    call();
                });
            },
            function(call){
                if(!_cache_found){
                    data_mon.get(db,data_type,tbl_id,function(error,data_list){
                        if(data_list.length>0){
                            set_cache_item(client_redis,db.db_name,data_type,tbl_id,data_list[0],function(data){
                                data_item=data_list[0];
                                data_item.source='db';
                                call();
                            });
                        }
                        else{
                            data_item.source='not_found';
                            call();
                        }
                    });
                }else{
                    call();
                }
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err, result){
                callback(error,appz.set_biz_item(data_item));
            });
    }
    module.get_sql_paging_cache=function(db,data_type,sql_obj,sort_by,page_current,page_size,callback){
        dataz.get_sql_cache_paging_cache(db,data_type,sql_obj,sort_by,page_current,page_size,function(error,data_list,total_count,page_size){
            callback(error,data_list,total_count,page_size);
        });
    }
    module.get_sql_cache=function(db,data_type,sql_obj,sort_by,callback){
        var page_current=0;
        var page_size=0;
        dataz.get_sql_cache_paging_cache(db,data_type,sql_obj,sort_by,page_current,page_size,function(error,data_list,total_count,page_size){
            callback(error,data_list);
        });
    }
    module.get_sql_cache_paging_cache=function(db,data_type,sql_obj,sort_by,page_current,page_size,callback){
        var data_sql_tbl_id_list = [];
        var data_list=[];
        var total_count=0;
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                if(page_current!=0&&page_size!=0){//db
                    data_mon.paging_sql_tbl_id(db,data_type,sql_obj,sort_by,page_current,page_size,function(error,_total_count,data_list){
                        total_count=_total_count;
                        for(a=0;a<data_list.length;a++){
                            data_sql_tbl_id_list.push({
                                data_type:data_list[a].data_type,
                                tbl_id:data_list[a].tbl_id,
                                source:null,
                                cache_key_list:null,
                                data:null
                            });
                        }
                        call();
                    });
                }else{//cache
                    data_mon.get_sql_tbl_id(db,data_type,sql_obj,sort_by,function(error,data_list){
                        total_count=data_list.length;
                        for(a=0;a<data_list.length;a++){
                            data_sql_tbl_id_list.push({
                                data_type:data_list[a].data_type,
                                tbl_id:data_list[a].tbl_id,
                                source:null,
                                cache_key_list:null,
                                data:null
                            });
                        }
                        call();
                    });
                }
            },
            function(call){
                async.forEachOf(data_sql_tbl_id_list,(item,key,go)=>{
                    cache_red.get_cache_string(client_redis,get_cache_item_attr_list_key(db.db_name,data_type,item.tbl_id),function(error,data){
                        if(data){
                            item.cache_key_list=data;
                        }
                        else{
                            item.cache_key_list=null;
                        }
                        go()
                    });
                },error=>{
                    call();
                });
            },
            function(call){
                async.forEachOf(data_sql_tbl_id_list,(item,key,go)=>{
                    if(item.cache_key_list!=null){
                        var _list =item.cache_key_list.split(',');
                    }else{
                        var _list=[];
                    }
                    _cache_found=false;
                    var data_value = {};
                    async.forEachOf(_list,(item2,key2,go2)=>{
                        if(item2){
                            //item2
                            cache_red.get_cache_string(client_redis,get_cache_item_attr_key(db.db_name,data_type,item.tbl_id,item2),function(error,data){
                                if(data){
                                    data_value[item2] = data;
                                    _cache_found=true;
                                }else{
                                    data_value[item2] =null;
                                }
                                go2();
                            });
                        }else{
                            go2();
                        }
                    }, error => {
                        if(_cache_found){
                            data_value.source='cache';
                            item.data=data_value;
                        }
                        go();
                    });
                }, error => {
                    call();
                });
            },
            function(call){
                async.forEachOf(data_sql_tbl_id_list,(item,key,go)=>{
                    if(!item.data){
                        data_mon.get(db,data_type,item.tbl_id,function(error,data_list){
                            if(data_list.length>0){
                                set_cache_item(client_redis,db.db_name,item.data_type,item.tbl_id,data_list[0],function(data_b){
                                    data_b.source='db';
                                    item.data=data_list[0];
                                    go();
                                });
                            }
                            else{
                                item.data=appz.get_new_item(item.data_type,item.tbl_id);
                                go();
                            }
                        });
                    }else{
                        go();
                    }
                }, error => {
                    call();
                });
            },
            function(call){
                for(a=0;a<data_sql_tbl_id_list.length;a++){
                    if(data_sql_tbl_id_list[a].data){
                        data_list.push(appz.set_biz_item(data_sql_tbl_id_list[a].data));
                    }
                }
                call();
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err,result){
                callback(error,data_list,total_count,Math.round(total_count/page_size+1));
            });
    }
    module.delete_cache_item=function(db,data_type,tbl_id,callback){
        var data_item=appz.get_new_item(data_type,tbl_id);
        var client_redis = redis.createClient(redis_port,redis_url);
        var error=null;
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(db.db_name,data_type,tbl_id),function(error,data)
                    {
                        data_item.cache_string=get_cache_item_attr_list_key(db.db_name,data_type,tbl_id);
                        data_item.cache_del=true;
                        call();
                    });
            },
            function (call){
                data_mon.delete(db,data_type,tbl_id,function(error,data)
                    {
                        data_item.data_del=true;
                        data_item.data=data;
                        call();
                    });
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err, result){
                callback(error,data_item);
            });
    }
    module.delete_sql=function(db,data_type,sql_obj,callback){
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                data_mon.get_sql_tbl_id(db,data_type,sql_obj,{},function(error,data_list){
                    if(data_list.length>0){
                        async.forEachOf(data_list,(item,key,go)=>{
                            if(item){
                                data_mon.delete(db,item.data_type,item.tbl_id,function(error,data)
                                    {
                                        cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(db.db_name,item.data_type,item.tbl_id),function(error,data)
                                            {
                                                go();
                                            });
                                    });
                            }else{
                                go();
                            }
                        }, error => {
                            call();
                        });
                    }
                    else{
                        call();
                    }
                });
            },
            function(call){
                data_mon.delete_sql(db,data_type,sql_obj,function(error,data){
                    call();
                });
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err, result){
                callback(error,[]);
            });
    }
    module.delete_cache_list = function(db,data_type,data_item_list,callback){
        var data_list=[];
        var error=null;
        var client_redis = redis.createClient(redis_port, redis_url);
        async.series([
            function(call){
                const run = async function(a,b){
                    await client_redis.connect();
                    call();
                }
                run();
            },
            function(call){
                async.forEachOf(data_item_list,(item,key,go)=>{
                    cache_red.del_cache_string(client_redis,get_cache_item_attr_list_key(db.db_name,item.data_type,item.tbl_id),function(error,data){
                        data_mon.delete(db,item.data_type,item.tbl_id,function(error,data)
                            {
                                data_list.push(data);
                                go();
                            });
                    });
                }, error => {
                    call();
                });
            },
            function(call){
                const run = async function(a,b){
                    await client_redis.disconnect();
                    call();
                }
                run();
            },
        ],
            function(err, result){
                callback(error,data_list);
            });
    }
    module.drop=function(db,data_type,callback){
        data_mon.drop(db,data_type,function(error,data){
            callback(error,data);
        });
    }
    module.count=function(db,data_type,sql,callback){
        data_mon.count(db,data_type,sql,function(error,data){
            callback(error,data);
        });
    }
    function set_cache_item(client_redis,db_name,data_type,tbl_id,data_item,callback){
        var cache_string_str='';
        async.series([
            function(call){
                for (property in data_item) {
                    if(String(property)){
                        cache_red.set_cache_string(client_redis,get_cache_item_attr_key(db_name,data_type,tbl_id,property),data_item[property],function(error,data){
                        });
                        cache_string_str=cache_string_str+property+',';
                    }
                }
                call();
            },
            function(call){
                cache_red.set_cache_string(client_redis,get_cache_item_attr_list_key(db_name,data_type,tbl_id),cache_string_str,function(error,data){
                    call();
                });
            },
        ],
            function(err, result){
                callback(data_item);
            });
        function get_cache_key_item(org_key_parm_str,data_item){
            if(!org_key_parm_str){
                org_key_parm_str='';
            }
            new_key_obj = {};
            f = org_key_parm_str.split(',');
            for(a = 0; a < f.length; a++) {
                if(f[a]){
                    new_key_obj[f[a]] = null;
                }
            }
            for(property in data_item){
                new_key_obj[property] = null;
            }
            return new_key_obj;
        }
    }
    function get_cache_item_attr_key(cache_id,data_type,tbl_id,key){
        return cache_id + "_" +data_type + "_" + key + "_" + String(tbl_id);
    }
    function get_cache_item_attr_list_key(cache_id,data_type,tbl_id){
        return cache_id + "_" +data_type+"_aik_"+String(tbl_id);
    }
    return module;
}

