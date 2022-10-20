var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.test = 'crud photo ping';
    res.send({helper:helper});
    res.end();
});
router.post("/update_photo", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK, 0);
    helper.error=null;
    async.series([
        //get file name
        function(call){
            helper.item.photofilename = biz9.get_guid() + '.png';
            call();
        },
        //save file
        function(call){
            const bb = busboy({ headers: req.headers });
            const run = async function(a, b) {
                bb.on('file', (name, file, info) => {
                    const saveTo = path.join(FILE_SAVE_PATH,helper.item.photofilename);
                    file.pipe(fs.createWriteStream(saveTo));
                });
                req.pipe(bb);
                bb.on('finish', () => {
                    call();
                });
            }
            run();
        },
        //check if valid photo
        function(call){
            detect.fromFile(FILE_SAVE_PATH+helper.item.photofilename, function(err, data) {
                if (err) {
                    helper.error='error: detect-file-type-error: '+err;
                    call();
                }else{
                    if(data.ext!='jpg'&&data.ext!='png'&&data.ext!='jpeg'&&data.ext!='svg'&&data.ext!='webp'){
                        helper.error='error: invalid file type. please upload a valid image.';
                    }
                    call();
                }
            });
        },
        //save with new filename size thumb_size
        function(call){
            if(helper.error==null){
                biz9.set_resize_photo_file(PHOTO_SIZE_THUMB.size,FILE_SAVE_PATH,helper.item.photofilename,PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,function(error,data) {
                    call();
                });
            }else{
                call();
            }
        },
        //save with new filename size mid
        function(call){
            if(helper.error==null){
                biz9.set_resize_photo_file(PHOTO_SIZE_MID.size,FILE_SAVE_PATH,helper.item.photofilename,PHOTO_SIZE_MID.title_url+helper.item.photofilename,function(error,data) {
                    call();
                });
            }else{
                call();
            }
        },
        //save with new filename size large
        function(call){
            if(helper.error==null){
                biz9.set_resize_photo_file(PHOTO_SIZE_LARGE.size,FILE_SAVE_PATH,helper.item.photofilename,PHOTO_SIZE_LARGE.title_url+helper.item.photofilename,function(error,data) {
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_org
        function(call){
            if(helper.error==null){
                if(S3_SAVE){
                    biz9.update_bucket_file(S3_BUCKET,FILE_SAVE_PATH+helper.item.photofilename,helper.item.photofilename,function(error,data) {
                        call();
                    });

                }else{
                    call();
                }
            }else{
                call();
            }
        },
        //update_s3_thumb
        function(call){
            if(S3_SAVE){
                biz9.update_bucket_file(S3_BUCKET,FILE_SAVE_PATH+PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,function(error,data) {
                    call();
                });
            }else{
                call();
            }
        },
         //update_s3_mid
        function(call){
            if(S3_SAVE){
                biz9.update_bucket_file(S3_BUCKET,FILE_SAVE_PATH+PHOTO_SIZE_MID.title_url+helper.item.photofilename,PHOTO_SIZE_MID.title_url+helper.item.photofilename,function(error,data) {
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_large
        function(call){
            if(S3_SAVE){
                biz9.update_bucket_file(S3_BUCKET,FILE_SAVE_PATH+PHOTO_SIZE_LARGE.title_url+helper.item.photofilename,PHOTO_SIZE_LARGE.title_url+helper.item.photofilename,function(error,data) {
                    call();
                });
            }else{
                call();
            }
        },
        //delete file large
        /*
        function(call){
            if(helper.error==null){
                if(S3_SAVE){
                    try {
                        fs.unlinkSync(FILE_SAVE_PATH+PHOTO_SIZE_LARGE.title_url+helper.item.photofilename)
                        call();
                    } catch(err) {
                        helper.error='error: org could not delete file '+err;
                        call();
                    }
                }else{
                    call();
                }
            }else{
                call();
            }
        },
        */
        function(call){
            helper.item = biz9.set_biz_item(helper.item);
            call();
        },
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/update_mp3", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(DT_BLANK, 0);
    helper.error=null;
    async.series([
        //get file name
        function(call){
            helper.item.mp3filename = biz9.get_guid() + '.mp3';
            call();
        },
        //save file
        function(call){
            const bb = busboy({ headers: req.headers });
            const run = async function(a, b) {
                bb.on('file', (name, file, info) => {
                const saveTo = path.join(FILE_SAVE_PATH,helper.item.mp3filename);
                    file.pipe(fs.createWriteStream(saveTo));
                });
                req.pipe(bb);
                bb.on('finish', () => {
                    call();
                });
            }
            run();

        },
        //check if valid mp3
        function(call){
            detect.fromFile(FILE_SAVE_PATH+helper.item.mp3filename, function(err, data) {
                if (err) {
                    helper.error='error: detect-file-type-error: '+err;
                    call();
                }else{
                    if(data.ext!='mp3'){
                        helper.error='error: invalid file type';
                    }
                    call();
                }
            });
        },
        function(call){
            helper.item.mp3duration='0:00';
            if(helper.error==null){
                mp3Duration(FILE_SAVE_PATH+helper.item.mp3filename,function(err,duration){
                    if (err)
                        error=err;
                        helper.item.mp3duration=biz9.get_duration(duration);
                        call();
                    });
            }else{
                call();
            }
        },
        //upload to s3
        function(call){
            if(S3_SAVE && helper.error==null){
                biz9.update_bucket_file(S3_BUCKET,FILE_SAVE_PATH+helper.item.mp3filename,helper.item.mp3filename,function(data,error){
                    helper.item.mp3_url = FILE_URL+helper.item.mp3filename;
                    call();
                });
            }else{
                call();
            }
        },
        //delete mp3
        /*
        function(call){
            if(helper.error==null){
                try {
                    fs.unlinkSync(FILE_SAVE_PATH+helper.item.mp3filename)
                    call();
                } catch(err) {
                    helper.error='error: could not delete mp3';
                    call();
                }
            }else{
                call();
            }
        },
        */
    ],
        function(err, result){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
