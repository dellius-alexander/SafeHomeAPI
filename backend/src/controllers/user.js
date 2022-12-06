const {
    encrypt,
    decrypt,
} = require('../utils/helpers')
const { User } = require('../model/user.model')
const { UserRoleEnum } = require('../model/userRole.enum')


/**
 * Registers a new user
 * @param req the request object
 * @param res the response object
 * @returns {Promise<*>}
 */
const register = async function (req, res) {
    try {
        // console.log(req.body)
        // get the request body for the new user
        const params =
            Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined;

        // check if the request is empty
        if (params.length < 4) {
            return res.status(400).json({
                error: 'Missing required fields'
            })
        }

        console.log(req.headers)
        console.log(req.ip)
        console.log(JSON.stringify(params))

        const {name, email, dob, password} = params

        if (!name || !email || !dob || !password) {
            return res.status(400).json({
                error: 'Missing required fields',
            });
        }
        const encryptedPasswd = encrypt(password)
        const timestamp = new Date().toISOString()
        let apiToken = encrypt(JSON.stringify({
            username: email,
            createdAt: timestamp,
            expireAt: 21600000 // 6|12|24 hours
        })).toString()
        let role = await UserRoleEnum.findOne({role: 'USER'})
        if (!role){
            role = await UserRoleEnum.create({role: 'USER'})
        }
        let newUser = {
            name: name,
            email: email,
            dob: new Date(dob).getDate(),
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
    }
}

/**
 * Accepts user login
 * @param req the request object
 * @param res the response object
 * @returns {Promise<void>}
 */
const login = async function(req, res) {
    try {
        // get the request query object
        const params =
            Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined;
        // check if the request is empty
        if (params.length < 2) {
            return res.status(400).json({
                message: 'Missing required fields',
                success: false
            })
        }
        console.log(req.headers)
        console.log(req.ip)
        console.log(JSON.stringify(params))
        const { email, password } = params
        console.log(`Email: ${email} | Password: ${await encrypt(password)}`)
        if (email) { // if object exists
            // check if user already exists
            let user = await User.findOne({email: {$regex: email}})
            // if user already exists, send user information to client via response
            if (user) {
                console.log("User information: ")
                console.log(user)
                let passwd = decrypt(user.password)
                const timestamp = new Date()

                /*
                 * Check password for match
                 * if password matches send api token to client via response
                 */
                if (passwd === password){
                    //
                    let oldToken = JSON.parse(decrypt(user.token))
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
                        apiToken = encrypt(JSON.stringify({
                            username: email,
                            createdAt: timestamp.toISOString(),
                            expireAt: 21600000 // 6|12|24 hours
                        })).toString()

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
            return res.status(404).json({error: 'User not found'})
        } else {
            return res.status(422).json({
                error: 'Missing required fields',
            })
        }
    } catch(e) {
        console.dir(e)
    }
}

module.exports = {
    register,
    login,
}