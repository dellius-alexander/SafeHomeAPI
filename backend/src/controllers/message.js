// const { MongoClient, ServerApiVersion }  = require("mongodb");
const { Message } = require('../model/message.model')
const {
    checkForSearchFilters,
    queryMessageFilter
} = require('../utils/helpers')


/**
 * Get a list of mail messages.
 * @param req the request object
 * @param res the response object
 * @returns {Promise<void>}
 * @desc GET mail message
 * @route GET /api/v1/mail
 * @access private
 */
const getOne = async function (req, res){
    try {
        // check for filters
        const filters = checkForSearchFilters(req.query)
        // check for page parameters
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
        const messagesPerPage = req.query.messagesPerPage ? parseInt(req.query.messagesPerPage, 10) : 20;
        console.log(`Name: ${filters.name}, email: ${filters.email}, page: ${page}, messagesPerPage: ${messagesPerPage}`)
        // start the database connection using mongoose
        // const client = await new MongoClient();
        console.log(`Filters: ${filters}`);
        // get one message
        let query = queryMessageFilter(filters);
        const messages = await Message.find(query).limit(messagesPerPage).skip(messagesPerPage * page).exec();
        // response message
        let response = {
            timestamp: new Date().toISOString(),
            authorization: req.get('authorization'),
            secure: req.secure,
            messages: messages.messages,
            page: page,
            filters: filters,
            messagesPerPage: messagesPerPage,
            totalNumberOfMessages: messages.totalNumberOfMessages,
            route: req.route,
        }


        res.status(200)
            .json(response);

    // await MongoClient.connection.close();
} catch (e) {
    console.error("Error getting messages: ")
    console.error(e)
}
}

/**
 * Get all messages from mail server.
 * @param req the request object
 * @param res the response object
 * @returns {Promise<void>} produces a promise to be fulfilled when all messages are fetched from the server.
 */
const getAll = async function (req, res){
    try {
        let filters = checkForSearchFilters(req.query);
        // check for page parameters
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
        const messagesPerPage = req.query.messagesPerPage ? parseInt(req.query.messagesPerPage, 10) : 20;
        console.log(`Page: ${page}, MessagesPerPage: ${messagesPerPage}`)
        // start the database connection using mongoose
        // let client = new Mongo();
        console.log(`Filters: `);
        console.log(filters)
        // const {messages, totalNumberOfMessages} =  await client.getMessages(filters, page, messagesPerPage)
        // get all messages
        let messages = await Message.find(filters).limit(messagesPerPage).skip(messagesPerPage * page).exec();
        // response message
        let response = {
            timestamp: new Date().toISOString(),
            authorization: req.get('authorization'),
            secure: req.secure,
            messages: messages.messages,
            page: page,
            filters: filters,
            messagesPerPage: messagesPerPage,
            totalNumberOfMessages: messages.totalNumberOfMessages,
            route: req.route,
        }
        // console.log({messages, totalNumberOfMessages});
        console.log(response)
        res.status(200)
            .json(response);
        // await MongoClient.connection.close();
    } catch (e) {
        console.error("Error getting messages: ")
        console.error(e)
    }
}

/**
 * Create a new attempt to post an email message.
 * @param req the request object
 * @param res the response object
 * @returns {Promise<void>}
 * @desc post mail message
 * @route POST /api/v1/mail/post
 * @access private
 *
 */

const post = async function(req, res){
    let msg;
    try {
        msg = checkForSearchFilters(req.query);
        //// Authorization is needed for secure response
        // // Or you can use `req.headers`
        // req.headers.authorization;
        // // Or you can use `req.get`
        // req.get('authorization'),
        if (
            msg.name === undefined ||
            msg.email === undefined ||
            msg.subject === undefined ||
            msg.message === undefined
        ) {
            const m = 'Your Name, Your Email, Subject, Message are required parameters! \n';
            console.error(`Error: ${m}`);
            res.status(400).json({
                authorization: req.get('authorization'),
                message: new Error(m),
                route: req.route,
            });
        } else {

            const results = await Message.create(msg)

            let response = {
                timestamp: new Date().toISOString,
                authorization: req.get('authorization'),
                secure: req.secure,
                response: results,
                successMsg: "You message was sent successfully...\nSomeone will be in touch with you shortly.\n",
                route: req.route,
                messages: msg,
            }
            console.log(response)

            // The request succeeded, and a new resource was created as a result.
            // This is typically the response sent after POST requests, or some PUT requests.
            res
                .status(201)
                .json(response);
        }
    } catch (e) {
        console.error("Error creating new resource...")
        console.error(e)
    }
}

module.exports = {
    getOne,
    getAll,
    post
}