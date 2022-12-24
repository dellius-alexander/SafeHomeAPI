## Vault server listen configuration
listener "tcp" {
  address = "vault:8200"
  tls_disable = "true"
 }

## The address to advertise for HA purpose
api_addr = "http://vault:8200"
cluster_addr = "https://vault:8201"