const options = {
    apiVersion: 'v1',
    endpoint: 'http://vault:8200',
    token: 'U2FsdGVkX19BTBBZ2sNRH9r3'
};

// get new instance of the client
const vault = require("node-vault")(options);

module.exports = vault