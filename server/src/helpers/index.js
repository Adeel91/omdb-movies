(function () {
    'use strict';

    const movieSchemaModel = require('../schema/movie');

    module.exports = {
        any: any,
        PromiseRemainingTime: PromiseRemainingTime
    };

    /**
     * Returns a promise that will resolve at start + duration
     * @param start date in milliseconds from the start of the request
     * @param start the start time of the api
     * @param duration the amount of time the api should take
     */
    function PromiseRemainingTime(start, duration) {
        return new Promise((resolve) => {
            const now = new Date().getTime();
            const end = start + duration;
            now < end ? setTimeout(resolve, end - now) : resolve();
        });
    }

    function any(req, res, next) {
        next();
    }
})();
