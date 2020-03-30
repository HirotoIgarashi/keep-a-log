'use strict';

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
  first: '五十嵐', last: '浩人', email: 'hiroto@gmail.com', zipCode: '1350004'
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
                // console.log(err);
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

    it('eメールアドレスの重複でユーザの登録が失敗するはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(testUserParam)
        .end((err, res) => {
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

    it('emailがないためユーザの登録が失敗するはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(noEmailUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('zipCodeがないためユーザの登録が失敗するはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(noZipCodeUserParam)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).to.redirectTo('http://localhost:8001/users/new');
          done();
        });
    });

    it('passwordがないためユーザの登録が失敗するはず', (done) => {
      chai.request('http://localhost:8001')
        .post('/users/create')
        .send(noPasswordUserParam)
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
        .end(function(errors, res) {
          // アプリケーションのレスポンスデータが200になることを期待
          expect(res).to.have.status(200);
          // エラーがないことを期待
          expect(errors).to.be.equal(null);
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

