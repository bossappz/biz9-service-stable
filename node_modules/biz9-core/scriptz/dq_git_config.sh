source ./.biz9_config.sh
echo "#################"
echo "BiZ9 Framework Git Config"
echo "#################"
bash ./scriptz/dq_header.sh
echo 'Enter your developer name'
read config_name
echo 'Enter your developer email'
read config_email
git config --global user.email "$config_email"
git config --global user.name "$config_name"
bash ./scriptz/dq_footer.sh
exit
