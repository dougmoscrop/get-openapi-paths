'use strict';

const test = require('ava');
const express = require('express');

const info = require('..');

test('get /', async t => {
    const app = express();
 
    app.get('/', Function.prototype);
    
    const paths = await info(app);

    t.deepEqual(paths, {
      '/': {
        get: {},
      }
    });
});

test('get /:id', async t => {
  const app = express();

  app.get('/:id', Function.prototype);
  
  const paths = await info(app);

  t.deepEqual(paths, {
    '/{id}': {
      get: {},
    }
  });
});

test('get /:quoteID', async t => {
  const app = express();

  app.get('/:quoteID', Function.prototype);

  const paths = await info(app);

  t.deepEqual(paths, {
    '/{quoteID}': {
      get: {},
    }
  });
});

test('nested paths', async t => {
  const app = express();

  app.get('/', Function.prototype);
  app.get('/:id', Function.prototype);
  
  const paths = await info(app);

  t.deepEqual(paths, {
    '/': {
      get: {},
    },
    '/{id}': {
      get: {},
    }
  });
});

test('chain style', async t => {
  const app = express();

  app.route('/')
    .get(Function.prototype)
    .post(Function.prototype);

    const paths = await info(app);

  t.deepEqual(paths, {
    '/': {
      get: {},
      post: {},
    },
  });
});

test('mounted router', async t => {
  const app = express();
  const router = express.Router();

  router.get('/', Function.prototype);
  router.get('/bar', Function.prototype);

  app.use('/foo', router);

  const paths = await info(app);

  t.deepEqual(paths, {
    '/foo': {
      get: {},
    },
    '/foo/bar': {
      get: {},
    },
  });
});

test('nested router with no routes defined', async t => {
  const app = express();
  const router = express.Router();
  const nestedRouter = express.Router();

  router.get('/', Function.prototype);
  router.get('/bar', Function.prototype);
  router.use('/baz', nestedRouter);

  app.use('/foo', router);

  const paths = await info(app);

  t.deepEqual(paths, {
    '/foo': {
      get: {},
    },
    '/foo/bar': {
      get: {},
    },
  });
});
