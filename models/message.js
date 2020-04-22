'use strict';

const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const messageSchema = new Schema(
  {
    // 各メッセージの内容（必須）
    content: {
      type: String,
      required: true
    },
    // ユーザの名前（必須）
    userName: {
      type: String,
      required: true
    },
    // ユーザのID（必須）
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
// 各メッセージでタイムスタンプを保存
  },
  {timestamps: true}
);

module.exports = mongoose.model('Message', messageSchema);
