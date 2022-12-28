source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework ScriptZ Deploy"
echo "#################"
bash ./scriptz/dq_header.sh
G_PROJECT_FOLDER="$HOME/www/projectz/"
echo 'Enter Branch'
read _branch
G_BIZ_SCRIPT_FOLDER="${BIZ9_HOME}/biz9-scriptz/src/${_branch}"
G_BIZ_CMS_FOLDER="${BIZ9_HOME}/biz9-cms/src/${_branch}"
G_BIZ_CORE_FOLDER="${BIZ9_HOME}/biz9-core/src/${_branch}"
G_BIZ_DOCZ_FOLDER="${BIZ9_HOME}/biz9-docz/src/${_branch}"
G_BIZ_MOBILE_FOLDER="${BIZ9_HOME}/biz9-mobile/src/${_branch}"
G_BIZ_SERVICE_FOLDER="${BIZ9_HOME}/biz9-service/src/${_branch}"
G_BIZ_TEST_FOLDER="${BIZ9_HOME}/biz9-test/src/${_branch}"
G_BIZ_WEB_FOLDER="${BIZ9_HOME}/biz9-website/src/${_branch}"
G_BIZ_VENDOR_FOLDER="${BIZ9_HOME}/biz9-vendor/src/${_branch}"
G_BIZ_VENDOR_PAYMENT_FOLDER="${BIZ9_HOME}/biz9-vendor-payment/src/${_branch}"
#cms
rm -rf ${G_BIZ_CMS_FOLDER}/scriptz
mkdir ${G_BIZ_CMS_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_CMS_FOLDER}/scriptz/
cp -rf ${G_BIZ_SERVICE_FOLDER}/routes/cloud  ${G_BIZ_CMS_FOLDER}/routes/
#core
rm -rf ${G_BIZ_CORE_FOLDER}/scriptz
mkdir ${G_BIZ_CORE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_CORE_FOLDER}/scriptz/
#docz
rm -rf ${G_BIZ_DOCZ_FOLDER}/scriptz
mkdir ${G_BIZ_DOCZ_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/  ${G_BIZ_DOCZ_FOLDER}/scriptz/
#mobile
rm -rf ${G_BIZ_MOBILE_FOLDER}/scriptz
mkdir ${G_BIZ_MOBILE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_MOBILE_FOLDER}/scriptz/
#service
rm -rf ${G_BIZ_SERVICE_FOLDER}/scriptz
mkdir ${G_BIZ_SERVICE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_SERVICE_FOLDER}/scriptz/
#web
rm -rf ${G_BIZ_WEB_FOLDER}/scriptz
mkdir ${G_BIZ_WEB_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_WEB_FOLDER}/scriptz/
cp -rf ${G_BIZ_SERVICE_FOLDER}/routes/cloud  ${G_BIZ_WEB_FOLDER}/routes/
#test
rm -rf ${G_BIZ_TEST_FOLDER}/scriptz
mkdir ${G_BIZ_TEST_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/* ${G_BIZ_TEST_FOLDER}/scriptz/
#vendor
rm -rf ${G_BIZ_VENDOR_FOLDER}/scriptz
mkdir ${G_BIZ_VENDOR_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_VENDOR_FOLDER}/scriptz/
#vendor-payment
rm -rf ${G_BIZ_VENDOR_PAYMENT_FOLDER}/scriptz
mkdir ${G_BIZ_VENDOR_PAYMENT_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_VENDOR_PAYMENT_FOLDER}/scriptz/
bash ./scriptz/dq_footer.sh
exit
