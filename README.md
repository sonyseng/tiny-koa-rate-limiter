# tiny-koa-rate-limiter
This is a tiny middleware library for koa 1.x applications to limit ANY requests by ip

## Example

```js
const app = require('koa')();
const limiter = require('./middleware/limiter');

app.use(function *errorHandler (next) {
    try {
        yield next;
    } catch (e) {
        this.status = e.status;
        this.body = { code: e.status, message: e.message };
    }
});

// Allow 100 requests from the same IP address for every hour.
// An exception will be thrown setting HTTP Status to 429
app.use(limiter({maxRequests: 100, interval: 60*60**1000}));

app.listen(process.env.PORT);
```

## Execute Tests
To run the tests, type:
```js
npm test
```
