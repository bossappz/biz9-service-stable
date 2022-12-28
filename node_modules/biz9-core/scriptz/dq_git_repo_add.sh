source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Git Repo Add"
echo "#################"
bash ./scriptz/dq_header.sh
touch README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin ${REPO_URL}
git push -u origin master
bash ./scriptz/dq_footer.sh
exit

