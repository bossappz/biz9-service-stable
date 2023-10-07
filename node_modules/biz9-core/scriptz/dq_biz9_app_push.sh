echo "#################"
echo "BiZ9 Framework App Push"
echo "#################"
G_PROJECT_FOLDER="$HOME/www/projectz/"
# prod start #
echo "Enter APP ID"
read app_id
echo "Enter APP Title"
read app_title
echo "Enter APP Title ID"
read app_title_id
echo "Enter APP Type [change-request, cms, docz, mobile, service, server, vendor, vendor-payment, website, workshop]"
read app_type
echo "Enter Web Folder ID"
read folder_id
echo "Enter Branch [unstable, testing, stable]"
read branch
# prod end #

# test start #
'
app_id=19;
app_title='Cool Server'
app_type='server'
app_title_id='cool339'
folder_id='server'
branch='unstable'
 '
# test end #
G_BIZ_APP_NEW_DIR=${G_PROJECT_FOLDER}${app_id}/${folder_id}
if [ -d "${G_BIZ_APP_NEW_DIR}" ];  then
    echo "File exsist. overwrite?"
    #read n
    n='yes'
    yes=$(echo $n | tr -s '[:upper:]' '[:lower:]')
    if [[  "$n" != "yes"  ]] ; then
        echo" Folder exsist";
        echo "Please run BiZ9-Framework Update.";
        #exit 1;
    fi
else
    # move fileZ
    mkdir ${G_PROJECT_FOLDER}${app_id}
    mkdir ${G_BIZ_APP_NEW_DIR}
fi
G_HAS_APP=false;
if [ "${app_type}" = "change-request" ]; then
    G_HAS_APP=false;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_CHANGE_REQUEST_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    git checkout -b ${GIT_BRANCH}
    source .biz9_config.sh
    print_result="${BIZ9_CHANGE_REQUEST_TITLE} Version: ${BIZ9_CHANGE_REQUEST_VERSION}"
fi
if [ "${app_type}" = "workshop" ]; then
    G_HAS_APP=false;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_WORKSHOP_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    git checkout -b ${GIT_BRANCH}
    source .biz9_config.sh
    print_result="${BIZ9_WORKSHOP_TITLE} Version: ${BIZ9_WORKSHOP_VERSION}"
fi
if [ "${app_type}" = "docz" ]; then
    G_HAS_APP=false;
    cd ${G_BIZ_APP_NEW_DIR}/
    pwd
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_DOCZ_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    git checkout -b ${GIT_BRANCH}
    source .biz9_config.sh
    print_result="${BIZ9_DOCZ_TITLE} Version: ${BIZ9_DOCZ_VERSION}"
fi
if [ "${app_type}" = "service" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_SERVICE_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    git checkout -b ${GIT_BRANCH}
    source .biz9_config.sh
    sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${BIZ9_SERVICE_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    print_result="${BIZ9_SERVICE_TITLE} Version: ${BIZ9_SERVICE_VERSION}"
fi

if [ "${app_type}" = "website" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_WEBSITE_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    source .biz9_config.sh
    sed -i "s/BIZ9_WEBSITE_VERSION=.*/BIZ9_WEBSITE_VERSION='${BIZ9_WEBSITE_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    print_result="${BIZ9_WEBSITE_TITLE} Version: ${BIZ9_WEBSITE_VERSION}"
fi
if [ "${app_type}" = "vendor" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_VENDOR_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    source .biz9_config.sh
    sed -i "s/BIZ9_VENDOR_VERSION=.*/BIZ9_VENDOR_VERSION='${BIZ9_VENDOR_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    print_result="${BIZ9_VENDOR_TITLE} Version: ${BIZ9_VENDOR_VERSION}"
fi
if [ "${app_type}" = "vendor-payment" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_VENDOR_PAYMENT_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    source .biz9_config.sh
    sed -i "s/BIZ9_VENDOR_PAYMENT_VERSION=.*/BIZ9_VENDOR_PAYMENT_VERSION='${BIZ9_VENDOR_PAYMENT_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    print_result="${BIZ9_VENDOR_PAYMENT_TITLE} Version: ${BIZ9_VENDOR_PAYMENT_VERSION}"
fi
if [ "${app_type}" = "cms" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_CMS_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    source .biz9_config.sh
    sed -i "s/BIZ9_CMS_VERSION=.*/BIZ9_CMS_VERSION='${BIZ9_CMS_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    print_result="${BIZ9_CMS_TITLE} Version: ${BIZ9_CMS_VERSION}"
fi
if [ "${app_type}" = "mobile" ]; then
    G_HAS_APP=false;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_MOBILE_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    #sed
    #.biz9_config
    sed -i "s/CONFIG_ID=.*/CONFIG_ID='io.bossappz.mobile${app_id}'/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
    sed -i "s/APP_ID=.*/APP_ID='${app_id}'/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz9-mobile/scriptz/config.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${app_title}'/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz9-mobile/scriptz/config.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${app_title_id}'/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz9-mobile/scriptz/config.js
    source .biz9_config.sh
    sed -i "s/BIZ9_MOBILE_VERSION=.*/BIZ9_MOBILE_VERSION='${BIZ9_MOBILE_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz9-mobile/scriptz/config.js
    print_result="${BIZ9_MOBILE_TITLE} Version: ${BIZ9_MOBILE_VERSION}"
fi
if [ "${app_type}" = "server" ]; then
    G_HAS_APP=false;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_URL}/${BIZ9_SERVER_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    #sed
    #.biz9_config
    source .biz9_config.sh
    print_result="${BIZ9_SERVER_TITLE} Version: ${BIZ9_SERVER_VERSION}"
fi
#sed
#.biz9_config
    sed -i "s/APP_VERSION=.*/APP_VERSION='1.0.0';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
    sed -i "s/APP_ID=.*/APP_ID='${app_id}';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
    sed -i "s/APP_TITLE=.*/APP_TITLE='${app_title}';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${app_title_id}';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
    sed -i 's/_app_id_/'${app_id}'/' ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
    sed -i "s/REPO_URL=.*/REPO_URL='github.com';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
if [ "${G_HAS_APP}" = true ]; then
    #app.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${app_title}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    sed -i "s/APP_VERSION=.*/APP_VERSION='1.0.0';/" ${G_BIZ_APP_NEW_DIR}/app.js
    sed -i "s/APP_ID=.*/APP_ID='${app_id}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${app_title_id}';/" ${G_BIZ_APP_NEW_DIR}/app.js
fi
echo "----------------------------------"
echo "Project Push ResultZ"
echo ${print_result}
echo "Project APP ID: ${app_id}"
echo "Project APP Title: ${app_title}"
echo "Project APP Title ID: ${app_title_id}"
echo "Project APP Type: ${app_type}"
echo "Project Folder ID: ${folder_id}"
echo "Project Branch: ${branch}"
echo "BiZ9 Framework Push Success: @ $(date +%F@%H:%M)"
echo "----------------------------------"
exit 1
