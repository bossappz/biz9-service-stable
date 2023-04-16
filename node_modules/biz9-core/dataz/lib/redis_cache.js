module.exports = function(){
   module.set_cache_string=function(cr,key,value,callback){
        error=null;
        if(!value||value==null||value==undefined){
            value=" ";
        }
        value=String(value).trim();
        var data=null;
            const run = async function(a,b){
            data = await cr.set(key,value);
            callback(error,data);
        }
        run();
    }
    module.get_cache_string=function(cr,key,callback){
        error=null;
        data=null;
        const run = async function(a,b){
            data = await cr.get(key);
            callback(error,data);
        }
        run();
    }
    module.del_cache_string=function(cr,key,callback){
        error=null;
        data=null;
        const run = async function(a,b){
            data = await cr.del(key);
            callback(error,0);
        }
        run();
    }
    return module;
}
