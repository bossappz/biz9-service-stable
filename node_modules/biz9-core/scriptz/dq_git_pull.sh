source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Git Pull"
echo "#################"
bash ./scriptz/dq_header.sh
echo "Are you sure you want to pull?"
read n
yes=$(echo $n | tr -s '[:upper:]' '[:lower:]')
if [[  "$n" = "yes"  ]] ; then
    echo 'Enter Branch'
    read branch
    git pull ${REPO_URL} ${branch} --allow-unrelated-histories
else
    echo "exit"
fi
bash ./scriptz/dq_footer.sh
exit
