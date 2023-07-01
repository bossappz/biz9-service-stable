source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Cordova Google Play Icon"
echo "#################"
node other/scriptz/icon_resize.js
cp -rf other/cordova/icon/512.png www/images/preload-logo.png
bash ./scriptz/dq_footer.sh
exit
