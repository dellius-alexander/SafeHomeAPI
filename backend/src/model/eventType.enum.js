const { Schema, model } = require('mongoose')

/**
 * Creates a new EventTypeEnum object
 * @param {model<{Schema}>} model The model to create
 */
class EventTypeEnum extends model("eventType",
    /**
     * Create a new event type
     * @type {Schema<any, Model<any>>}
     */
    new Schema({
        eventType: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            toLocaleUpperCase: true,
            index: true,
            enumerable: true
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
     * Creates a new event type.
     * @param doc the document
     */
    constructor(doc = {}) {
        super(doc)
    }
}

module.exports = {
    EventTypeEnum
}
