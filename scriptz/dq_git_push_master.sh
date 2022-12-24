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
    git branch ${APP_VERSION}
    git switch ${APP_VERSION}

    ##
    git push -f ${REPO_URL} ${APP_VERSION}

    ##
    git checkout master
    git pull  --rebase  ${REPO_URL} ${APP_VERSION}
    git rebase master

    ##
    git push -f  ${REPO_URL} master

    ##
    git checkout ${APP_VERSION}

    else
    echo "exit"
fi
bash ./scriptz/dq_footer.sh
exit
