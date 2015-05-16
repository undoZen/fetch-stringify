'use strict';
if (!global.fetch) {
    throw(new Error('you want to enhance fetch but there is no fetch function, try use fetch-polyfill or node-fetch first.'));
}
var support = {
    blob: 'FileReader' in global && 'Blob' in global && (function() {
        try {
            new Blob();
            return true
        } catch(e) {
            return false
        }
    })(),
    formData: 'FormData' in global
}
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);
global.fetch = (function (f) {
    Object.keys(f).forEach(function (method) {
        fetch[method] = f[method];
    });
    return fetch;
    function fetch(url) {
        var opts = arguments[1];
        if (!opts ||
            !opts.body ||
            (opts.header && findHeader(opts.header, 'content-type')) ||
            typeof opts.body === 'string' ||
            typeof opts.body.pipe === 'function' || // for node-fetch
            (support.blob && Blob.prototype.isPrototypeOf(opts.body)) ||
            (support.formData && FormData.prototype.isPrototypeOf(opts.body))
        ) {
            return f.apply(this, arguments);
        }
        var stringify = fetch.stringify || opts.stringify || function (body) {
            return {
                body: JSON.stringify(body),
                type: 'application/json;charset=UTF-8'
            }
        };
        var stringified = stringify(opts.body);
        opts.body = stringified.body;
        opts.headers = opts.headers || {};
        opts.headers['content-type'] = stringified.type;
        opts.headers['content-length'] = Buffer.byteLength(stringified.body);
        var args = [url, opts].concat(slice(arguments, 2));
        return f.apply(this, args);
    }
}(fetch));
function findHeader(headers, name) {
    var k;
    for (k in headers) {
        if (!headers.hasOwnProperty(k)) continue;
        if (k.toLowerCase() === name) return k;
    }
    return null;
}
