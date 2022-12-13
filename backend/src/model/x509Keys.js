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
