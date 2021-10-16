// login.js
// login機能

'use strict';

import { setLocationHash } from "./controlDom.js";
import {
  createDocumentFragment, createElement, setAttribute,
  innerHTML, createLabelAndInput, appendChild,
  getElementById, emptyElement
} from "./utilDom.js";
import { createXMLHttpRequest, openXMLHttpRequest,setOnreadystatechange,
  setRequestHeader, sendPostRequest
} from "./utilAjax.js";

//--------------------- ユーティリティメソッド開始 -----------------
const makeLoginForm = () => {
  let frag = createDocumentFragment();
  // -----divタグの作成 --------------------------------------------
  let divElement = createElement('div');
  setAttribute(divElement, 'class', 'data-form');

  let h2Element = createElement('h2');
  h2Element = innerHTML(
    h2Element,
    'ログインする:'
  );

  // -----formタグの作成 -------------------------------------------
  let formElement = createElement('form');
  let passwordLabelAndInput = createLabelAndInput({
    'for': 'inputPassword',
    'innerHTML': 'パスワード',
    'type': 'password',
    'name': 'password',
    'id': 'inputPassword',
    'placeholder': 'パスワード',
    'required': true,
    'autofocus': false
  });

  // -----パスワードを表示するcheckboxとlabelを生成 ----------------
  let showPasswordCheckbox = createElement('input');
  setAttribute(showPasswordCheckbox, 'type', 'checkbox');
  setAttribute(showPasswordCheckbox, 'id', 'showPassword');
  let showPasswordLabel = createElement('label');
  innerHTML(showPasswordLabel, 'パスワードを表示');

  // -----パスワードのvalidate結果の表示エリアとinput --------------
  let inputPasswordResponse = createElement('div');

  // ----- Eメールのlabel ------------------------------------------
  let emailLabelAndInput = createLabelAndInput({
    'for': 'inputEmail',
    'innerHTML': 'Email address',
    'type': 'email',
    'name': 'email',
    'id': 'inputEmail',
    'placeholder': 'Email Address',
    'required': true,
    'autofocus': false
  });

  // -----Eメールのvalidate結果の表示エリア-------------------------
  let inputEmailResponse = createElement('div');

  // -----ボタンを生成 ---------------------------------------------
  let submitButton = createElement('button');
  setAttribute(submitButton, 'type', 'submit');
  setAttribute(submitButton, 'id', 'loginUser');
  innerHTML(submitButton, 'ログイン');

  // -----メッセージエリアを生成 -----------------------------------
  let messageArea = createElement('div');
  setAttribute(messageArea, 'id', 'message-area');

  // -----HTMLを組み立てる------------------------------------------
  appendChild(divElement, formElement);
  appendChild(formElement, h2Element);
  appendChild(formElement, emailLabelAndInput[0]);
  appendChild(formElement, emailLabelAndInput[1]);
  appendChild(formElement, inputEmailResponse);
  appendChild(formElement, passwordLabelAndInput[0]);
  appendChild(formElement, passwordLabelAndInput[1]);
  appendChild(formElement, inputPasswordResponse);
  appendChild(formElement, showPasswordCheckbox);
  appendChild(formElement, showPasswordLabel);
  appendChild(formElement, submitButton);
  appendChild(divElement, messageArea);
  appendChild(frag, divElement);

  return frag;
};
//--------------------- ユーティリティメソッド終了 -----------------

//--------------------- DOMメソッド開始 ----------------------------
//--------------------- DOMメソッド終了 ----------------------------

// --------------------- イベントハンドラ開始 ----------------------
// 例: onClickButton = function ( event ) {};
const onClickLogin = (event) => {
  let xhr;
  const requestType = 'POST';
  const url = '/session/create';
  const async = true;
  let formMap = {};

  event.preventDefault();

  // フォームから入力された値を取得する
  formMap.email = getElementById('inputEmail').value;
  formMap.password = getElementById('inputPassword').value;

  // --------------------- Loginの結果の処理 -------------------------
  const onReceiveLogin = function () {
    const messageArea = getElementById('message-area');
    const userInfo = getElementById('pal-dom-user-info');
    let response;

    if ( xhr && xhr.readyState === 4 ) {

      console.log(xhr.response);

      if (xhr.response) {
        response = JSON.parse(xhr.response);
      }

      if (xhr.status === 200) {
      // ----- ログインが成功したときの処理 ------------------------
        messageArea.removeAttribute( 'hidden' );
        messageArea.textContent = 'ログインしました。ステータス: ' + xhr.status;
        userInfo.innerHTML = response.email;

        setTimeout(() => {
          messageArea.setAttribute( 'hidden', 'hidden' );
          setLocationHash( '' );
        }, 2000);
      }
      else {
        messageArea.removeAttribute( 'hidden' );
        switch (xhr.status) {
          case 401:
            console.log(response);
            // messageArea.textContent =
            // 'E-mailアドレスかパスワードが不正です。ステータス: ' +
            // xhr.status;
            messageArea.textContent = `${response.message}`;
            break;
          case 500:
            messageArea.textContent =
              'サーバエラーが発生しました。ステータス: ' +
                xhr.status;
            break;
          default:
            messageArea.textContent =
              'エラーが発生しました。ステータス: ' + xhr.status;
        }
      }
    }
  };
  // --------------------- イベントハンドラ終了 ----------------------
  // XMLHttpRequestによる送信
  xhr = createXMLHttpRequest();
  // 受信した後の処理ほ登録する
  xhr = setOnreadystatechange(xhr, onReceiveLogin);
  // XMLHttpRequestオブジェクトが正しく生成された場合、リクエストをopenする
  xhr = openXMLHttpRequest(xhr, requestType, url, async);
  // POSTの場合はRequest Headerを設定する
  xhr = setRequestHeader(xhr, 'application/json');
  // リクエストを送信する
  xhr = sendPostRequest(xhr, JSON.stringify(formMap));
};


// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/login/開始
// 目的: モジュールを初期化する
// 引数:
//  * $container この機能が使うjQuery要素
// 戻り値: true
// 例外発行: なし
//
export const login = () => {
  const mainSection = getElementById('pal-main');

  // mainセクションの子要素をすべて削除する
  emptyElement(mainSection);

  //----- ログインフォームを表示する -------------------------------
  mainSection.appendChild(makeLoginForm());

  //----- パスワードを表示する機能を追加する -----------------------
  const password = getElementById('inputPassword');
  const showPassword = getElementById('showPassword');

  showPassword.addEventListener('change', () => {
    let type = showPassword.checked ? 'text' : 'password';
    password.setAttribute('type', type);
  });

  let login_button = getElementById('loginUser');

  login_button.addEventListener('click', onClickLogin);

  return true;

};
// パブリックメソッド/login/終了
