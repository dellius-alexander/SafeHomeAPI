
const post = async function (req, res) {
    try {
        // get the request body for the new user
        const notification =
            Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined;
        if (!notification) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

    } catch (e) {
        console.dir(e)
    }
}


const get = async function (req, res) {
    try {
// get the request body for the new user
        const notification =
            Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined;
        if (!notification) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
    } catch (e) {
        console.dir(e)
    }
}


const patch = async function (req, res) {
    try {
// get the request body for the new user
        const notification =
            Object.keys(req.query).length !== 0 ? req.query :
                Object.keys(req.body).length !== 0 ? req.body :
                    Object.keys(req.params).length !== 0 ? req.params :
                        undefined;
        if (!notification) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }
    } catch (e) {
        console.dir(e)
    }
}


module.exports = {
    post,
    get,
    patch,
}