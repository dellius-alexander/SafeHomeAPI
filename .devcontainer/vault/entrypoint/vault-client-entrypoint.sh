#!/usr/bin/env sh

VAULT_RETRIES=6
sleep 45
until vault status &2>/dev/null || [  ${VAULT_RETRIES} -eq 0 ]; do
    echo "Waiting for vault to start - attempt =>  $((VAULT_RETRIES--))"
    sleep 10;
done

# check if vault started successfully
if [ ! vault status &2>/dev/null  ]; then
    echo "Waiting for vault to start failed...";
    exit 1;
fi

echo "Vault is starting...";
vault login ${VAULT_TOKEN}

vault auth enable \
-path=applications \
-description="AppRole auth method for applications" \
approle

vault policy write safehomeapi-policy /policies/safehomeapi-policy.hcl

#vault policy write safehomeapi-policy - << EOF
#path "secrets/data/apps/safehomeapi" {
#  capabilities = ["create", "read"]
#}
#
#path "database/creds/vault-mysql-role" {
#  capabilities = ["read"]
#}
#EOF

vault write auth/approle/role/safehomeapi \
policies="safehomeapi-policy" \
role_id="dbrole" \
token_ttl=30m \
token_max_ttl=60m \
secret_id_ttl=120m

#vault write auth/approle/role/safehomeapi/custom-secret-id secret_id=${SECRET_ID}

###############################################################################
# Configuring the Database Secrets Engine:
# The first step to using the database secrets engine is to enable it.
# The database secrets engine can be enabled using the UI, CLI, or API
#vault secrets enable database

###############################################################################
# Configure the Secrets Engine:
#Before creating a role, Vault needs to understand what database it
# will generate credentials against, how to connect to it, and what
# credentials to use to create users. This configuration is required
# for every separate database instance that Vault integrates with to
# generate credentials. For example, if an organization has separate
# database instances for production, integration, and development,
# each database requires a separate configuration.
#vault write database/config/dev-data \
#    plugin_name=mysql-database-plugin \
#    connection_url="{{username}}:{{password}}@tcp(mysql-server:3306)/" \
#    allowed_roles="vault-mysql-role" \
#    username="${DBUSER}" \
#    password="${DBPASS}"

###############################################################################
# Create a Role:
# After the database configuration has been written, one or more roles
# need to be defined. Each role specifies the database to use along with
# the command Vault uses to create the database user. The command includes
# some generic database platform-specific statements to create the new user
# and additional grants for the new user. For example, Vault may create a
# new user and only permit the new user SELECT, EXECUTE, and INSERT on a
# database named data.
#vault write database/roles/vault-mysql-role \
#    db_name=secrets \
#    creation_statements="CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT SELECT, EXECUTE, INSERT ON secrets.* TO '{{name}}'@'%';" \
#    default_ttl="1h" \
#    max_ttl="24h"

###############################################################################
# Generate Credentials:
# With the prerequisites completed, an application can now generate
# credentials for the database. The credential generation is performed by
# issuing a read operation against the creds/ prefix for the role.
#vault read database/creds/vault-mysql-role

#vault write auth/approle/role/safehomeapi/custom-secret-id secret_id=${SECRET_ID}
