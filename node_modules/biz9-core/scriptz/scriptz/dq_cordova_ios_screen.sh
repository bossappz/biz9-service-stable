source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Cordova Google Play IOS Screen"
echo "#################"
bash ./scriptz/dq_header.sh
node other/scriptz/ios_screen_resize.js
bash ./scriptz/dq_footer.sh
exit
