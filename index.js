'use strict';

const { posix } = require('path');

const methods = new Set([
    'get',
    'put',
    'post',
    'patch',
    'delete',
    'head',
    'options'
]);

module.exports = function info(app) {
    const paths = {};

    function regexception(regexp) {
        if (regexp && !regexp.fast_slash) {
            const match = regexp.toString()
                .replace('\\/?', '')
                .replace('(?=\\/|$)', '$')
                .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
            
            if (match) {
                return match[1].replace(/\\(.)/g, '$1');
            }
        }
    
        return '';
    }
    
    function pathify(paths, p) {
        return p === '/'
            ? posix.join(...paths)
            : posix.join(...paths, p);
    }

    function addRoute(m, p) {
        const methodLower = m.toLowerCase();
        const pathWithoutSlash = p.length > 1 && p.endsWith('/')
            ? p.slice(0, -1)
            : p;
        const pathWithParams = pathWithoutSlash.replace(/:([a-z_]+)/g, '{$1}');

        paths[pathWithParams] = paths[pathWithParams] || {};

        if (methodLower === 'any') {
            for (const value of methods) {
                paths[pathWithParams][value] = {};
            }
        } else if (methods.has(methodLower)) {
            paths[pathWithParams][methodLower] = {};
        }
    }

    function expressVisit(layer = {}, paths = ['/']) {
        const { stack = [], path } = layer;

        [].concat(stack).forEach(({ route, handle, method, regexp }) => {
            if (method && typeof method === 'string') {
                addRoute(method, pathify(paths, path));
                return;
            }

            if (route) {
                expressVisit(route, Array.from(paths));
                return;
            }

            const matched = regexception(regexp);
                    
            if (matched) {
                paths.push(matched);
            }

            expressVisit(handle, Array.from(paths));
        });
    }

    function koaVisit({ middleware = [] } = {}, paths = ['/']) {
        middleware.forEach(layer => {
            const { router = {} } = layer;
            const { stack = [] } = router;

            [].concat(stack).forEach(({ path, methods = [] }) => {
                [].concat(methods).forEach(method => {
                    addRoute(method, pathify(paths, path));
                });
            });
        });
    }

    function connectVisit({ stack = [], route = '' }, paths = []) {
        if (route) {
            paths.push(route);
        }

        [].concat(stack).forEach(layer => {
            if (typeof layer.handle === 'function') {
                if (typeof layer.route === 'string') {
                    addRoute('any', pathify(paths, layer.route));
                }

                connectVisit(layer, paths);
            }
        });
    }

    expressVisit(app._router);
    koaVisit(app);
    connectVisit(app);

    return paths;
};