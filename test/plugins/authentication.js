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

describe('authentication.js', function(){
  it('should have an empty token', function(done){
    Server.init(function(serverErr, server){
      if(serverErr){throw serverErr; }

      server.plugins.authentication.authenticate.validateFunc({}, function(authErr, isAuth, credentials){
        expect(authErr).to.not.be.okay;
        expect(isAuth).to.not.be.okay;
        expect(credentials).to.not.be.okay;

        server.stop(function(){
          Mongoose.disconnect(done);
        });
      });
    });
  });

  it('should have a valid issued at token', function(done){
    Server.init(function(serverErr, server){
      if(serverErr){throw serverErr; }

      var iat = (Date.now() / 1000) - 5;
      server.plugins.authentication.authenticate.validateFunc({iat: iat, d: {uid: 'fake'}}, function(authErr, isAuth, credentials){
        expect(authErr).to.be.okay;
        expect(isAuth).to.be.okay;
        expect(credentials).to.be.okay;

        server.stop(function(){
          Mongoose.disconnect(done);
        });
      });
    });
  });
});
