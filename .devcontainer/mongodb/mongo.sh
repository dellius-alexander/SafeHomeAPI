#!/usr/bin/env bash
# setup your environment to install mongodbcli
apt-get install -y gnupg &&
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add - &&
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list &>/dev/null 2>&1 &&
apt-get update &&
# install mongodbcli
apt-get install -y mongocli &&
mongocli help  # verify your installation with mongocli help command

