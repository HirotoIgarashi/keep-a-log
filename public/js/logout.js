/*
 * logout.js
 * logout機能
*/

'use strict';

import { sendXmlHttpRequest } from "./controlDom.js";

//--------------------- モジュールスコープ変数開始 -----------------
let request = null;
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- ユーティリティメソッド開始 -----------------
//--------------------- ユーティリティメソッド終了 -----------------

//--------------------- DOMメソッド開始 ----------------------------
const makeLogOutPage = () => {
  let frag = util.dom.createFragment();
  // -----divタグの作成 --------------------------------------------
  let divElement = util.dom.createElement('div');
  let h2Element = util.dom.createElement('h2');
  h2Element = util.dom.innerHTML(
    h2Element,
    'ログアウトします:'
  );

  // -----agreeボタンを生成 ---------------------------------------------
  let agreeButton = util.dom.createElement('button');
  util.dom.setAttribute(agreeButton, 'id', 'agree');
  util.dom.innerHTML(agreeButton, 'はい');

  // -----cancelボタンを生成 ---------------------------------------------
  let cancelButton = util.dom.createElement('button');
  util.dom.setAttribute(cancelButton, 'id', 'cancel');
  util.dom.innerHTML(cancelButton, 'キャンセル');

  // -----メッセージエリアを生成 -----------------------------------
  let messageArea = util.dom.createElement('div');
  util.dom.setAttribute(messageArea, 'id', 'message-area');

  // -----HTMLを組み立てる------------------------------------------
  util.dom.appendChild(divElement, h2Element);
  util.dom.appendChild(divElement, agreeButton);
  util.dom.appendChild(divElement, cancelButton);
  util.dom.appendChild(divElement, messageArea);

  util.dom.appendChild(frag, divElement);

  return frag;
};
//--------------------- DOMメソッド終了 ----------------------------

// --------------------- イベントハンドラ開始 ----------------------
const onClickAgree = function (event) {
  let requestType = 'GET';
  let url = '/session/delete';

  event.preventDefault();

  // XMLHttpRequestによる送信
  request = sendXmlHttpRequest(
    requestType,
    url,
    true,
    onReceiveLogout
  );
};

//------ Loginの結果の処理/開始 ------------------------------------
const onReceiveLogout = function () {
  const messageArea = document.getElementById('message-area');

  if ( request && request.readyState === 4 ) {
    if ( request.status === 200 ) {
      messageArea.textContent =
        'ログアウトしました。ステータス: ' + request.status;
      setTimeout( function () {
        pal.bom.setLocationHash('');
      }, 2000);
    }
    else {
      switch ( request.status ) {
        case 404:
          messageArea.textContent =
            'URLが存在しません。ステータス: ' + request.status;
          break;
        case 401:
          messageArea.textContent =
            'エラーが発生しました。ステータス: ' + request.status;
          break;
        case 500:
          messageArea.textContent =
            'サーバエラーが発生しました。ステータス: ' +
              request.status;
          break;
        default:
          messageArea.textContent =
            'エラーが発生しました。ステータス: ' + request.status;
      }
    }
  }
};
//------ Loginの結果の処理/終了 ------------------------------------

// キャンセルボタンクリックされたときの処理/開始
const onClickCancel = function () {
  pal.bom.setLocationHash('');
};
// キャンセルボタンクリックされたときの処理/終了
// --------------------- イベントハンドラ終了 ----------------------

// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/initModule/開始
// 目的: モジュールを初期化する
// 引数:
//  * $container この機能が使うjQuery要素
// 戻り値: true
// 例外発行: なし
//
export const logout = () => {
  const main_section = document.getElementById( 'pal-main' );

  // mainセクションの子要素をすべて削除する
  util.dom.emptyElement( main_section );

  main_section.appendChild(makeLogOutPage());

  const agreeButton = document.getElementById('agree');
  const cancelButton = document.getElementById('cancel');

  agreeButton.addEventListener('click', onClickAgree );
  cancelButton.addEventListener('click', onClickCancel );

  return true;

};
// パブリックメソッド/initModule/終了

// パブリックメソッドを返す
