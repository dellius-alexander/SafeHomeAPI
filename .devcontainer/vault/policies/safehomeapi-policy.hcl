path "secrets/data/apps/safehomeapi" {
  capabilities = ["create", "read"]
}

path "database/creds/vault-mysql-role" {
  capabilities = ["read"]
}