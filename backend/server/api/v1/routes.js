const app = require( "../../server.js");
const {errorHandler} = require("../../../src/middleware/errorHandler");

/**
 * Redirect http to https
 */
app.use((req, res, next) => {
    if(req.protocol === 'http') {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

app.use('/', require('../../../src/routes/index'))
app.use('/api/v1/user', require('../../../src/routes/api/v1/user'))
app.use('/api/v1/certificate', require('../../../src/routes/api/v1/certificate'))
app.use('/api/v1/message', require('../../../src/routes/api/v1/message'))
app.use('/api/v1/notification', require('../../../src/routes/api/v1/notification'))
// final handler in chain of custody routes
app.use(errorHandler)

module.exports = app
