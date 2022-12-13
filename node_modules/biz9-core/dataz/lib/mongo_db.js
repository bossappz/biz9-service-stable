module.exports = function(){
    module.update = function(db,data_type,item,callback){
        var error=null;
        if (String(item.tbl_id)=='0') {//insert
            item.tbl_id = utilityz.get_guid();
            item.date_create = new moment().toISOString();
            item.date_save = new moment().toISOString();
            item.db_name = db.db_name;
            db.collection(data_type).insertOne(item,function(error,data){
                callback(error,item);
            });
        }
        else{//update
            item.date_save = new moment().toISOString();
            db.collection(data_type).updateOne({tbl_id:item.tbl_id},{$set: item},function(error,data){
                if(error){
                    callback(error,item);
                }else{
                    callback(error,item);
                }
            });
        }
    }
    module.get=function(db,data_type,tbl_id,callback){
        var error=null;
        db.collection(data_type).findOne({tbl_id:tbl_id},function(error,data) {
            if(error){
                error=error;
            }
            callback(error,data);
        });
    }
    module.get_sql_tbl_id=function(db,data_type,sql_obj,sort_by,callback){
        var error=null;
        db.collection(data_type).find(sql_obj).project({tbl_id:1,data_type:1}).sort(sort_by).collation({locale:"en_US",numericOrdering:true}).toArray(function(error,data){
            if(!data){
                data=[]
            }
            callback(error,data);
        });
    }
    module.delete=function(db,data_type,tbl_id,callback){
        var error=null;
        db.collection(data_type).deleteOne({tbl_id:tbl_id},function(error,data) {
            callback(error,0);
        });
    }
    module.delete_sql=function(db,data_type,sql_obj,callback){
        var error=null;
        db.collection(data_type).deleteOne(sql_obj,function(error,data) {
            callback(error,[]);
        });
    }
    module.paging_sql_tbl_id=function(db,data_type,sql_obj,sort_by,current_page,page_size,callback){
        var total_count = 0;
        var data_list = [];
        var error=null;
        async.series([
            function(call){
                const run = async function(a,b){
                   total_count= await db.collection(data_type).countDocuments(sql_obj);
                    call();
                }
                run();
            },
        ],
            function(errors,result){
                if(error){
                    callback(error,total_count,data);
                }else {
                    db.collection(data_type).find(sql_obj,{tbl_id:1,data_type:1}).sort(sort_by)
                        .skip(current_page>0?((current_page-1)*page_size):0)
                        .limit(page_size).collation({locale:"en_US",numericOrdering:true})
                        .toArray(function(error,_data) {
                            callback(error,total_count,_data);
                        });
                }
            });
    }
    module.drop=function(db,data_type,callback){
        var error=null;
        db.collection(data_type).drop(function(error,data){
            callback(error,0);
        });
    }
    module.rename=function(db,data_type,new_title,callback){
        var error=null;
        db.collection(data_type).rename(new_title,function(error,newColl) {
            callback(error,0);
        });
    }
    return module;
}

