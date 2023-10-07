source ./.biz9_config.sh
echo "#################"
echo 'BiZ9 EC2 Connect'
echo "#################"
bash ./scriptz/dq_header.sh
EC2_KEY_DIR=other/aws/ec2_key
ssh -i ssh -i ${EC2_KEY_FILE} admin@$EC2_IP_ADDR
bash ./scriptz/dq_footer.sh
exit
