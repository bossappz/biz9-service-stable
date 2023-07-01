source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Info"
echo "#################"
bash ./scriptz/dq_header.sh
#mobile
if [ "${APP_TITLE}" = "${BIZ9_MOBILE_TITLE}" ]; then
    echo "BIZ9 MOBILE VERSION : ${BIZ9_MOBILE_VERSION}"
fi
if [ "$APP_TITLE" = "BIZ9_SERVICE_TITLE" ]; then
    echo "BIZ9 SERVICE VERSION : ${BIZ9_SERVICE_VERSION}"
fi
#web
if [ "${APP_TITLE}" = "${BIZ9_WEBSITE_TITLE}" ]; then
    echo "BIZ9 WEBSITE VERSION : ${BIZ9_WEBSITE_VERSION}"
fi
#core
if [ "${APP_TITLE}" = "${BIZ9_CORE_TITLE}" ]; then
    echo "BIZ9 CORE VERSION : ${BIZ9_CORE_VERSION}"
fi
#cms
if [ "${APP_TITLE}" = "${BIZ9_CMS_TITLE}" ]; then
    echo "BIZ9 CMS VERSION : ${BIZ9_CMS_VERSION}"
fi
#scriptz
if [ "${APP_TITLE}" = "${BIZ9_SCRIPTZ_TITLE}" ]; then
    echo "BIZ9 SCRIPTZ VERSION : ${BIZ9_SCRIPTZ_VERSION}"
fi
#testz
if [ "${APP_TITLE}" = "${BIZ9_TEST_TITLE}" ]; then
    echo "BIZ9 TEST VERSION : ${BIZ9_TEST_VERSION}"
fi
#vendor
if [ "${APP_TITLE}" = "${BIZ9_VENDOR_TITLE}" ]; then
    echo "BIZ9 VENDOR VERSION : ${BIZ9_VENDOR_VERSION}"
fi
#vendor-payment
if [ "${APP_TITLE}" = "${BIZ9_VENDOR_PAYMENT_TITLE}" ]; then
    echo "BIZ9 VENDOR-PAYMENT VERSION : ${BIZ9_VENDOR_PAYMENT_VERSION}"
fi
bash ./scriptz/dq_footer.sh
exit
