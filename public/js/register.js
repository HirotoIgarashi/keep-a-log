/*
 * register.js
 * ユーザ登録機能
*/

'use strict';

import { sendXmlHttpRequest, setLocationHash } from "./controlDom.js";
import {
  emptyElement, createDocumentFragment, querySelector,
  createElement, setAttribute, innerHTML,
  createLabelAndInput, appendChild, getElementById
} from "./utilDom.js";

//--------------------- モジュールスコープ変数開始 -----------------
let request = null;
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- ユーティリティメソッド開始 -----------------
const resetInputForm = (nameValueArray) => {
  nameValueArray.forEach((value) => {
    let inputTag = querySelector(`input[name='${value}']`);

    inputTag.style.borderColor = 'initial';
    inputTag.nextElementSibling.innerHTML = '';
  });
  return;
};
//--------------------- ユーティリティメソッド終了 -----------------

//--------------------- DOMメソッド開始 ----------------------------
const makeRegisterForm = () => {
  let frag = createDocumentFragment();
  // -----divタグの作成 --------------------------------------------
  let divElement = createElement('div');
  setAttribute(divElement, 'class', 'data-form');

  let h2Element = createElement('h2');
  h2Element = innerHTML(
    h2Element,
    'ユーザ登録:'
  );

  // -----formタグの作成 -------------------------------------------
  let formElement = createElement('form');

  // -----姓のlabelとinput -----------------------------------------
  let firstLabelAndInput = createLabelAndInput({
    'for': 'inputFirstName',
    'innerHTML': '姓',
    'type': 'text',
    'name': 'first',
    'id': 'inputFirstName',
    'placeholder': '姓',
    'required': false,
    'autofocus': false
  });
  // -----姓のlabelとinput -----------------------------------------

  // -----名のlabelとinput -----------------------------------------
  let lastLabelAndInput = createLabelAndInput({
    'for': 'inputLastName',
    'innerHTML': '名',
    'type': 'text',
    'name': 'last',
    'id': 'inputLastName',
    'placeholder': '名',
    'required': false,
    'autofocus': false
  });
  // -----パスワードのlabelとinput ---------------------------------
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

  // checkboxとlabelを囲むdivを作成する ----------------------------
  let divShowPassword = createElement('div');

  // -----パスワードを表示するcheckboxとlabelを生成 ----------------
  let showPasswordCheckbox = createElement('input');
  setAttribute(showPasswordCheckbox, 'type', 'checkbox');
  setAttribute(showPasswordCheckbox, 'id', 'showPassword');
  let showPasswordLabel = createElement('label');
  innerHTML(showPasswordLabel, 'パスワードを表示');

  appendChild(divShowPassword, showPasswordCheckbox);
  appendChild(divShowPassword, showPasswordLabel);

  // -----パスワードのvalidate結果の表示エリアとinput --------------
  let inputPasswordResponse = createElement('div');

  // ----- Eメールのlabel ------------------------------------------
  let emailLabelAndInput = createLabelAndInput({
    'for': 'inputEmail',
    'innerHTML': 'メールアドレス',
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
  setAttribute(submitButton, 'id', 'registerUser');
  innerHTML(submitButton, '登録');

  // -----メッセージエリアを生成 -----------------------------------
  let messageArea = createElement('div');
  setAttribute(messageArea, 'id', 'message-area');

  // -----HTMLを組み立てる------------------------------------------
  appendChild(divElement, formElement);
  appendChild(formElement, h2Element);
  appendChild(formElement, firstLabelAndInput[0]);
  appendChild(formElement, firstLabelAndInput[1]);
  appendChild(formElement, lastLabelAndInput[0]);
  appendChild(formElement, lastLabelAndInput[1]);
  appendChild(formElement, emailLabelAndInput[0]);
  appendChild(formElement, emailLabelAndInput[1]);
  appendChild(formElement, inputEmailResponse);
  appendChild(formElement, passwordLabelAndInput[0]);
  appendChild(formElement, passwordLabelAndInput[1]);
  appendChild(formElement, divShowPassword);
  appendChild(formElement, inputPasswordResponse);
  // appendChild(formElement, zipCodeLabelAndInput[0]);
  // appendChild(formElement, zipCodeLabelAndInput[1]);
  // appendChild(formElement, inputZipCodeResponse);
  appendChild(formElement, submitButton);
  appendChild(divElement, messageArea);

  appendChild(frag, divElement);

  return frag;
};
//--------------------- DOMメソッド終了 ----------------------------

// --------------------- イベントハンドラ開始 ----------------------
// -- イベントハンドラ(onClickRegister)開始 ------------------------
const onClickRegister = (event) => {
  // XMLHttpRequestによる送信を行う
  const requestType = 'POST';
  const url = '/user/create';

  let form_map = {};

  event.preventDefault();

  // フォームから入力された値を取得する
  form_map.first = getElementById('inputFirstName').value;
  form_map.last = getElementById('inputLastName').value;
  form_map.password = getElementById('inputPassword').value;
  form_map.email = getElementById('inputEmail').value;
  // form_map.zipCode = getElementById('inputZipCode').value;

  console.log('登録ボタンが押されました');
  // XMLHttpRequestによる送信
  request = sendXmlHttpRequest(
    requestType,
    url,
    true,
    onReceiveRegister,
    JSON.stringify(form_map)
  );

  // inputフォームを初期化する
  // resetInputForm(['password', 'email', 'zipCode']);
  resetInputForm(['password', 'email']);

};
// -- イベントハンドラ(onClickRegister)終了 ------------------------

// -- イベントハンドラ(onReceiveRegister)開始 ----------------------
// Registerの結果の処理
const onReceiveRegister = function () {
  const message_area = getElementById('message-area');

  if (request && request.readyState === 4) {
    if (request.status === 201) {
      message_area.removeAttribute('hidden');
      message_area.textContent =
        'ユーザを作成しました。ステータス: ' + request.status;
      setTimeout(function () {
        message_area.setAttribute('hidden', 'hidden');
        setLocationHash('');
      }, 5000);
    }
    else {
      let responseArray = JSON.parse(request.response);

      console.log(responseArray);
      console.log(typeof responseArray);

      // validate結果を表示する
      if (typeof responseArray !== 'object') {
        responseArray.forEach((response) => {
          let inputTag = querySelector(`input[name='${response.param}']`);
          inputTag.style.borderColor = 'red';
          inputTag.nextElementSibling.innerHTML += response.msg;
        });
      }

      message_area.removeAttribute('hidden');
      switch (request.status) {
        case 401:
          message_area.textContent =
            'メールアドレスかパスワードが不正です。ステータス: ' +
              request.status;
          break;
        case 409:
          message_area.textContent =
          '入力されたメールアドレスはすでに使われています。ステータス: ' +
            request.status;
            break;
        case 422:
          message_area.textContent =
            '入力された値が正しくありません。再度入力してください ステータス: ' +
              request.status;
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
// -- イベントハンドラ(onReceiveRegister)終了 ----------------------
// --------------------- イベントハンドラ終了 ----------------------

// --------------------- パブリックメソッド開始 --------------------
// -- パブリックメソッド(register)開始 ---------------------------
export const register = mainSection => {
    // mainセクションの子要素をすべて削除する
  emptyElement(mainSection);

  // document fragmentを追加する
  mainSection.appendChild(makeRegisterForm());

  let inputFirstNameElement = getElementById('inputFirstName');
  inputFirstNameElement.focus();

  //----- パスワードを表示する機能を追加する -----------------------
  const password = getElementById('inputPassword');
  const showPassword = getElementById('showPassword');

  showPassword.addEventListener('change', () => {
    let type = showPassword.checked ? 'text' : 'password';
    password.setAttribute( 'type', type );
  });

  // サインインボタンにonClickRegisterイベントを登録する -----------
  let registerButton = getElementById('registerUser');
  registerButton.addEventListener('click', onClickRegister);

  return true;
};
// -- パブリックメソッド(logout)終了 ---------------------------
