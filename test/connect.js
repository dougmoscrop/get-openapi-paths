'use strict';

const test = require('ava');
const connect = require('connect');

const info = require('..');

test('get /', async t => {
    const app = connect();
 
    app.use('/', Function.prototype);
    
    const paths = await info(app);

    t.deepEqual(paths, {
      '/': {
        delete: {},
        get: {},
        head: {},
        options: {},
        post: {},
        put: {},
        patch: {},
      },
    });
});

test('get /:id', async t => {
  const app = connect();

  app.use('/:id', Function.prototype);
  
  const paths = await info(app);

  t.deepEqual(paths, {
    '/{id}': {
      delete: {},
      get: {},
      head: {},
      options: {},
      post: {},
      put: {},
      patch: {},
    },
  });
});

test('nested paths', async t => {
  const app = connect();

  app.use('/', Function.prototype);
  app.use('/:id', Function.prototype);
  
  const paths = await info(app);

  t.deepEqual(paths, {
    '/': {
      delete: {},
        get: {},
        head: {},
        options: {},
        post: {},
        put: {},
        patch: {},
    },
    '/{id}': {
      delete: {},
        get: {},
        head: {},
        options: {},
        post: {},
        put: {},
        patch: {},
    },
  });
});
