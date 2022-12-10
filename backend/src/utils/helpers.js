
const { readFileSync } = require('fs')
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
// get the public key
const PUBLIC_KEY = readFileSync(process.env.PUBLIC_KEY_FILE, 'utf-8')
const PRIVATE_KEY = readFileSync(process.env.SSL_KEY_FILE, 'utf-8')

const getEncryptedData = function (data) {
    let params;
    try {
        console.log('Authorization: ')
        console.log(data)
        // const cypherText = CryptoJS.dec.Base64.parse(params.secureMessage)
        console.log(data.length)

        // const decryptedMessage = CryptoJS.RSA(params.secureMessage, PRIVATE_KEY)
        let decryptedData = crypto.privateDecrypt({
                key: PRIVATE_KEY,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            Buffer.from(data.toString(), "base64")
        );
        params = JSON.parse(decryptedData.toString("utf-8"))

        // The decrypted data is of the Buffer type, which we can convert to a
        // string to reveal the original data
        console.log("Decrypted data: ", params.email);
        console.log("Params Count: ", Object.keys(params).length)
    } catch (e) {
        console.dir(e)
        e.stackTrace
    }
    return params;
}

/**
 * Encrypt the given message using the PUBLIC_KEY
 * @param {String} message the message to encrypt
 * @param {CryptoJS.AES} algorithm encoding algorithm to use
 * @returns {Promise<*>} a promise that will be fulfilled
 */
const encrypt = function(message, algorithm){
    try {
        // Encrypt
        let cypherText = algorithm.encrypt(message,PRIVATE_KEY);
        console.log("CypherText: ",cypherText.toString());
        return cypherText.toString();
    } catch (e) {
        console.dir(e)
    }
}

/**
 * Decrypt the given message using the PUBLIC_KEY
 * @param {String} message the message to decrypt
 * @param {CryptoJS.AES} algorithm encoding algorithm to use
 * @returns {Promise<*>} a promise that will be fulfilled
 */
const decrypt = function(message, algorithm) {
    try {
        // Decrypt
        const bytes = algorithm.decrypt(message, PRIVATE_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted Text: ",decryptedString);
        return decryptedString;
    } catch (e) {
        console.dir(e)
    }
}

/**
 * Decrypt encrypted data using the provided algorithm, iv and key.
 * @param { AlgorithmIdentifier | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams} encrypted the encrypted message
 * @param { BufferSource} iv the initialization vector
 * @param {CryptoKey} key the encryption key
 * @returns {string} decrypted message
 */
function decryptData(encrypted,iv,key){
    const decrypted = CryptoJS.AES.decrypt(encrypted.toString(), key);
    console.log(decrypted);
    return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * Checks if the object is empty.
 * @param obj the object to check
 * @returns {{isEmpty: boolean, object}}
 * @private
 */
const isEmpty = function(obj) {
    for (let key in obj)
    {
        if (obj.hasOwnProperty(key))
        {
            return false;
        }
    }
    return true;
}
/**
 * Check request body, params, query and returns search filter
 * @param obj the request object
 * @returns {Promise<*>}
 */
const checkForSearchFilters = async function(obj){
    let filters = {}
    if (isEmpty(obj)){ return {};
    } else {
        if (obj.name !== undefined){
            filters.name = obj.name;
        }
        if (obj.email !== undefined){
            filters.email = obj.email;
        }
        if (obj.subject !== undefined){
            filters.subject = obj.subject;
        }
        if (obj.message !== undefined){
            filters.message = obj.message;
        }
    }
    return filters;
}

/**
 * Cycles through the filter object to build a query object.
 * We first check if the filters object contains the property "name"
 * with filters.hasOwnProperty('name').
 * If so, we use the $text query operator together with $search to search for sender
 * name containing the user specified search terms. $text also allows us to query
 * using multiple words by separating your words with spaces to query for documents
 * that match any of the search terms (logical OR). E.g. “ John Jane ” .
 * @param filters the filter object
 * @returns {*}
 */
const queryMessageFilter = function(filters =  {}){
    let query = {};
    // if the filter is empty, by checking for the default toString method
    if (isEmpty(filters))
    {
        // return the query object
        return query;
    }
    // else build the query object
    if (filters.hasOwnProperty('_id')) {
        console.log("Property Found: '_id'")
        query._id = {$regex: filters._id}
        delete filters._id;
    }
    if  (filters.hasOwnProperty('name')) {
        console.log("Property Found: 'name'")
        query.name = {$regex: filters.name}
        delete filters.name;
    }
    if (filters.hasOwnProperty('email')) {
        console.log("Property Found: 'email'")
        query.email = {$regex: filters.email}
        delete filters.email;
    }
    if (filters.hasOwnProperty('subject')) {
        console.log("Property Found: 'subject'")
        query.subject = {$regex: filters.subject}
        delete filters.subject;
    }
    if (filters.hasOwnProperty('message')) {
        console.log("Property Found: 'message'")
        query.message = {$regex: filters.message}
        delete filters.message;
    }
    // if (filters.hasOwnProperty('timestamp')) {
    //     console.log("Property Found: 'timestamp'")
    //     query.timestamp = {$eq: new Date(filters.timestamp).toISOString()}
    //     delete filters.message;
    // }
    return query;
}


// let filter = {
//     name: undefined,
//     email: "jane@gmail.com",
//     subject: "Its jane",
//     message: "jane"
// }
// let query = isEmpty(filter)
// console.log(query)

module.exports = {
    encrypt,
    decrypt,
    isEmpty,
    checkForSearchFilters,
    queryMessageFilter,
    decryptData,
    getEncryptedData
}

