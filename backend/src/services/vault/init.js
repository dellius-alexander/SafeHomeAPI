'use strict';
const {
    writeFileSync,
    readFileSync
} = require('fs');
const { Buffer } = require('buffer');
const vault = require('./vault');
const {
    initCallback
} = require('../../utils/helpers')

const options = {
    secret_shares: 1,
    secret_threshold: 1,
}
/**
 * Write the given raw data to file to save vault key shares
 * @param rawData raw data buffer or string to convert to write to file
 * @param replacer replacer – A function that alters the behavior of the
 * stringification process, or an array of String and Number that serve as
 * an allowlist for selecting/filtering the properties of the value object
 * to be included in the JSON string. If this value is null or not provided,
 * all properties of the object are included in the resulting JSON string.
 * @param filepath absolute/relative path to write to file
 * @return {Promise<void>}
 */
async function writeTokenToFile(rawData, replacer = null, filepath){
    try {
        const jsonData = JSON.stringify(rawData, replacer, 2);
        const data = Buffer.alloc(jsonData.length, jsonData, 'utf-8')
        await writeFileSync(filepath, data)
    } catch (e) {
        console.dir(e);
        e.stackTrace
        return false;
    } finally {
        console.log('Vault keys written to file: ' , filepath)
    }
    return true;
}

async function init(){
    let timer = null;
    try {
        timer = setTimeout(async () => {
            await vault.initialized()
                .then(async (result) => {
                    console.log(result);
                    return await vault.init(options);
                })
                .then(async (result) => {
                    console.log('Vault keys: ')
                    console.dir(result);
                    await writeTokenToFile(result, null, process.env.VAULT_CLUSTER_CRED_JSON_FILE.toString())
                    vault.token = result.root_token;
                    const key = result.keys[0];
                    /**
                     * Unseal vault server
                     */
                    return await vault.unseal({secret_shares: 1, key});
                })
                .then((result) => {
                    console.log('Vault unsealed successfully: ')
                    console.dir(result);
                    return result;
                })
                .catch((err) => console.error(err.message));
        }, 10000);
        } catch (err) {
        console.log('Vault unsealed error: ')
        console.dir(err);
        return await init()
    }
}
module.exports = {
    init
}