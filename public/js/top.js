/*
 * top.js
 * TOPページを表示する機能
*/

'use strict';
import { getTplContent } from "./utilCore.js";
//--------------------- モジュールスコープ変数開始 -----------------
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- DOMメソッド開始 ----------------------------
// DOMメソッド/makeNav/開始 ----------------------------------------
export const makeNav = () => {
  let frag = util.dom.createFragment();
  let ulElement = util.dom.createElement('ul', {
    id: 'pal-main-nav-list'
  });
  let liHome = util.dom.createElement('li');
  let buttonHome = util.dom.createElement('button', {
    id: 'pal-nav-home',
    'aria-pressed': 'false'
  });
  let anchorHome = util.dom.createElement('a', {
    href: '#',
    onfocus: 'this.blur();',
    textContent: 'ホーム'
  });
  let liEvent = util.dom.createElement('li');
  let buttonEvent = util.dom.createElement('button', {
    id: 'pal-nav-event',
    'aria-pressed': 'false'
  });
  let anchorEvent = util.dom.createElement('a', {
    href: '#event',
    onfocus: 'this.blur();',
    textContent: 'イベント'
  });
  let liCalendar = util.dom.createElement('li');
  let buttonCalendar = util.dom.createElement('button', {
    id: 'pal-nav-calendar',
    'aria-pressed': 'false'
  });
  let anchorCalendar = util.dom.createElement('a', {
    href: '#calendar',
    onfocus: 'this.blur();',
    textContent: 'カレンダー'
  });

  let liChat = util.dom.createElement('li');

  let buttonChat = util.dom.createElement('button', {
    id: 'pal-nav-chat',
    'aria-pressed': 'false'
  });

  let anchorChat = util.dom.createElement('a', {
    href: '/chat',
    onfocus: 'this.blur();',
    textContent: 'チャット'
  });

  // -----HTMLを組み立てる------------------------------------------
  util.dom.appendByTreeArray([
    frag, [
      ulElement, [
        liHome, [buttonHome, [anchorHome]],
        liEvent, [buttonEvent, [anchorEvent]],
        liCalendar,[
          buttonCalendar, [
            anchorCalendar
          ]
        ],
        liChat, [
          buttonChat, [
            anchorChat
          ]
        ]
      ]
    ]
  ]);

  return frag;
};
// DOMメソッド/makeNav/終了 ----------------------------------------
//--------------------- DOMメソッド終了 ----------------------------

// --------------------- パブリックメソッド開始 --------------------

//------ パブリックメソッド/initModule/開始 ------------------------
// 目的: モジュールを初期化する
// 引数:
//  なし
// 戻り値: true
// 例外発行: なし
//
export const makeTop = () => {
  const topPage = getTplContent( 'top-page' );

  //mainセクションの子要素をすべて削除してトップページを表示する ---
  util.core.compose(
    util.dom.appendChildCurried(topPage),
    util.dom.emptyElement,
    util.dom.getElementById
  )('pal-main');

  // pal-main-navの子要素を削除してから表示する --------------------
  util.core.compose(
    util.dom.appendChildCurried(makeNav()),
    util.dom.emptyElement,
    util.dom.querySelector
  )('#pal-main-nav');

  return true;
};
//------ パブリックメソッド/initModule/終了 ------------------------
