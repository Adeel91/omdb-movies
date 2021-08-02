(function () {
    'use strict';
    const sinon = require('sinon');
    require('chai').should();

    describe('movieModel Test', function () {
        const model = require('../../src/model/movieModel');
        const movies = require('../../src/schema/movie/index');

        describe('FindOneById', () => {
            let schemaStub, query;

            beforeEach(() => {
                schemaStub = sinon.stub(movies, 'FindAllMovies').returns();
            });

            afterEach(() => {
                schemaStub.restore();
            });

            it('should find one by imdbId', async () => {
                const id = 'tt0167360';
                await model.FindOneByImdbId(id);

                schemaStub.calledOnce.should.be.true;
                query.exec.calledOnce.should.be.true;
            });
        });
    });
})();
