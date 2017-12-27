var assert = require('assert');
var express = require('express');
var rp = require('request-promise');
var Eaglr = require('../index.js');

let eaglrToken, app_1_eaglr, app_2_eaglr;

const app_1 = express();
app_1.use(Eaglr());
app_1.get('/dummy-route', (req, res) => {
  eaglrToken = req.headers['eaglr-token'];
  app_1_eaglr = req.headers['eaglr-token'];
  rp({
    method: 'GET',
    uri: 'http://localhost:3302/dummy-route',
    headers: req.headers,
    resolveWithFullResponse: true
  })
  .then((response) => {
    res.send(response.body);
  })
})
let server_1 = app_1.listen(3301);

const app_2 = express();
app_2.use(Eaglr());
app_2.get('/dummy-route', (req, res) => {
  app_2_eaglr = req.headers['eaglr-token'];
  res.send(req.headers);
})
let server_2 = app_2.listen(3302);


describe('Test eaglr token is created and then propagated', () => {

  before('ping app_1', (done) => {
    rp({
      method: 'GET',
      uri: 'http://localhost:3301/dummy-route',
      resolveWithFullResponse: true
    })
    .then((res) => {
      console.log(res.body)
      done();
    })
  })

  after('kill all apps', (done) => {
    server_1.close()
    server_2.close()
    done()
  })

  it ('# eaglrToken is created', (done) => {
    assert.equal(!!eaglrToken, true);
    done();
  })

  it ('# app_1 receives the eaglr token', (done) => {
    assert.equal(app_1_eaglr, eaglrToken);''
    done();
  })

  it ('# app_2 receives the eaglr token', (done) => {
    assert.equal(app_2_eaglr, eaglrToken);
    done();
  })

})
