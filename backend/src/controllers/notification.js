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
 * Change settings by posting notification object with updated settings.
 * @param {request} req the request object
 * @param {response} res the response object
 * @returns {Promise<*>}
 */
async function post(req, res) {
    try {
        // get the request body for the new user
        const notification =
            Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined;
        if (!notification) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

    } catch (e) {
        console.dir(e)
    }
}


const get = async function (req, res) {
    try {
// get the request body for the new user
        const notification =
            Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined;
        if (!notification) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
    } catch (e) {
        console.dir(e)
    }
}


const patch = async function (req, res) {
    try {
// get the request body for the new user
        const notification =
            Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined;
        if (!notification) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
    } catch (e) {
        console.dir(e)
    }
}


module.exports = {
    post,
    get,
    patch,
}