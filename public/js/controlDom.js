'use strict';

import { getNowDateJp } from "./utilCore.js";
import { createElement, createDocumentFragment, appendChild, getElementById,
  getElementsByClassName, querySelector, querySelectorAll,
  setAttribute, addEventListener, supportsTemplate
} from "./utilDom.js";
import { createXMLHttpRequest, openXMLHttpRequest,setOnreadystatechange,
  // setRequestHeader,
  sendGetRequest
} from "./utilAjax.js";
import { makeTop } from "./top.js";
import { login } from "./login.js";
import { logout } from "./logout.js";
import { register } from "./register.js";
import { menu } from "./menu.js";
import { cycleSystem } from "./cycleSystem.js";
import { onHashchange as hashChangeToList } from "./list.js";
import { onHashchange as hashChangetoCalender } from "./calendar.js";
import { initEvent } from "./event.js";
import { browserInformation } from "./browserInformation.js";
import { lab } from "./lab.js";
import { registSchedule } from "./registSchedule.js";

export let elementMap = {};

const configMap = {
  logouttle          : 'ログアウトします。',
  login_le           : 'IDとパスワードでログインします。',
  registtitle        : 'IDとパスワードを登録します。',
  menu_retracted_title  : 'クリックしてメニューを開きます',
  menu_extended_title   : 'クリックしてメニューを閉じます'
};

let stateMap = { container: null };

// DOMメソッド/makeFooter/開始 -------------------------------------
const makeFooter = () => {
  let frag = createDocumentFragment();
  let spanElement = createElement('span', {id: 'pal-dom-date-info'});
  // -----HTMLを組み立てる------------------------------------------
  appendChild(frag, spanElement);
  return frag;
};
  // DOMメソッド/makeFooter/終了 -------------------------------------

// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/controlDom/開始
// 用例: controlDom(id);
// 目的:
// 引数:
//  * id
// 動作:
//  containerにUIのシェルを含め、機能モジュールを構成して初期化する。
//  シェルはURIアンカーやCookieの管理などのブラウザ全体に及ぶ問題を担当する。
// 戻り値: なし
// 例外発行: なし
//
export const controlDom = (id) => {
  const mainPage = querySelector('#main-page').content;
  // 与えられたidをDOMの中から探す
  let content = getElementById(id);
  let siteButton;
  let siteButtonRect;
  let siteMenu;
  let menu_ahchor;

  const onClickTop = (/* event */) => setLocationHash('');
  const onClickLogout = (/* event */) => setLocationHash('logout');
  const onClickLogin = (/* event */) => setLocationHash('login');
  const onClickRegister = (/* event */) => setLocationHash('register');

  // HTMLをロードしマッピングする
  stateMap.container = content;

  // templateタグが利用可能であればtemplate#main-pageを描画する-----
  if (supportsTemplate()) {
    content.appendChild(mainPage);
  }
  else {
    console.log('templateは利用できません。');
  }
  // footerを表示する ----------------------------------------------
  appendChild(querySelector('#pal-footer'), makeFooter());
  // ウィンドウのサイズが変更されたときのイベント
  // addEventListener(window, 'resize', onResize );

  // DOM要素を取得する ---------------------------------------------
  setElementMap();
  // 機能モジュールを設定して初期化する/開始
  makeTop(mainPage);
  // 機能モジュールを設定して初期化する/終了
  // クリックハンドラをバインドする
  // ヘッダーのトップ
  addEventListener(elementMap.top[0], 'click', onClickTop);
  // ヘッダーのログアウト
  setAttribute(elementMap.logout[0], 'title', configMap.logout_title);
  addEventListener(elementMap.logout[0], 'click', onClickLogout);
  // ヘッダーのログイン要素
  setAttribute(elementMap.login[0], 'title', configMap.login_title);
  addEventListener(elementMap.login[0], 'click', onClickLogin);
  // ヘッダーのサインアップ要素
  setAttribute(elementMap.register[0], 'title', configMap.register_title);
  addEventListener(elementMap.register[0], 'click', onClickRegister);
  // ボタンとメニューのノードを取得
  siteButton = querySelector('.pal-dom-header-menu');
  siteMenu = querySelector('[aria-label="サイト"]');
  // 初期の(メニューが閉じているときの)状態と設定
  setAttribute(siteButton, 'aria-expanded', 'false');
  siteButton.hidden = false;
  siteMenu.hidden = true;
  // サイトボタンの位置座標を取得してメニューの表示位置を指定する
  // サイトボタンのbottomをサイトメニューのtopに指定する
  siteButtonRect = siteButton.getBoundingClientRect();
  siteMenu.style.top = siteButtonRect.bottom + 'px';
  addEventListener(siteButton, 'click', toggleMenu, false );
  // メニューのaタグを取得
  menu_ahchor = querySelectorAll('#pal-nav-menu a' );
  for (let i = 0; i < menu_ahchor.length; i = i + 1) {
    addEventListener(menu_ahchor[i], 'click', toggleMenu, false );
  }
  // ボタンのaria-pressed属性をtrueにする --------------------------
  setButtonPressed('pal-nav-home');
  // セッションがあるかを確認する ----------------------------------
  readSessionStatus();
  //----- フッターに日時を表示する(初回) ---------------------------
  elementMap.dateInfo.textContent = getNowDateJp();
  //------ フッターに日時を表示する(次回以降) ----------------------
  setInterval(() => {
    elementMap.dateInfo.textContent = getNowDateJp();
  }, 1000 );
  // URIのハッシュ変更イベントを処理する。
  // これはすべての機能モジュールを設定して初期化した後に行う。
  // そうしないと、トリガーイベントを処理できる状態になっていない。
  // トリガーイベントはアンカーがロード状態と見なせることを保証する
  // ために使う
  if (Object.prototype.hasOwnProperty.call(window, "onhashchange")) {
     addEventListener(window, "hashchange", onHashchange, false );
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

// DOMメソッド/setElementMap/開始
export const setElementMap = () => {
  elementMap = {
    top       : getElementsByClassName('pal-dom-header-title'),
    userInfo : getElementById('pal-dom-user-info'),
    dateInfo : getElementById('pal-dom-date-info'),
    logout    : getElementsByClassName('pal-dom-header-logout'),
    login     : getElementsByClassName('pal-dom-header-login'),
    register  : getElementsByClassName('pal-dom-header-register')
  };
};
// DOMメソッド/setElementMap/終了

// イベントハンドラ/onHashchange/開始
const onHashchange = () => {
  setSection();
};
// イベントハンドラ/onHashchange/終了

// ユーティリティメソッド/toggleMenu/開始
const toggleMenu = () => {
  // ボタンとメニューのノードを取得 --------------------------------
  const siteButton = querySelector('.pal-dom-header-menu');
  const siteMenu = querySelector('[aria-label="サイト"]');
  // メニューの表示非表示を切り替える
  let expanded = siteButton.getAttribute( 'aria-expanded' ) === 'true';

  setAttribute(siteButton, 'aria-expanded', String(!expanded));
  siteMenu.hidden = expanded;
};
// ユーティリティメソッド/toggleMenu/終了

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
      initEvent(mainSection);
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
      readSessionStatus();
      makeTop(mainSection);
      setButtonPressed('pal-nav-home');
      break;
  }
};
// DOMメソッド/setSection/終了 -------------------------------------

//----- ユーティリティメソッド/readSessionStatus/開始 --------------------
const readSessionStatus = () => {
  let xhr;
  const requestType = 'GET';
  const url = '/session/read';
  const async = true;
  // const sendData = undefined;
  const onReceiveSession = () => {
    if (xhr && xhr.readyState === 0) {
      console.log('open()はまだ呼び出されていない。')
    }
    else if (xhr && xhr.readyState === 1) {
      console.log('open()が呼び出された。')
    }
    else if (xhr && xhr.readyState === 2) {
      console.log('ヘッダを受け取った。')
    }
    else if (xhr && xhr.readyState === 3) {
      console.log('レスポンスボディを受信中である。')
    }
    else if (xhr && xhr.readyState === 4) {
      console.log('レスポンスの受信が完了した。')
      let responseMap = JSON.parse(xhr.responseText);

      if (xhr.status === 200 ) {
        elementMap.logout[0].style.visibility = 'visible';
        elementMap.login[0].style.visibility = 'hidden';
        elementMap.register[0].style.visibility = 'hidden';
        elementMap.userInfo.textContent =
          `${responseMap.first} ${responseMap.last} としてログインしています`;
      }
      else if (xhr.status === 203 ) {
        console.log('ステータス203が返されました。');
        console.log(responseMap);
        elementMap.logout[0].style.visibility = 'hidden';
        elementMap.login[0].style.visibility = 'visible';
        elementMap.register[0].style.visibility = 'visible';
        elementMap.userInfo.textContent = 'こんにちはゲストさん';
      }
      else {
        elementMap.logout[0].style.visibility = 'hidden';
        elementMap.login[0].style.visibility = 'visible';
        elementMap.register[0].style.visibility = 'visible';
        elementMap.userInfo.textContent = 'こんにちはゲストさん';
      }
    }
  };
  // XMLHttpRequestオブジェクトのインスタンスを生成する
  xhr = createXMLHttpRequest();
  // 受信した後の処理ほ登録する
  xhr = setOnreadystatechange(xhr, onReceiveSession);
  // XMLHttpRequestオブジェクトが正しく生成された場合、リクエストをopenする
  xhr = openXMLHttpRequest(xhr, requestType, url, async);
  // xhr = setRequestHeader(xhr, 'application/json');
  // リクエストを送信する
  xhr = sendGetRequest(xhr);
};
//----- ユーティリティメソッド/readSessionStatus/終了 --------------------

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
      (element) => setAttribute(element, 'aria-pressed', 'false')
    );
  }
  else {
    setAttribute(getElementById(`${data}`), 'aria-pressed', 'true');
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
