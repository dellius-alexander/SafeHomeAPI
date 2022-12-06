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
    post,
    get,
    patch,
} = require('../../../controllers/notification')


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
 * API endpoint used to create new notification settings
 */
router.post('/post', post, mailErrorCallback);

/**
 * API endpoint to get notification settings
 */
router.get('/get', get, mailErrorCallback);

/**
 * API endpoint to update notification settings
 */
router.put('/put', patch, mailErrorCallback);

/**
 * API endpoint to update notification settings
 */
router.patch('/patch', patch, mailErrorCallback);

module.exports = router

