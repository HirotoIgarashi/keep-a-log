/*eslint-env mocha, expect */

const expect  = require( "chai" ).expect;

describe( "bcrypt test", function () {
  describe( "hash and compare", function () {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const myPlaintextPassword = 's0//Pr$$worD';
    let hashed;

    it('hash and compare', function (done) {

      bcrypt.genSalt(saltRounds, function(err, salt) {

        bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
          hashed = hash;

          expect(err).to.equal(undefined);

          bcrypt.compare(myPlaintextPassword, hashed, function(err, result) {
            expect(err).to.equal(undefined);
            expect(result).to.be.true;

          });
        });
      });
      done();
    });

  });
});
