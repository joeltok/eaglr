var assert = require('assert');
var express = require('express');
var rp = require('request-promise');
var Eaglr = require('../index.js');


function startServers(express, Eaglr, eaglrOptions1, eaglrOptions2) {

	let app1 = express();
	app1.use(Eaglr(eaglrOptions1));
	app1.get('/dummy-route', (req, res) => {
		container.app1Req = req;
		rp({
			method: 'GET',
			uri: 'http://localhost:3302/dummy-route',
			headers: req.headers,
			resolveWithFullResponse: true
		})
			.then((response) => {
				res.send(response.body);
			});
	});
	let server1 = app1.listen(3301);

	let app2 = express();
	app2.use(Eaglr(eaglrOptions2));
	app2.get('/dummy-route', (req, res) => {
		container.app2Req = req;
		res.send(req.headers);
	});
	let server2 = app2.listen(3302);

	let container = {
		app1Req: undefined,
		app2Req: undefined,
		server1: server1,
		server2: server2,
		closeServers: () => {
			server1.close();
			server2.close();
		}
	};

	return container;
}

function ping(done) {
	return rp({
		method: 'GET',
		uri: 'http://localhost:3301/dummy-route',
		resolveWithFullResponse: true
	})
		.then(() => {
			done();
		});
}

describe('Test default eaglr token is created and then propagated', () => {

	let container;

	before('spin up servers', (done) => {
		container = startServers(express, Eaglr, undefined, undefined);
		done();
	});

	before('ping app1', (done) => {
		ping(done);
	});

	after('kill all apps', (done) => {
		container.closeServers();
		done();
	});

	it ('# eaglr token is created in app1', (done) => {
		assert.equal(!!container.app1Req.headers['eaglr-token'], true);
		done();
	});

	it ('# app2 receives the eaglr token from app1', (done) => {
		assert.equal(container.app2Req.headers['eaglr-token'], container.app1Req.headers['eaglr-token']);
		done();
	});

});

describe('Test that header and prefix options work', () => {

	let container;

	before('spin up servers', (done) => {
		let options1 = {
			header: 'test-header',
			prefix: 'indigo-'
		};
		let options2 = {
			header: 'test-header',
			prefix: 'indigo-'
		};
		container = startServers(express, Eaglr, options1, options2);
		done();
	});

	before('ping app1', (done) => {
		ping(done);
	});

	after('kill all apps', (done) => {
		container.closeServers();
		done();
	});

	it ('# test-header is created in app1', (done) => {
		assert.equal(!!container.app1Req.headers['test-header'], true);
		done();
	});

	it ('# test-header starts with indigo-', (done) => {
		let prefix = container.app1Req.headers['test-header'].split('-')[0].concat('-');
		assert.equal(prefix, 'indigo-');
		done();
	});

	it ('# app2 receives the test-header token from app1', (done) => {
		assert.equal(container.app2Req.headers['test-header'], container.app1Req.headers['test-header']);
		done();
	});

});

describe('Test that if second app has a different custom header, it will create that one instead of using the eaglr header from the first app', () => {

	let container;

	before('spin up servers', (done) => {
		container = startServers(express, Eaglr, undefined, {header: 'custom-header'});
		done();
	});

	before('ping app1', (done) => {
		ping(done);
	});

	after('kill all apps', (done) => {
		container.closeServers();
		done();
	});

	it ('# eaglrToken is created in app1', (done) => {
		assert.equal(!!container.app1Req.headers['eaglr-token'], true);
		done();
	});

	it ('# app2 receives the eaglr token from app1', (done) => {
		assert.equal(container.app2Req.headers['eaglr-token'], container.app1Req.headers['eaglr-token']);
		done();
	});

	it ('# but app2 also creates its own custom eaglr token', (done) => {
		assert.equal(!!container.app2Req.headers['custom-header'], true);
		done();
	});

});
