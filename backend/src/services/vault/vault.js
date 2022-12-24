const { writeFileSync } = require('fs');
const { Buffer } = require('buffer');

const options = {
    apiVersion: 'v1',
    endpoint: 'http://vault:8200',
    token: 'U2FsdGVkX19BTBBZ2sNRH9r3'
};

const key_shares_options = {
    secret_shares: 1,
    secret_threshold: 1
};

// get new instance of the client
const vault = require("node-vault")(options);

/**
 * Write a user credentials to the vault service
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
async function write(email, password){
    try {
        // write, read and delete secrets
        vault.write(`secret/${email}`, { value: `${password}`, lease: '1s' })
            .then( () => {
                const result = vault.read(`secret/${email}`)
                console.log('Read: ')
                console.dir(result)
            })
            .catch((err) => {
                console.dir(err);
                err.stackTrace
            });
    } catch (e) {
        console.dir(e);
        e.stackTrace
    }
}

/**
 * Read and retrieve the secret associated with the given email
 * @param email
 * @returns {Promise<void>}
 */
async function read(email){
    try {
        vault.read(`secret/${email}`)
            .then( (response) => {
                const secretValue = response.data.value
                console.log('Vault Secret: ')
                console.dir(secretValue)
                // Store the secret value in a variable or use it in your app
            })
            .catch(err => {
                console.dir(err)
                err.stackTrace
                // Handle any errors that occurred
            })
    } catch (e) {
        console.dir(e);
        e.stackTrace
    }
}

/**
 * Delete the secret associated with the given email
 * @param email
 * @returns {Promise<void>}
 */
async function delete_cred(email) {
    try {
        const result = vault.delete(`secret/${email}`)
        console.log('Deleted: ')
        console.dir(result)

    } catch (e) {
        console.dir(e);
        e.stackTrace
    }
}



async function setupBackend() {
    vault.generateDatabaseCredentials({
        ha_enabled : "true",
        address : "mysql-server:3306",
        username : "vault",
        password : "password",
        database : "safehomeapi",
        plaintext_connection_allowed : "true" //non-TLS mysql
        //path to CA.pem to verify MySQL SSL
        //tls_ca_file : "<path-to-mysql-ca-pem>"
    }).then( (result) => {
        console.log('Generating database credentials: ')
        console.dir(result)
    })
}


