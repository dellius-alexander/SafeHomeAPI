////////////////////////////////////////////////////////////////
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
try {
    if (fs.existsSync(path.join(__dirname.split("/")[0], '*.env')))
    {
        const options = {
            path: path.join(__dirname.split("/")[0], '*.env'),
            encoding: 'utf8',
            debug: true
        }
        dotenv.config(options, (err, config) => {
            if (err) {
                console.error(err);
            } else {
                console.log(config);
            }

        });
    } else {
        console.error("No environment file found. Startup will continue, defaulting to runtime environment.")
        console.error(process.env)
    }
}
catch (e) {
    console.error("\n")
    console.error(e)
    console.error("\n")
}
////////////////////////////////////////////////////////////////
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


module.exports = {
    normalizePort
}