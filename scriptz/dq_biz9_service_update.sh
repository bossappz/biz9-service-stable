source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Service Update"
echo "#################"
bash ./scriptz/dq_header.sh
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
APP_VERSION_NEW=$(INCREMENT_VERSION $BIZ9_SERVICE_VERSION);
echo ${APP_VERSION_NEW}
sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${APP_VERSION_NEW}'/" .biz9_config.sh
sed -i "s/BIZ9_SERVICE_VERSION=.*/BIZ9_SERVICE_VERSION='${APP_VERSION_NEW}'/" app.js
bash ./scriptz/dq_footer.sh
exit

