const { Schema, model } = require('mongoose')
const { UserRoleEnum }  = require('./userRole.enum')


/**
 * Creates a message model or provides access to message collection.
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
     * Creates a message model or provides access to message collection.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)
    }

}


module.exports = {
    User
}


