const {init} = require('./init')
const {status} = require('./status')
const {unseal} = require('./unseal')
const {init_mysql} = require('./mount_mysql')
const {readFileSync} = require("fs");
const {initCallback} = require("../../utils/helpers")

/**
 * Vault status check
 */
status()
    .catch((err) => console.error(err.message));

/**
 * Initialize vault service
 */
init()
    .catch((err) => console.error(err.message));

/**
 * Setup mysql database as vault backend storage engine
 */
init_mysql()
    .catch((err) => console.error(err.message));


