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
const express = require('express')
const router = express.Router();
const {
    getOne,
    getAll,
    post
} = require('../../../controllers/message');


/**
 * mail error callback handler.
 * @param msg custom error message
 * @param err error message from server
 */
const mailErrorCallback = function(msg, err){
    console.error('Something went wrong')
    console.error(msg, err)
}
////////////////////////////////////////////////////////////////
/**
 * API endpoint for sending emails messages.
 * Create a new message and posts it to database.
 */
router.post('/post', post, mailErrorCallback);
/**
 * Get one message.
 */
router.get('/get', getOne, mailErrorCallback);

/**
 * Get all messages
 */
router.get('/getAll', getAll, mailErrorCallback);
/**
 * Update a message
 */
router.patch('/update/:id', (req, res) => {
    console.log(req.body | req.query | req.params);
    res.status(200).json({
        timestamp: new Date().toISOString(),
        message: "Hello from /update path"
    })
}, mailErrorCallback)
/**
 * Delete a message
 */
router.delete('/delete', (req, res) => {
    console.log(req.body | req.query | req.params);
    res.status(200).json({
        timestamp: new Date().toISOString(),
        message: "Hello from /delete path"
    })
}, mailErrorCallback)

module.exports = router

