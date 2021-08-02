(function () {
    'use strict';

    const constants = require("../config/constants");

    module.exports = {
        createIndex: createIndex,
        findAndUpdateIndex: findAndUpdateIndex,
        searchMovies: searchMovies,
        searchMovieById: searchMovieById,
    };

    /**
     * Index model and logging it
     * @param model
     */
    function createIndex(model) {
        model.on('es-indexed', function (err, res) {
            console.log("Model has been indexed!");
        });
    }

    /**
     * Find indexed result and update the entry inside the elastic search
     * @param model
     * @param data
     * @param objectId
     * @param modelData
     * @param resolve
     */
    function findAndUpdateIndex(model, data, objectId, modelData, resolve) {
        model.findOneAndUpdate(
            {_id: objectId},
            {
                director: data.director,
                plot: data.plot,
                rating: data.rating,
                votes: data.votes,
                genre: data.genre,
                writer: data.writer,
                actors: data.actors
            },
            {upsert: true, new: true},
            (err, res) => {
                if (err) console.log("ERROR", err);
                resolve(modelData);
            }
        );
    }

    /**
     * Search for all movies based on the search term which are indexed such as looking for text in title,
     * director or plot
     * @param query
     * @param model
     * @returns {Promise<unknown>}
     */
    function searchMovies(query, model) {
        let searchTerm = new RegExp(query.searchTerm,'gi');

        return new Promise(resolve => {
            model.find({
                $or: [ {title: searchTerm}, {director: searchTerm}, {plot: searchTerm} ]
            }, (err, results) => {
                if (err) console.log("ERROR", err);
                resolve(results);
            });
        });
    }

    /**
     * Search movies by imdbId from elastic search and the response will be one record because assuming imdbId from
     * OMDBAPI is unique
     * @param query
     * @param model
     * @returns {Promise<unknown>}
     */
    function searchMovieById(query, model) {
        return new Promise(resolve => {
            model.search({
                match: {
                    imdbId: query.imdbId,
                }
            }, {
                hydrate: true,
                hydrateOptions: {select: constants.selectSearchOptions}
            }, (err, results) => {
                if (err) console.log("ERROR", err);
                resolve(results.hits.hits);
            });
        });
    }
})();
