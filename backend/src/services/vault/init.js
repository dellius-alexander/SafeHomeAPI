'use strict';
const { writeFileSync } = require('fs');
const { Buffer } = require('buffer');
const vault = require('./vault');

const key_shares_options = {
    secret_shares: 1,
    secret_threshold: 1
};

let vault_keys;

/**
 * Check if the vault cluster is initialized
 * @returns {Promise<void>}
 */
async function initialized(){

    try {
        await vault.initialized(key_shares_options)
            .then( (result) => {
                if ( initialized ) {
                    console.log(`Vault is initialized. Continuing without initialization.`)
                    console.dir(result)
                    return result.initialized;
                } else {
                    console.log(`Vault is not initialized.`)
                    console.dir(result)
                    return result.initialized;
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
    await writeFileSync('/usr/local/app/.certs/vault-cluster.json', data)
}

/**
 * Main entry point to the vault cluster
 * @returns {Promise<void>}
 */
async function init() {
    try {
        if ( await initialized() === false){

            // initialize vault server
            await vault.init(key_shares_options)
                .then( async (result) => {
                    console.log('Init Response: ')
                    console.dir(result)

                    vault_keys.keys = result.keys;
                    vault_keys.keys_base64 = result.keys_base64
                    vault_keys.root_token = result.root_token

                    console.log('Vault Keys: ')
                    console.dir(vault_keys.keys)

                    console.log('Vault Base64 Keys: ')
                    console.dir(vault_keys.keys_base64)

                    console.log('Vault Root Token: ')
                    console.dir(vault_keys.root_token)

                    // write the key shares to file where the x509 certificates are located
                    await writeTokenToFile(result)

                    // unseal vault server
                    return await vault.unseal({secret_shares: 1, key: vault_keys.keys[0]})
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
/**
 * Initializes vault server with an imposed delay in considerations of databases,
 * vault and server startup time.
 * @param milliseconds
 * @returns {Promise<null>}
 */
async function init_delay ( milliseconds = 3000 ){
    let timer = null;
    let sealed = null;
    try{

        while ( await initialized() === false ) {


            if (await initialized() === false) {
                console.log('Attempting to initialize vault cluster. Attempt: ', counter)
                timer = setTimeout(init, milliseconds)
                console.dir(`Timer: ${timer}`)
            }

            else if (! vault_keys === undefined) {
                console.log('Attempting to initialize vault cluster. Attempt: ', counter)
                sealed = await vault.unseal({secret_shares: 1, key: vault_keys.keys[0]})
                console.dir(`Sealed: ${sealed}`)
            }

            else if (counter > 10 || await initialized() === true && vault_keys !== undefined) {
                clearTimeout(timer);
                break;
            }

            counter += 1
        };
    } catch (e) {
        console.dir(e);
        e.stackTrace

    }
}

module.exports = {
    init_delay
}