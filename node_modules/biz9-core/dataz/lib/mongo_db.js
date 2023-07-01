module.exports = function(){
    module.update =async function(db,data_type,item,callback){
        var error=null;
        if (String(item.tbl_id)=='0') {//insert
            item.tbl_id = utilityz.get_guid();
            item.date_create = new moment().toISOString();
            item.date_save = new moment().toISOString();
            item.db_name = db.db_name;
            async function run() {
                try {
                    const collection = db.collection(data_type);
                    await collection.insertOne(item);
                } catch (e) {
                    error = e;
                    console.error(e);
                    callback(error,item);
                } finally {
                    callback(error,item);
                }
            }
            run();
        }
        else{//update
            item.date_save = new moment().toISOString();
            async function run() {
                try {
                    const collection = db.collection(data_type);
                    await collection.updateOne({tbl_id:item.tbl_id},{$set: item});
                } catch (e) {
                    error = e;
                    console.error(e);
                    callback(error,item);
                } finally {
                    callback(error,item);
                }
            }
            run();
        }
    }
    module.get=function(db,data_type,tbl_id,callback){
        var error=null;
        var data = {};
        async function run() {
            try {
                const collection = db.collection(data_type);
                data = await collection.find({tbl_id:tbl_id}).toArray();
            } catch (e) {
                error = e;
                console.error(e);
                callback(error,data);
            } finally {
                callback(error,data);
            }
        }
        run();
    }
    module.get_sql_tbl_id=function(db,data_type,sql_obj,sort_by,callback){
        var error=null;
        async function run() {
            try {
                const collection = db.collection(data_type);
                data = await collection.find(sql_obj).project({tbl_id:1,data_type:1}).sort(sort_by).collation({locale:"en_US",numericOrdering:true}).toArray();
            } catch (e) {
                error = e;
                console.error(e);
                callback(error,data);
            } finally {
                callback(error,data);
            }
        }
        run();
    }
    module.delete=function(db,data_type,tbl_id,callback){
        var error=null;
        db.collection(data_type).deleteOne({tbl_id:tbl_id},function(error,data) {
            callback(error,0);
        });
        async function run() {
            try {
                const collection = db.collection(data_type);
                data = await collection.deleteMany({tbl_id:tbl_id});
            } catch (e) {
                error = e;
                console.error(e);
                callback(error,data);
            } finally {
                callback(error,data);
            }
        }
        run();
    }
    module.delete_sql=function(db,data_type,sql_obj,callback){
        var error=null;
        async function run() {
            try {
                const collection = db.collection(data_type);
                data = await collection.deleteMany(sql_obj);
            } catch (e) {
                error = e;
                console.error(e);
                callback(error,data);
            } finally {
                callback(error,data);
            }
        }
        run();
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
            function(call){
                async function run() {
                    try {
                        data_list = await db.collection(data_type).find(sql_obj,{tbl_id:1,data_type:1}).sort(sort_by).skip(current_page>0?((current_page-1)*page_size):0).limit(page_size).collation({locale:"en_US",numericOrdering:true}).toArray();
                    } catch (e) {
                        error = e;
                        console.error(e);
                        call();
                    } finally {
                        call();
                    }
                }
                run();
            },
        ],
            function(errors,result){
                callback(error,total_count,data_list);
            });
    }
    module.drop=function(db,data_type,callback){
        var error=null;
        async function run() {
            try {
                const collection = db.collection(data_type);
                data = await collection.drop();
            } catch (e) {
                error = e;
                console.error(e);
                callback(error,data);
            } finally {
                callback(error,data);
            }
        }
        run();
    }
    module.count=function(db,data_type,sql,callback){
        var total_count=0;
        var error=null;
        async.series([
            function(call){
                const run = async function(a,b){
                    total_count= await db.collection(data_type).countDocuments(sql);
                    call();
                }
                run();
            },
        ],
            function(errors,result){
                callback(error,total_count);
            });
    }
    return module;
}
