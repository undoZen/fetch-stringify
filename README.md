# fetch-stringify

With this module you could easily set body and proper headers when using fetch api.

## installation

```bash
npm i --save fetch-stringify
```

## usage

```js
require('fetch-polyfill'); //use IE8+ polyfill
require('fetch-stringify');
var qs = require('qs');
var qsStringify = function (body) { //default to use JSON.stringify if you didn't set this
    return {
        body: qs.stringify(body)
        type:  'application/x-www-form-urlencoded;charset=UTF-8'
    }
};
fetch('/echo', {
    method: 'POST',
    stringify: qsStringify,
    body: {hello: 'world'}
/* equals to
    method: 'POST',
    body: 'hello=world',
    headers: {
        'content-length': 11,
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
*/
}).then(function (response) {return response.json();})

// or set default function to fetch.stringify
fetch.stringify = qsStringify;
fetch('/echo', {
    method: 'POST',
    body: {hello: 'world'}
}).then(function (response) {/*...*/});
```

## license
MIT
