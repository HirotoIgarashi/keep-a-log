'use strict';

/*
 * pal.chat.js
 * chat機能
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global io $ pal*/

'use strict';

pal.chat = (() => {
  //--------------------- モジュールスコープ変数開始 -----------------
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- パブリックメソッド開始 --------------------
  // initModule開始 --------------------------------------------------
  // 目的: モジュールを初期化する
  // 引数: なし
  // 戻り値: true
  // 例外発行: なし
  //
  const initModule = () => {
    // クライアントサイドでsocket.ioを初期化
    const socket = io();

    // フォームが送出されたときにイベントを発行 ----------------------
    $('#chatForm').submit(() => {
      // ビューの入力フォームからテキストを取り込み、
      let text = $('#chat-input').val(),
        // ユーザの名前とIDを取り込む
        userName = $('#chat-user-name').val(),
        userId = $('#chat-user-id').val();
      // メッセージの内容とユーザデータを含むイベントをサーバーに送出
      socket.emit('message', {
        content: text,
        userName: userName,
        userId: userId
      });
      $('#chat-input').val('');
      return false;
    });

    // イベントを監視し、チャットボックスに記入 ----------------------
    socket.on('message', message => {
      displayMessage(message);
      // アイコンのアニメーションを行う ------------------------------
      for (let i = 0; i < 2; i++) {
        $('.chat-icon').fadeOut(200).fadeIn(200);
      }
    });

    // load all messageイベントの処理で、届いたデータを解析する ------
    socket.on('load all messages', (data) => {
      data.forEach(message => {
        // それぞれのメッセージをdisplayMessageに渡して
        // チャットボックスに表示させる
        displayMessage(message);
      });
    });

    // user disconnectedイベントを監視してカスタムメッセージを表示 ---
    socket.on('user disconnected', () => displayMessage(
      {
       userName: 'Notice',
       content: 'User left the chat'
      })
    );

    // displayMessage開始 --------------------------------------------
    let displayMessage = (message) => {
      $('#chat').prepend(
        // メッセージの内容とともにユーザー名をチャットボックスに表示
        $('<li>').html(`
<strong class="message ${getCurrentUserClass(message.user)}">
${message.userName}
</strong>:
${message.content}
`)
      );
    };
    // displayMessage終了 --------------------------------------------

    // getCurrentUserClass開始 ---------------------------------------
    let getCurrentUserClass = (id) => {
      let userId = $('#chat-user-id').val();

      // メッセージのユーザーIDはフォームのユーザーIDと同じか？
      return userId === id ? 'current-user': '';
    };
    // getCurrentUserClass終了 ---------------------------------------
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    initModule    : initModule
  };
  // initModule終了 --------------------------------------------------
  // --------------------- パブリックメソッド終了 --------------------
})();
