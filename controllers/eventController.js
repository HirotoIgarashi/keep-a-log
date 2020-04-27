'use strict';

// const Message = require('../models/message.js');

// チャットコントローラの内容をエクスポートする ----------------------
module.exports = io => {
  // 新しいユーザ接続を監視する --------------------------------------
  io.on('connection', client => {
    console.log('new connection');
    // Message.find({})
    //   .sort({createdAt: -1})
    //   .limit(10)
    //   // 新しいソケットだけに10個まで最新メッセージを送る
    //   // カスタムイベント
    //   .then(messages => {
    //     client.emit('load all messages', messages.reverse());
    //   });

    // ユーザーの接続断を監視する ------------------------------------
    client.on('disconnect', () => {
      // 接続中の他の全てのユーザにブロードキャストする --------------
      client.broadcast.emit('user disconnected');
      console.log('user disconnected');
    });

    // // カスタムメッセージイベントを監視する --------------------------
    // client.on('message', (data) => {
    //   // 受け取ったデータを全て集める
    //   let messageAttributes = {
    //     content: data.content,
    //     userName: data.userName,
    //     user: data.userId
    //   };
    //   let m = new Message(messageAttributes);

    //   // メッセージを保存する ----------------------------------------
    //   m.save()
    //     .then(() => {
    //       // 保存に成功したらメッセージの値を送出
    //       io.emit('message', messageAttributes);
    //     })
    //     .catch(error => console.log(`error: ${error.message}`));
    // });
  });
};

