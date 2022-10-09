echo "#################"
echo "BiZ9 Framework Update"
echo "#################"
G_PROJECT_FOLDER="$HOME/www/projectz/"
# prod start #
: '
echo "Enter APP ID"
read app_id
echo "Enter APP Type [website, service, cms, mobile]"
read app_type
echo "Enter Web Folder ID"
read folder_id
echo "Enter Branch"
read unstable
'
# prod end #
# test start #
app_id=19
app_type='service'
folder_id='service'
branch='unstable'
# test end #

G_BIZ_APP_DIR=${G_PROJECT_FOLDER}${app_id}/${folder_id}

source ${G_BIZ_APP_DIR}/.biz9_config.sh
G_HAS_APP=false;
if [ "${app_type}" = "website" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_DIR}/
    #backup
    rm -rf .biz9_update_bk
    mkdir .biz9_update_bk
    mkdir .biz9_update_bk/other
    mkdir .biz9_update_bk/other/blank
    mkdir .biz9_update_bk/public
    mkdir .biz9_update_bk/public/uploads
    cp -rf app.js  .biz9_update_bk/
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf other .biz9_update_bk/
    cp -rf public/uploads .biz9_update_bk/
    #git pull
    echo ".biz9_update_bk" > .gitignore
    git add .
    git stash
    git pull -f ${BIZ9_GIT_URL}/${BIZ9_WEBSITE_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    echo ".biz9_update_bk" > .gitignore
    #get latest version
    source .biz9_config.sh
    biz9_website_version=${BIZ9_WEBSITE_VERSION}
    #backup cp
    cp -rf .biz9_update_bk/app.js ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/other/*  ${G_BIZ_APP_DIR}/other/
    cp -rf .biz9_update_bk/public/uploads ${G_BIZ_APP_DIR}/public/uploads
    source ${G_BIZ_APP_DIR}/.biz9_config.sh
    #app.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${APP_TITLE}';/" app.js
    sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION}';/" app.js
    sed -i "s/APP_ID=.*/APP_ID='${APP_ID}';/" app.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${APP_TITLE_ID}';/" app.js
    sed -i "s/BIZ9_WEBSITE_VERSION=.*/BIZ9_WEBSITE_VERSION='${biz9_website_version}';/" app.js
    sed -i "s/BIZ9_WEBSITE_VERSION=.*/BIZ9_WEBSITE_VERSION='${biz9_website_version}';/" .biz9_config.sh
    rm -rf .biz9_update_bk
fi
if [ "${app_type}" = "mobile" ]; then
    G_HAS_APP=false;
    cd ${G_BIZ_APP_DIR}/
    #backup
    rm -rf .biz9_update_bk
    mkdir .biz9_update_bk
    mkdir .biz9_update_bk/other
    mkdir .biz9_update_bk/other/blank
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf other .biz9_update_bk/
    cp -rf www/scripts/biz_scriptz/config.js .biz9_update_bk/
    #git pull
    echo ".biz9_update_bk" > .gitignore
    git add .
    git stash
    git pull -f ${BIZ9_GIT_URL}/${BIZ9_MOBILE_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    echo ".biz9_update_bk" > .gitignore
    #get latest version
    source .biz9_config.sh
    biz9_mobile_version=${BIZ9_MOBILE_VERSION}
    #backup cp
    cp -rf .biz9_update_bk/config.js ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/
    cp -rf .biz9_update_bk/.biz9_config.sh  ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/other/*  ${G_BIZ_APP_DIR}/other/
    source ${G_BIZ_APP_DIR}/.biz9_config.sh
    echo ${APP_TITLE}
    #config.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${APP_TITLE}';/" ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION}';/" ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_ID=.*/APP_ID='${APP_ID}';/" ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${APP_TITLE_ID}';/" ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_VENDOR=.*/APP_VENDOR='${APP_VENDOR}';/" ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_VENDOR_WEBSITE=.*/APP_VENDOR_WEBSITE='${APP_VENDOR_WEBSITE}';/" ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/BIZ9_MOBILE_VERSION=.*/BIZ9_MOBILE_VERSION='${biz9_mobile_version}';/" ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/BIZ9_MOBILE_VERSION=.*/BIZ9_MOBILE_VERSION='${biz9_mobile_version}';/" .biz9_config.sh
    rm -rf .biz9_update_bk
fi

if [ "${app_type}" = "website" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_DIR}/
    #backup
    rm -rf .biz9_update_bk
    mkdir .biz9_update_bk
    mkdir .biz9_update_bk/other
    mkdir .biz9_update_bk/other/blank
    mkdir .biz9_update_bk/public
    mkdir .biz9_update_bk/public/uploads
    cp -rf app.js  .biz9_update_bk/
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf other .biz9_update_bk/
    cp -rf public/uploads .biz9_update_bk/
    #git pull
    echo ".biz9_update_bk" > .gitignore
    git add .
    git stash
    git pull -f ${BIZ9_GIT_URL}/${BIZ9_WEBSITE_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    echo ".biz9_update_bk" > .gitignore
    #get latest version
    source .biz9_config.sh
    biz9_website_version=${BIZ9_WEBSITE_VERSION}
    #backup cp
    cp -rf .biz9_update_bk/app.js ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/other/*  ${G_BIZ_APP_DIR}/other/
    cp -rf .biz9_update_bk/public/uploads ${G_BIZ_APP_DIR}/public/uploads
    source ${G_BIZ_APP_DIR}/.biz9_config.sh
    #app.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${APP_TITLE}';/" app.js
    sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION}';/" app.js
    sed -i "s/APP_ID=.*/APP_ID='${APP_ID}';/" app.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${APP_TITLE_ID}';/" app.js
    sed -i "s/BIZ9_WEBSITE_VERSION=.*/BIZ9_WEBSITE_VERSION='${biz9_website_version}';/" app.js
    sed -i "s/BIZ9_WEBSITE_VERSION=.*/BIZ9_WEBSITE_VERSION='${biz9_website_version}';/" .biz9_config.sh
    rm -rf .biz9_update_bk
fi

if [ "${app_type}" = "service" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_DIR}/
    #backup
    rm -rf .biz9_update_bk
    mkdir .biz9_update_bk
    mkdir .biz9_update_bk/other
    mkdir .biz9_update_bk/other/blank
    mkdir .biz9_update_bk/public
    mkdir .biz9_update_bk/public/uploads
    cp -rf app.js  .biz9_update_bk/
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf other .biz9_update_bk/
    cp -rf public/uploads .biz9_update_bk/
    #git pull
    echo ".biz9_update_bk" > .gitignore
    git add .
    git stash
    git pull -f ${BIZ9_GIT_URL}/${BIZ9_SERVICE_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    echo ".biz9_update_bk" > .gitignore
    #get latest version
    source .biz9_config.sh
    biz9_service_version=${BIZ9_SERVICE_VERSION}
    #backup cp
    cp -rf .biz9_update_bk/app.js ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/other/*  ${G_BIZ_APP_DIR}/other/
    cp -rf .biz9_update_bk/public/uploads ${G_BIZ_APP_DIR}/public/uploads
    source ${G_BIZ_APP_DIR}/.biz9_config.sh
    #app.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${APP_TITLE}';/" app.js
    sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION}';/" app.js
    sed -i "s/APP_ID=.*/APP_ID='${APP_ID}';/" app.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${APP_TITLE_ID}';/" app.js
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${biz9_service_version}';/" app.js
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${biz9_service_version}';/" .biz9_config.sh
    rm -rf .biz9_update_bk
fi


echo "BiZ9 Framework Push Success: @ $(date +%F@%H:%M)"
exit 1

