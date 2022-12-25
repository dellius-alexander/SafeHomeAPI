const { writeFileSync, readFileSync} = require('fs');
const { Buffer } = require('buffer');
const vault = require('vault');

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


console.log('Vault status: ')
console.dir(await vault.status())


/**
 * Check if the vault cluster is initialized
 * @returns {Promise<void>}
 */
async function initialized(){

    try {
        return await vault.initialized()
            .then( async (result) => {
                if ( result.initialized === true) {
                    console.log(`Vault is initialized. Continuing without initialization.`)
                    console.dir(result)
                    return true;
                } else {
                    console.log(`Vault is not initialized.`)
                    console.dir(result)
                    return false;
                }
            })
            .catch(console.dir)
    } catch (e) {
        console.dir(e);
        e.stackTrace
        console.log('Initialization error.')
    }
}




/**
 * Main entry point to the vault cluster
 * @returns {Promise<void>}
 */
async function init() {

    try {
        if ( await initialized() === false){

            // initialize vault server
            return await vault.init(options)
                .then( async (result) => {

                    console.log('Vault Keys: ')
                    console.dir(result)

                    // write the key shares to file where the x509 certificates are located
                    await writeTokenToFile(result, null, process.env.VAULT_CLUSTER_CRED_JSON_FILE.toString())
                    // return {unsealed: true, result};
                })
                .catch(console.dir)
        }
    } catch (e) {
        console.error('Init error:')
        console.dir(e);
        e.stackTrace
    }
}

/**
 * Unseal the vault cluster
 * @returns {Promise<any>}
 */
async function unseal(){
    let timer = null;
    try {

        while ((await vault.status()).sealed) {
            console.log('Attempting to unseal vault cluster.')
            const vault_keys = await JSON.parse(readFileSync(process.env.VAULT_CLUSTER_CRED_JSON_FILE.toString(), 'utf-8'))
            console.log('Attempting to retrieve keys: ')
            console.log(vault_keys)
            // unseal vault server
            let results =  await vault.unseal({secret_shares: 1, key: vault_keys.keys[0]})
            timer = setTimeout(() => {}, 10000)
            if (!results.sealed){
                clearTimeout(timer);
                break;
            }
        }

        if (!(await vault.status()).sealed) {
            console.log('Vault is currently unsealed.')
            return {sealed: false};
        }

    } catch (e) {
        console.error('Unsealed error: ')
        console.dir(e);
        e.stackTrace
    }
}
let counter = 0;
/**
 * Initializes vault server with an imposed delay in considerations of databases,
 * vault and server startup time.
 * @param milliseconds
 * @returns {Promise<null>}
 */
async function init_delay ( milliseconds = 3000 ){
    let timer = null;

    try{
        // initiate the loop
        while ( await initialized() === false) {
            console.dir(`Attempt: ${counter}`)
            timer = setTimeout(init, milliseconds)
            console.dir(`Timer: ${timer}`)
            // check for race condition and clear timeout before race condition occurs
            if ( counter > 10  || await initialized() === true ) {
                clearTimeout(timer);
                break;
            }
            counter += 1
        };
    } catch (e) {
        console.error('Initial delay error: ')
        console.dir(e);
        e.stackTrace
    }
}

