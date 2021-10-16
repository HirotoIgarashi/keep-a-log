/*
 * logout.js
 * logout機能
*/

'use strict';

import { setLocationHash } from "./controlDom.js";
import {
  createDocumentFragment, createElement, innerHTML,
  setAttribute, appendChild, getElementById,
  emptyElement
} from "./utilDom.js";
import { createXMLHttpRequest, openXMLHttpRequest,setOnreadystatechange,
  // setRequestHeader,
  sendGetRequest
} from "./utilAjax.js";
//--------------------- モジュールスコープ変数開始 -----------------
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- ユーティリティメソッド開始 -----------------
//--------------------- ユーティリティメソッド終了 -----------------

//--------------------- DOMメソッド開始 ----------------------------
const makeLogOutPage = () => {
  let frag = createDocumentFragment();
  // -----divタグの作成 --------------------------------------------
  let divElement = createElement('div');
  let h2Element = createElement('h2');
  h2Element = innerHTML(h2Element, 'ログアウトします:');

  // -----agreeボタンを生成 ---------------------------------------------
  let agreeButton = createElement('button');
  setAttribute(agreeButton, 'id', 'agree');
  innerHTML(agreeButton, 'はい');

  // -----cancelボタンを生成 ---------------------------------------------
  let cancelButton = createElement('button');
  setAttribute(cancelButton, 'id', 'cancel');
  innerHTML(cancelButton, 'キャンセル');

  // -----メッセージエリアを生成 -----------------------------------
  let messageArea = createElement('div');
  setAttribute(messageArea, 'id', 'message-area');

  // -----HTMLを組み立てる------------------------------------------
  appendChild(divElement, h2Element);
  appendChild(divElement, agreeButton);
  appendChild(divElement, cancelButton);
  appendChild(divElement, messageArea);

  appendChild(frag, divElement);

  return frag;
};
//--------------------- DOMメソッド終了 ----------------------------

// --------------------- イベントハンドラ開始 ----------------------
const onClickAgree = (event) => {
  let xhr;
  const requestType = 'GET';
  const url = '/session/delete';
  const async = true;

  event.preventDefault();

  //------ Logout処理/開始 ------------------------------------
  const onReceiveLogout = function () {
    const messageArea = getElementById('message-area');

    if (xhr && xhr.readyState === 4) {
      if (xhr.status === 200) {
        messageArea.textContent = `ログアウトしました。ステータス: ${xhr.status}`;
        setTimeout(() => setLocationHash(''), 1500);
      }
      else {
        switch (xhr.status) {
          case 404:
            messageArea.textContent =
              `URLが存在しません。ステータス: ${xhr.status}`;
            break;
          case 401:
            messageArea.textContent =
              `エラーが発生しました。ステータス: ${xhr.status}`;
            break;
          case 500:
            messageArea.textContent =
              `サーバエラーが発生しました。ステータス: ${xhr.status}`;
            break;
          default:
            messageArea.textContent =
              `エラーが発生しました。ステータス: ${xhr.status}`;
        }
      }
    }
  };
  //------ Logout処理/終了 ------------------------------------

  // XMLHttpRequestオブジェクトのインスタンスを生成する
  xhr = createXMLHttpRequest();
  // 受信した後の処理ほ登録する
  xhr = setOnreadystatechange(xhr, onReceiveLogout);
  // XMLHttpRequestオブジェクトが正しく生成された場合、リクエストをopenする
  xhr = openXMLHttpRequest(xhr, requestType, url, async);
  // xhr = setRequestHeader(xhr, 'application/json');
  // リクエストを送信する
  xhr = sendGetRequest(xhr);
};


// キャンセルボタンクリックされたときの処理/開始
const onClickCancel = function () {
  setLocationHash('');
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
  const mainSection = getElementById( 'pal-main' );

  // mainセクションの子要素をすべて削除する
  emptyElement( mainSection );

  mainSection.appendChild(makeLogOutPage());

  const agreeButton = getElementById('agree');
  const cancelButton = getElementById('cancel');

  agreeButton.addEventListener('click', onClickAgree );
  cancelButton.addEventListener('click', onClickCancel );

  return true;
};
// パブリックメソッド/initModule/終了

// パブリックメソッドを返す
