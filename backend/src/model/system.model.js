const { Schema, model } = require('mongoose')

/**
 * Creates a new securitySystem record.
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
     * Creates a message model or provides access to message collection.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)
    }
}

module.exports = {
    SecuritySystem
}
