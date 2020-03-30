const mongoose = require('mongoose');
const {Schema} = mongoose;

// bcryptをロード
const bcrypt = require('bcrypt');

// ユーザのスキーマを作る
var userSchema = new Schema({
  // ファーストネームとラストネームのプロパティ
  name: {
    first: {
      type: String,
      trim: true
    },
    last: {
      type: String,
      trim: true
    }
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  zipCode: {
    type: Number,
    required: true,
    trim: true
  },
  // パスワードのプロパティを追加
  password: {
    type: String,
    required: true
  },
}, {
  // createAtとupdateAtの日時を記録する
  // タイムスタンププロパティを追加
  timestamps: true
});

// ユーザのフルネームを取得する仮想属性を追加
userSchema.virtual('fullName')
  .get(function() {
    return `${this.name.first} ${this.name.last}`;
  });

// ユーザスキーマにpreフックを追加
userSchema.pre('save', function(next) {
  const saltRounds = 10;

  let user = this;

  // ユーザのパスワードにハッシュをかける
  bcrypt.hash(user.password, saltRounds)
    .then(hash => {
      user.password = hash;
      next();
    })
    .catch(error => {
      console.error(`パスワードのハッシュ化に失敗しました: ${error.message}`);
      next(error);
    });
});

// ハッシュをかけたパスワード2つを比較する関数
userSchema.methods.passwordComparison = function(inputPassword) {
  let user = this;

  console.log('inputPasswor: ' + inputPassword);
  console.log('user.password: ' + user.password);

  // このユーザのパスワードと保存されているパスワードを比べる
  // return bcrypt.compare(inputPassword, user.pssword);
  return bcrypt.compare(inputPassword, user.password)
          .then(result => {
            console.log('result: ' + result);
            return result;
          })
          .catch(error => {
            console.log('error: ' + error.message);
          });
};

module.exports = mongoose.model('User', userSchema);
