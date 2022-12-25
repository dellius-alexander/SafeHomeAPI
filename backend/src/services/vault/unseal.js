const vault = require('./vault')
const {readFileSync} = require("fs");

async function unseal(){
    let timer = null;
    try {
        timer = setTimeout(async () => {
            let sealed = (await vault.status()).sealed
            if(sealed === true) {
                const vault_keys = await JSON.parse(readFileSync(process.env.VAULT_CLUSTER_CRED_JSON_FILE.toString(), 'utf-8'))
                vault.token = vault_keys.root_token
                const key = vault_keys.keys[0];
                return await vault.unseal({secret_shares: 1, key: key});
            } else {
                clearTimeout(timer);
                console.log('Vault is already unsealed.\n', sealed)
                return sealed;
            }

        }, 10000)
    } catch (e) {
        console.error('Vault unseal error: ')
        console.dir(e.message)
        return await unseal();
    }
}


module.exports = {
    unseal
}