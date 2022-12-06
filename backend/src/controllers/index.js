/**
 * Gets the index path.
 * @param req the request object
 * @param res the response object
 * @returns {Promise<void>}
 * @desc GET main root path
 * @route GET /
 * @access private
 */
const getIndex = async (req, res) => {
    // console.log(req)
    const response = {
        timestamp: new Date().toISOString(),
        status: req.status,
        secure: req.secure,
        message: "Hello From SafeHome API"
    }
    res .status(200)
        .json(response);
}

module.exports = {getIndex};