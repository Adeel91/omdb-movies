(function () {
    'use strict';

    const fs = require('fs');
    const rfs = require('rotating-file-stream');
    const path = require('path');
    const dotenv = require('dotenv');

    module.exports = {
        envVariables: envVariables,
        logger: logger,
    };

    function envVariables() {
        const result = dotenv.config({
            path: path.join(__dirname, '..', '..', '.env'),
        });

        if (result.error || !process.env.NODE_ENV) {
            console.log('Error setting environment variables: %s', result.error);
            process.exit(-1);
        }

        // env vars { _var: 'variable name', development: 'required on development', quality_assurance: 'required on staging', production: 'required on production' }
        const nodeEnvVars = [
            { _var: 'NODE_ENV', development: true, quality_assurance: true, production: true },
            { _var: 'PORT', development: true, quality_assurance: true, production: true },
            { _var: 'LOG_DIRECTORY', development: false, quality_assurance: true, production: true },
            { _var: 'LOG_FILENAME', development: false, quality_assurance: true, production: true },
            { _var: 'MONGO_DATABASE', development: true, quality_assurance: true, production: true },
            { _var: 'MONGO_CONNECTION', development: true, quality_assurance: true, production: true },
            { _var: 'MONGO_KEEP_ALIVE', development: true, quality_assurance: true, production: true },
            { _var: 'BASE_URL', development: false, quality_assurance: true, production: true },
            { _var: 'OMDB_BASE_URL', development: true, quality_assurance: true, production: true },
            { _var: 'OMDB_API_KEY', development: true, quality_assurance: true, production: true },
        ];
        let hasError = false;

        for (let i = 0; i < nodeEnvVars.length; i++) {
            if (
                process.env[nodeEnvVars[i]._var] === undefined ||
                (nodeEnvVars[i][process.env.NODE_ENV] && !process.env[nodeEnvVars[i]._var])
            ) {
                console.log('\x1b[31m%s\x1b[0m', `process.env.${nodeEnvVars[i]._var} is not set or is incorrect`);
                hasError = true;
            }
        }

        if (hasError) {
            process.exit(-1);
        }
    }

    function logger() {
        if (!process.env.LOG_DIRECTORY || !process.env.LOG_FILENAME || !fs.existsSync(process.env.LOG_DIRECTORY))
            return {};

        const dir = process.env.LOG_DIRECTORY;
        const file = process.env.LOG_FILENAME;
        return { stream: rfs.createStream(file, { path: dir, interval: '3d', maxFiles: 5 }) };
    }
})();
