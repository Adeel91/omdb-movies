(function () {
    'use strict';

    const constants = require('../../config/constants');

    module.exports = {
        preValidate: preValidate,
        updateVersionFromDBS: updateVersionFromDBS,
    };

    async function preValidate(next) {
        await this.updateVersionFromDBS();
        next();
    }

    async function updateVersionFromDBS() {
        this.schemaVersion = constants.schemaVersion;
        return this;
    }
})();
