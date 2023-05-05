source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework NPM Publish"
echo "#################"
bash ./scriptz/dq_header.sh

sudo npm publish --access public

bash ./scriptz/dq_footer.sh
exit
