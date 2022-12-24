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
 * Check if the vault cluster is initialized
 * @returns {Promise<void>}
 */
async function initialized(){
    let isInitialized = false;
    try {
        vault.initialized(key_shares_options)
            .then( (result) => {
                isInitialized = result.initialized;
                if ( ! initialized ) {
                    console.log(`Vault is initialized. Continuing without initialization.`)
                    console.dir(result)
                    return isInitialized;
                } else {
                    console.log(`Vault is not initialized.`)
                    console.dir(result)
                    return isInitialized;
                }
            })
    } catch (e) {
        console.dir(e);
        e.stackTrace
        console.log('Initialization error.')
    }
}


/**
 * Write the given raw data to file to save vault key shares
 * @param rawData
 * @returns {Promise<void>}
 */
async function writeTokenToFile(rawData){
    const jsonData = JSON.stringify(rawData, null, 2);
    const data = Buffer.alloc(jsonData.length, jsonData, 'utf-8')
    writeFileSync('/usr/local/app/.certs/vault-cluster.json', data)
}

/**
 * Main entry point to the vault cluster
 * @returns {Promise<void>}
 */
async function main() {
    try {
        if (! await initialized()){

            // initialize vault server
            vault.init(key_shares_options)
                .then( (result) => {
                    console.log('Init Response: ')
                    console.dir(result)

                    const keys = result.keys;
                    const keys_base64 = result.keys_base64
                    const root_token = result.root_token

                    console.log('Vault Keys: ')
                    console.dir(keys)

                    console.log('Vault Base64 Keys: ')
                    console.dir(keys_base64)

                    console.log('Vault Root Token: ')
                    console.dir(root_token)

                    // write the key shares to file where the x509 certificates are located
                    writeTokenToFile(result)

                    // unseal vault server
                    return vault.unseal({ secret_shares: 1, key: keys[0]})
                })
                .then( (resp) => {
                    console.log('\nServer Unsealed Response: ')
                    console.dir(resp)
                })
        }
    } catch (e) {
        console.dir(e);
        e.stackTrace
        console.log('Error in main function.')
    }
}

let counter = 0;
const delay = async( milliseconds = 1000 ) =>{
    let response = null;
    try{

        while (! await initialized()) {
            console.log('Attempting to initialize vault cluster. Attempt: ', counter)
            response = setTimeout(main, milliseconds)
            counter += 1
            if (counter === 10 || await initialized()) break
        };
        console.log('Vault cluster initialized')
        console.dir(response)
        return response;
    } catch (e) {
        console.dir(e);
        e.stackTrace

    }
}

const resp = delay(10000);
console.log('Server Response: ')
console.dir(resp)
