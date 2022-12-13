# Vault

Vault is HashiCorp’s open-source product for managing secrets and sensitive data. Here’s a list of Vault’s top features that make it a popular choice for secret management:

1. Built-in concept of low trust and enforcement of security by identity
2. Encryption at rest
3. Several ways to authenticate against Vault, e.g., tokens, LDAP, AppRole, etc.
4. Policies to govern the level of access of each identity
5. Lots of secret backends, each catering to specific needs, including key-value store, Active Directory, etc.
6. Support for multiple storage backends for high availability, e.g., databases (MySQL, Postgres), object stores (GCS, S3), HashiCorp’s Consul, etc.
7. Ability to generate dynamic secrets, such as database credentials, cloud service account keys (Google, AWS, Azure), PKI certificates, etc.
8. Built-in TTL and lease for provided credentials
9. Built-in audit trail which logs every interaction with Vault
10. Several ways to interact with the Vault service, including Web UI, CLI, Rest API, and programmatic access via language libraries
