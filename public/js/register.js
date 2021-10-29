/*
 * register.js
 * ユーザ登録機能
*/

'use strict';

// import { sendXmlHttpRequest, setLocationHash } from "./controlDom.js";
import { setLocationHash } from "./controlDom.js";
import {
  emptyElement, createDocumentFragment, querySelector,
  createElement, setAttribute, innerHTML,
  createLabelAndInput, appendChild, getElementById,
} from "./utilDom.js";
import { createXMLHttpRequest, openXMLHttpRequest,setOnreadystatechange,
  setRequestHeader, sendPostRequest
} from "./utilAjax.js";

//--------------------- モジュールスコープ変数開始 -----------------
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- ユーティリティメソッド開始 -----------------
const resetInputForm = (nameValueArray) => {
  nameValueArray.forEach((value) => {

    console.log(value);

    let inputTag = querySelector(`input[name='${value}']`);
    inputTag.style.borderColor = 'initial';
    // inputTag.nextElementSibling.innerHTML = '';
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
  h2Element = innerHTML(h2Element, 'ユーザ登録');

  // -----formタグの作成 -------------------------------------------
  let formElement = createElement('form');

  // -----姓のlabelとinput -----------------------------------------
  let firstLabelAndInput = createLabelAndInput({
    'for': 'inputFirstName',
    'innerHTML': '姓',
    'type': 'text',
    'name': 'first',
    'id': 'inputFirstName',
    'placeholder': '',
    'required': false,
    'autofocus': false
  });
  // -----姓のlabelとinput -----------------------------------------
  let firstDiv = createElement('div');
  setAttribute(firstDiv, 'class', 'field');

  appendChild(firstDiv, firstLabelAndInput[0]);
  appendChild(firstDiv, firstLabelAndInput[1]);

  // -----名のlabelとinput -----------------------------------------
  let lastLabelAndInput = createLabelAndInput({
    'for': 'inputLastName',
    'innerHTML': '名',
    'type': 'text',
    'name': 'last',
    'id': 'inputLastName',
    'placeholder': '',
    'required': false,
    'autofocus': false
  });

  let lastDiv = createElement('div');
  setAttribute(lastDiv, 'class', 'field');

  appendChild(lastDiv, lastLabelAndInput[0]);
  appendChild(lastDiv, lastLabelAndInput[1]);


  let emailDiv = createElement('div');
  setAttribute(emailDiv, 'class', 'field');

  // ----- メールアドレスのlabel ------------------------------------------
  let emailLabel = createElement('label');
  setAttribute(emailLabel, 'for', 'inputEmail');

  // ----- メールアドレスのspan ------------------------------------------
  let emailSpan = createElement('span');
  setAttribute(emailSpan, 'class', 'field-label');
  emailSpan.textContent = 'メールアドレス';

  appendChild(emailLabel, emailSpan);

  // ----- メールアドレスのinput ------------------------------------------
  let emailInput = createElement('input');
  setAttribute(emailInput, 'type', 'text');
  setAttribute(emailInput, 'id', 'inputEmail');
  setAttribute(emailInput, 'name', 'inputEmail');
  setAttribute(emailInput, 'value', '');

  appendChild(emailDiv, emailLabel);
  appendChild(emailDiv, emailInput);

  // -----パスワードのlabelとinput ---------------------------------
  let passwordDiv = createElement('div');
  setAttribute(passwordDiv, 'class', 'field');

  let passwordLabel = createElement('label');
  setAttribute(passwordLabel, 'for', 'inputPassword');

  let passwordSpan = createElement('span');
  setAttribute(passwordSpan, 'class', 'field-label');
  passwordSpan.textContent = 'パスワード';

  let passwordHintSpan = createElement('span');
  setAttribute(passwordHintSpan, 'class', 'field-hint');
  passwordHintSpan.textContent =
    '数字を1文字以上含めて、8文字以内で入力してください';

  appendChild(passwordLabel, passwordSpan);
  appendChild(passwordLabel, passwordHintSpan);

  let passwordRevealerDiv = createElement('div');
  setAttribute(passwordRevealerDiv, 'class', 'passwordRevealer');

  let passwordInput = createElement('input');
  setAttribute(passwordInput, 'type', 'password');
  setAttribute(passwordInput, 'id', 'inputPassword');
  setAttribute(passwordInput, 'name', 'inputPassword');
  setAttribute(passwordInput, 'value', '');

  let passwordRevealerButton = createElement('button');
  setAttribute(passwordRevealerButton, 'type', 'button');
  passwordRevealerButton.textContent = '表示する';


  appendChild(passwordRevealerDiv, passwordInput);
  appendChild(passwordRevealerDiv, passwordRevealerButton);

  appendChild(passwordDiv, passwordLabel);
  appendChild(passwordDiv, passwordRevealerDiv);

  // -----パスワードのvalidate結果の表示エリアとinput --------------
  let inputPasswordResponse = createElement('div');

  // -----ボタンを生成 ---------------------------------------------
  let submitButton = createElement('button');
  setAttribute(submitButton, 'type', 'submit');
  setAttribute(submitButton, 'id', 'registerUser');
  innerHTML(submitButton, 'ユーザを登録する');

  // -----メッセージエリアを生成 -----------------------------------
  let messageArea = createElement('div');
  setAttribute(messageArea, 'id', 'message-area');

  // -----HTMLを組み立てる------------------------------------------
  appendChild(divElement, h2Element);
  appendChild(divElement, formElement);
  appendChild(formElement, firstDiv);
  appendChild(formElement, lastDiv);

  appendChild(formElement, emailDiv);

  appendChild(formElement, passwordDiv);
  appendChild(formElement, inputPasswordResponse);
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
  let xhr;
  const requestType = 'POST';
  const url = '/user/create';
  const async = true;
  let formMap = {};

  // -- イベントハンドラ(onReceiveRegister)開始 ----------------------
  // Registerの結果の処理
  const onReceiveRegister = () => {
    const messageArea = getElementById('message-area');
    messageArea.removeAttribute('hidden');

    if (xhr && xhr.readyState === 4) {

      let responseArray = JSON.parse(xhr.response);

      // validate結果を表示する
      if (typeof responseArray !== 'object') {
        responseArray.forEach((response) => {
          let inputTag = querySelector(`input[name='${response.param}']`);
          inputTag.style.borderColor = 'red';
          inputTag.nextElementSibling.innerHTML += response.msg;
        });
      }

      if (xhr.status === 201) {
        messageArea.removeAttribute('hidden');
        messageArea.textContent = 'ユーザを作成しました。ステータス: ' + xhr.status;
        setTimeout(() => {
          setAttribute(messageArea, 'hidden', 'hidden');
          setLocationHash('');
        }, 5000);
      }
      else if (xhr.status === 401) {
        messageArea.textContent =
          `メールアドレスかパスワードが不正です。ステータス: ${xhr.status}`;
      }
      else if (xhr.status === 409) {
        messageArea.textContent =
          `入力されたメールアドレスはすでに使われています。ステータス: ${xhr.status}`;
      }
      else if (xhr.status === 422) {
        messageArea.textContent =
          `入力された値が正しくありません。再度入力してください ステータス: ${xhr.status}`;
      }
      else if (xhr.status === 500) {
        messageArea.textContent =
          `サーバエラーが発生しました。ステータス: ${xhr.status}`;
      }
      else {
        messageArea.textContent = `エラーが発生しました。ステータス: ${xhr.status}`;
      }
    }
  };
  // -- イベントハンドラ(onReceiveRegister)終了 ----------------------
  // --------------------- イベントハンドラ終了 ----------------------

  event.preventDefault();

  // フォームから入力された値を取得する
  formMap.first = getElementById('inputFirstName').value;
  formMap.last = getElementById('inputLastName').value;
  formMap.password = getElementById('inputPassword').value;
  formMap.email = getElementById('inputEmail').value;

  xhr = createXMLHttpRequest();
  // 受信した後の処理ほ登録する
  xhr = setOnreadystatechange(xhr, onReceiveRegister);
  // XMLHttpRequestオブジェクトが正しく生成された場合、リクエストをopenする
  xhr = openXMLHttpRequest(xhr, requestType, url, async);
  // POSTの場合はRequest Headerを設定する
  xhr = setRequestHeader(xhr, 'application/json');
  // リクエストを送信する
  xhr = sendPostRequest(xhr, JSON.stringify(formMap));

  console.log('登録ボタンが押されました');

  // inputフォームを初期化する
  resetInputForm(['inputPassword', 'inputEmail']);
};
// -- イベントハンドラ(onClickRegister)終了 ------------------------

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
  const password = querySelector('.passwordRevealer input');
  const showPassword = querySelector('.passwordRevealer button');

  showPassword.addEventListener('click', () => {
    if (showPassword.textContent === '表示する') {
      showPassword.textContent = '隠す';
      setAttribute(password, 'type', 'text');
    }
    else {
      showPassword.textContent = '表示する';
      setAttribute(password, 'type', 'password');
    }
  });

  // showPassword.addEventListener('change', () => {
  //   let type = showPassword.checked ? 'text' : 'password';
  //   password.setAttribute( 'type', type );
  // });

  // サインインボタンにonClickRegisterイベントを登録する -----------
  let registerButton = getElementById('registerUser');
  registerButton.addEventListener('click', onClickRegister);

  return true;
};
// -- パブリックメソッド(logout)終了 ---------------------------
