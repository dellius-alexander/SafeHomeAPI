#!/usr/bin/env bash
# unfortunately we could not get this to update docker /etc/hosts file with the updated DNS namespaces
# so the workaround was to use hostname attribute in the docker-compose.yml file
# Add the following to /etc/hosts file for loopback compatibility for custom DNS entries.
#chmod +x /app/certs.sh  &&
#/bin/bash "${APP_HOME}/certs.sh" "${DOMAIN_NAME}" &&
#chown -R node:root /app/.certs/ &&
#service apache2 restart  &&
#
#COMMAND=""
## Check for production environment
#if [ $(echo "${NODE_ENV}" | grep -ic  "prod") -eq 1 ]; then
#  COMMAND="start"
#fi
## check for development environment
#if [ $(echo "${NODE_ENV}" | grep -ic  "dev") -eq 1 ]; then
#  COMMAND="dev"
#fi
## check if the command not set and exit if not set
#if [ $(echo "${NODE_ENV}" | grep -ic  "") -eq 1 ]; then
#  echo "ERROR: Environment variable NODE_ENV is not set."
#  exit 1
#fi
#
cd /home/dalexander/app/node_modules/mongodb &&
npm install &&
cd /home/dalexander/app/ &&
npm audit fix --force &&
npm run dev