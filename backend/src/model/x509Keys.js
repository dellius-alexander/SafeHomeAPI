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
 * Creates an object for the X509 certificate key pair.
 * @param {model<{Schema}>} model The model to create
 */
class X509Keys extends model("keys",
    /**
     * X509 certificate schema keys
     * @type {Schema<any, Model<any>>}
     */
    new Schema({
        private: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        public: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true,
        },
        timestamp: {
            createdAt: {
                type: Date,
                required: true,
                generatedColumn: true,
                default: new Date().toISOString()
            },
            updatedAt: {
                type: Date,
                required: true,
                generatedColumn: true,
                default: new Date().toISOString()
            }
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
     * Create X509 certificate key pairs.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)
    }
}

module.exports = {
    Keys: X509Keys
}
