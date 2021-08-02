(function () {
    'use strict';

    const constants = require('../config/constants');
    const axios = require('axios');

    const omdbBaseUrl = process.env.OMDB_BASE_URL;
    const omdbApiKey = process.env.OMDB_API_KEY;
    const omdbSearchTerm = process.env.OMDB_SEARCH_TERM;
    const omdbSearchYear = process.env.OMDB_SEARCH_YEAR;
    const omdbSearchType = process.env.OMDB_SEARCH_TYPE;

    module.exports = {
        retrieveMovies: retrieveMovies,
        retrieveMovieDetail: retrieveMovieDetail,
    };

    /**
     * Request OMDBAPI in a loop because the endpoint only returns 10 records per one request. Therefore, using while
     * loop checking the total records e.g. 14 records then two api requests occurred
     * @returns {Promise<[]>}
     */
    async function retrieveMovies() {
        let page = 1;
        let moviesCount = 1;
        let pageRecordLimit = 10;
        let totalResultsPage = 1;

        const moviesList = [];

        while (page <= totalResultsPage) {
            const res = await axios(
                `${omdbBaseUrl}/?apikey=${omdbApiKey}&s=${omdbSearchTerm}&type=${omdbSearchType}&y=${omdbSearchYear}&page=${page}`
            );

            const movies = res.data;

            movies.Search.map((movie) => {
                const data = movieDataBinding(movie);
                moviesList.push(data);
            });

            page++;

            if (moviesCount <= movies.totalResults && movies.totalResults > pageRecordLimit) {
                moviesCount = pageRecordLimit * page
                totalResultsPage = pageRecordLimit * page / pageRecordLimit
            }
        }

        return moviesList;
    }

    /**
     * Retrieve movie detail from the OMDBAPI
     * @param imdbId
     * @returns {Promise<*>}
     */
    async function retrieveMovieDetail(imdbId) {
        const res = await axios(
            `${omdbBaseUrl}/?apikey=${omdbApiKey}&i=${imdbId}`
        );

        return filterMovieDetail(res.data);
    }

    /**
     * All movies data binding as per schema
     * @param movie
     * @returns {{image: (string|*), year: *, imdbId: *, title: *, type: Type}}
     */
    function movieDataBinding(movie) {
        return {
            "imdbId": movie.imdbID,
            "title": movie.Title,
            "year": movie.Year,
            "type": movie.Type,
            "image": movie.Poster === 'N/A' ? constants.defaultImage : movie.Poster,
        };
    }

    /**
     * Filter records and make it as per schema
     * @param movie
     * @returns {{actors: *, image: (string|*), year: *, plot: *, imdbId: *, director: *, rating: *, genre: *, votes: *, writer: *, title: *, type: Type}}
     */
    function filterMovieDetail(movie) {
        return {
            "imdbId": movie.imdbID,
            "title": movie.Title,
            "year": movie.Year,
            "type": movie.Type,
            "director": movie.Director,
            "writer": movie.Writer,
            "actors": movie.Actors,
            "plot": movie.Plot,
            "rating": movie.imdbRating,
            "votes": movie.imdbVotes,
            "genre": movie.Genre,
            "image": movie.Poster === 'N/A' ? constants.defaultImage : movie.Poster,
        };
    }
})();
