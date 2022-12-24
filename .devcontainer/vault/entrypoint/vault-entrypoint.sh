#!/usr/bin/env sh
# The -dev-root-token-id flag for dev servers tells the Vault
# server to allow full root access to anyone who presents a token
# with the specified value (in this case "dev-only-token").
__main__(){
VAULT_RETRIES=5
echo "Vault is starting..................................................."
echo "Vault token id: ${VAULT_TOKEN}"
echo "Vault address: ${VAULT_ADDR}"
echo "Load server configuration..........................................."

# runs the loop and checks if the vault server is running
until vault status 2>&1  || [ "${VAULT_RETRIES}" -eq 0 ]; do
  sleep 15
  # load server configuration
  vault server \
    -config /etc/vault/main.hcl \
    -config /etc/vault/tcp-listener.hcl \
    -config /etc/vault/storage.hcl && wait $! &&

  echo "Waiting for vault to start...: $((VAULT_RETRIES--))" &&
  echo "Vault status: $(vault status)" &&
  sleep 15
done


#vault operator init \
#  -key-shares=3 \
#  -key-threshold=2 \
#  -pgp-keys="keybase:hashicorp,keybase:dalexander,keybase:dalexander3"
#


# check if vault started successfully
if [ ! vault status &2>/dev/null  ]; then
    echo "Waiting for vault to start failed...";
    exit 1;
fi

echo "Vault started successfully............................................"
}
__main__

