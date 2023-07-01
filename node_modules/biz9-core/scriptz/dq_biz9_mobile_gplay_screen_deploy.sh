source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Cordova GPlay Screen Deploy"
echo "#################"
bash ./scriptz/dq_header.sh
node other/scriptz/gplay_screen_resize.js
bash ./scriptz/dq_footer.sh
exit
