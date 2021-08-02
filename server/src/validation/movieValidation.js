(function () {
    'use strict';

    const validation = require('./requestValidator');

    module.exports = {
        SaveMovies: SaveMovies,
        SearchMovies: SearchMovies,
    };

    function SaveMovies(data) {
        return validation.Validate(data, {
            imdbId: {
                type: 'string',
                required: true,
            },
            title: {
                type: 'string',
                required: true,
            },
            year: {
                type: 'string',
                required: true,
            },
            type: {
                type: 'string',
                required: true,
            },
        });
    }

    function SearchMovies(req) {
        return validation.Validate(req.query, {
            searchTerm: {
                type: 'string',
                required: true,
                minLength: 1
            },
        });
    }
})();
