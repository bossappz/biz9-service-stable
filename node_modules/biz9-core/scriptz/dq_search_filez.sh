source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Search FileZ"
echo "#################"
bash ./scriptz/dq_header.sh
echo 'Enter Directory ex. /path/ or blank for current'
read DIR
echo $(pwd)'/'$DIR
echo 'Enter Pattern:'
read STR
echo $STR
echo '##############'
grep -rnw $(pwd)/$DIR -e $STR
bash ./scriptz/dq_footer.sh
exit
