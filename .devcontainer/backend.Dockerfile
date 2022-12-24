ARG NODE_VERSION=18
# Beginning of Dockerfile ############################
## Build Stage: node_modules
FROM node:${NODE_VERSION}
ARG NODE_ENV="development"
ARG TZ="America/New_York"
ARG USER="node"
ARG LISTEN_PORT=443
ARG DOMAIN_NAME=""
ARG DOMAIN_BASENAME=""
ARG HOSTNAME=""
ARG USERNAME=""
ARG UUID=1001
######################################################
ENV APP_HOME="/home/${USERNAME}/app"
ENV NODE_ENV=${NODE_ENV}
WORKDIR "${APP_HOME}"

RUN echo "Domain name: ${DOMAIN_NAME} | DOMAIN: ${DOMAIN_BASENAME}"

RUN apt-get update -y

RUN mkdir -p \
    /tmp/app \
    /entrypoint \
    /usr/local/app/.certs

COPY .devcontainer/scripts/ /tmp/app/
COPY .devcontainer/certs/certs.sh* /tmp/app/

RUN mv /tmp/app/entrypoint.sh* /entrypoint/

RUN /bin/bash /tmp/app/user.sh "${USERNAME}" "${UUID}"
RUN /bin/bash /tmp/app/certs.sh -s "${DOMAIN_NAME}"
RUN cp -r ${APP_HOME}/.certs/*   "/usr/local/app/.certs/"

EXPOSE "${LISTEN_PORT}"

RUN chown -R ${USERNAME}:root /usr/local/app/.certs
RUN chown -R ${USERNAME}:root "/home/${USERNAME}"
RUN npm install -g npm@latest
#RUN apt-get install -y certbot

### # Clean up
#RUN apt-get autoremove -y \
#    && apt-get clean -y \
#    && rm -rf /var/lib/apt/lists/* \
#    && rm -rf /tmp/app

USER ${USERNAME}

ENTRYPOINT ["/bin/sh","/entrypoint/entrypoint.sh"]
## End of Dockerfile ##################################
