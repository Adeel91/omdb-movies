(function () {
    'use strict';

    const constants = require('../config/constants');
    const movieService = require('../service/movieService');

    module.exports = {
        RetrieveMovies: RetrieveMovies,
        RetrieveMovieDetail: RetrieveMovieDetail,
        SaveMovies: SaveMovies,
        SearchMovies: SearchMovies
    };

    async function RetrieveMovies() {
        const movies = await movieService.RetrieveMovies();
        return { status: constants._2xx._200.status, content: movies };
    }

    async function RetrieveMovieDetail(req) {
        const movie = await movieService.RetrieveMovieDetail(req);
        return { status: constants._2xx._200.status, content: movie };
    }

    async function SaveMovies() {
        await movieService.SaveMovies();
        return { status: constants._2xx._200.status, content: constants._2xx._200.reason };
    }

    async function SearchMovies(req) {
        const movies = await movieService.SearchMovies(req);
        return { status: constants._2xx._200.status, content: movies };
    }
})();
