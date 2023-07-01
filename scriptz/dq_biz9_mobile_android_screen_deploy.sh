source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Cordova Android Screen Deploy"
echo "#################"
bash ./scriptz/dq_header.sh
node other/scriptz/android_screen_resize.js
bash ./scriptz/dq_footer.sh
exit
