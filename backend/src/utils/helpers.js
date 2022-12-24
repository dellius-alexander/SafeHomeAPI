/**
 *    Copyright 2022 Dellius Alexander
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
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

    return query;
}

/**
 * Normalize a port into a number, string, or false.
 * @param val the port to be normalized
 * @returns {boolean|number|*} the normalized port value
 */
function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
module.exports = {
    isEmpty,
    checkForSearchFilters,
    queryMessageFilter,
    normalizePort
}

