source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Git Repo Reset"
echo "#################"
bash ./scriptz/dq_header.sh
git reset -- hard
git reset --hard ${GIT_BRANCH}
bash ./scriptz/dq_footer.sh
exit
