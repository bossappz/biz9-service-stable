/* --- APP CONFIG START  --- */
const APP_ID='19';
const APP_TITLE_ID='service-19';
const APP_TITLE='BiZ9-Service';
const APP_PORT="1901";
const APP_CLOUD_BUCKET='bappz';
/* --- ENV CONFIG END --- */
/* --- ENV FILE START --- */
const FILE_SAVE_PATH=__dirname+"/public/uploads/";//prod
//const FILE_SAVE_PATH="~/www/projectz/200/website/public/uploads";//website_local
//const FILE_URL="http://localhost:1902/uploads/"; //website_url
//const FILE_URL="/uploads/"; //prod
const FILE_URL="https://"+APP_CLOUD_BUCKET+".s3.amazonaws.com/" //aws_s3_url
//FILE_URL="https://bossappz.com/uploads/" //web_prod_url
/* --- ENV FILE END --- */
/* --- BIZ9 CONFIG START --- */
const BIZ_MAP=true;
/* --- BIZ9 CONFIG END --- */
/* --- ENV EMAILZ START --- */
const EMAIL_TO="contact@biz9framework.com";
const EMAIL_FROM="contact@biz9framework.com";
/* --- ENV EMAILZ START --- */
/* --- MONGO START --- */
const MONGO_IP="0.0.0.0";
const MONGO_PORT="27019";
const MONGO_URL="mongodb://localhost:"+MONGO_PORT+"?socketTimeoutMS=360000&connectTimeoutMS=360000"; //local
//MONGO_URL="mongodb://ban:1234567@"+MONGO_IP+":"+MONGO_PORT+"?socketTimeoutMS=360000&connectTimeoutMS=360000"; //remote
/* --- MONGO END --- */
/* --- REDIS START --- */
const REDIS_URL="0.0.0.0";
const REDIS_PORT="27019";
/* --- REDIS END --- */
/* --- ENV AWS START --- */
const AWS_S3_SAVE=true;
const AWS_S3_BUCKET=APP_CLOUD_BUCKET;
const AWS_KEY="AKIAWTPS5CXHLMIGE72B";
const AWS_SECRET="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";
const AWS_REGION='us-east-2';
/* --- ENV AWS END --- */
//-SEND_IN_BLUE-START
const SEND_IN_BLUE_KEY='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';
const SEND_IN_BLUE_ORDER_SEND_TEMPLATE_ID='7';
const SEND_IN_BLUE_FORM_SEND_TEMPLATE_ID='10';
//-SEND_IN_BLUE-END
exports.SEND_IN_BLUE_KEY = SEND_IN_BLUE_KEY;
exports.SEND_IN_BLUE_ORDER_SEND_TEMPLATE_ID = SEND_IN_BLUE_ORDER_SEND_TEMPLATE_ID;
exports.SEND_IN_BLUE_FORM_SEND_TEMPLATE_ID = SEND_IN_BLUE_FORM_SEND_TEMPLATE_ID;
exports.APP_ID = APP_ID;
exports.APP_TITLE_ID = APP_TITLE_ID;
exports.APP_TITLE = APP_TITLE;
exports.APP_PORT = APP_PORT;
exports.MONGO_IP = MONGO_IP;
exports.MONGO_PORT = MONGO_PORT;
exports.MONGO_URL = MONGO_URL;
exports.REDIS_URL = REDIS_URL;
exports.REDIS_PORT = REDIS_PORT;
exports.AWS_S3_SAVE = AWS_S3_SAVE;
exports.AWS_S3_BUCKET = AWS_S3_BUCKET;
exports.AWS_KEY = AWS_KEY;
exports.AWS_SECRET = AWS_SECRET;
exports.AWS_REGION = AWS_REGION;
exports.EMAIL_TO = EMAIL_TO;
exports.EMAIL_FROM = EMAIL_FROM;
exports.FILE_SAVE_PATH = FILE_SAVE_PATH;
exports.FILE_URL = FILE_URL;
exports.BIZ_MAP = BIZ_MAP;
