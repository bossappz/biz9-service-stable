source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework ScriptZ Deploy"
echo "#################"
bash ./scriptz/dq_header.sh
G_PROJECT_FOLDER="$HOME/www/projectz/"
echo 'Enter Branch'
read _branch
G_BIZ_SCRIPT_FOLDER="$HOME/www/opz/productz/biz9/biz9-scriptz/src/${BRANCH}"
G_BIZ_CMS_FOLDER="$HOME/www/opz/productz/biz9/biz9-cms/src/${_branch}"
G_BIZ_CORE_FOLDER="$HOME/www/opz/productz/biz9/biz9-core/src/${_branch}"
G_BIZ_DOCZ_FOLDER="$HOME/www/opz/productz/biz9/biz9-docz/src/${_branch}"
G_BIZ_MOBILE_FOLDER="$HOME/www/opz/productz/biz9/biz9-mobile/src/${_branch}"
G_BIZ_SERVICE_FOLDER="$HOME/www/opz/productz/biz9/biz9-service/src/${_branch}"
G_BIZ_TEST_FOLDER="$HOME/www/opz/productz/biz9/biz9-test/src/${_branch}"
G_BIZ_WEB_FOLDER="$HOME/www/opz/productz/biz9/biz9-web/src/${_branch}"
#cms
rm -rf ${G_BIZ_CMS_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/scriptz  ${G_BIZ_CMS_FOLDER}/
cp -rf ${G_BIZ_SERVICE_FOLDER}/routes/cloud  ${G_BIZ_CMS_FOLDER}/routes/
#core
rm -rf ${G_BIZ_CORE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/scriptz  ${G_BIZ_CORE_FOLDER}/
#docz
rm -rf ${G_BIZ_DOCZ_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/scriptz  ${G_BIZ_DOCZ_FOLDER}/
#mobile
rm -rf ${G_BIZ_MOBILE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/scriptz  ${G_BIZ_MOBILE_FOLDER}/
#service
rm -rf ${G_BIZ_SERVICE_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/scriptz  ${G_BIZ_SERVICE_FOLDER}/
#web
rm -rf ${G_BIZ_WEB_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/scriptz  ${G_BIZ_WEB_FOLDER}/
cp -rf ${G_BIZ_SERVICE_FOLDER}/routes/cloud  ${G_BIZ_WEB_FOLDER}/routes/
#test
rm -rf ${G_BIZ_TEST_FOLDER}/scriptz
cp -rf ${G_BIZ_SCRIPT_FOLDER}/scriptz  ${G_BIZ_TEST_FOLDER}/
bash ./scriptz/dq_footer.sh
exit
