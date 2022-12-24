ARG VERSION=1.12.2
FROM vault:${VERSION}
RUN mkdir -p \
    /entrypoint \
    /etc/vault

COPY .devcontainer/vault/config/main.hcl*  /etc/vault/
COPY .devcontainer/vault/config/storage.hcl* /etc/vault/
COPY .devcontainer/vault/config/tcp-listener.hcl* /etc/vault/

COPY .devcontainer/vault/entrypoint/vault-entrypoint.sh /entrypoint/

ENTRYPOINT ["/bin/sh", "/entrypoint/vault-entrypoint.sh"]
CMD ["/bin/sh", "-c", "vault operator init"]
