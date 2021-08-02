(function () {
    'use strict';

    const movieModel = require('../model/movieModel');
    const omdbApi = require('../api/omdb');

    const movieValidation = require('../validation/movieValidation');

    module.exports = {
        RetrieveMovies: RetrieveMovies,
        RetrieveMovieDetail: RetrieveMovieDetail,
        SaveMovies: SaveMovies,
        SearchMovies: SearchMovies
    };

    /**
     * Retrieve all movies stored in the database, if not exist in DB then store them
     * @returns {Promise<Array<EnforceDocument<unknown, {}>>>}
     * @constructor
     */
    async function RetrieveMovies() {
        const movies = await movieModel.FindAllMovies();

        if (!movies.length) {
            SaveMovies().then(r => r);
        }

        return movies;
    }

    /**
     * Retrieve detailed info of a movie by checking the existence in DB by imdbId then fetch movie detail from
     * elastic search and also update the elastic search index
     * @param req
     * @returns {Promise<unknown>}
     * @constructor
     */
    async function RetrieveMovieDetail(req) {
        const movie = await movieModel.FindOneByImdbId(req.query.imdbId);
        const searchedMovie = await movieModel.SearchMovieByImdbId(movie);

        if (!searchedMovie[0].plot) {
            const movieDetail = await omdbApi.retrieveMovieDetail(req.query.imdbId);

            await movieModel.updateMovieDetail(movie._id, movieDetail);

            return movieDetail;
        }

        return searchedMovie;
    }

    /**
     * Fetch movies from the OMDBAPI and save them into the database
     * @returns {Promise<*[]>}
     * @constructor
     */
    async function SaveMovies() {
        return omdbApi.retrieveMovies().then(movies => {
            return movies.filter((movie) => {
                const validate = movieValidation.SaveMovies(movie);

                if (!validate.length) {
                    return (
                        movieModel.FindOneByImdbIdCount(movie.imdbId).then(async (item) => {
                            if (!item) {
                                return await movieModel.SaveMovies(movie);
                            }
                        })
                    )
                }
            });
        });
    }

    /**
     * Search movies from elastic search index
     * @param req
     * @returns {Promise<unknown>}
     * @constructor
     */
    async function SearchMovies(req) {
        return await movieModel.SearchMovies(req.query);
    }
})();
