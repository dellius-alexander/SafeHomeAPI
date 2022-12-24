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
const { Schema, model } = require('mongoose')

/**
 * Creates a message model or provides access to message collection.
 * @param {model<{Schema}>} model The model to create
 */
class Message extends model("messages",
/**
 * Message Schema for Sending and Receiving Message.
 * subject, message, timestamp, sensor, system, eventType
 * @type {Schema<any, Model<any>>}
 */
new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        description: "The client email address"
    },
    system: {
        type: Schema.Types.ObjectId,
        ref: 'securitySystem',
        description: "The client security system"
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    timestamp: {
        type: Date,
        required: true,
        generatedColumn: true,
        default: new Date().toISOString(),
        allowNull: false,
    },
    __revision_history: {
        type: Number,
        generatedColumn: true,
        required: true,
        allowNull: false,
        default: 0
    }
},{ // schema options
    timestamp: true,
    versionKey: '__revision_history',
    validateBeforeSave: true,
})){
    /**
     * Creates a new message.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)

    }

}


module.exports = {
    Message
}


