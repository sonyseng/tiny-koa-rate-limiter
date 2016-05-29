'use strict';

let limiter = require('./index.js');

describe('Tiny ip rate limiter middleware', function () {
    let koaContext, koaException;

    beforeEach(function() {
        // Mock out the koa generatorFn context
        koaException = null;
        koaContext = {
            request: { ip: '127.0.0.1' },
            throw: function (message, code) {
                koaException = {message: message, code: code};
            }
        };
    });

    it('throws koa exception when request count is reached', function () {
        let rateLimit = limiter({
            maxRequests: 3, interval: 999999999
        });

        // Since this is a generator function middleware, we have to simulate the next calls and also set
        // the context because koa uses it for shortcutting the request/response
        expect(koaException).toBeNull();

        rateLimit.call(koaContext).next();
        rateLimit.call(koaContext).next();
        rateLimit.call(koaContext).next();
        rateLimit.call(koaContext).next();

        expect(koaException.code).toEqual(429);
    });

    it('resets the count when time interval has passed', function () {
        let time = 0;
        let rateLimit = limiter({
            maxRequests: 3,
            interval: 3,
            currentTime: function () {
                return time;
            }
        });

        rateLimit.call(koaContext).next();
        rateLimit.call(koaContext).next();
        rateLimit.call(koaContext).next();

        time = time + 4;
        rateLimit.call(koaContext).next();
        rateLimit.call(koaContext).next();

        expect(koaException).toBeNull();
    });
});