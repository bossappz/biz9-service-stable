source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Mongo Restore"
echo "#################"
bash ./scriptz/dq_header.sh
#DB_DATE=`date +%d%b%Y`
echo 'Enter Date:'
read DB_DATE;
DB_DIR=db/backup/${DB_DATE}
cd ${DB_DIR}
mongorestore --db ${APP_TITLE_ID} --port ${MONGO_PORT} --drop dump/${APP_TITLE_ID}
bash ./scriptz/dq_footer.sh
exit


