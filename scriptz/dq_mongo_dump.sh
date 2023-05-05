source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Mongo Backup Dump"
echo "#################"
bash ./scriptz/dq_header.sh
DB_DATE=`date +%m-%d-%Y`
echo ${DB_DATE}
DB_DIR=db/backup/${DB_DATE}
mkdir -p ${DB_DIR}
cd ${DB_DIR}
mongodump --db ${APP_TITLE_ID} --port ${MONGO_PORT}
cd ../../../
bash ./scriptz/dq_footer.sh
exit


