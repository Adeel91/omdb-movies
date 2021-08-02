(function () {
    'use strict';
    const sinon = require('sinon');
    require('chai').should();
    const expect = require('chai').expect;

    describe('MovieService Test', function () {
        const mongoose = require('mongoose');
        const service = require('../../src/service/movieService');
        const movieModel = require('../../src/model/movieModel');

        describe('RetrieveAllConversations Test', () => {
            let movieModelStub;

            beforeEach(() => {
                movieModelStub = sinon.stub(movieModel, 'RetrieveMovies');
            });

            afterEach(() => {
                movieModelStub.restore();
            });

            it('should return movies', async () => {
                movieModelStub.resolves();

                try {
                    await service.RetrieveMovies();
                } catch (e) {
                    e.message.should.equal('movies does not exist');
                }

                movieModelStub.calledOnce.should.be.true;
            });
        });
    });
})();
