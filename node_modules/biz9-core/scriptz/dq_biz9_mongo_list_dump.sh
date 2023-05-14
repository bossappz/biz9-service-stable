source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Mongo List Backup DbZ"
echo "#################"
bash ./scriptz/dq_header.sh
db_bk_list=$(cat .biz9_project_list.sh)
db_dump_dir="other/db/backup/projectz_dump";
for line in $db_bk_list
do
mongodump --db ${line} --port ${MONGO_PORT} --out "${db_dump_dir}"
done
bash ./scriptz/dq_footer.sh
exit
