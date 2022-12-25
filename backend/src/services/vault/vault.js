const options = {
    apiVersion: 'v1',
    endpoint: process.env.VAULT_URI
};

// get new instance of the client
const vault = require("node-vault")(options);

module.exports = vault