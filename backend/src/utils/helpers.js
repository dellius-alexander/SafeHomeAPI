
const { readFileSync } = require('fs')
const CryptoJS = require("crypto-js");
// get the public key
const PUBLIC_KEY = readFileSync(process.env.PUBLIC_KEY_FILE, 'utf-8')
console.log(PUBLIC_KEY)

/**
 * Encrypt the given message using the PUBLIC_KEY
 * @param message
 * @returns {Promise<*>}
 */
const encrypt = function(message){
    try {
        // Encrypt
        let cypherText = CryptoJS.AES.encrypt(message,PUBLIC_KEY);
        console.log("CypherText: ",cypherText.toString());
        return cypherText.toString();
    } catch (e) {
        console.dir(e)
    }
}

/**
 * Decrypt the given message using the PUBLIC_KEY
 * @param message
 * @returns {Promise<string>}
 */
const decrypt = function(message) {
    try {
        // Decrypt
        const bytes = CryptoJS.AES.decrypt(message, PUBLIC_KEY);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted Text: ",decryptedString);
        return decryptedString;
    } catch (e) {
        console.dir(e)
    }
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
    queryMessageFilter
}

