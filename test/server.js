var
  expect  = require( "chai" ).expect,
  request = require("request");

describe( "Keep a Log", function () {
  describe( "Get index /", function () {
    var
      url = "http://localhost:8000/";

    it( "return status 200", function ( done ) {
      request( url, function ( error, response, body ) {
        expect( response.statusCode ).to.equal( 200 );
        done();
      });
    });

  });
  describe( "get /users", function () {
    let
      url = "http://localhost:8000/users";

    it( "return status 200", function ( done ) {
      request( url, function ( error, response, body ) {
        expect( response.statusCode ).to.equal(200);
        done();
      });
    });
  });

  describe('put /users/create', function() {
    let url = 'http://localhost:8000/users/new';
    it('return status 200', function(done) {
      request(url, function(error, res, body) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });
});
