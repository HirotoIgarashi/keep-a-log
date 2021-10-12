'use strict';

import { getNowDateJp } from "./utilCore.js";
import {
  createElement, createDocumentFragment,
  appendChild, getElementById, getElementsByClassName,
  querySelector, querySelectorAll
} from "./utilDom.js";
import { makeTop } from "./top.js";
import { login } from "./login.js";
import { logout } from "./logout.js";
import { register } from "./register.js";
import { menu } from "./menu.js";
import { cycleSystem } from "./cycleSystem.js";
import { onHashchange as hashChangeToList } from "./list.js";
import { onHashchange as hashChangetoCalender } from "./calendar.js";
import { event } from "./event.js";
import { browserInformation } from "./browserInformation.js";
import { lab } from "./lab.js";
import { registSchedule } from "./registSchedule.js";

export let elementMap = {};

//--------------------- ユーティリティメソッド開始 -----------------
const supportsTemplate = () => {
  const template  = createElement('template');
  return template.content !== undefined;
};
// ユーティリティメソッド/supportsTemplate/終了

const configMap = {
  logout_title          : 'ログアウトします。',
  login_title           : 'IDとパスワードでログインします。',
  register_title        : 'IDとパスワードを登録します。',
  menu_retracted_title  : 'クリックしてメニューを開きます',
  menu_extended_title   : 'クリックしてメニューを閉じます'
};

let stateMap = { container: null };

// DOMメソッド/makeFooter/開始 -------------------------------------
const makeFooter = () => {
  let frag = createDocumentFragment();
  let spanElement = createElement('span', {
    id: 'pal-dom-date-info'
  });
  // -----HTMLを組み立てる------------------------------------------
  appendChild(frag, spanElement);
  return frag;
};
  // DOMメソッド/makeFooter/終了 -------------------------------------

// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/controlDom/開始
// 用例: pal.dom.initModule( $('#app_div_id') );
// 目的:
// 引数:
//  * $append_target (例: $('#app_div_id'))
//  1つのDOMコンテナを表すjQueryコレクション
// 動作:
//  containerにUIのシェルを含め、機能モジュールを構成して初期化する。
//  シェルはURIアンカーやCookieの管理などのブラウザ全体に及ぶ問題を担当する。
// 戻り値: なし
// 例外発行: なし
//
export const controlDom = (id) => {
  // 与えられたidをDOMの中から探す
  let content = getElementById(id);
  console.log(content);

  const mainPage = querySelector('#main-page').content;
  let site_button;
  let site_button_rect;
  let site_menu;
  let menu_ahchor;

  const onClickTop = ( /* event */ ) => setLocationHash('');

  const onClickLogout = ( /* event */ ) =>
    setLocationHash('logout');

  const onClickLogin = ( /* event */ ) =>
    setLocationHash('login');

  const onClickRegister = ( /* event */ ) =>
    setLocationHash('register');

  // HTMLをロードしマッピングする
  stateMap.container = content;

  // templateタグが利用可能であればtemplate#main-pageを描画する-----
  if (supportsTemplate()) {
    content.appendChild(mainPage);
  }
  else {
    console.log( 'templateは利用できません。' );
  }

  // footerを表示する ----------------------------------------------
  appendChild(querySelector('#pal-footer'), makeFooter());

  // ウィンドウのサイズが変更されたときのイベント
  // window.addEventListener( 'resize', onResize );

  // DOM要素を取得する ---------------------------------------------
  setElementMap();

  // 機能モジュールを設定して初期化する/開始
  makeTop(mainPage);

  // 機能モジュールを設定して初期化する/終了

  // クリックハンドラをバインドする
  // ヘッダーのトップ
  elementMap.top[0].addEventListener('click', onClickTop);

  // ヘッダーのログアウト
  elementMap.logout[0].setAttribute('title', configMap.logout_title);
  elementMap.logout[0].addEventListener('click', onClickLogout);

  // ヘッダーのログイン要素
  elementMap.login[0].setAttribute('title', configMap.login_title);
  elementMap.login[0].addEventListener('click', onClickLogin);

  // ヘッダーのサインアップ要素
  elementMap.register[0].setAttribute('title', configMap.register_title);
  elementMap.register[0].addEventListener('click', onClickRegister);

  // ボタンとメニューのノードを取得
  site_button = querySelector('.pal-dom-header-menu');
  site_menu = querySelector('[aria-label="サイト"]');

  // 初期の(メニューが閉じているときの)状態と設定
  site_button.setAttribute('aria-expanded', 'false');
  site_button.hidden = false;
  site_menu.hidden = true;

  // サイトボタンの位置座標を取得してメニューの表示位置を指定する
  // サイトボタンのbottomをサイトメニューのtopに指定する
  site_button_rect = site_button.getBoundingClientRect();
  site_menu.style.top = site_button_rect.bottom + 'px';

  site_button.addEventListener('click', toggle_menu, false );

  // メニューのaタグを取得
  menu_ahchor = querySelectorAll('#pal-nav-menu a' );

  for (let i = 0; i < menu_ahchor.length; i = i + 1 ) {
    menu_ahchor[ i ].addEventListener('click', toggle_menu, false );
  }

  // ボタンのaria-pressed属性をtrueにする --------------------------
  setButtonPressed('pal-nav-home');

  // セッションがあるかを確認する ----------------------------------
  readSession();

  //----- フッターに日時を表示する(初回) ---------------------------
  elementMap.date_info.textContent = getNowDateJp();

  //------ フッターに日時を表示する(次回以降) ----------------------
  setInterval(() => {
    elementMap.date_info.textContent = getNowDateJp();
  }, 1000 );
  // URIのハッシュ変更イベントを処理する。
  // これはすべての機能モジュールを設定して初期化した後に行う。
  // そうしないと、トリガーイベントを処理できる状態になっていない。
  // トリガーイベントはアンカーがロード状態と見なせることを保証する
  // ために使う
  if (Object.prototype.hasOwnProperty.call(window, "onhashchange")) {
     window.addEventListener( "hashchange", onHashchange, false );
  }
};
// パブリックメソッド/initModule/終了

// パブリックメソッド/setLocationHash/開始
export const setLocationHash = (hash) => {
  window.location.hash = hash;
  return window.location.hash;
};
// パブリックメソッド/setLocationHash/終了

// パブリックメソッド/getLocationHash/開始
export const getLocationHash = () => {
  return window.location.hash;
};
// パブリックメソッド/getLocationHash/終了

// sendXmlHttpRequest開始
// 目的: ブラウザごとに適切なXMLHttpRequestオブジェクトを生成して
//       サーバに送信します。
// 必須引数:
//  * requestType     : HTTPリクエストの形式。GETかPOSTを指定します
//  * url             : リクエスト先のURL
//  * async           : 非同期呼び出しを行うか否かを指定します
//  * responseHandle  : レスポンスを処理する関数
//  * arguments[4]    : 5番目の引数はPOSTリクエストによって送信される
//                      文字列を表します
// オプション引数: なし
// 設定:
//  * xmlhttp
// 戻り値: なし
// 例外発行: なし
//
export const sendXmlHttpRequest = (requestType, url, async, responseHandle, sendData) => {
  let request = null;

  if (window.XMLHttpRequest) {
    // Mozillaベースのブラウザの場合
    request = new XMLHttpRequest();
  }
  else if (window.ActiveXObject) {
    // Internet Explorerの場合
    request = new ActiveXObject("Msxml2.XMLHTTP");
    if ( !request ) {
      request = new ActiveXObject("Miforsoft.XMLHTTP");
    }
  }

  // XMLHttpRequestオブジェクトが正しく生成された場合のみ、以降の処理に
  // 進みます。
  if (request) {
    if (requestType.toLowerCase() !== 'post') {
      initSendRequest( request, requestType, url, async, responseHandle );
    }
    else {
      // POSTの場合、5番目の引数で指定された値を送信します。
      if ( sendData !== null && sendData.length > 0 ) {
        initSendRequest( request, requestType, url, async, responseHandle, sendData );
      }
    }
    return request;
  }
  alert( 'このブラウザはAjaxに対応していません。' );
  return false;
};
// sendXmlHttpRequest終了

// initSendRequest開始
export const initSendRequest = (
  request,
  requestType,
  url,
  async,
  responseHandle,
  requestData) => {

  try {
    // HTTPレスポンスを処理するための関数を指定します。
    request.onreadystatechange = responseHandle;
    request.open(requestType, url, async);

    if (requestType.toLowerCase() === "post") {
      // POSTの場合はContent-Headerが必要です。
      request.setRequestHeader( 'Content-Type', 'application/json' );
      request.send(requestData);
      console.log('Ajaxリクエストを実行しました');
    }
    else {
      request.send(null);
    }
  }
  catch (err) {
    alert('サーバーに接続できません。' +
          'しばらくたってからやり直して下さい。\n' +
          'エラーの詳細: ' + err.message );
  }
};
// initSendRequest終了
// イベントハンドラ/onHashchange/開始
const onHashchange = () => {
  setSection();
};
// イベントハンドラ/onHashchange/終了

// ユーティリティメソッド/toggle_menu/開始
const toggle_menu = () => {
  // ボタンとメニューのノードを取得 --------------------------------
  const site_button = querySelector('.pal-dom-header-menu');
  const site_menu = querySelector('[aria-label="サイト"]');
  // メニューの表示非表示を切り替える
  let expanded = site_button.getAttribute( 'aria-expanded' ) === 'true';

  site_button.setAttribute( 'aria-expanded', String(!expanded) );
  site_menu.hidden = expanded;
};
// ユーティリティメソッド/toggle_menu/終了
// DOMメソッド/setSection/開始 -------------------------------------
// 目的: URLのハッシュが変更されたら呼ばれる。ハッシュの値を
// 取得して必要なモジュールを呼び出す
// モジュールを初期化する。
// 必須引数: なし
// オプション引数: なし
// 設定:
//  * currentLocationHash: カレントのハッシュの値を格納する。
// 戻り値: なし
// 例外発行: なし
//
export const setSection = () => {
  // mainセクションを取得する
  const mainSection = getElementById('pal-main');
  let currentLocationHash = getLocationHash();
  let firstHash = currentLocationHash.split('/')[0];
  // ボタンのaria-pressed属性の初期化 ------------------------------
  setButtonPressed();
  // ロケーションハッシュの最初の文字列で処理を振り分ける
  switch (firstHash) {
    case '#login':
      login(mainSection);
      break;
    case '#logout':
      logout(mainSection);
      break;
    case '#register':
      register(mainSection);
      break;
    case '#menu':
      menu(mainSection);
      break;
    case '#calendar':
      hashChangetoCalender(mainSection);
      setButtonPressed('pal-nav-calendar');
      break;
    case '#event':
      event(mainSection);
      setButtonPressed('pal-nav-event');
      break;
    case '#browser_information':
      browserInformation(mainSection);
      break;
    case '#list':
      hashChangeToList(mainSection);
      break;
    case '#lab':
      lab(mainSection);
      break;
    case '#regist_schedule':
      registSchedule(mainSection);
      break;
    case '#cycle_system':
      cycleSystem(mainSection);
      break;
    default:
      readSession();
      makeTop(mainSection);
      setButtonPressed('pal-nav-home');
      break;
  }
};
// DOMメソッド/setSection/終了 -------------------------------------
// DOMメソッド/setElementMap/開始
export const setElementMap = () => {
  elementMap = {
    top       : getElementsByClassName('pal-dom-header-title'),
    user_info : getElementById('pal-dom-user-info'),
    date_info : getElementById('pal-dom-date-info'),
    logout    : getElementsByClassName('pal-dom-header-logout'),
    login     : getElementsByClassName('pal-dom-header-login'),
    register  : getElementsByClassName('pal-dom-header-register')
  };
};
// DOMメソッド/setElementMap/終了
//----- ユーティリティメソッド/onReceiveSession/開始 --------------------
export const onReceiveSession = () => {
  let request;  // XMLHttpRequest
  if ( request && request.readyState === 4 ) {
    let response_map = JSON.parse(request.responseText);

    if (request.status === 200 ) {
      elementMap.logout[0].style.visibility = 'visible';
      elementMap.login[0].style.visibility = 'hidden';
      elementMap.register[0].style.visibility = 'hidden';
      elementMap.user_info.textContent =
        `${response_map.first} ${response_map.last} としてログインしています`;
    }
    else {
      elementMap.logout[0].style.visibility = 'hidden';
      elementMap.login[0].style.visibility = 'visible';
      elementMap.register[0].style.visibility = 'visible';
      elementMap.user_info.textContent = 'こんにちはゲストさん';
    }
  }
};
//----- ユーティリティメソッド/onReceiveSession/終了 --------------------
//----- ユーティリティメソッド/readSession/開始 --------------------
export const readSession = () => {
  const requestType = 'GET';
  const url = '/session/read';
  // AjaxによりGETする
  sendXmlHttpRequest(requestType, url, true, onReceiveSession);
};
//----- ユーティリティメソッド/readSession/終了 --------------------

// hashが変更されときの処理 ----------------------------------------
const setButtonPressed = ((data) => {
  const palNavHome = getElementById('pal-nav-home');
  const palNavEvent = getElementById('pal-nav-event');
  const palNavCalendar = getElementById('pal-nav-calendar');
  const palNavChat = getElementById('pal-nav-chat');

  const elementArray = [
    palNavHome, palNavEvent, palNavCalendar, palNavChat
  ];

  if (!data) {
    elementArray.forEach(
      (element) => element.setAttribute('aria-pressed', 'false')
    );
  }
  else {
    getElementById(`${data}`).setAttribute('aria-pressed', 'true');
  }
});

// --------------------- イベントハンドラ開始 ----------------------
// onResize = function () {
//   var
//     header,
//     // header_height,
//     nav,
//     // nav_height,
//     main,
//     main_height,
//     footer;
//     // footer_height;

//   // console.log( 'viewportの高さ: ' + window.innerHeight );

//   header  = getElementById( 'pal-header' );
//   nav     = getElementById( 'pal-nav' );
//   main    = getElementById( 'pal-main' );
//   footer  = getElementById( 'pal-footer' );

//   // header_height = header.clientHeight;
//   // console.log( "header_height: " + header_height );

//   // console.log( nav.hidden );

//   // nav_height   = nav.clientHeight;
//   // console.log( "nav_height: " + nav_height );

//   main_height   = main.clientHeight;
//   console.log( "main_height: " + main_height );

//   // footer_height = footer.clientHeight;
//   // console.log( "footer_height: " + footer_height );

//   // console.log( window.innerHeight - header_height - footer_height );
//   // main.style.height = window.innerHeight - header_height - footer_height - nav_height + 'px';

//   // console.log("main.style.height: " + main.style.height);

//   // console.log( '全体の高さ: ' + ( header_height + nav_height + main_height + footer_height ) );
// };
// --------------------- イベントハンドラ終了 ----------------------
