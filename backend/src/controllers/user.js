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
const { User } = require('../model/user.model')
const { UserRoleEnum } = require('../model/userRole.enum')
const {
    rsaDecrypt,
    encrypt,
    decrypt
} = require("../utils/rsa_crypto");
const publicKey = require('fs').readFileSync(process.env.PUBLIC_KEY_FILE, 'utf8');
const privateKey = require('fs').readFileSync(process.env.PRIVATE_KEY_FILE, 'utf8');
/************************************************************************/
/**
 * Registers a new user
 * @param req the request object
 * @param res the response object
 * @returns {Promise<*>}
 */
const register = async function (req, res) {
    let params
    try {
        // get the request query object
        params = Object.keys(req.query).length !== 0 ? req.query :
                    Object.keys(req.body).length !== 0 ? req.body :
                        Object.keys(req.params).length !== 0 ? req.params :
                            undefined;


        params = JSON.parse((await rsaDecrypt(privateKey, params.secureMessage)).toString())


        // The decrypted data is of the Buffer type, which we can convert to a
        // string to reveal the original data
        console.log("Decrypted data: ", params);

        // check if the request is empty
        if (params === undefined || Object.keys(params).length  < 4) {
            return res.status(400).json({
                error: 'Missing required fields'
            })
        }

        const { name, email, dob, password } = params

        if (!name || !email || !dob || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
            });
        }
        const encryptedPasswd = encrypt(publicKey, password)
        const timestamp = new Date().toISOString()
        let apiToken = encrypt(publicKey, JSON.stringify({
            username: email,
            createdAt: timestamp,
            expireAt: 21600000 // 6|12|24 hours
        })).toString()
        let role = await UserRoleEnum.findOne({role: 'USER'})
        if (!role){
            role = await UserRoleEnum.create({role: 'USER'})
        }
        // create new user
        let newUser = {
            name: name,
            email: email,
            dob: new Date(dob),
            password: encryptedPasswd,
            roles: [role.role],
            token: apiToken,
        };

        console.log("New User: ")
        console.log(newUser)

        if (newUser) { // if object found
            // check if user already exists
            const user = await User.findOne({email: {$regex: newUser.email}})
            if (user) {  // if user already exists, throw exception back to client
                return res.status(400).json({
                    error: 'User already exists'
                })
            }
            // else create new user
            const result = await User.create(newUser)

            if (result){ // check for success
                console.log(result)
                let response = { // write a response back to client
                    timestamp: timestamp,
                    secure: req.secure,
                    name: result.name,
                    username: result.email,
                    token: result.token,
                    successMsg: `User ${result.name} created successfully`,
                }
                console.log('Response: ')
                console.log(response)
                // send the response
                return res.status(201).json(response)
            }
        } else {
            return res.status(400).json({
                error: 'Invalid user format',
            })
        }
    } catch (e) {
        console.dir(e)
        e.stackTrace
    }
}

/**
 * Accepts user login
 * @param req the request object
 * @param res the response object
 * @returns {Promise<void>}
 */
const login = async function(req, res) {
    let params
    try {
        // get the request query object
        params =
            (Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined);

        params = JSON.parse((await rsaDecrypt(privateKey, params.secureMessage)).toString('utf-8'))
        console.log('Decrypted message: ', params)
        const email = params.email
        const password = params.password

        // check if the request is empty
        if (params === undefined || Object.keys(params).length  < 2) {
            return res.status(400).json({
                message: 'Missing required fields',
                success: false
            })
        }

        // get user information from params
        console.log(`Email: ${email} | Password: ${(await encrypt(publicKey, password)).toString()}`)

        if (email) { // if object exists
            // check if user already exists
            let user = await User.findOne({email: {$regex: email}})
            // if user already exists, send user information to client via response
            if (user) {
                console.log("User information: ")
                console.log(user)
                let passwd = (await decrypt(publicKey, user.password)).toString()
                const timestamp = new Date()
                console.log('Decrypted passwd: ' + passwd)

                /*
                 * Check password for match
                 * if password matches send api token to client via response
                 */
                if (passwd === password){
                    // decrypt user api token
                    let oldToken = JSON.parse((await decrypt(publicKey, user.token)).toString())
                    console.log("Old token: ")
                    console.log(oldToken)
                    const oldTimestamp = new Date(oldToken.createdAt)
                    const elapsed = timestamp.getTime() - oldTimestamp.getTime()
                    let apiToken;

                    /**
                     * Check if the api token has expired and if so create a new api token
                     * after 6 hours or 21600000 milliseconds. Then update the user object
                     */
                    if (elapsed > 21600000) {
                        // new api token
                        apiToken = (await encrypt(publicKey, JSON.stringify({
                            username: email,
                            createdAt: timestamp.toISOString(),
                            expireAt: 21600000 // 6|12|24 hours
                        }))).toString()
                        console.log("New api token: ")
                        console.log(apiToken)

                        // update user token and __revision_history
                        await User.findOneAndUpdate(
                            {
                                email: {$regex: email}
                            },
                            {
                                token: apiToken,    // new api token
                                timestamp: { // updated timestamp
                                    createdAt: user.timestamp.createdAt,
                                    updatedAt: timestamp.toISOString()
                                }, // increment __revision_history
                                __revision_history: user.__revision_history + 1
                            }
                        )
                    } else {
                        // or reuse old api token
                        apiToken = user.token
                    }
                    console.log(`Elapsed time:  ${elapsed} milliseconds`)

                    // create a response for the client
                    let response = {
                        timestamp: timestamp.toISOString(),
                        secure: req.secure,
                        name: user.name,
                        username: user.email,
                        token: apiToken,
                        successMsg: `${user.name} Logged in successfully`,
                    }
                    console.log('Response: ')
                    console.log(response)
                    // send the response message back to client
                    return res.status(200).json(response)
                }
            }
            // else send an error message back to client
            return res.status(404).json({error: 'User not found, or your username/password is incorrect '})
        } else {
            return res.status(422).json({
                error: 'Missing required fields',
            })
        }
    } catch(e) {
        console.dir(e)
        e.stackTrace
    }
}



module.exports = {
    register,
    login,
}