'use strict';

// test環境を設定する
process.env.NODE_ENV = 'test';

const chai = require('chai');
// expect関数をロードする
const expect = chai.expect;
const chaiHTTP = require('chai-http');
// chaiにchaiHTTPを使うように指示する
chai.use(chaiHTTP);

// アプリケーションのメインモジュールをロードする
require('../app');

const port = '8001';
const url = 'http://localhost:' + port;

describe( "Keep a Log", function () {
  describe( "Get index /", function () {
    var
      url = 'http://localhost:' + port;

    it( "return status 200", function ( done ) {
      chai.request(url)
        .get('/')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

  });
  describe( "get /users", function () {

    it( "return status 200", function ( done ) {
      chai.request(url)
        .get('/users')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.equal(null);
          done();
        });
    });
  });

  describe('put /users/create', function() {

    it('return status 200', function(done) {
      chai.request(url)
        .get('/users/new')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(err).to.be.equal(null);
          done();
        });
      });
  });

  describe('get 404 Not Found', function() {

    it('return status 404', function(done) {
      chai.request(url)
        .get('/404NotFOUND')
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(err).to.be.equal(null);
          done();
        });
      });
  });

});
