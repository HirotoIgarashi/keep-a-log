// チャットコントローラの内容をエクスポートする
module.exports = io => {
  // 新しいユーザ接続を監視する
  io.on('connection', client => {
    console.log('new connection');

    // ユーザーの接続断を監視する
    client.on('disconnect', () => {
      console.log('user disconnected');
    });

    // カスタムメッセージイベントを監視する
    client.on('message', (data) => {
      // 受け取ったデータを全て集める
      let messageAttribute = {
        content: data.content,
        userName: data.userName,
        user: data.userId
      };

      // データをmessageイベントの内容として送出
      io.emit('message', messageAttribute);
    });
  });
};

