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
// import environment variables
const path = require('path');
const fs = require('fs')
const dotenv = require('dotenv')
try {
    if (fs.existsSync(path.join(process.env.APP_HOME, '.env'))) {
        // if we have environment file we use it, else use default runtime environment
        const result = dotenv.config({
                path: path.join(process.env.APP_HOME, ".env"),
                encoding: 'utf8',
                debug: true,
                override: true
            }
        )
        if (result.error) {
            // console.error(result.error)
        }
        // else {
        //     // console.log(result)
        // }
    } else {
        console.log(`No .env file found...\nDefaulting to rutime environment...\n`)
    }
}
catch (e) {
    console.error(e)
    console.error(`Startup will continue, defaulting to runtime environment.`)
}

// initialize SSL configuration using child process
const { exec } = require("node:child_process")


/**
 * Callback for script success.
 * @param cmd the command to execute
 * @param stdout the message returned from the command
 */
function successCallback(cmd, stdout){
    console.log(`Success executing: ${cmd}`)
    console.log(stdout)
}

/**
 * Callback for script failure.
 * @param cmd the command to execute
 * @param error the error returned from the command execution
 * @param stderr the error returned from the command execution
 */
function errorCallback(cmd, error, stderr){
    console.error(`Execution failed for [${cmd}], is invalid.`)
    // console.error(stderr)
    console.error(error)
}

/**
 * Execute a shell command or script.
 * @param script the script to generate certificate and private key
 * @param successCallback success callback
 * @param errorCallback error callback
 */
async function execShell(script, successCallback, errorCallback) {
// execute a script or Shell command
    return exec(`${script}`, function (error ,stdout, stderr) {
        if (error !== null) {
            // log and return error message
            errorCallback(script, error, stderr);
            return error;
        } else {
            successCallback(script, stdout);
            return stdout;
        }
    });
}

/**
 * Execute Shell command async with a promise on script or command execution.
 * @param script {String} shell script to execute or command to execute
 * @returns {Promise<Object>} a promise that will be fulfilled on the script or command execution
 */
const execShellCmd = function execShellRun(script){
    return execShell(
            script,
            successCallback,
            errorCallback
            );
}

// export our newly created shell wrapper
// module.exports = execShellCmd

/**
 * Generate certificates and private key
 */
function gen_rsa(execShellCmd){
    // generate if no .certs directory found
    if (!fs.existsSync(path.join(__dirname, `.certs`)))
    {
        console.log(`No certificate files found.\nGenerating new certificate files.\n`);
        execShellCmd(`sh  ${path.join(__dirname, 'certs.sh')}  -s ${process.env.HOSTNAME}`)
            .catch(e => console.error(e))
    } else {
        // check the certs if they are found
        fs.readdir(path.join(__dirname, `.certs`), (err, files) => {
            console.log(`Domain Basename: ${process.env.DOMAIN_BASENAME}`)
            const certs = {
                crt: `${process.env.DOMAIN_BASENAME}.crt`,
                key: `${process.env.DOMAIN_BASENAME}.key`,
                pem: `${process.env.DOMAIN_BASENAME}.pem`,
                pub: `${process.env.DOMAIN_BASENAME}.pub`,
                req: `${process.env.DOMAIN_BASENAME}.req`
            }
            var count = 0;
            try {
                if (err) { // exit on errorCallback
                    console.error(err);
                    process.exit(1);
                }

                for (let file of files) {
                    for (const key in certs) {
                        switch(`${file}`) {
                            case `${certs[key]}`:
                                console.log(`SSL dependency found: ${file}`);
                                count += 1;
                                break;
                            default:
                        }
                    }
                }
                if (count !== 5)
                {
                    console.log(`Expected 5 Certificate files but ${files.length} were found.
Due to missing files, new certificates will have to be generated.
Generating new certificate files for hostname: ${process.env.HOSTNAME}......\n`);
                    execShellCmd(`sh  ${path.join(__dirname, 'certs.sh')} -s ${process.env.HOSTNAME}`)
                        .catch(e => console.error(e))
                } else {
                    console.log(`SSL Certificate already exists...\nReusing certificates...`)
                }
            } catch (e) {
                console.error(e);
            }
        });

    }

}
// Generate new certificates or reuse old certificates
gen_rsa(execShellCmd)