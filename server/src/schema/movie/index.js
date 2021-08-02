(function () {
    'use strict';

    const mongoose = require('mongoose');
    const mongoosastic = require('mongoosastic');
    const Schema = mongoose.Schema;
    const constants = require('../../config/constants');
    const functions = require('./movie.functions');

    const movieSchema = new Schema(
        {
            _id: { type: Schema.Types.ObjectId, auto: true },
            imdbId: { type: Schema.Types.String, required: true, es_indexed: true },
            title: { type: Schema.Types.String, required: true, es_indexed: true },
            year: { type: Schema.Types.String, required: true },
            type: { type: Schema.Types.String, required: true },
            rating: { type: Schema.Types.String },
            votes: { type: Schema.Types.String },
            genre: { type: Schema.Types.String },
            director: { type: Schema.Types.String, es_indexed: true },
            writer: { type: Schema.Types.String },
            actors: { type: Schema.Types.String },
            plot: { type: Schema.Types.String, es_indexed: true },
            image: { type: Schema.Types.String, default: constants.defaultImage },
            schemaVersion: { type: Schema.Types.String, required: true, default: constants.schemaVersion },
        },
        { timestamps: true }
    );

    movieSchema.methods.updateVersionFromDBS = functions.updateVersionFromDBS;
    movieSchema.pre('validate', functions.preValidate);

    movieSchema.plugin(mongoosastic, {
        index: 'movies',
    });

    const Movie = mongoose.model('Movie', movieSchema, 'movies');

    Movie.createMapping((err, mapping) => {
        console.log('Elasticsearch mapping created');
    });

    module.exports = Movie;
})();
