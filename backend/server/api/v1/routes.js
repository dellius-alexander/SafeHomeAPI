const app = require(process.env.BASEDIR + "/server/server.js");
const {errorHandler} = require(process.env.BASEDIR + "/src/middleware/errorHandler");

/**
 * Redirect http to https
 */
app.use((req, res, next) => {
    if(req.protocol === 'http') {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

app.use('/', require(process.env.BASEDIR + '/src/routes/index'))
app.use('/', require(process.env.BASEDIR + '/src/routes/api/v1/certificate'))
app.use('/', require(process.env.BASEDIR + '/src/routes/api/v1/message'))
app.use('/', require(process.env.BASEDIR + '/src/routes/api/v1/user'))
app.use('/', require(process.env.BASEDIR + '/src/routes/api/v1/notification'))
// final handler in chain of custody routes
app.use(errorHandler)

module.exports = app
