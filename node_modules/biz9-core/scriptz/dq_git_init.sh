source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Git Init"
echo "#################"
bash ./scriptz/dq_header.sh
git init
git checkout -b ${BRANCH}
#git branch --show-current
bash ./scriptz/dq_footer.sh
exit


