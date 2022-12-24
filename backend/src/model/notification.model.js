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
 * Defines the notification model for a given security system settings. Setting are stored in the database and
 * updated per user activation/deactivation remotely.
 * @param {model<{Schema}>} model The model to create
 */
class Notification extends model("notifications",
    /**
     * Defines the notification schema for the security system notification settings
     * @type {Schema<any, Model<any>> }
     */
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            description: "The client email address"
        },
        enabledEventTypes: [{
          eventType: {
              type: String,
              required: true,
              trim: true,
          }
        }],
        messages: [{
            type: Schema.Types.ObjectId,
            ref: 'messages',
        }],
        numNewEvents: {
            type: Boolean,
            required: false,
            trim: true,
            default: false,
        },
        lastUpdated: {
                type: Date,
                required: true,
                generatedColumn: true,
                default: new Date().toISOString()
        },
        __revision_history: {
            type: Number,
            generatedColumn: true,
            required: true,
            allowNull: false,
            default: 0
        },
    },{ // schema options
        timestamp: true,
        versionKey: '__revision_history',
        validateBeforeSave: true,
    })){
    /**
     * Creates a notification object or provides access to notification collection.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)
    }
}

module.exports = {
    Notification
}
