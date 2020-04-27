'use strict';

/*
 * pal.register.js
 * 登録機能
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global pal util */

pal.register = (() => {
  //--------------------- モジュールスコープ変数開始 -----------------
  let request = null;
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  const resetInputForm = (nameValueArray) => {
    nameValueArray.forEach((value) => {
      let inputTag = document.querySelector(`input[name='${value}']`);

      inputTag.style.borderColor = 'initial';
      inputTag.nextElementSibling.innerHTML = '';
    });
    return;
  };
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  const makeRegisterForm = () => {
    let frag = util.dom.createFragment();
    // -----divタグの作成 --------------------------------------------
    let divElement = util.dom.createElement('div');
    util.dom.setAttribute(divElement, 'class', 'data-form');

    let h2Element = util.dom.createElement('h2');
    h2Element = util.dom.innerHTML(
      h2Element,
      '新しいユーザを作成する:'
    );

    // -----formタグの作成 -------------------------------------------
    let formElement = util.dom.createElement('form');

    // -----姓のlabelとinput -----------------------------------------
    let firstLabelAndInput = util.dom.createLabelAndInput({
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
    let lastLabelAndInput = util.dom.createLabelAndInput({
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

    // checkboxとlabelを囲むdivを作成する ----------------------------
    let divShowPassword = util.dom.createElement('div');

    // -----パスワードを表示するcheckboxとlabelを生成 ----------------
    let showPasswordCheckbox = util.dom.createElement('input');
    util.dom.setAttribute(showPasswordCheckbox, 'type', 'checkbox');
    util.dom.setAttribute(showPasswordCheckbox, 'id', 'showPassword');
    let showPasswordLabel = util.dom.createElement('label');
    util.dom.innerHTML(showPasswordLabel, 'パスワードを表示');

    util.dom.appendChild(divShowPassword, showPasswordCheckbox);
    util.dom.appendChild(divShowPassword, showPasswordLabel);

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

    // -----郵便番号のlabelとinput -----------------------------------
    let zipCodeLabelAndInput = util.dom.createLabelAndInput({
      'for': 'inputZipCode',
      'innerHTML': '郵便番号',
      'type': 'text',
      'name': 'zipCode',
      'id': 'inputZipCode',
      'placeholder': '郵便番号',
      'required': true,
      'autofocus': false
    });

    // -----郵便番号のvalidate結果の表示エリア------------------------
    let inputZipCodeResponse = util.dom.createElement('div');

    // -----ボタンを生成 ---------------------------------------------
    let submitButton = util.dom.createElement('button');
    util.dom.setAttribute(submitButton, 'type', 'submit');
    util.dom.setAttribute(submitButton, 'id', 'registerUser');
    util.dom.innerHTML(submitButton, 'サインイン');

    // -----メッセージエリアを生成 -----------------------------------
    let messageArea = util.dom.createElement('div');
    util.dom.setAttribute(messageArea, 'id', 'message-area');

    // -----HTMLを組み立てる------------------------------------------
    util.dom.appendChild(divElement, formElement);
    util.dom.appendChild(formElement, h2Element);
    util.dom.appendChild(formElement, firstLabelAndInput[0]);
    util.dom.appendChild(formElement, firstLabelAndInput[1]);
    util.dom.appendChild(formElement, lastLabelAndInput[0]);
    util.dom.appendChild(formElement, lastLabelAndInput[1]);
    util.dom.appendChild(formElement, passwordLabelAndInput[0]);
    util.dom.appendChild(formElement, passwordLabelAndInput[1]);
    util.dom.appendChild(formElement, divShowPassword);
    util.dom.appendChild(formElement, inputPasswordResponse);
    util.dom.appendChild(formElement, emailLabelAndInput[0]);
    util.dom.appendChild(formElement, emailLabelAndInput[1]);
    util.dom.appendChild(formElement, inputEmailResponse);
    util.dom.appendChild(formElement, zipCodeLabelAndInput[0]);
    util.dom.appendChild(formElement, zipCodeLabelAndInput[1]);
    util.dom.appendChild(formElement, inputZipCodeResponse);
    util.dom.appendChild(formElement, submitButton);
    util.dom.appendChild(divElement, messageArea);

    util.dom.appendChild(frag, divElement);

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
    form_map.first = document.getElementById('inputFirstName').value;
    form_map.last = document.getElementById('inputLastName').value;
    form_map.password = document.getElementById('inputPassword').value;
    form_map.email = document.getElementById('inputEmail').value;
    form_map.zipCode = document.getElementById('inputZipCode').value;

    // XMLHttpRequestによる送信
    request = pal.util_b.sendXmlHttpRequest(
      requestType,
      url,
      true,
      onReceiveRegister,
      JSON.stringify(form_map)
    );

    // inputフォームを初期化する
    resetInputForm(['password', 'email', 'zipCode']);

  };
  // -- イベントハンドラ(onClickRegister)終了 ------------------------

  // -- イベントハンドラ(onReceiveRegister)開始 ----------------------
  // Registerの結果の処理
  const onReceiveRegister = function () {
    const message_area = document.getElementById('message-area');

    if (request && request.readyState === 4) {
      if (request.status === 201) {
        message_area.removeAttribute('hidden');
        message_area.textContent =
          'ユーザを作成しました。ステータス: ' + request.status;
        setTimeout(function () {
          message_area.setAttribute('hidden', 'hidden');
          pal.bom.setLocationHash('');
        }, 5000);
      }
      else {
        let responseArray = JSON.parse(request.response);

        // validate結果を表示する
        responseArray.forEach((response) => {
          let inputTag = document.querySelector(`input[name='${response.param}']`);
          inputTag.style.borderColor = 'red';
          inputTag.nextElementSibling.innerHTML += response.msg;
        });

        message_area.removeAttribute('hidden');
        switch (request.status) {
          case 401:
            message_area.textContent =
              'E-mailアドレスかパスワードが不正です。ステータス: ' +
                request.status;
            break;
          case 409:
            message_area.textContent =
              '入力されたEmailアドレスはすでに使われています。ステータス: ' +
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
  // -- パブリックメソッド(initModule)開始 ---------------------------
  const initModule = function (main_section) {
    // mainセクションの子要素をすべて削除する
    pal.util.emptyElement(main_section);

    // document fragmentを追加する
    main_section.appendChild(makeRegisterForm());

    let inputFirstNameElement = document.getElementById('inputFirstName');
    inputFirstNameElement.focus();

    //----- パスワードを表示する機能を追加する -----------------------
    const password = document.getElementById('inputPassword');
    const showPassword = document.getElementById('showPassword');

    showPassword.addEventListener('change', () => {
      let type = showPassword.checked ? 'text' : 'password';
      password.setAttribute( 'type', type );
    });

    // サインインボタンにonClickRegisterイベントを登録する -----------
    let register_button = document.getElementById('registerUser');
    register_button.addEventListener('click', onClickRegister);

    return true;
  };
  // -- パブリックメソッド(initModule)終了 ---------------------------
  // パブリックメソッドを返す ----------------------------------------
  return {
    initModule    : initModule
  };
  // --------------------- パブリックメソッド終了 --------------------
})();
