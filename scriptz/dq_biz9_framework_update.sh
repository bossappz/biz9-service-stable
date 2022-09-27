echo "#################"
echo "BiZ9 Framework Update"
echo "#################"
G_PROJECT_FOLDER="$HOME/www/projectz/"
# prod start #
: '
echo "Enter APP Type [website, service, cms, mobile, core]"
read app_type
echo "Enter Source Branch [unstable, testing, stable]"
read source_branch
echo "Enter Destination Branch [unstable, testing, stable]"
read destination_branch
'
# prod end #
# test start #
app_type='service'
source_branch='unstable'
destination_branch='testing'
# test end #
G_HAS_APP=false;
if [ "${app_type}" = "service" ]; then
    G_HAS_APP=true;
    G_BIZ_APP_DIR="${BIZ9_HOME}/biz9-service/src/${destination_branch}"
    cd ${G_BIZ_APP_DIR}
    #backup
    rm -rf .biz9_update_bk
    mkdir .biz9_update_bk
    cp -rf app.js  .biz9_update_bk/
    cp -rf .biz9_config.sh .biz9_update_bk/
    #git pull
    echo ".biz9_update_bk" > .gitignore
    echo ${BIZ9_GIT_URL}/${BIZ9_SERVICE_TITLE,,}-${source_branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    git add .
    git stash
    git pull ${BIZ9_GIT_URL}/${BIZ9_SERVICE_TITLE,,}-${source_branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    echo ".biz9_update_bk" > .gitignore
    #get latest version
    source .biz9_config.sh
    biz9_service_version=${BIZ9_SERVICE_VERSION}
    echo 'aaaaaa'
    echo ${biz9_service_version}
    echo 'bbbbbbbb'
    : '
    #backup cp
    cp -rf .biz9_update_bk/app.js ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    source ${G_BIZ_APP_DIR}/.biz9_config.sh
    echo 'ccccccc'
    echo ${biz9_service_version}
    echo 'ddddddd'

    #app.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${APP_TITLE}';/" app.js
    sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION}';/" app.js
    sed -i "s/APP_ID=.*/APP_ID='${APP_ID}';/" app.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${APP_TITLE_ID}';/" app.js
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${biz9_service_version}';/" app.js
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${biz9_service_version}';/" .biz9_config.sh
    rm -rf .biz9_update_bk
    '
fi
if [ "${app_type}" = "core" ]; then
    G_HAS_APP=true;
    G_BIZ_APP_DIR="${BIZ9_HOME}/biz9-core/src/${destination_branch}"
    cd ${G_BIZ_APP_DIR}
    #backup
    rm -rf .biz9_update_bk
    mkdir .biz9_update_bk
    cp -rf .biz9_config.sh .biz9_update_bk/
    #git pull
    echo ".biz9_update_bk" > .gitignore
    echo ${BIZ9_GIT_URL}/${BIZ9_CORE_TITLE,,}-${source_branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    git add .
    git stash
    git pull ${BIZ9_GIT_URL}/${BIZ9_CORE_TITLE,,}-${source_branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    echo ".biz9_update_bk" > .gitignore
    : '
    #get latest version
    source .biz9_config.sh
    biz9_core_version=${BIZ9_CORE_VERSION}
    echo ${biz9_core_version}
    #backup cp
    cp -rf .biz9_update_bk/app.js ${G_BIZ_APP_DIR}/
    cp -rf .biz9_update_bk/.biz9_config.sh ${G_BIZ_APP_DIR}/
    source ${G_BIZ_APP_DIR}/.biz9_config.sh
    #app.js
    sed -i "s/BIZ9_CORE_VERSION=.*/BIZ9_CORE_VERSION='${biz9_service_version}';/" .biz9_config.sh
    rm -rf .biz9_update_bk
    '
fi
if [ "${app_type}" = "mobile" ]; then
    G_HAS_APP=true;
    G_BIZ_APP_DIR="${BIZ9_HOME}/biz9-mobile/src/${destination_branch}"
    cd ${G_BIZ_APP_DIR}
    #backup
    rm -rf .biz9_update_bk
    mkdir .biz9_update_bk
    cp -rf .biz9_config.sh .biz9_update_bk/
    cp -rf www/scripts/biz_scriptz/config.js .biz9_update_bk/
    #git pull
    echo ".biz9_update_bk" > .gitignore
    git add .
    git stash
    git pull ${BIZ9_GIT_URL}/${BIZ9_MOBILE_TITLE,,}-${source_branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    echo ".biz9_update_bk" > .gitignore
    #get latest version
    source .biz9_config.sh
    biz9_mobile_version=${BIZ9_MOBILE_VERSION}
    #backup cp
    cp -rf .biz9_update_bk/config.js ${G_BIZ_APP_DIR}/www/scripts/biz_scriptz/
    cp -rf .biz9_update_bk/.biz9_config.sh  ${G_BIZ_APP_DIR}/
    source ${G_BIZ_APP_DIR}/.biz9_config.sh
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
echo "BiZ9 Framework Push Success: @ $(date +%F@%H:%M)"
exit 1
