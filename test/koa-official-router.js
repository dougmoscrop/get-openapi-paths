'use strict';

const test = require('ava');
const Koa = require('koa');
const Router = require('@koa/router');

const info = require('..');

test.only('basic /', async t => {
    const app = new Koa();
    const router = new Router();

    router.get('/', Function.prototype);

    app.use(router.routes());
    
    const paths = await info(app);

    t.deepEqual(paths, {
        '/': {
            get: {},
            head: {}
        }
    });
});

test('basic /:id', async t => {
    const app = new Koa();
    const router = new Router();

    router.get('/:id', Function.prototype);

    app.use(router.routes());
    
    const paths = await info(app);

    t.deepEqual(paths, {
        '/{id}': {
            get: {},
            head: {}
        }
    });
});

test('nested routes', async t => {
    const app = new Koa();
    const router = new Router();

    router.get('/', Function.prototype);
    router.get('/foo', Function.prototype);

    app.use(router.routes());
    
    const paths = await info(app);

    t.deepEqual(paths, {
        '/': {
            get: {},
            head: {}
        },
        '/foo': {
            get: {},
            head: {}
        }
    });
});

test.only('nested routes (with .allowedMethods())', async t => {
    const app = new Koa();
    const router = new Router();

    router.get('/', Function.prototype);
    router.get('/foo', Function.prototype);

    app.use(router.routes());
    // not everyone includes this
    app.use(router.allowedMethods());
    
    const paths = await info(app);

    t.deepEqual(paths, {
        '/': {
            get: {},
            head: {}
        },
        '/foo': {
            get: {},
            head: {}
        }
    });
});

test('all methods', async t => {
    const app = new Koa();
    const router = new Router();

    router.all('/', Function.prototype);
    router.all('/foo', Function.prototype);

    app.use(router.routes());
    
    const paths = await info(app);

    const methods = Object.values(paths).reduce((memo, p) => {
        Object.keys(p).forEach(m => {
            memo.add(m);
        })
        return memo;
    }, new Set());

    // non-exhaustive
    t.true(methods.has('get'));
    t.true(methods.has('put'));
    t.true(methods.has('post'));
    t.true(methods.has('delete'));
    t.true(methods.has('options'));
    t.true(methods.has('head'));
});
