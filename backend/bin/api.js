const app = require('../server')
// const greenlock = require('./greenlock.config')
const mongoose = require('mongoose')
const {
    normalizePort
} = require('./config')
/**
 * Error Handler must be last in the chain of custody handlers.
 * @type {function(err, req, res, next): Promise<void>}
 */
const {
    errorHandler
} = require("../src/middleware/errorHandler");
const {
    readFileSync
} = require("fs");

/**
 * Http Server object.
 */
const httpServer = require('http')
/**
 * Https Server object.
 */
// const httpsServer = require('https')

/**
 * Initialize application server
 * @returns {Promise<void>}
 */
async function main() {
    /**
     * Database connection options<Request, Response>
     */
    let options;
    try {
        options = {
            autoIndex: false, // Don't build indexes
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            useNewUrlParser: true,
            useUnifiedTopology: true,
            keepAliveInitialDelay: 300000,
            keepAlive: true,
        };
        /**
         * We always connect to Database cluster before we start the server
         */
        module.exports.db = await mongoose
            .connect(
                process.env.MONGODB_URI, // Database URI
                options, // pass in options
                ( err, db ) => {
                    if (err) {
                        console.dir(err);
                        process.exit(1);
                        return;
                    }
                    console.log('Connected to database...........................................');
                    return db
                }
            );


        /**
         * Setup Routes for our API endpoints
         */
        app.use('/', require('../src/routes/index'));
        app.use(`/api/v1/message`, require('../src/routes/api/v1/message'));
        app.use('/api/v1/user', require('../src/routes/api/v1/user'))
        app.use('/api/v1/notification', require('../src/routes/api/v1/notification'))
        // final handler in chain of custody routes
        app.use(errorHandler)

        /**
         * Set server port configuration options
         * @type {{hostname: string, port: (string|number), node_hostname: string}}
         */
        const cfg = {
            port: normalizePort(process.env.PORT || 8080),
            hostname: process.env.HOSTNAME || process.env.NODEHOSTNAME,
            node_hostname: process.env.NODEHOSTNAME
        }

        // /**
        //  * Setup server to use http protocol.
        //  * Disable this if using https protocol.
        //  */
        // app.listen(
        //     cfg.port,
        //     cfg.hostname,
        //     () => {
        //         console.log(`Example app is listening on https://${cfg.hostname}:${cfg.port}`)
        //     }
        // );

        /**
         * create ssl options
         * @type {{cert: Buffer, key: Buffer}}
         */
        const sslOptions = {
            key: readFileSync(process.env.SSL_KEY_FILE, 'utf-8'),
            cert: readFileSync(process.env.SSL_CERT_FILE, 'utf-8'),
            ca: readFileSync(process.env.SSL_CA_FILE, 'utf-8')
        }

        /**
         * Create https server
         */
        httpServer.createServer(app)
            .listen(
                cfg.port,
                cfg.hostname,
                () => {
                    console.log(`SafeHome API listening on http://${cfg.hostname}:${cfg.port}`)
                    console.log(`To test server entrypoint Run: curl -k http://${cfg.hostname}:${cfg.port}`)

                }
            ).on('success', async function(req, res) {
            console.log(`Success`)
            console.log(req, res)
            })
            .on('error', async function(req, res) {
                console.error(`Error:`)
                console.error(req, res)
            })

        // /**
        //  * configure server to use SSL.
        //  * Test if server state is up by running: curl -k https://HOSTNAME:PORT
        //  * @type {Server<typeof httpsServer.IncomingMessage, typeof httpsServer.ServerResponse>}
        //  */
        // httpsServer.createServer(sslOptions, app)
        //     .listen(
        //         cfg.port,
        //         cfg.hostname,
        //         () => {
        //             console.log(`SafeHome API listening on https://${cfg.hostname}:${cfg.port}`)
        //             console.log(`To test server entrypoint Run: curl -k https://${cfg.hostname}:${cfg.port}`)
        //         })
        //     .on('success', async function(req, res) {
        //         console.log(`Success`)
        //         console.log(req, res)
        //     })
        //     .on('error', async function(req, res) {
        //         console.error(`Error:`)
        //         console.error(req, res)
        //     })

    } catch (e) {
        console.error(`server.Error: `)
        console.error(e)
        process.exit(1)
    }
}

// start the server
main().catch(err => console.dir(err));