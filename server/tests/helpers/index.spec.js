(function () {
    'use strict';
    require('chai').should();
    const sinon = require('sinon');

    describe('Helpers Test', function () {
        const helper = require('../../src/helpers/index');

        describe('PromiseRemainingTime', function () {
            let start, clock;

            beforeEach(() => {
                start = new Date();
                clock = sinon.useFakeTimers(start);
            });

            afterEach(() => {
                clock.restore();
            });

            it('should wait until end time', (done) => {
                helper.PromiseRemainingTime(start.getTime(), 50).then(done);
                clock.tick(50);
            });

            it('should resolve if the time has already passed on dev', (done) => {
                clock.tick(51);
                helper.PromiseRemainingTime(start.getTime(), 50).then(done);
            });
        });
    });
})();
