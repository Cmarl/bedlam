/*eslint no-unused-expressions: 0*/

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../lib/server');
var User = require('../../lib/models/user');
var Sinon = require('sinon');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

/*
before runs first - before test runs
thennn before each runs. runs before each test
--
after each - after each test
after - runs once after everything runs
*/

describe('authentication.js', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should have an empty token', function(done){
    server.plugins.authentication.authenticate.validateFunc({}, function(authErr, isAuth, credentials){
      expect(authErr).to.not.be.okay;
      expect(isAuth).to.not.be.okay;
      expect(credentials).to.not.be.okay;
      done();
    });
  });

  it('should have a valid issued at token', function(done){
    var iat = (Date.now() / 1000) - 5;
    server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(authErr, isAuth, credentials){
      expect(authErr).to.not.be.okay;
      expect(isAuth).to.be.okay;
      expect(credentials).to.be.okay;
      done();
    });
  });

  it('should cause a db error', function(done){
    var iat = (Date.now() / 1000) - 5;
    var stub = Sinon.stub(User, 'findOne').yields(new Error());
    server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(authErr, isAuth, credentials){
      expect(authErr).to.be.okay;
      expect(isAuth).to.not.be.okay;
      expect(credentials).to.not.be.okay;
      stub.restore();
      done();
    });
  });

  it('should find a user', function(done){
    var iat = (Date.now() / 1000) - 5;
    var stub = Sinon.stub(User, 'findOne').yields(null, {_id: 3});
    server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(authErr, isAuth, credentials){
      expect(authErr).to.not.be.okay;
      expect(isAuth).to.be.okay;
      expect(credentials._id).to.equal(3);
      stub.restore();
      done();
    });
  });
});
