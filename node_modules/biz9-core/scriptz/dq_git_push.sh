source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Git Push"
echo "#################"
bash ./scriptz/dq_header.sh
echo "Are you sure you want to push?"
read n
yes=$(echo $n | tr -s '[:upper:]' '[:lower:]')
if [[  "$n" = "yes"  ]] ; then
    ##
    git push -f ${REPO_URL} ${GIT_BRANCH}
    else
    echo "exit"
fi
bash ./scriptz/dq_footer.sh
exit


