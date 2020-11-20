# get-openapi-paths

This library tries to return paths from various frameworks for inclusion in an auto-generated OpenAPI specification

Supports:

- koa-router
- koa/router
- express
- connect (routes only, no methods)
- fastify

Does not support:

- koa-route


## Sample output

```js
const getPaths = require('get-openapi-paths');
const express = require('express');

const app = express();

app.get('/foo', ...);

const paths = getPaths(app);

/*
paths is:
{
    '/foo': {
        get: {}
    }
}
*/
```

## Prior Art

- https://github.com/serverless-components/express/commit/5cc5086f18ec9cf6480caf5cc5b9f676d7108cf2
- https://github.com/thenativeweb/get-routes/
- https://github.com/wesleytodd/express-openapi
- https://github.com/expressjs/express/issues/3308
- https://github.com/AlbertoFdzM/express-list-endpoints
