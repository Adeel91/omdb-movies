(function () {
    'use strict';
    const sinon = require('sinon');
    require('chai').should();
    const expect = require('chai').expect;

    describe('MovieController Test', () => {
        const constants = require('../../src/config/constants');
        const controller = require('../../src/controller/movieController');
        const movieService = require('../../src/service/movieService');

        describe('RetrieveMovies Test', async () => {
            let movieServiceStub;

            beforeEach(() => {
                movieServiceStub = sinon.stub(movieService, 'RetrieveMovies');
            });

            afterEach(() => {
                movieServiceStub.restore();
            });

            it('should retrieve all movies', async () => {
                movieServiceStub.resolves([]);

                const resp = await controller.RetrieveMovies();

                movieServiceStub.calledOnce.should.be.true;
                expect(resp.status).to.equal(constants._2xx._200.status);
                expect(resp.content).to.deep.equal([]);
            });
        });
    });
})();
