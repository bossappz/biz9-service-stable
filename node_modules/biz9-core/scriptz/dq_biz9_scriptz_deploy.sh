source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework ScriptZ Deploy"
echo "#################"
bash ./scriptz/dq_header.sh
G_PROJECT_FOLDER="$HOME/www/projectz/"
G_BIZ_SCRIPT_FOLDER="${BIZ9_HOME}/${BIZ9_SCRIPTZ_TITLE,,}/src/stable"
G_BIZ_CMS_FOLDER="${BIZ9_HOME}/${BIZ9_CMS_TITLE,,}/src/unstable"
G_BIZ_DOCZ_FOLDER="${BIZ9_HOME}/${BIZ9_DOCZ_TITLE,,}/src/unstable"
G_BIZ_MOBILE_FOLDER="${BIZ9_HOME}/${BIZ9_MOBILE_TITLE,,}/src/unstable"
G_BIZ_SERVICE_FOLDER="${BIZ9_HOME}/${BIZ9_SERVICE_TITLE,,}/src/unstable"
G_BIZ_SERVICE_CLOUD_FOLDER="${BIZ9_HOME}/${BIZ9_SERVICE_TITLE,,}/src/stable/routes/cloud"
G_BIZ_TEST_FOLDER="${BIZ9_HOME}/${BIZ9_TEST_TITLE,,}/src/unstable"
G_BIZ_WEBSITE_FOLDER="${BIZ9_HOME}/${BIZ9_WEBSITE_TITLE,,}/src/unstable"
G_BIZ_CORE_FOLDER="${BIZ9_HOME}/${BIZ9_CORE_TITLE,,}/src/unstable"
#core
rm -rf ${G_BIZ_CORE_FOLDER}/scriptz
mkdir ${G_BIZ_CORE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_CORE_FOLDER}/scriptz/
#docz
rm -rf ${G_BIZ_DOCZ_FOLDER}/scriptz
mkdir ${G_BIZ_DOCZ_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_DOCZ_FOLDER}/scriptz/
#mobile
rm -rf ${G_BIZ_MOBILE_FOLDER}/scriptz
mkdir ${G_BIZ_MOBILE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/* ${G_BIZ_MOBILE_FOLDER}/scriptz/
#service
rm -rf ${G_BIZ_SERVICE_FOLDER}/scriptz
mkdir ${G_BIZ_SERVICE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_SERVICE_FOLDER}/scriptz/
#web
rm -rf ${G_BIZ_WEBSITE_FOLDER}/scriptz
mkdir ${G_BIZ_WEBSITE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_WEBSITE_FOLDER}/scriptz/
#web_cloud
cp -rf ${G_BIZ_SERVICE_CLOUD_FOLDER}  ${G_BIZ_WEBSITE_FOLDER}/routes/
#test
rm -rf ${G_BIZ_TEST_FOLDER}/scriptz
mkdir ${G_BIZ_TEST_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_TEST_FOLDER}/scriptz/
#cms
rm -rf ${G_BIZ_CMS_FOLDER}/scriptz
mkdir ${G_BIZ_CMS_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_CMS_FOLDER}/scriptz/
#cms_cloud
cp -rf ${G_BIZ_SERVICE_CLOUD_FOLDER}  ${G_BIZ_CMS_FOLDER}/routes/
##scriptz_push
G_BIZ_SCRIPT_PUSH_FOLDER="${BIZ9_HOME}/${BIZ9_SCRIPTZ_TITLE,,}/src/push/scriptz"
rm -rf ${G_BIZ_SCRIPT_PUSH_FOLDER}/*
cp -rf ${G_BIZ_SCRIPT_FOLDER}/* ${G_BIZ_SCRIPT_PUSH_FOLDER}/
bash ./scriptz/dq_footer.sh
exit
