/* Copyright (C) 2019 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-StatZ
 */
module.exports = function(){
    module.update_item_view_count=function(db,item_data_type,item_tbl_id,customer_id,callback){
        var new_view=true;
        var item_count=0;
        var update_item = biz9.get_new_item(item_data_type,item_tbl_id);
        var new_stat = biz9.get_new_item(DT_STAT,0);
        var error=null;
        async.series([
            function(call){
                if(customer_id){
                sql = {customer_id:customer_id,item_tbl_id:item_tbl_id,type_id:1};
                sort={};
                dataz.get_sql_cache(db,DT_STAT,sql,sort,function(error,data_list) {
                    if(data_list.length>0){
                        new_view=false;
                    }
                    call();
                });
                }else{
                    new_view=false;
                    call();
                }
            },
            function(call){
                if(new_view){
                    new_stat.item_data_type=item_data_type;
                    new_stat.item_tbl_id=item_tbl_id;
                    new_stat.customer_id=customer_id;
                    new_stat.type_id=1;
                    biz9.update_item(db,DT_STAT,new_stat,function(error,data) {
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_view){
                    sql={type_id:1,item_tbl_id:item_tbl_id};
                    biz9.count(db,DT_STAT,sql,function(error,data) {
                        if(!data){
                        item_count=0;
                        }else if(data==1){
                            item_count=0;//bug fix
                        }else{
                        item_count=parseInt(data);
                        }
                        call();
                    });
                }else{
                    call();
                }
            },
            function(call){
                if(new_view){
                    update_item.view_count=parseInt(item_count)+1;
                    biz9.update_item(db,item_data_type,update_item,function(error,data) {
                        update_item=data;
                        call();
                    });
                }else{
                    call();
                }
            },
        ],
            function(err, result){
                update_item.new_view=new_view;
                update_item.new_stat=new_stat;
                update_item.item_count = item_count;
                callback(error,update_item);
            });
    }
    return module;
}


