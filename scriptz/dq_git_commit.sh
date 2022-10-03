source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Git Commit"
echo "#################"
#bash ./scriptz/dq_header.sh
INCREMENT_VERSION ()
{
    declare -a part=( ${1//\./ } )
    declare    new
    declare -i carry=1

    for (( CNTR=${#part[@]}-1; CNTR>=0; CNTR-=1 )); do
        len=${#part[CNTR]}
        new=$((part[CNTR]+carry))
        [ ${#new} -gt $len ] && carry=1 || carry=0
        [ $CNTR -gt 0 ] && part[CNTR]=${new: -len} || part[CNTR]=${new}
    done
    new="${part[*]}"
    echo -e "${new// /.}"
}
echo 'Enter commit noteZ:'
read commit_notes
APP_VERSION_NEW=$(INCREMENT_VERSION ${APP_VERSION});
sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION_NEW}'/" .biz9_config.sh
#CMS
if [ -n "${BIZ9_CMS_VERSION}" ]; then
        sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION_NEW}'/" app.js
fi
#Mobile
if [ -n "${BIZ9_MOBILE_VERSION}" ]; then
        sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION_NEW}'/" www/scripts/biz_scriptz/config.js
fi #Service
if [ -n "${BIZ9_SERVICE_VERSION}" ]; then
    sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION_NEW}'/" app.js
fi
#Web
if [ -n "${BIZ9_WEBSITE_VERSION}" ]; then
        sed -i "s/APP_VERSION=.*/APP_VERSION='${APP_VERSION_NEW}'/" app.js
fi
echo "APP NEW VERSION : ${APP_VERSION_NEW}"
git add -A .
git commit -m  "${commit_notes}"
bash ./scriptz/dq_footer.sh
exit
