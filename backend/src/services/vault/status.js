const vault = require('./vault')

async function status(){

    let timer = null;
    try {
        timer = setTimeout(async () => {
            return await vault.status()
                .then((_status) => {
                    console.log('Vault status: ')
                    console.dir(_status)
                    clearTimeout(timer)
                    return _status;
                })
                .catch(async (err) => {
                    console.error('Vault status error: ')
                    console.error(err.message)
                    return await status();
                });
        }, 10000)
    } catch (e) {
        console.error('Vault status error: ')
        console.dir(e.message)
        return await status();
    }

}

module.exports = {
    status
}