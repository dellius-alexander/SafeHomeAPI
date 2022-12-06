const { Schema, model } = require('mongoose')

/**
 * Defines the notification model for a given security system
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
     * Creates a message model or provides access to message collection.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)
    }
}

module.exports = {
    Notification
}
