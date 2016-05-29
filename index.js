// Simple IP based Request rate limiter. Sony Seng 2016

'use strict';

let requestTracker = {};
let config = {
    maxRequests: 1000,
    interval: 60*60*1000,

    // Allows time to be mocked and tested when it's exposed this way
    currentTime: function () {
        return new Date().getTime();
    }
};

function isRequestAllowed (ip) {
    let request = requestTracker[ip] = requestTracker[ip] || {count: 0, time: config.currentTime()};

    let timeDelta = config.currentTime() - request.time;
    if (timeDelta > config.interval) {
        request.count = 0;
        request.time = config.currentTime();
    }

    if (request.count < config.maxRequests) {
        request.count++;
        return true;
    }

    return false;
}

function *limitRequests (next) {
    let ip = this.request.ip;

    // Hopefully, you have middleware to handle exceptions, else you will not see anything
    if (!isRequestAllowed(ip)) {
        this.throw('Rate Limit Reached: ', 429);
    }

    yield next;
}

function limiter (c) {
    Object.assign(config, c);
    requestTracker = {};

    return limitRequests;
}

module.exports = limiter;