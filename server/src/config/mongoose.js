(function () {
    'use strict';

    const mongoose = require('mongoose');
    const ms = require('ms');
    let expectingShutdown = false;

    module.exports = {
        connect: connect,
        close: close,
    };

    async function connect() {
        await mongoose.connect(process.env.MONGO_CONNECTION, {
            dbName: process.env.MONGO_DATABASE,
            keepAlive: true,
            keepAliveInitialDelay: ms(process.env.MONGO_KEEP_ALIVE),
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        });
    }

    function close() {
        return new Promise((resolve) => {
            console.log('Shutting down MongoDB connection');
            expectingShutdown = true;
            mongoose.connection.on('disconnected', resolve);
            mongoose.connection.close();
            setTimeout(() => {
                const error = new Error('Timeout for disconnecting mongo has triggered.');
                Error.captureStackTrace(error);
                resolve(error);
            }, 3000);
        });
    }

    mongoose.connection.on('connected', function () {
        console.log('Mongoose has connected successfully to MongoDB instance');
    });

    mongoose.connection.on('error', function (err) {
        console.log('Mongoose connection has encountered ' + err + ' error');
    });

    mongoose.connection.on('disconnected', async function () {
        if (!expectingShutdown) {
            const error = new Error('Mongoose has prematurely disconnected. Shutting down...');
            Error.captureStackTrace(error);
            process.exit(1);
        }

        console.log('Mongoose has disconnected successfully from the MongoDB instance');
    });
})();
