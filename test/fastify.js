'use strict';

// has to be required first to facilitate require-in-the-middle
const info = require('..');

const test = require('ava');
const fastify = require('fastify');

test('get /', async t => {
    const app = fastify();

    app.get('/', Function.prototype);

    const paths = await info(app);

    t.deepEqual(paths, {
        '/': {
            get: {},
        },
    });
});

test('get /:id', async t => {
    const app = fastify();

    app.get('/:id', Function.prototype);

    const paths = await info(app);

    t.deepEqual(paths,{
        '/{id}': {
            get: {},
        },
    });
});

test('get / put /:id', async t => {
    const app = fastify();

    app.get('/:id', Function.prototype);
    app.put('/:id', Function.prototype);

    const paths = await info(app);

    t.deepEqual(paths, {
        '/{id}': {
            get: {},
            put: {},
        },
    });
});

test('prefix', async t => {
    const app = fastify();

    app.register((instance, opts, next) => {
        instance.get('/',  Function.prototype);
        instance.post('/', Function.prototype);
    
        instance.get('/qwerty', Function.prototype);
      
        next()
      }, { prefix: 'asdf' });

    const paths = await info(app);

    t.deepEqual(paths, {
        '/asdf': {
            get: {},
            post: {},
        },
        '/asdf/qwerty': {
            get: {},
        },
    });
});
