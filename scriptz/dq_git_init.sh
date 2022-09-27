source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Git Init"
echo "#################"
bash ./scriptz/dq_header.sh
git init
git add -A .
git commit -m  "first commit"
git branch ${GIT_BRANCH}
git checkout ${GIT_BRANCH}
git branch --show-current
bash ./scriptz/dq_footer.sh
exit


