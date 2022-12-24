// file: example/mount_postgresql.js

process.env.DEBUG = 'node-vault'; // switch on debug mode

const vault = require('./../src/index')();

const connection = '{{username}}:{{password}}@tcp(mysql-server:3306)/';

const query = "CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT SELECT, EXECUTE, INSERT ON secrets.* TO '{{name}}'@'%';";

const configure = () => vault.write('postgresql/config/lease', { lease: '1h', lease_max: '24h' })
    .then(() => vault.write('postgresql/config/connection', { value: connection }));

const createRole = () => vault.write('postgresql/roles/readonly', { sql: query });
const getCredentials = () => vault.read('postgresql/creds/readonly');

const run = () => configure()
    .then(createRole)
    .then(getCredentials)
    .then(console.log);

vault.mounts()
    .then((result) => {
        if (result.hasOwnProperty('postgresql/')) return run();
        return vault.mount({
            mount_point: 'postgresql',
            type: 'postgresql',
            description: 'postgresql mount test',
        }).then(run);
    })
    .catch((err) => console.error(err.message));