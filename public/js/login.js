// login.js
// login機能

'use strict';

import { sendXmlHttpRequest, setLocationHash } from "./controlDom.js";
import {
  createDocumentFragment, createElement, setAttribute,
  innerHTML, createLabelAndInput, appendChild,
  getElementById, emptyElement
} from "./utilDom.js";

  //--------------------- モジュールスコープ変数開始 -----------------
let request = null;
//--------------------- モジュールスコープ変数終了 -----------------

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
  const requestType = 'POST';
  const url = '/session/create';

  let form_map = {};

  event.preventDefault();

  // フォームから入力された値を取得する
  form_map.email = getElementById('inputEmail').value;
  form_map.password = getElementById('inputPassword').value;

  // XMLHttpRequestによる送信
  request = sendXmlHttpRequest(
    requestType,
    url,
    true,
    onReceiveLogin,
    JSON.stringify(form_map)
  );

};

// --------------------- Loginの結果の処理 -------------------------
const onReceiveLogin = function () {
  const message_area = getElementById('message-area');
  const userInfo = getElementById('pal-dom-user-info');
  let response;

  if ( request && request.readyState === 4 ) {

    console.log(request.response);

    if (request.response) {
      response = JSON.parse(request.response);
    }

    if (request.status === 200) {
    // ----- ログインが成功したときの処理 ------------------------

    message_area.removeAttribute( 'hidden' );
    message_area.textContent =
      'ログインしました。ステータス: ' + request.status;

      userInfo.innerHTML = response.email;

      setTimeout(() => {
        message_area.setAttribute( 'hidden', 'hidden' );
        setLocationHash( '' );
      }, 2000);
    }
    else {
      message_area.removeAttribute( 'hidden' );
      switch (request.status) {
        case 401:
          console.log(response);
          // message_area.textContent =
          // 'E-mailアドレスかパスワードが不正です。ステータス: ' +
          // request.status;
          message_area.textContent = `${response.message}`;
          break;
        case 500:
          message_area.textContent =
            'サーバエラーが発生しました。ステータス: ' +
              request.status;
          break;
        default:
          message_area.textContent =
            'エラーが発生しました。ステータス: ' + request.status;
      }
    }
  }
};

// --------------------- イベントハンドラ終了 ----------------------

// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/login/開始
// 目的: モジュールを初期化する
// 引数:
//  * $container この機能が使うjQuery要素
// 戻り値: true
// 例外発行: なし
//
export const login = () => {
  const main_section = getElementById( 'pal-main' );

  // mainセクションの子要素をすべて削除する
  emptyElement( main_section );

  //----- ログインフォームを表示する -------------------------------
  main_section.appendChild(makeLoginForm());

  //----- パスワードを表示する機能を追加する -----------------------
  const password = getElementById('inputPassword');
  const showPassword = getElementById( 'showPassword' );

  showPassword.addEventListener('change', () => {
    let type = showPassword.checked ? 'text' : 'password';
    password.setAttribute( 'type', type );
  });

  let login_button = getElementById('loginUser');

  login_button.addEventListener('click', onClickLogin);

  return true;

};
// パブリックメソッド/login/終了
