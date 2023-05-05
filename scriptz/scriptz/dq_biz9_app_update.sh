echo "#################"
echo "BiZ9 Framework Update"
echo "#################"
G_PROJECT_FOLDER="$HOME/www/projectz/"
G_PROJECT_SRC_FOLDER="$HOME/www/doqbox/biz9/"

: '
# prod start #
echo "Enter APP ID"
read app_id
echo "Enter APP Type [website, service, cms, mobile]"
read app_type
echo "Enter Web Folder ID"
read folder_id
echo "Enter Branch: [unstable, testing, stable]"
read branch_dir
# prod end #
'
# test start #
app_id=19
app_type='vendor-payment'
folder_id='vendor-payment'
branch_dir='stable'
# test end #

G_BIZ_APP_DIR=${G_PROJECT_FOLDER}${app_id}/${folder_id}
#go dir
cd ${G_BIZ_APP_DIR}/
# mk backup
rm -rf .biz9_update_bk
mkdir .biz9_update_bk

if [ "${app_type}" = "mobile" ]; then
FRAMEWORK_SRC_PROJECT=${G_PROJECT_SRC_FOLDER}${BIZ9_MOBILE_TITLE,,}/src/${branch_dir}/
#source
source ${FRAMEWORK_SRC_PROJECT}.biz9_config.sh
   #bk configs
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf www/scripts/biz9-mobile/scriptz/config.js .biz9_update_bk/
    #copy src to project dir
    cp -rf ${FRAMEWORK_SRC_PROJECT}config.xml ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}gulpfile.js ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}node_modules ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}package.json ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}platforms ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}plugins ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}scriptz ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}www ${G_BIZ_APP_DIR}/
    #mv configs
    cp -rf  .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    cp -rf  .biz9_update_bk/config.js ${G_BIZ_APP_DIR}/www/scripts/biz9-mobile/scriptz/
    #update versionz
    sed -i "s/BIZ9_MOBILE_VERSION=.*/BIZ9_MOBILE_VERSION='${BIZ9_MOBILE_VERSION}';/" ${G_BIZ_APP_DIR}/www/scripts/biz9-mobile/scriptz/config.js
    sed -i "s/BIZ9_MOBILE_VERSION=.*/BIZ9_MOBILE_VERSION='${BIZ9_MOBILE_VERSION}';/" ${G_BIZ_APP_DIR}/.biz9_config.sh
fi

if [ "${app_type}" = "service" ]; then
    FRAMEWORK_SRC_PROJECT=${G_PROJECT_SRC_FOLDER}${BIZ9_SERVICE_TITLE,,}/src/${branch_dir}/
    #source
    source ${FRAMEWORK_SRC_PROJECT}.biz9_config.sh
    #bk configs
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf app.js .biz9_update_bk/
    #copy src to project dir
    cp -rf ${FRAMEWORK_SRC_PROJECT}bin ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}node_modules ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}package.json ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}public ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}routes ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}scriptz ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}views ${G_BIZ_APP_DIR}/
    #mv configs
    cp -rf  .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    #update versionz
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${BIZ9_SERVICE_VERSION}';/" ${G_BIZ_APP_DIR}/.biz9_config.sh
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${BIZ9_SERVICE_VERSION}';/" ${G_BIZ_APP_DIR}/app.js
fi

if [ "${app_type}" = "cms" ]; then
    FRAMEWORK_SRC_PROJECT=${G_PROJECT_SRC_FOLDER}${BIZ9_CMS_TITLE,,}/src/${branch_dir}/
    #source
    source ${FRAMEWORK_SRC_PROJECT}.biz9_config.sh
    #bk configs
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf app.js .biz9_update_bk/
    #copy src to project dir
    cp -rf ${FRAMEWORK_SRC_PROJECT}bin ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}node_modules ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}package.json ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}public ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}routes ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}scriptz ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}views ${G_BIZ_APP_DIR}/
    #mv configs
    cp -rf  .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    #update versionz
    sed -i "s/BIZ9_CMS_VERSION=.*/BIZ9_CMS_VERSION='${BIZ9_CMS_VERSION}';/" ${G_BIZ_APP_DIR}/.biz9_config.sh
    sed -i "s/BIZ9_CMS_VERSION=.*/BIZ9_CMS_VERSION='${BIZ9_CMS_VERSION}';/" ${G_BIZ_APP_DIR}/app.js
fi

if [ "${app_type}" = "vendor" ]; then
    FRAMEWORK_SRC_PROJECT=${G_PROJECT_SRC_FOLDER}${BIZ9_VENDOR_TITLE,,}/src/${branch_dir}/
    #source
    source ${FRAMEWORK_SRC_PROJECT}.biz9_config.sh
    #bk configs
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf app.js .biz9_update_bk/
    #copy src to project dir
    cp -rf ${FRAMEWORK_SRC_PROJECT}bin ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}node_modules ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}package.json ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}public ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}routes ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}scriptz ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}views ${G_BIZ_APP_DIR}/
    #mv configs
    cp -rf  .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    #update versionz
    sed -i "s/BIZ9_VENDOR_VERSION=.*/BIZ9_VENDOR_VERSION='${BIZ9_VENDOR_VERSION}';/" ${G_BIZ_APP_DIR}/.biz9_config.sh
    sed -i "s/BIZ9_VENDOR_VERSION=.*/BIZ9_VENDOR_VERSION='${BIZ9_VENDOR_VERSION}';/" ${G_BIZ_APP_DIR}/app.js
fi

if [ "${app_type}" = "vendor-payment" ]; then
    FRAMEWORK_SRC_PROJECT=${G_PROJECT_SRC_FOLDER}${BIZ9_VENDOR_PAYMENT_TITLE,,}/src/${branch_dir}/
    #source
    source ${FRAMEWORK_SRC_PROJECT}.biz9_config.sh
    #bk configs
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf app.js .biz9_update_bk/
    #copy src to project dir
    cp -rf ${FRAMEWORK_SRC_PROJECT}bin ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}node_modules ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}package.json ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}public ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}routes ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}scriptz ${G_BIZ_APP_DIR}/
    cp -rf ${FRAMEWORK_SRC_PROJECT}views ${G_BIZ_APP_DIR}/
    #mv configs
    cp -rf  .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    #update versionz
    sed -i "s/BIZ9_VENDOR_PAYMENT_VERSION=.*/BIZ9_VENDOR_PAYMENT_VERSION='${BIZ9_VENDOR_PAYMENT_VERSION}';/" ${G_BIZ_APP_DIR}/.biz9_config.sh
    sed -i "s/BIZ9_VENDOR_PAYMENT_VERSION=.*/BIZ9_VENDOR_PAYMENT_VERSION='${BIZ9_VENDOR_PAYMENT_VERSION}';/" ${G_BIZ_APP_DIR}/app.js
fi









echo "BiZ9 Framework Push Success: @ $(date +%F@%H:%M)"
exit 1

