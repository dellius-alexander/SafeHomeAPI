# Database Parameters:
#
# connection_url (string: <required>) – Specifies the connection string to
# use to authenticate and connect to PostgreSQL. The connection URL can also
# be set using the VAULT_PG_CONNECTION_URL environment variable. A full list
# of supported parameters can be found in the pgx library and PostgreSQL connection
# string documentation. For example connection string URLs, see the examples section below.
#
# table (string: "vault_kv_store") – Specifies the name of the table in which
# to write Vault data. This table must already exist (Vault will not attempt to create it).
#
# max_idle_connections (int) - Default not set. Sets the maximum number of
# connections in the idle connection pool. See golang docs on SetMaxIdleConns for
# ore information. Requires 1.2 or later.
#
# max_parallel (string: "128") – Specifies the maximum number of concurrent requests to PostgreSQL.
#
# ha_enabled (string: "true|false") – Default not enabled, requires 9.5 or later.
#
# ha_table (string: "vault_ha_locks") – Specifies the name of the table to use for storing
# high availability information. This table must already exist (Vault will not attempt to create it).
#
# The URI schema designator can be either "postgresql://" or "postgres://".
# postgresql://[user[:password]@][hostname spec][/dbname][?parameter spec]
##########################################################################
# MySQL backend config
storage "mysql" {
  ha_enabled = "true"
  address = "mysql-server:3306"
  username = "vault"
  password = "password"
  database = "safehomeapi"
  plaintext_connection_allowed = "true" #non-TLS mysql
  #path to CA.pem to verify MySQL SSL
  #tls_ca_file = "<path-to-mysql-ca-pem>"
}