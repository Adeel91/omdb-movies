(async function () {
    'use strict';

    // setup env vars right away
    const config = require('./src/config/config');
    config.envVariables();

    // packages
    const express = require('express');
    const helmet = require('helmet'); // Helmet helps you secure your Express apps by setting various HTTP headers.
    const morgan = require('morgan'); // HTTP request Logger
    const cors = require('cors')

    // app
    const constants = require('./src/config/constants');
    const mongoose = require('./src/config/mongoose');
    const movieRoutes = require('./src/routes/movie');

    // setup and configure application
    const app = express();
    await mongoose.connect();

    app.use(cors());
    // set up the app.use functions
    app.use(morgan('common', config.logger()));
    app.use(helmet({ contentSecurityPolicy: false }));

    app.use('/api', movieRoutes);

    // error handler must come as last app.use with exactly 4 arguments
    // #see-also http://expressjs.com/en/guide/error-handling.html
    app.use(async function (err, req, res, next) {
        const error = new Error('Error occurred...');
        Error.captureStackTrace(error);

        if (err.code === 'EUNAUTHORIZED') {
            return res.status(constants._4xx._401.status).send(constants._4xx._401.reason);
        } else if (err.code === 'EBADCSRFTOKEN' || err.code === 'EFORBIDDEN') {
            return res.status(constants._4xx._403.status).send(constants._4xx._403.reason);
        } else {
            return next(err);
        }
    });

    // Start server listening
    const server = app.listen(process.env.PORT, () => console.info('listening on port %s...', process.env.PORT));

    // set up the shutdown handlers
    const exitHandler = async function (code) {
        const services = [server, mongoose];

        for (let i = 0; i < services.length; ++i) {
            const resp = await services[i].close();
            if (resp instanceof Error) console.log(resp);
        }

        const error = new Error(`${process.env.NODE_ENV} has shut down with exit code: ${code}`);
        Error.captureStackTrace(error);
        process.exit(0);
    };

    process.on('SIGINT', exitHandler);
    process.on('SIGTERM', exitHandler);
})();
