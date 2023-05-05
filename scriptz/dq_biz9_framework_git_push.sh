echo "#################"
echo "BiZ9 Framework GitHub Push"
echo "#################"
bash ./scriptz/dq_header.sh
#prod-start
echo "Enter APP Type: [cms, core, docz, mobile, scriptz, service, test, website, vendor, vendor-payment]"
read app_type
echo "Enter Branch: [unstable, testing, stable]"
read branch_dir
#prod-end
##test-start##
: '
app_type='cms'
branch_dir='unstable'
'
##test-end##
echo "Are you sure you want to push?"
g_push=false;
read n
yes=$(echo $n | tr -s '[:upper:]' '[:lower:]')
if [[  "$n" = "yes"  ]] ; then
    g_push=true;
fi
if [ "${app_type}" = "docz" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_DOCZ_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-DocZ";
    echo "Version: ${BIZ9_DOCZ_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "website" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_WEBSITE_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-Website";
    echo "Version: ${BIZ9_WEBSITE_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "service" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_SERVICE_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-Service";
    echo "Version: ${BIZ9_SERVICE_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "cms" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_CMS_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-CMS";
    echo "Version: ${BIZ9_CMS_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "mobile" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_MOBILE_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-Mobile";
    echo "Version: ${BIZ9_MOBILE_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "docz" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_DOCZ_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-DocZ";
    echo "Version: ${BIZ9_DOCZ_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "test" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_TEST_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-DocZ";
    echo "Version: ${BIZ9_TEST_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "scriptz" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_SCRIPTZ_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-Scriptz";
   echo "Version: ${BIZ9_SCRIPTZ_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "core" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_CORE_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-Core";
    echo "Version: ${BIZ9_CORE_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "vendor" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_VENDOR_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-Vendor";
    echo "Version: ${BIZ9_VENDOR_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
if [ "${app_type}" = "vendor-payment" ]&& [ "${g_push}" == true ] ; then
    G_PROJECT_DIR=${BIZ9_HOME}/${BIZ9_VENDOR_PAYMENT_TITLE,,}/src/${branch_dir}
    cd ${G_PROJECT_DIR}
    source .biz9_config.sh
    git push -f ${REPO_URL} ${GIT_BRANCH}
    echo "Tool: BiZ9-Vendor-Payment";
    echo "Version: ${BIZ9_VENDOR_PAYMENT_VERSION}";
    echo "Repo URL:${REPO_URL}"
fi
bash ./scriptz/dq_footer.sh
exit
