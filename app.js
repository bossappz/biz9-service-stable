/* --- APP REQUIRE START -- */
async=require("async");
busboy=require("busboy");
cors=require("cors")
detect=require('detect-file-type');
express=require("express");
fs=require('fs-extra')
mp3Duration=require('mp3-duration');
path=require("path");
session=require("express-session");
/* --- APP REQUIRE END --- */
/* --- APP DEFAULT START --- */
ENV=process.env.NODE_ENV;
/*--- APP DEFAULT END ---*/
/* --- APP CONFIG START  --- */
BIZ9_SERVICE_VERSION='5.1.8'
APP_ID='19';
//APP_TITLE_ID='';
APP_TITLE_ID='';
APP_TITLE='BiZ9-Service';
APP_VERSION='2.7.0'
PAGE_SIZE_CATEGORY_POPULAR_LIST=9;
PAGE_SIZE_CATEGORY_LIST=19;
PAGE_SIZE_ITEM_LIST=19;
PAGE_SIZE_FEATURE_LIST=19;
PAGE_SIZE_SLIDE_SHOW_LIST=12;
/* --- APP CONFIG END  --- */
//-SEND_IN_BLUE-START
//SEND_IN_BLUE_KEY='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';
//-SEND_IN_BLUE-END
/* --- ENV CONFIG START --- */
APP_PORT="1901";
/* --- ENV CONFIG END --- */
/* --- MONGO START --- */
MONGO_IP="0.0.0.0";
MONGO_PORT="27019";
MONGO_URL="mongodb://localhost:"+MONGO_PORT+"?keepAlive=true&socketTimeoutMS=360000&connectTimeoutMS=360000"; //local
//MONGO_URL="mongodb://ban:1234567@"+MONGO_IP+":"+MONGO_PORT+"?keepAlive=true&socketTimeoutMS=360000&connectTimeoutMS=360000"; //remote
/* --- MONGO END --- */
/* --- ENV AWS START --- */
S3_SAVE=true;
S3_BUCKET="bappz";
AWS_KEY="AKIA3JQYFN5KARMHJVKJ";
AWS_SECRET="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";
AWS_REGION="us-east-1";
/* --- ENV AWS END --- */
/* --- ENV EMAILZ START --- */
EMAIL_TO="contact@bossappz.com";
EMAIL_FROM="contact@bossappz.com";
/* --- ENV EMAILZ END --- */
/* --- ENV FILE START --- */
//FILE_SAVE_PATH="/uploads/";//local
FILE_SAVE_PATH=__dirname+"/public/uploads/";
//FILE_URL="/uploads/"; //box_url
//FILE_URL="http://localhost:1900/uploads/"; //mobile_box_url
FILE_URL="https://"+S3_BUCKET+".s3.amazonaws.com/" //aws_s3_url
//FILE_URL="https://bossappz.com/uploads/" //web_prod_url
/* --- ENV FILE END --- */
/* --- ENV CONFIG END -- */
/* --- DATA_TYPE-START --- */
DT_USER="user_biz";
DT_BLANK="blank_biz";
DT_PHOTO="photo_biz";
DT_BLOG_POST="blog_post_biz";
DT_MEMBER="member_biz";
DT_EVENT="event_biz";
DT_CATEGORY="category_biz";
DT_GALLERY="gallery_biz";
DT_PRODUCT="product_biz";
DT_SERVICE="service_biz";
DT_CART_ITEM="cart_item_biz";
DT_ORDER="order_biz";
DT_ITEM="item_biz";
DT_ORDER_ITEM="order_item_biz";
DT_STAT="stat_biz";
/* --- DATA_TYPE-END --- */
/* --- BiZ9_CORE_CONFIG-START --- */
data_config={
    mongo_url:MONGO_URL,
    redis_url:"127.0.0.1",
    redis_port:6379,
};
app_config={
    app_title_id:APP_TITLE_ID,
    app_version:APP_VERSION,
    app_title:APP_TITLE,
    app_id:APP_ID,
    file_url:FILE_URL,
    biz_map:true
};
/* --- BiZ9_CORE_CONFIG-END --- */
/* --- PHOTO-SIZE-START --- */
PHOTO_SIZE_ALBUM={title_url:"",size:0};
PHOTO_SIZE_THUMB={title_url:"thumb_size_",size:250};
PHOTO_SIZE_MID={title_url:"mid_size_",size:720};
PHOTO_SIZE_LARGE={title_url:"large_size_",size:1000};
PHOTO_SIZE_SQUARE_THUMB={title_url:"square_thumb_size_",size:250};
PHOTO_SIZE_SQUARE_MID={title_url:"square_mid_size_",size:720};
PHOTO_SIZE_SQUARE_LARGE={title_url:"square_large_size_",size:1000};
/* --- PHOTO-SIZE-END --- */
/* --- BiZ9_CORE_CONFIG-START --- */
//biz9=require("biz9-core")(app_config,data_config);
biz9=require("/home/mama/www/doqbox/biz9/biz9-core/src/unstable")(app_config,data_config);
/* --- BiZ9_CORE_CONFIG-END --- */
/* --- APP URL START  -- */
test=require("./routes/cloud/test");
crud=require("./routes/cloud/crud");
mail=require("./routes/cloud/mail");
file=require("./routes/cloud/file");
index=require("./routes/index");
admin=require("./routes/admin");
blog_post=require("./routes/blog_post");
event=require("./routes/event");
item=require("./routes/item");
service=require("./routes/service");
member=require("./routes/member");
gallery=require("./routes/gallery");
category=require("./routes/category");
product=require("./routes/product");
photo=require("./routes/photo");
order=require("./routes/order");
/* --- APP URL END  -- */
/* --- APP EXPRESS START --- */
var app = express();
app.use(cors());
app.use(session({
    secret: "secret_key_cms",
    cookieName: "session_cms",
    secret: "eg[isfd-8yF9-7w2315df{}+Ijsli;;to8",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    saveUninitialized: false,
    resave:false
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb",extended:false}));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
/* --- APP EXPRESS END --- */
/* --- APP ROUTES START --- */
app.use("/", index);
app.use("/product", product);
app.use("/photo", photo);
app.use("/admin", admin);
app.use("/order", order);
app.use("/blog_post", blog_post);
app.use("/event", event);
app.use("/service", service);
app.use("/item", item);
app.use("/gallery", gallery);
app.use("/member", member);
app.use("/category", category);
app.use("/cloud/crud",crud);
app.use("/cloud/mail",mail);
app.use("/cloud/file",file);
app.use("/cloud/test",test);
/* --- APP ROUTES END --- */
/* --- APP ERROR START --- */
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error =  err;
    res.status(err.status || 500);
    res.render("error");
});
/* --- APP ERROR END --- */
module.exports = app;
