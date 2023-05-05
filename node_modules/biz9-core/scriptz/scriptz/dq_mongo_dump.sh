source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Mongo Backup Dump"
echo "#################"
bash ./scriptz/dq_header.sh
echo "Enter APP TITLE ID"
read app_title_id
DB_DATE=`date +%m-%d-%Y`
echo ${DB_DATE}
DB_DIR=db/backup/${DB_DATE}/${app_title_id}
mkdir -p ${DB_DIR}
cd ${DB_DIR}
mongodump --db ${app_title_id} --port ${MONGO_PORT}
cd ../../../../
bash ./scriptz/dq_footer.sh
exit
