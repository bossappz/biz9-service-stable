/* Copyright (C) 2016 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-AWZ
 */
module.exports = function(data_config){
    module.get_client_db=async function(callback){
        //var client_db = new mongo_client(MONGO_FULL_URL, {useNewUrlParser: true,useUnifiedTopology: true});
        var reset_cmd = "sudo mongod --fork --config "+data_config.mongo_config_file;
        var error=null;
        async function run() {
            try {
                if(!dataz.db_connected(client_db)){
                    await client_db.connect();
                }
            } catch (e) {
                error=e;
                //ssh admin@0.0.0.0 -- sudo mongod --fork --config /etc/mongod.conf
                biz9.o('get_mongo_connect_db_error',error);
                biz9.o('get_mongo_connect_db_data_config',data_config);
                if(data_config.mongo_ip!='localhost'){
                    if(!data_config.ssh_key_file){
                        data_config.ssh_key_file='';
                    }else{
                        data_config.ssh_key_file=' -i '+ data_config.ssh_key_file;
                    }
                    reset_cmd='ssh '+ data_config.ssh_key_file + " " +data_config.mongo_server_user +"@"+data_config.mongo_ip +" -- "+reset_cmd;
                }
                biz9.o('mongo_reset_cmd',reset_cmd);
                dir = exec(reset_cmd, function(error,stdout,stderr){
                });
                dir.on('exit', function (code) {
                    biz9.o('get_mongo_connect_reset','OK');
                    callback(error,null);
                });
            } finally {
                callback(error,client_db);
            }
        }
        run();
    }
    module.db_connected=function(client_db){
        return !!client_db && !!client_db.topology && !!client_db.topology.isConnected()
    }
    module.db_client_connected=function(client_db){
        if(!db.client){
            return false;
        }else if(!db.client.topology){
                 return false;
        }else if(!db.client.topology){
                 return false;
        }else{
                 return true;
            }
                //if(!db.client.topology){
        //return !!db.client.topology.isConnected()&&!!db.client.topology&&!!db.client;
    }
    module.close_client_db=async function(client_db,callback){
        var error=null;
        async function run() {
            try {
                if(dataz.db_connected(client_db)){
                    await client_db.close();
                }
            } catch (e) {
                error=e;
                if(error){
                    biz9.o('clost_mongo_connect_db_error',error);
                }
            } finally {
                callback(error);
            }
        }
        run();
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
                async.forEachOf(data_item_list,(item,key,go)=>{
                    for(property in item[key]){
                        if(property!='tbl_id'&&property!='data_type'){
                            if(!item[key][property]){
                                delete item[key][property];
                            }
                        }
                    }
                    go();
                }, error => {
                    if(error){
                        error=error;
                    }
                    call();
                });
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
                    if(error){
                        error=error;
                    }
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
                    data_mon.paging_sql_tbl_id(db,data_type,sql_obj,sort_by,page_current,page_size,function(error,_total_count,_data_list_1){
                        total_count=_total_count;
                        async.forEachOf(_data_list_1,(item_1,key_1,go_1)=>{
                            data_sql_tbl_id_list.push({
                                data_type:item_1.data_type,
                                tbl_id:item_1.tbl_id,
                                source:null,
                                cache_key_list:null,
                                data:null
                            });
                            go_1();
                        },error=>{
                            if(error){
                                error=error;
                            }
                            call();
                        });
                    });
                }else{//cache
                    data_mon.get_sql_tbl_id(db,data_type,sql_obj,sort_by,function(error,_data_list_2){
                        total_count=_data_list_2.length;
                        async.forEachOf(_data_list_2,(item_2,key_2,go_2)=>{
                            data_sql_tbl_id_list.push({
                                data_type:item_2.data_type,
                                tbl_id:item_2.tbl_id,
                                source:null,
                                cache_key_list:null,
                                data:null
                            });
                            go_2();
                        },error=>{
                            if(error){
                                error=error;
                            }
                            call();
                        });
                    });
                }
            },
            function(call){
                async.forEachOf(data_sql_tbl_id_list,(item_3,key_3,go_3)=>{
                    cache_red.get_cache_string(client_redis,get_cache_item_attr_list_key(db.db_name,data_type,item_3.tbl_id),function(error,data_3){
                        if(data_3){
                            item_3.cache_key_list=data_3;
                        }
                        else{
                            item_3.cache_key_list=null;
                        }
                        go_3();
                    });
                },error=>{
                    call();
                });
            },
            function(call){
                async.forEachOf(data_sql_tbl_id_list,(item_4,key_4,go_4)=>{
                    if(item_4.cache_key_list!=null){
                        var _list =item_4.cache_key_list.split(',');
                    }else{
                        var _list=[];
                    }
                    _cache_found=false;
                    var data_value = {};
                    async.forEachOf(_list,(item_5,key_5,go_5)=>{
                        if(item_5){
                            cache_red.get_cache_string(client_redis,get_cache_item_attr_key(db.db_name,data_type,item_4.tbl_id,item_5),function(error,data_5){
                                if(data_5){
                                    data_value[item_5] = data_5;
                                    _cache_found=true;
                                }else{
                                    data_value[item_5] =null;
                                }
                                go_5();
                            });
                        }else{
                            go_5();
                        }
                    }, error => {
                        if(_cache_found){
                            data_value.source='cache';
                            item_4.data=data_value;
                        }
                        go_4();
                    });
                }, error => {
                    call();
                });
            },
            function(call){
                async.forEachOf(data_sql_tbl_id_list,(item_7,key_7,go_7)=>{
                    if(!item_7.data){
                        data_mon.get(db,data_type,item_7.tbl_id,function(error,data_list){
                            if(data_list.length>0){
                                set_cache_item(client_redis,db.db_name,item_7.data_type,item_7.tbl_id,data_list[0],function(data_7){
                                    data_7.source='db';
                                    item_7.data=data_list[0];
                                    go_7();
                                });
                            }
                            else{
                                item_7.data=appz.get_new_item(item_7.data_type,item_7.tbl_id);
                                go_7();
                            }
                        });
                    }else{
                        go_7();
                    }
                }, error => {
                    if(error){
                        error = error;
                    }
                    call();
                });
            },
            function(call){
                async.forEachOf(data_sql_tbl_id_list,(item_8,key,go)=>{
                    if(item_8.data){
                        data_list.push(appz.set_biz_item(item_8.data));
                    }
                    go();
                }, error => {
                    if(error){
                        error = error;
                    }
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
                            if(error){
                                error = error;
                            }
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
                    if(error){
                        error=error;
                    }
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

