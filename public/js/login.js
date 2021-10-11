// login.js
// login機能

'use strict';

import { sendXmlHttpRequest } from "./controlDom.js";

  //--------------------- モジュールスコープ変数開始 -----------------
let request = null;
//--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
const makeLoginForm = () => {
  let frag = util.dom.createFragment();
  // -----divタグの作成 --------------------------------------------
  let divElement = util.dom.createElement('div');
  util.dom.setAttribute(divElement, 'class', 'data-form');

  let h2Element = util.dom.createElement('h2');
  h2Element = util.dom.innerHTML(
    h2Element,
    'ログインする:'
  );

  // -----formタグの作成 -------------------------------------------
  let formElement = util.dom.createElement('form');
  let passwordLabelAndInput = util.dom.createLabelAndInput({
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
  let showPasswordCheckbox = util.dom.createElement('input');
  util.dom.setAttribute(showPasswordCheckbox, 'type', 'checkbox');
  util.dom.setAttribute(showPasswordCheckbox, 'id', 'showPassword');
  let showPasswordLabel = util.dom.createElement('label');
  util.dom.innerHTML(showPasswordLabel, 'パスワードを表示');

  // -----パスワードのvalidate結果の表示エリアとinput --------------
  let inputPasswordResponse = util.dom.createElement('div');

  // ----- Eメールのlabel ------------------------------------------
  let emailLabelAndInput = util.dom.createLabelAndInput({
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
  let inputEmailResponse = util.dom.createElement('div');

  // -----ボタンを生成 ---------------------------------------------
  let submitButton = util.dom.createElement('button');
  util.dom.setAttribute(submitButton, 'type', 'submit');
  util.dom.setAttribute(submitButton, 'id', 'loginUser');
  util.dom.innerHTML(submitButton, 'ログイン');

  // -----メッセージエリアを生成 -----------------------------------
  let messageArea = util.dom.createElement('div');
  util.dom.setAttribute(messageArea, 'id', 'message-area');

  // -----HTMLを組み立てる------------------------------------------
  util.dom.appendChild(divElement, formElement);
  util.dom.appendChild(formElement, h2Element);
  util.dom.appendChild(formElement, emailLabelAndInput[0]);
  util.dom.appendChild(formElement, emailLabelAndInput[1]);
  util.dom.appendChild(formElement, inputEmailResponse);
  util.dom.appendChild(formElement, passwordLabelAndInput[0]);
  util.dom.appendChild(formElement, passwordLabelAndInput[1]);
  util.dom.appendChild(formElement, inputPasswordResponse);
  util.dom.appendChild(formElement, showPasswordCheckbox);
  util.dom.appendChild(formElement, showPasswordLabel);
  util.dom.appendChild(formElement, submitButton);
  util.dom.appendChild(divElement, messageArea);

  util.dom.appendChild(frag, divElement);

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
  form_map.email = document.getElementById('inputEmail').value;
  form_map.password = document.getElementById('inputPassword').value;

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
  const message_area = document.getElementById('message-area');
  const userInfo = document.getElementById('pal-dom-user-info');
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

      setTimeout( function () {
        message_area.setAttribute( 'hidden', 'hidden' );
        pal.bom.setLocationHash( '' );
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
  const main_section = document.getElementById( 'pal-main' );

  // mainセクションの子要素をすべて削除する
  util.dom.emptyElement( main_section );

  //----- ログインフォームを表示する -------------------------------
  main_section.appendChild(makeLoginForm());

  //----- パスワードを表示する機能を追加する -----------------------
  const password = document.getElementById('inputPassword');
  const showPassword = document.getElementById( 'showPassword' );

  showPassword.addEventListener('change', () => {
    let type = showPassword.checked ? 'text' : 'password';
    password.setAttribute( 'type', type );
  });

  let login_button = document.getElementById('loginUser');

  login_button.addEventListener('click', onClickLogin);

  return true;

};
// パブリックメソッド/login/終了
