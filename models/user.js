const mongoose = require('mongoose');
const {Schema} = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

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
  }
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

userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);
