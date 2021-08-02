(function () {
    'use strict';

    const constants = require('./constants');
    const helper = require('../helpers');

    module.exports = {
        controllerWrapper: controllerWrapper,
    };

    function controllerWrapper(validationFunc, controllerFunc, duration) {
        return async (req, res) => {
            const start = new Date().getTime();

            try {
                if (validationFunc) {
                    const failures = validationFunc(req);

                    if (failures.length > 0) {
                        if (res) {
                            return res.status(constants._4xx._400.status).send(failures);
                        } else {
                            return global.io.to(1).emit(constants.ioEmitters.error, {
                                status: constants._4xx._400.status,
                                body: JSON.parse(constants._4xx._400.reason),
                            });
                        }
                    }
                }

                const resp = await controllerFunc(req, res);
                const end = new Date().getTime();

                if (duration) {
                    if (end - start >= duration) {
                        const error = new Error(
                            `Function was expected to take [${duration}] ms but actually took [${end - start}] ms`
                        );
                        Error.captureStackTrace(error);
                    } else {
                        await helper.PromiseRemainingTime(start, duration);
                    }
                }

                for (const sendTo of resp.ioSendTo || []) {
                    if (sendTo === 'all') {
                        global.io.emit(resp.ioEmitterName, {
                            status: resp.status,
                            body: resp.ioContent || resp.content,
                        });
                        continue; // io.emit sends to all
                    }
                    global.io
                        .to(sendTo)
                        .emit(resp.ioEmitterName, { status: resp.status, body: resp.ioContent || resp.content });
                }

                if (res) {
                    return res.status(resp.status).send(resp.content);
                }
            } catch (e) {
                if (duration) await helper.PromiseRemainingTime(start, duration);

                if (res) {
                    return res.status(constants._5xx._500.status).send(constants._5xx._500.reason);
                } else {
                    return global.io.to(1).emit(constants.ioEmitters.error, {
                        status: constants._5xx._500.status,
                        body: JSON.parse(constants._5xx._500.reason),
                    });
                }
            }
        };
    }
})();
