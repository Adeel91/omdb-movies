(function () {
    'use strict';

    const movieModel = require('../schema/movie');
    const elasticsearch = require('../api/elasticsearch');

    module.exports = {
        FindOneByImdbId: FindOneByImdbId,
        FindOneByImdbIdCount: FindOneByImdbIdCount,
        FindAllMovies: FindAllMovies,
        SaveMovies: SaveMovies,
        updateMovieDetail: updateMovieDetail,
        SearchMovies: SearchMovies,
        SearchMovieByImdbId: SearchMovieByImdbId
    };

    async function FindOneByImdbId(id) {
        const query = movieModel.findOne({ 'imdbId': id });
        return await query.exec();
    }

    async function FindOneByImdbIdCount(id) {
        const query = movieModel.findOne({ 'imdbId': id }).countDocuments();
        return await query.exec();
    }

    async function FindAllMovies() {
        const query = movieModel.find();
        return await query.exec();
    }

    async function SaveMovies(data) {
        const movie = new movieModel(data);
        const movieData = await movie.save();

        elasticsearch.createIndex(movie);

        return movieData;
    }

    function updateMovieDetail(objectId, data) {
        return new Promise(resolve => {
            const movie = new movieModel(data);
            const movieData = movie.updateOne({_id: objectId}, data);

            elasticsearch.findAndUpdateIndex(movieModel, data, objectId, movieData, resolve);

            resolve(movieData);
        });
    }

    async function SearchMovies(query) {
        return await elasticsearch.searchMovies(query, movieModel);
    }

    async function SearchMovieByImdbId(query) {
        return await elasticsearch.searchMovieById(query, movieModel);
    }
})();
