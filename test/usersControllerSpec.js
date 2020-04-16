'use strict';

/*eslint-env mocha, expect */

// test環境を設定する
process.env.NODE_ENV = 'test';

const chai = require('chai');
// expect関数をロードする
const expect = chai.expect;
const usersController = require('../controllers/usersController');
const chaiHTTP = require('chai-http');
// chaiにchaiHTTPを使うように指示する
chai.use(chaiHTTP);

// アプリケーションのメインモジュールをロードする
require('../app');

const testUserParam = {
  first: '五十嵐', last: '浩人', email: 'hiroto@gmail.com', password: 'hiroto3768', zipCode: '1350004'
};

const noFirstUserParam = {
  last: '浩人', email: 'hiroto@gmail.com', password: 'hiroto3768', zipCode: '1350004'
};

const noLastUserParam = {
  first: '五十嵐', email: 'hiroto@gmail.com', password: 'hiroto3768', zipCode: '1350004'
};

const noEmailUserParam = {
  first: '五十嵐',
  last: '浩人',
  password: 'hiroto3768',
  zipCode: '1350004'
};

const noZipCodeUserParam = {
  first: '五十嵐',
  last: '浩人',
  email: 'hiroto@gmail.com',
  password: 'hiroto3768'
};

const noPasswordUserParam = {
  first: '五十嵐',
  last: '浩人',
  email: 'hiroto@gmail.com', zipCode: '1350004'
};

const shortPasswordUserParam = {
  first: '五十嵐', last: '浩人', email: 'hiroto@gmail.com', password: 'hi', zipCode: '1350004'
};

const zipCodeSix = {
  first: '五十嵐', last: '浩人', email: 'test@gmail.com', password: 'hiroto3768', zipCode: '135000'
};

const zipCodeEight = {
  first: '五十嵐', last: '浩人', email: 'test@gmail.com', password: 'hiroto3768', zipCode: '13500008'
};

const zipCodeInvalid = {
  first: '五十嵐', last: '浩人', email: 'hiroto@gmail.com', password: 'hiroto3768', zipCode: 'abcdefg'
};

const invalidEmail = {
  first: '五十嵐', last: '浩人', email: 'hirotogmail.com', password: 'hiroto3768', zipCode: '1350004'
};

describe('usersControllerのテスト', () => {

  describe('ユーザモデルのcreateのテスト', () => {
    // itが終了されたあとに実行される
    afterEach((done) => {
      console.log('ユーザモデルのテストの終了');
      chai.request('http://localhost:8001')
        .get('/users')
        .then((res) => {
          // ahref="/users/以降の任意の単語文字[A-Za-z0-9_]を抜き出す
          let pattern = /href="\/users\/(\w+)"/g;
          let text = res.text;
          let result;

          while((result = pattern.exec(text)) != null) {
            chai.request('http://localhost:8001')
              .get('/users/' + result[1] + '/delete?_method=DELETE')
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res).to.redirectTo('http://localhost:8001/users');
                done();
              });
          }
        })
        .catch((err) => {
          throw err;
        });
      done();
    });

    it('ユーザ情報の登録が成功するはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(testUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users');
          done();
        })
    });

    it('姓がなくてもユーザ情報の登録が成功するはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(noFirstUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users');
          done();
        })
    });

    it('名がなくてもユーザ情報の登録が成功するはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(noLastUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users');
          done();
        })
    });

    it('eメールアドレスが重複しているので/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(testUserParam)
        // .end((err, res) => {
        .end(() => {
          chai.request('http://localhost:8001')
            .post('/users/create')
            .send(testUserParam)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res).to.redirectTo('http://localhost:8001/users/new');
              done();
            })
        });
    });

    it('emailがないため/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(noEmailUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('zipCodeがないため/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(noZipCodeUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('passwordがないため/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(noPasswordUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('passwordが5桁ないため/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(shortPasswordUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('zipCodeが6桁なので/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(zipCodeSix)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('zipCodeが8桁なので/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(zipCodeEight)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('zipCodeが数字じゃないので/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(zipCodeInvalid)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('Eメールが正しくないので/users/newが表示されるはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(invalidEmail)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });
  });

  describe('ユーザモデルのreadのテスト', () => {
    it('ユーザ情報の表示', (done) => {
      done();
    });
  });

  describe('ユーザモデルのupdateのテスト', () => {
    it('ユーザ情報の更新', (done) => {
      done();
    });
  });

  describe('ユーザモデルのdeleteのテスト', () => {
    it('ユーザ情報の削除', (done) => {
      done();
    });
  });

  describe('ユーザモデルのCRUDのテスト', () => {

    // ユーザインデックスアクションのテストを記述するブロック
    it('すべてのユーザをGETするはず /users', (done) => {
      // テストサーバにGETリクエストを出す
      chai.request('http://localhost:8001')
        .get('/users')
        // expectを実行するコールバックでリクエストを終える
        .end(function(err, res) {
          // アプリケーションのレスポンスデータが200になることを期待
          expect(res).to.have.status(200);
          // エラーがないことを期待
          expect(err).to.be.equal(null);
        });
      // テストにおけるサーバとのインタラクションを終了する
      done();
    });
  });


  describe('getUserParams', () => {

    it('fails, as expected', function(done) { // <= Pass in done callback
      chai.request('http://localhost:8001')
      .get('/')
      .end(function(err, res) {
        expect(res).to.have.status(200);
        expect(err).to.be.equal(null);
        done();                               // <= Call done to signal callback end
      });
    });

    // リクエスト本体の変換結果は、ユーザーオブジェクトのname属性を
    // 含むはず
    it('リクエスト本体の変換結果は、ユーザーオブジェクトのname属性を' +
      '含むはず', () => {
      // サンプルの入力
      const body = {
        first: 'John',
        last: 'Wexler',
        email: 'jon@jonwexler.com',
        password: 12345,
        zipCode: 10016
      };

      // 結果に含まれるべきオブジェクトを期待する
      expect(usersController.getUserParams(body))
        .to.deep.include({
          name: {
            first: 'John',
            last: 'Wexler',
          }
      });

    });

    // 入力のリクエスト本体が空のときは空のオブジェクトを返すはず
    it('入力のリクエスト本体が空のときは空のオブジェクトを返す', () => {
      const emptyBody = {};
      expect(usersController.getUserParams(emptyBody))
        .to.deep.include({});
    });

  });
});

