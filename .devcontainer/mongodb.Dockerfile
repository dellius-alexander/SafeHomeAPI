ARG VERSION=6.0.2
FROM mongo:${VERSION}
RUN apt-get update -y && \
    apt-get install -y wget curl
COPY .devcontainer/scripts/mongo.sh* /tmp/mongo/scripts/
RUN /bin/bash /tmp/mongo/scripts/mongo.sh
COPY .devcontainer/scripts/mongo-init.js* /docker-entrypoint-initdb.d/
ENTRYPOINT ["/bin/sh", "/docker-entrypoint-initdb.d/mongo-init.js"]