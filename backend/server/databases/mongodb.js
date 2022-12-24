const mongoose = require("mongoose");
const {mongodb_options} = require("../config");


/**
 * We always connect to Database cluster before we start the server
 */
const db = async function () {
    await mongoose
        .connect(
            process.env.MONGODB_URI, // Database URI
            mongodb_options, // pass in options
            (err, db) => {
                if (err) {
                    console.dir(err);
                    process.exit(1);
                    return;
                }
                console.log('Connected to database...........................................');
                return db
            }
        );
}

module.exports = db