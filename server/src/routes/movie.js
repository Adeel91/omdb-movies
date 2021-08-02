(function () {
    'use strict';

    const bodyParser = require('body-parser');
    const mongoSanitize = require('express-mongo-sanitize');
    const router = require('express').Router();

    router.use(bodyParser.urlencoded({
        extended: true
    }));
    router.use(bodyParser.json());
    router.use(mongoSanitize());

    const wrap = require('../config/middleware.js').controllerWrapper;
    const movieController = require('../controller/movieController');
    const helper = require('../helpers');

    const movieValidation = require('../validation/movieValidation');

    router.get('/movies', helper.any, wrap(null, movieController.RetrieveMovies));
    router.post('/movies', helper.any, wrap(null, movieController.SaveMovies));

    router.get('/movie/detail', helper.any, wrap(null, movieController.RetrieveMovieDetail));
    router.get('/movies/search', helper.any, wrap(movieValidation.SearchMovies, movieController.SearchMovies));

    module.exports = router;
})();
