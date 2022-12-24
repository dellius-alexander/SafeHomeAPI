ARG VERSION=1.12.2
FROM vault:${VERSION}
RUN mkdir -p \
    /entrypoint \
    /etc/vault
COPY .devcontainer/vault/policies/*.hcl*  /etc/vault/
COPY .devcontainer/vault/entrypoint/vault-client-entrypoint.sh*  /entrypoint/
ENTRYPOINT ["/bin/sh", "/entrypoint/vault-client-entrypoint.sh"]
