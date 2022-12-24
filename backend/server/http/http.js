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

const app = require('../api/v1/routes.js')
const { normalizePort } = require(process.env.BASEDIR + '/src/utils/helpers')

/**
 * Http Server object.
 */
const httpServer = require('http')

/**
 * Initialize application server
 * @returns {Promise<void>}
 */
async function main_http() {

    try {

        /**
         * Set server port configuration options
         * @type {{hostname: string, port: (string|number), node_hostname: string}}
         */
        const cfg = {
            port: normalizePort(process.env.PORT || 8080),
            hostname: process.env.HOSTNAME || process.env.NODEHOSTNAME,
            node_hostname: process.env.NODEHOSTNAME
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

    } catch (e) {
        console.error(`server.Error: `)
        console.dir(e)
        process.exit(1)
    }
}

// start the server
main_http().catch(err => console.dir(err));