echo "#################"
echo "BiZ9 Framework App Push"
echo "#################"
G_PROJECT_FOLDER="$HOME/www/projectz/"

# prod start #
: '
echo "Enter APP ID"
read app_id
echo "Enter APP Title"
read app_title
echo "Enter APP Title ID"
read app_title_id
echo "Enter APP Type [website, service, cms, mobile]"
read app_type
echo "Enter Web Folder ID"
read folder_id
echo "Enter Branch"
read branch
'
# prod end #
# test start #
app_id=19;
app_title='Cool 339'
app_type='service'
app_title_id='cool339'
folder_id='service'
branch='unstable'
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
if [ "${app_type}" = "service" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    echo ${BIZ9_GIT_URL}${BIZ9_SERVICE_TITLE,,}-${branch}.git ${GIT_BRANCH}
    git pull ${BIZ9_GIT_URL}${BIZ9_SERVICE_TITLE,,}-${branch}.git ${GIT_BRANCH} --allow-unrelated-histories
    #git checkout -b ${GIT_BRANCH}
    #source .biz9_config.sh
    #sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${BIZ9_SERVICE_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
fi
if [ "${app_type}" = "website" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_WEB_URL} ${branch} --allow-unrelated-histories
    git checkout -b ${branch}
    source .biz9_config.sh
    sed -i "s/BIZ9_WEBSITE_VERSION=.*/BIZ9_WEBSITE_VERSION='${BIZ9_WEBSITE_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
fi
if [ "${app_type}" = "cms" ]; then
    G_HAS_APP=true;
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_CMS_URL} ${branch} --allow-unrelated-histories
    git checkout -b ${branch}
    source .biz9_config.sh
    sed -i "s/BIZ9_CMS_VERSION=.*/BIZ9_CMS_VERSION='${BIZ9_CMS_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
fi
if [ "${app_type}" = "mobile" ]; then
    G_HAS_APP=false;
    echo "Enter App Vendor"
    read app_vendor
    cd ${G_BIZ_APP_NEW_DIR}/
    git init
    git pull ${BIZ9_GIT_MOBILE_URL} ${branch} --allow-unrelated-histories
    git checkout -b ${branch}
    #sed
    #.biz9_config
    sed -i "s/CONFIG_ID=.*/CONFIG_ID='io.bossappz.mobile${app_id}'/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
    sed -i "s/APP_VENDOR=.*/APP_VENDOR='${app_vendor}';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
    # # update config.js
    sed -i "s/APP_VERSION=.*/APP_VERSION='1.0.0'/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_ID=.*/APP_ID='${app_id}'/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${app_title}'/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${app_title_id}'/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz_scriptz/config.js
    sed -i "s/APP_VENDOR=.*/APP_VENDOR='${app_vendor}'/" ${G_BIZ_APP_NEW_DIR}/www/scripts/biz_scriptz/config.js
    source .biz9_config.sh
    sed -i "s/BIZ9_MOBILE_VERSION=.*/BIZ9_MOBILE_VERSION='${BIZ9_MOBILE_VERSION}';/" ${G_BIZ_APP_NEW_DIR}/app.js
fi

#sed
#.biz9_config
: '
ed -i "s/APP_VERSION=.*/APP_VERSION='1.0.0';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
sed -i "s/APP_ID=.*/APP_ID='${app_id}';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
sed -i "s/APP_TITLE=.*/APP_TITLE='${app_title}';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${app_title_id}';/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
sed -i "s/REPO_URL=.*/REPO_URL='github.com'/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh
sed -i "s/EC2_KEY_FILE=.*/EC2_KEY_FILE='other/aws/ec2_key/${app_id}.pem'/" ${G_BIZ_APP_NEW_DIR}/.biz9_config.sh

if [ "${G_HAS_APP}" = true ]; then
    #app.js
    sed -i "s/APP_TITLE=.*/APP_TITLE='${app_title}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    sed -i "s/APP_VERSION=.*/APP_VERSION='1.0.0';/" ${G_BIZ_APP_NEW_DIR}/app.js
    sed -i "s/APP_ID=.*/APP_ID='${app_id}';/" ${G_BIZ_APP_NEW_DIR}/app.js
    sed -i "s/APP_TITLE_ID=.*/APP_TITLE_ID='${app_title_id}';/" ${G_BIZ_APP_NEW_DIR}/app.js
fi
'

    echo "BiZ9 Framework Push Success: @ $(date +%F@%H:%M)"
    exit 1
