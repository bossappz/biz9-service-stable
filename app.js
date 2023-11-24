/* --- APP REQUIRE START -- */
async=require("async");
compression=require('compression');
busboy=require("busboy");
cors=require("cors")
detect=require('detect-file-type');
express=require("express");
fs=require('fs-extra')
mp3Duration=require('mp3-duration');
path=require("path");
session=require("express-session");
biz9_app_config=require("./biz9_app_config");
/* --- APP REQUIRE END --- */
/* --- APP DEFAULT START --- */
ENV=process.env.NODE_ENV;
/*--- APP DEFAULT END ---*/
/* --- APP CONFIG START  --- */
BIZ9_SERVICE_VERSION='5.7.0';
APP_VERSION='1.9.3'
APP_PORT=biz9_app_config.APP_PORT;
/* --- APP CONFIG END  --- */

/* --- MONGO START --- */
MONGO_IP=biz9_app_config.MONGO_IP;
MONGO_PORT=biz9_app_config.MONGO_PORT;
MONGO_URL=biz9_app_config.MONGO_URL;
/* --- MONGO END --- */
/* --- AWS START --- */
AWS_S3_SAVE=biz9_app_config.AWS_S3_SAVE;
AWS_S3_BUCKET=biz9_app_config.AWS_S3_BUCKET;
AWS_KEY=biz9_app_config.AWS_KEY;
AWS_SECRET=biz9_app_config.AWS_SECRET;
AWS_REGION=biz9_app_config.AWS_REGION;
/* --- AWS END --- */
/* --- EMAILZ START --- */
EMAIL_TO=biz9_app_config.EMAIL_TO;
EMAIL_FROM=biz9_app_config.EMAIL_FROM;
/* --- EMAILZ START --- */
/* --- FILE START --- */
FILE_SAVE_PATH=biz9_app_config.FILE_SAVE_PATH;
FILE_URL=biz9_app_config.FILE_URL;
/* --- FILE END --- */
//-BREVO-START
BREVO_KEY=biz9_app_config.BREVO_KEY;
BREVO_ORDER_SEND_TEMPLATE_ID=biz9_app_config.BREVO_ORDER_SEND_TEMPLATE_ID;
BREVO_FORM_SEND_TEMPLATE_ID=biz9_app_config.BREVO_FORM_SEND_TEMPLATE_ID;
//-BREVO-END
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
    mongo_server_user:biz9_app_config.MONGO_SERVER_USER,
    mongo_username_password:biz9_app_config.MONGO_USERNAME_PASSWORD,
    mongo_ip:biz9_app_config.MONGO_IP,
    mongo_port:biz9_app_config.MONGO_PORT,
    mongo_config_file:biz9_app_config.MONGO_CONFIG_FILE,
    ssh_key_file:biz9_app_config.SSH_KEY_FILE,
    redis_url:biz9_app_config.REDIS_URL,
    redis_port:biz9_app_config.REDIS_PORT,
};
app_config={
    app_title_id:biz9_app_config.APP_TITLE_ID,
    app_version:APP_VERSION,
    app_title:biz9_app_config.APP_TITLE,
    app_id:biz9_app_config.APP_ID,
    file_url:biz9_app_config.FILE_URL,
    biz_map:biz9_app_config.BIZ_MAP
}
biz9=require("biz9-core")(app_config,data_config);
/* --- BiZ9_CORE_CONFIG-END --- */
/* --- PAGE_SIZE_START --- */
PAGE_SIZE_CATEGORY_POPULAR_LIST=9;
PAGE_SIZE_CATEGORY_LIST=19;
PAGE_SIZE_ITEM_LIST=19;
PAGE_SIZE_FEATURE_LIST=19;
PAGE_SIZE_SLIDE_SHOW_LIST=12;
/* --- PAGE_SIZE_END --- */
/* --- PHOTO-SIZE-START --- */
PHOTO_SIZE_ALBUM={title_url:"",size:0};
PHOTO_SIZE_THUMB={title_url:"thumb_size_",size:250};
PHOTO_SIZE_MID={title_url:"mid_size_",size:720};
PHOTO_SIZE_LARGE={title_url:"large_size_",size:1000};
PHOTO_SIZE_SQUARE_THUMB={title_url:"square_thumb_size_",size:250};
PHOTO_SIZE_SQUARE_MID={title_url:"square_mid_size_",size:720};
PHOTO_SIZE_SQUARE_LARGE={title_url:"square_large_size_",size:1000};
/* --- PHOTO-SIZE-END --- */
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
app.use(compression())
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
