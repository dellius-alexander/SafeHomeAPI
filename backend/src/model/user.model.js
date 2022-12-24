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
const { UserRoleEnum }  = require('./userRole.enum')


/**
 * Defines the system user and his/her roles assigned.
 * Note: all passwords should be encrypted, no clear text is allowed in database.
 * @param {model<{Schema}>} model The model to create
 */
class User extends model("users",
    /**
     * Message Schema for Sending and Receiving Message.
     * @type {Schema<any, Model<any>> }
     */
    new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            description: "User full name"
        },
        email: {
            type: String,
            index: true,
            required: true,
            trim: true,
            unique: true,
            match: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9.]+\.[a-zA-Z]+$/,
            description: "User email address",
        },
        dob: {
            type: Date,
            format: 'yyyy-MM-dd',
            required: true,
            description: "user date of birth",
        },
        password: {
            type: String,
            required: true,
            trim: true,
            description: "User password",
        },
        roles: [{
            type: String,
            ref: 'userRoles',
            value: UserRoleEnum.role
        }],
        token: {
            type: String,
            required: true,
            trim: true,
            description: "user access token",
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
     * Creates a user object representing the system user.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)
    }

}


module.exports = {
    User
}


