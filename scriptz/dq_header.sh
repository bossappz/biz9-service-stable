source ./.biz9_config.sh
echo "---------------------------------------------"
echo "#################"
if [ "$BIZ9_MOBILE_VERSION" != "" ]; then
    echo "BIZ9 MOBILE VERSION : ${BIZ9_MOBILE_VERSION}"
fi
if [ "$BIZ9_SERVICE_VERSION" != "" ]; then
    echo "BIZ9 SERVICE VERSION : ${BIZ9_SERVICE_VERSION}"
fi
if [ "$BIZ9_WEB_VERSION" != "" ]; then
    echo "BIZ9 WEB VERSION : ${BIZ9_WEB_VERSION}"
fi
if [ "$BIZ9_CORE_VERSION" != "" ]; then
    echo "BIZ9 CORE VERSION : ${BIZ9_CORE_VERSION}"
fi
if [ "$BIZ9_CMS_VERSION" != "" ]; then
    echo "BIZ9 CMS VERSION : ${BIZ9_CMS_VERSION}"
fi
if [ "$BIZ9_SCRIPTZ_VERSION" != "" ]; then
    echo "BIZ9 SCRIPTZ VERSION : ${BIZ9_SCRIPTZ_VERSION}"
fi
if [ "$BIZ9_DOCZ_VERSION" != "" ]; then
    echo "BIZ9 DOCZ VERSION : ${BIZ9_DOCZ_VERSION}"
fi
if [ "$APP_VERSION" != "" ]; then
    echo "APP VERSION : ${APP_VERSION}"
fi
if [ "$APP_ID" != "" ]; then
    echo "APP ID : ${APP_ID}"
fi
if [ "$APP_TITLE" != "" ]; then
    echo "APP TITLE : ${APP_TITLE}"
fi
if [ "$EC2_IP_ADDR" != "" ]; then
    echo "EC2 IP Address : ${EC2_IP_ADDR}"
fi
if [ "$EC2_DEPLOY_DIR" != "" ]; then
    echo "EC2 Deploy Dir : ${EC2_DEPLOY_DIR}"
fi
if [ "$APP_VENDOR" != "" ]; then
    echo "APP VENDOR : ${APP_VENDOR}"
fi
if [ "$APP_TITLE_ID" != "" ]; then
    echo "APP TITLE ID: ${APP_TITLE_ID}"
fi
if [ "$CONFIG_ID" != "" ]; then
    echo "CONFIG ID : ${CONFIG_ID}"
fi
if [ "$REPO_URL" != "" ]; then
    echo "REPO URL : ${REPO_URL}"
fi
if [ "$BRANCH" != "" ]; then
    echo "BRANCH : ${BRANCH}"
fi
echo "#################"
echo "------------------------------------------------------------------------------------------"

