echo "#################"
echo "BiZ9 Framework Wrong"
echo "#################"

G_PROJECT_FOLDER="$HOME/www/projectz/"
G_BIZ_WEB_FOLDER="$HOME/www/opz/productz/biz9/biz9-web/src"
G_BIZ_CMS_FOLDER="$HOME/www/opz/productz/biz9/biz9-cms/src"
G_BIZ_MOBILE_FOLDER="$HOME/www/opz/productz/biz9/biz9-mobile/src"
G_BIZ_SERVICE_FOLDER="$HOME/www/opz/productz/biz9/biz9-service/src"
G_BIZ_SCRIPT_FOLDER="$HOME/www/opz/productz/biz9/biz9-scriptz/src"
G_BIZ_CORE_FOLDER="$HOME/www/opz/productz/biz9/biz9-core/src"

echo "Enter APP ID"
read app_id
#app_id=19

echo "Enter APP Type [website, service, cms, mobile]"
read app_type
#app_type='mobile'

echo "Enter Web Folder ID"
read folder_id
#folder_id='mobile'

G_BIZ_APP_DIR=${G_PROJECT_FOLDER}${app_id}
G_HAS_APP=false;

if [ "${app_type}" = "website" ]; then
    G_HAS_APP=true;
    G_BIZ_APP_FOLDER=${G_BIZ_WEB_FOLDER};
    source ${G_BIZ_WEB_FOLDER}/.biz9_config.sh
    #cp
    #
    # update
    sed -i "s/BIZ9_WEB_VERSION=.*/BIZ9_WEB_VERSION='${BIZ9_WEB_VERSION}'/" ${G_BIZ_APP_DIR}/${folder_id}/app.js
    sed -i "s/BIZ9_WEB_VERSION=.*/BIZ9_WEB_VERSION='${BIZ9_WEB_VERSION}';/" ${G_PROJECT_FOLDER}${app_id}/${folder_id}/.biz9_config.sh
fi

if [ "${app_type}" = "service" ]; then
    G_HAS_APP=true;
    G_BIZ_APP_FOLDER=${G_BIZ_SERVICE_FOLDER};
    source ${G_BIZ_SERVICE_FOLDER}/.biz9_config.sh
    #cp
    #
    #update
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${BIZ9_SERVICE_VERSION}'/" ${G_BIZ_APP_DIR}/${folder_id}/app.js
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${BIZ9_SERVICE_VERSION}';/" ${G_PROJECT_FOLDER}${app_id}/${folder_id}/.biz9_config.sh
fi
if [ "${app_type}" = "cms" ]; then
    G_HAS_APP=true;
    G_BIZ_APP_FOLDER=${G_BIZ_CMS_FOLDER};
    #cp
    cp -rf ${G_BIZ_SERVICE_FOLDER}/routes  ${G_BIZ_APP_DIR}/${folder_id}/
    cp -rf ${G_BIZ_SERVICE_FOLDER}/bin  ${G_BIZ_APP_DIR}/${folder_id}/
    cp -rf ${G_BIZ_SERVICE_FOLDER}/node_modules  ${G_BIZ_APP_DIR}/${folder_id}/
    cp -rf ${G_BIZ_SERVICE_FOLDER}/public  ${G_BIZ_APP_DIR}/${folder_id}/
    cp -rf ${G_BIZ_SERVICE_FOLDER}/views  ${G_BIZ_APP_DIR}/${folder_id}/
    # update
    source ${G_BIZ_CMS_FOLDER}/.biz9_config.sh
    sed -i "s/BIZ9_CMS_VERSION=.*/BIZ9_CMS_VERSION='${BIZ9_CMS_VERSION}'/" ${G_BIZ_APP_DIR}/${folder_id}/app.js
    sed -i "s/BIZ9_CMS_VERSION=.*/BIZ9_CMS_VERSION='${BIZ9_CMS_VERSION}';/" ${G_PROJECT_FOLDER}${app_id}/${folder_id}/.biz9_config.sh
fi

if [ "${app_type}" = "mobile" ]; then
    G_HAS_APP=false;
    G_BIZ_APP_FOLDER=${G_BIZ_MOBILE_FOLDER};
    cp -rf ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js_bk
    cp -rf ${G_BIZ_APP_DIR}/${folder_id}/other/cordova/icon/512.png ${G_BIZ_APP_DIR}/${folder_id}/other/cordova/icon/512.png_bk
    cp -rf ${G_BIZ_MOBILE_FOLDER}/www ${G_BIZ_APP_DIR}/${folder_id}/
    cp -rf ${G_BIZ_MOBILE_FOLDER}/plugins ${G_BIZ_APP_DIR}/${folder_id}/
    cp -rf ${G_BIZ_MOBILE_FOLDER}/node_modules ${G_BIZ_APP_DIR}/${folder_id}/
    cp -rf ${G_BIZ_MOBILE_FOLDER}/other ${G_BIZ_APP_DIR}/${folder_id}/
    cp -rf ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js_bk ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js
    cp -rf ${G_BIZ_APP_DIR}/${folder_id}/other/cordova/icon/512.png_bk ${G_BIZ_APP_DIR}/${folder_id}/other/cordova/icon/512.png
    rm -rf ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js_bk
    rm -rf ${G_BIZ_APP_DIR}/${folder_id}/other/cordova/icon/512.png_bk
    #sed
    # update biz9_config
    source ${G_BIZ_MOBILE_FOLDER}/.biz9_config.sh
    sed -i "s/BIZ9_MOBILE_VERSION=.*/BIZ9_MOBILE_VERSION='${BIZ9_MOBILE_VERSION}'/" ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js
    sed -i "s/BIZ9_MOBILE_VERSION=.*/BIZ9_MOBILE_VERSION='${BIZ9_MOBILE_VERSION}';/" ${G_PROJECT_FOLDER}${app_id}/${folder_id}/.biz9_config.sh
    # update config.js
    source ${G_PROJECT_FOLDER}${app_id}/${folder_id}/.biz9_config.sh
    sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION}'/" ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_ID=.*/APP_ID='${APP_ID}'/" ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${APP_TITLE}'/" ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${APP_TITLE_ID}'/" ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_VENDOR=.*/APP_VENDOR='${APP_VENDOR}'/" ${G_BIZ_APP_DIR}/${folder_id}/www/scripts/biz_scriptz/config.js
  fi
 #copy
 #scriptz
rm -rf ${G_BIZ_APP_DIR}/${folder_id}/scriptz/*
cp -rf ${G_BIZ_SCRIPT_FOLDER}/*  ${G_BIZ_APP_DIR}/${folder_id}/scriptz/

 if [ "${G_HAS_APP}" = true ]; then
     source ${G_PROJECT_FOLDER}${app_id}/${folder_id}/.biz9_config.sh
     #cp
     cp -rf ${G_BIZ_WEB_FOLDER}/routes/cloud  ${G_BIZ_APP_DIR}/${folder_id}/routes/

    #app.js
     sed -i "s/APP_TITLE=.*/APP_TITLE='${APP_TITLE}';/" ${G_BIZ_APP_DIR}/${folder_id}/app.js
     sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION}';/" ${G_BIZ_APP_DIR}/${folder_id}/app.js
     sed -i "s/APP_ID=.*/APP_ID='${APP_ID}';/" ${G_BIZ_APP_DIR}/${folder_id}/app.js
     sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${APP_TITLE_ID}';/" ${G_BIZ_APP_DIR}/${folder_id}/app.js

    #biz-core
    rm -rf ${G_BIZ_APP_DIR}/${folder_id}/node_modules/biz9-core
    rm -rf ${G_BIZ_APP_DIR}/${folder_id}/node_modules/biz9-core/.git
    cp -rf ${G_BIZ_CORE_FOLDER} ${G_BIZ_APP_DIR}/${folder_id}/node_modules/biz9-core
 fi

 echo "BiZ9 Framework Push Success: @ $(date +%F@%H:%M)"
 exit 1

