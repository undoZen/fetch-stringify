'use strict';

require('../../');
var tape = require('tape');
var qs = require('qs');

tape('json (default)', function (test) {
    test.plan(1);
    fetch('/post', {
        method: 'POST',
        body: {
            arr: [1,2,3,'中文']
        }
    }).then(function (response) {
        console.log(response.header);
        response.json().then(function (json) {
            test.deepEqual(json, {"arr":[1,2,3,"中文"]});
        })
    });
});

tape('qs', function (test) {
    test.plan(1);
    fetch('/post', {
        stringify: function (body) {
            return {
                body: qs.stringify(body, {arrayFormat: 'repeat'}),
                type: 'application/x-www-form-urlencoded;charset=UTF-8'
            };
        },
        method: 'POST',
        body: {
            arr: [1,2,3,'中文']
        }
    }).then(function (response) {
        console.log(response.header);
        response.text().then(function (text) {
            test.equal(text, 'arr=1&arr=2&arr=3&arr=%E4%B8%AD%E6%96%87');
        })
    });
});
