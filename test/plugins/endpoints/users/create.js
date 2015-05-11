/*eslint no-unused-expressions: 0*/

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('POST /users', function(){
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

  it('should find an existing user', function(done){
    server.inject({method: 'POST', url: '/users', credentials: {_id: 3}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.equal(3);
      done();
    });
  });

  it('should create a new user', function(done){
    server.inject({method: 'POST', url: '/users', credentials: {firebaseId: 33}}, function(response){
      expect(response.statusCode).to.equal(200);
      console.log(response.result);
      expect(response.result.toString().length).to.equal(24);
      done();
    });
  });
});
