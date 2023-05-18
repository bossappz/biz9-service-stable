/* Copyright (C) 2021 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-AWZ
 */
module.exports = function(){
    module.get_bucket_data = function(aws_config,bucket,key,callback){
       aws.config.update({ accessKeyId: aws_config.aws_key, secretAccessKey:aws_config.aws_secret,region:aws_config.aws_region});
        var s3 = new aws.S3();
        var r_data='';
        var error=null;
        if(key){
            var params = {
                Bucket:String(bucket),
                Key:String(key),
                ACL: "public-read"
            };
            s3.getObject(params,function(error,data){
                error=error;
                if(data){
                    if(data.Body){
                        r_data = data.Body.toString('utf-8');
                    }
                }
                callback(error,r_data);
            });
        }
        else{
            error='bucket data key not found';
            callback(error,r_data);
        }
    }
    module.update_bucket=function(aws_obj,title,callback){
        aws.config.update({ accessKeyId: aws_obj.aws_key, secretAccessKey:aws_obj.aws_secret,region:aws_obj.aws_region});
        s3 = new aws.S3();
        error=null;
        var params = {
            Bucket:title
        };
        s3.createBucket(params, function(error,data) {
            callback(error,data);
        });
    }
    module.update_bucket_file=function(aws_config,bucket,file_path,key,content_type,callback){
       aws.config.update({ accessKeyId: aws_config.aws_key, secretAccessKey:aws_config.aws_secret,region:aws_config.aws_region});
         var p_buffer={};
        var error=null;
        async.series([
            function(call){
                utilityz.get_file_buffer(file_path,function(error,data){
                    error=error;
                    p_buffer=data;
                    call();
                });
            },
            function(call){
                s3 = new aws.S3();
                if(p_buffer){
                    //"image/jpeg"
                    //"audio/mp3"
                    var params = {
                        Body: Buffer.from(p_buffer,'utf-8'),
                        Bucket:String(bucket),
                        Key:String(key),
                        ACL: "public-read",
                        ContentType:content_type
                    };
                    s3.putObject(params,function(error,data){
                        if(error){
                            biz9.o('update_bucket_file_error',error);
                            biz9.o('update_bucket_file_error_aws_config',aws_config);
                            error=error.message;
                        }
                        call();
                    });
                }else{
                    error = "error: no buffer found :" +" file_path:"+file_path + ", key: "+key + ", content_type:"+content_type;
                    biz9.o('update_bucket_file',error);
                    call();
                }
        }
        ],
            function(err, result){
                callback(error,0);
            });
    }
    return module;
}
