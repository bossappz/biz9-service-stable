/* Copyright (C) 2021 9_OPZ #Certified CoderZ
 * GNU GENERAL PUBLIC LICENSE
 * Full LICENSE file ( gpl-3.0-licence.txt )
 * BiZ9 Framework
 * Core-AWZ
 */
module.exports = function(aws_config){
    AWS_REGION = aws_config.aws_region;
    AWS_KEY = aws_config.aws_key;
    AWS_SECRET = aws_config.aws_secret;
    module.get_bucket_data = function(bucket,key,callback){
        aws.config.update({ accessKeyId: AWS_KEY, secretAccessKey:AWS_SECRET,region:AWS_REGION});
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
    module.update_bucket=function(title,callback){
        aws.config.update({accessKeyId:AWS_KEY,secretAccessKey:AWS_SECRET,region:AWS_REGION});
        const REGION = AWS_REGION;
        s3 = new aws.S3();
        error=null;
        var params = {
            Bucket:title
        };
        s3.createBucket(params, function(error,data) {
            callback(error,data);
        });
    }
    module.update_bucket_file=function(bucket,file_path,key,callback){
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
                aws.config.update({accessKeyId:AWS_KEY,secretAccessKey:AWS_SECRET,region:AWS_REGION});
                s3 = new aws.S3();
                if(p_buffer){
                    var params = {
                        Body: Buffer.from(p_buffer,'utf-8'),
                        Bucket:String(bucket),
                        Key:String(key),
                        ACL: "public-read"
                    };
                    s3.putObject(params,function(error,data){
                        if(error){
                            error=error;
                        }
                        call();
                    });
                }
        }
        ],
            function(err, result){
                callback(error,0);
            });
    }
    return module;
}
