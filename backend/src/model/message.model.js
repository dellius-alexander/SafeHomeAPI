const { Schema, model } = require('mongoose')

/**
 * Creates a message model or provides access to message collection.
 * @param {model<{Schema}>} model The model to create
 */
class Message extends model("messages",
/**
 * Message Schema for Sending and Receiving Message.
 * subject, message, timestamp, sensor, system, eventType
 * @type {Schema<any, Model<any>> }
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

// let msg = new Messages({
//     name: "John",
//     email: "John@example.com",
//     subject: "John Testing Message",
//     message: "John Testing Message for Message testing..."
// })
//
// console.log(msg)
// console.log(msg.toString())

// msg = new Messages({
//     name: "Bob",
//     email: "Bob@example.com",
//     subject: "Bob Testing Message",
//     message: "bob Testing Message for Message testing..."
// })
//
// console.log(msg.__revision_history)
// console.log(msg.toString())

module.exports = {
    Message
}


