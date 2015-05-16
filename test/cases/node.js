'use strict';
var http = require('http');
var tape = require('tape');
var qs = require('qs');
global.fetch = require('node-fetch');
require('../../');

var rawBody = require('raw-body');
var server = http.createServer(function (req, res) {
    console.log(req.headers);
    rawBody(req, {length: req.headers['content-length']}, function (err, buf) {
        console.log(arguments);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        if (err) return res.end(err.toString());
        console.log(buf.length, buf.toString());
        res.end(buf.toString());
    });
})
var address = server.listen().address();
console.log(address);

tape('json (default)', function (test) {
    test.plan(1);
    fetch('http://127.0.0.1:' + address.port, {
        method: 'POST',
        body: {
            arr: [1,2,3,'中文']
        }
    }).then(function (response) {
        console.log(response.header);
        response.text().then(function (text) {
            test.equal(text, '{"arr":[1,2,3,"中文"]}');
        })
    });
});

tape('qs', function (test) {
    test.plan(1);
    fetch('http://127.0.0.1:' + address.port, {
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

tape('qs global', function (test) {
    test.plan(1);
    fetch.stringify = function (body) {
        return {
            body: qs.stringify(body, {arrayFormat: 'repeat'}),
            type: 'application/x-www-form-urlencoded;charset=UTF-8'
        };
    };
    fetch('http://127.0.0.1:' + address.port, {
        method: 'POST',
        body: {
            arr: [1,2,3,'中文']
        }
    }).then(function (response) {
        console.log(response.header);
        response.text().then(function (text) {
            test.equal(text, 'arr=1&arr=2&arr=3&arr=%E4%B8%AD%E6%96%87');
            server.close();
        })
    });
});
