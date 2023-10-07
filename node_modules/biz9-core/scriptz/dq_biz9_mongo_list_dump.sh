source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Mongo List Backup DbZ"
echo "#################"
bash ./scriptz/dq_header.sh
#db_bk_list=$(cat .biz9_project_list.sh)
#db_dump_dir="other/db/backup/projectz_dump";
DB_DATE=$(date +%F@%H:%M)
echo ${DB_DATE}
echo ./db_box_backupz/${DB_DATE};
if [ ! -d ./db_box_backupz ]; then
  mkdir -p ./db_box_backupz;
fi

for line in "${PROJECT_LIST[@]}"
do
    if [ ! -d ./db_box_backupz/${line} ]; then
        mkdir ./db_box_backupz/${line};
    fi
    if [ ! -d ./db_box_backupz/${line}/{DB_DATE} ]; then
        mkdir ./db_box_backupz/${line}/${DB_DATE};
    fi
    echo ${line}
    mongodump --db ${line} --port ${MONGO_PORT} --out "./db_box_backupz/${line}/${DB_DATE}"
done
bash ./scriptz/dq_footer.sh
exit
