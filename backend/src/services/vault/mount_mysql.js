const vault = require('./vault');
const {readFileSync} = require("fs");

const vault_keys = JSON.parse(readFileSync(process.env.VAULT_CLUSTER_CRED_JSON_FILE.toString(), 'utf-8'))
vault.token = vault_keys.root_token

/**
 * Initialize mysql database as the vault secret storage engine.
 *
 * @returns {Promise<void>}
 */
async function init_mysql() {
    let requestOptions = {
        path: "/safehomeapi",
        method: "GET",
        dbName: "safehomeapi"
    }

    const connection = "vault:password@tcp(mysql-server:3306)/safehomeapi";

    const adminQuery = "CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT ALL PRIVILEGES ON *.* TO '{{name}}'@'%';";

    const query = "CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT SELECT ON secrets.* TO '{{name}}'@'%';";

    const configure = async () => {
        await vault.write(
            'mysql/config/lease',
            {lease: '1h', lease_max: '24h'})
            .then(async () => await vault.write(
                'mysql/config/connection',
                {value: connection}))
    };

    const createAdminRole = async () => {
        await vault.write(
            'mysql/roles/admin',
            {sql: adminQuery})
    };
    const createRole = async () => {
        await vault.write(
            'mysql/roles/readonly',
            {sql: query})
    };

    const getAdminCredentials = async () => await vault.read('mysql/creds/admin');
    const getCredentials = async () => await vault.read('mysql/creds/readonly');

    const run = async () => await configure()
        .then(await createRole)
        .then(await createAdminRole)
        .then(await getCredentials)
        .then(await getAdminCredentials)
        .then(console.log);

    await vault.mounts({mount_point: 'mysql', type: 'mysql', description: 'Mysql Server mount point'})
        .then( async (result) => {
            if (result.hasOwnProperty('mysql/')) return await run();
            return await vault.mount({
                mount_point: 'mysql',
                type: 'mysql',
                description: 'mysql mount test',
            }).then(await run);
        })
        .catch((err) => console.error(err.message));
}

module.exports = {
    init_mysql
}
