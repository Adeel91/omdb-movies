(function () {
    'use strict';

    module.exports = {
        schemaVersion: '29-07-2021',
        localRepEmail: 'muhammad_adeel91@yahoo.com',
        noReplyEmail: 'muhammad_adeel91@yahoo.com',
        defaultImage: 'https://s.studiobinder.com/wp-content/uploads/2017/12/Movie-Poster-Template-Dark-with-Image.jpg?x81279',
        nodeEnv: {
            prod: 'production',
            qa: 'quality_assurance',
            dev: 'development',
            test: 'test',
        },
        selectSearchOptions: 'imdbId title year type genre rating votes actors director writer image',
        _2xx: {
            _200: { status: 200, reason: '{"response": "OK"}' },
            _201: { status: 201, reason: '{"response": "Created"}' },
            _202: { status: 202, reason: '{"response": "Accepted"}' },
            _204: { status: 204, reason: '{"response": "Not returning any content"}' },
        },
        _4xx: {
            _400: { status: 400, reason: '{"response": "Bad request"}' },
            _401: { status: 401, reason: '{"response": "Unauthorized"}' },
            _402: { status: 402, reason: '{"response": "Payment required"}' },
            _403: { status: 403, reason: '{"response": "Forbidden, refusing action."}' },
            _404: { status: 404, reason: '{"response": "Not found"}' },
            _405: { status: 405, reason: '{"response": "Method not allowed"}' },
            _406: { status: 406, reason: '{"response": "Not Acceptable"}' },
            _409: { status: 409, reason: '{"response": "Conflict"}' },
            _412: { status: 412, reason: '{"response": "Precondition failed"}' },
            _415: { status: 415, reason: '{"response": "Unsupported Media Type"}' },
            _429: { status: 429, reason: '{"response": "Too many requests"}' },
        },
        _5xx: {
            _500: { status: 500, reason: '{"response": "Internal Server Error"}' },
        },
        ioEmitters: {
            error: 'error'
        },
    };
})();
