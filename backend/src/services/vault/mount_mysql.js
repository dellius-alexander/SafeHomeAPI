const vault = require('./vault');

/**
 * Initialize mysql database as the vault secret storage engine.
 *
 * @returns {Promise<void>}
 */
async function init_mysql() {

    const connection = 'vault:password@tcp(mysql-server:3306)/';

    const adminQuery = "CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT ALL PRIVILEGES ON *.* TO '{{name}}'@'%';";

    const query = "CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT SELECT ON secrets.* TO '{{name}}'@'%';";

    const configure = async () => {
        await vault.write(
            'mysql/config/lease',
            {lease: '1h', lease_max: '24h'})
            .then(async () => await vault.write(
                'mysql/config/connection',
                {value: connection},
                {
                    username: "vault",
                    password: "password",
                    plugin_name: "mysql-database-plugin"}))
    };

    const createAdminRole = async () => {
        await vault.write(
            'mysql/roles/admin',
            {sql: adminQuery},
            {
                name: "admin",
                password: "password",
                plugin_name: "mysql-database-plugin"
            })
    };
    const createRole = async () => {
        await vault.write(
            'mysql/roles/readonly',
            {sql: query},
            {
                name: "readonly",
                password: "password",
                plugin_name: "mysql-database-plugin"
            })
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
