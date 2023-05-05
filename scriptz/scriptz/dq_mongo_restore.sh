source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Mongo Restore"
echo "#################"
bash ./scriptz/dq_header.sh
echo "Enter APP TITLE ID"
read app_title_id
echo "Enter New APP TITLE ID"
read new_app_title_id
echo 'Enter Date:'
read DB_DATE;
DB_DIR=db/backup/${DB_DATE}/${app_title_id}
cd ${DB_DIR}
mongorestore --db ${new_app_title_id} --port ${MONGO_PORT} --drop dump/${app_title_id}
cd ../../../../
bash ./scriptz/dq_footer.sh
exit


