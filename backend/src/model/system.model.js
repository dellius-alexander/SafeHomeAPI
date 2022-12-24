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
 * Creates a new securitySystem record object representing the in home control panel. Maps the system properties and
 * persists the system configuration.
 * @param {model<{Schema}>} model The model to create
 */
class SecuritySystem extends model("securitySystem",
    /**
     * Security System schema
     * @type {Schema<any, Model<any>> }
     */
    new Schema({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true,
            description: "The client email address"
        },
        serialNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
            description: "The serial number of the security system"
        },
        enabledEventTypes: [{
            eventType: {
                type: String,
                required: true,
                trim: true,
                description: "The type of event to alert users about"
            }
        }],
        numNewEvents: {
            type: Boolean,
            required: false,
            trim: true,
            default: false,
            description: "Whether to alert users when there are new events by keeping count of new events"
        },
        lastTimeUpdatedUser: {
            type: Date,
            required: true,
            generatedColumn: false,
            default: new Date().toISOString(),
            description: "The last time the User was updated of new events"
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
     * Creates a System object that represents the security  system.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)
    }
}

module.exports = {
    SecuritySystem
}
