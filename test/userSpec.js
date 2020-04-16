/*eslint-env mocha, expect */

// test環境を設定する
process.env.NODE_ENV = 'test';

// 必要なモジュールをロードする
const User = require('../models/user');

// chai.expect関数を定数に代入
const {expect} = require('chai');

require('../app');

// それぞれのテストを行う前にデータベースから全ユーザを消去する
beforeEach((done) => {
  User.deleteMany({})
  // User.deleteMany({})
    .then(() => {
      done();
    });
});

// ユーザの保存に関する一連のテストの記述
describe('ユーザを保存', () => {
  // 1人のユーザの保存をテストする
  it('it should save one user', (done) => {
    let testUser = new User({
      name: {
        first: 'John',
        last: 'Wexler'
      },
      email: 'Jon@jonwexler.com',
      password: 12345,
      zipCode: 10016
    });

    // サンプルコードでユーザを1人保存した後、
    testUser.save()
      .then(() => {
        User.find({})
          .then(users => {
          // IDを持つ1人のユーザがデータベースにあることを期待
          expect(users.length).to.equal(1);
          expect(users[0]).to.have.property('_id');
          // doneの呼び出しでプロミスのテストを完了させる
          done();
        });
      })
  });
});

after((done) => {
  process.exit();
  console.log('サーバーを停止しました。');
  done();
});
