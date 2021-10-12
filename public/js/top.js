/*
 * top.js
 * TOPページを表示する機能
*/

'use strict';
import { getTplContent, compose } from "./utilCore.js";
import {
  createDocumentFragment, createElement, appendByTreeArray,
  appendChildCurried, emptyElement, getElementById,
  querySelector
} from "./utilDom.js";

//--------------------- DOMメソッド開始 ----------------------------
// DOMメソッド/makeNav/開始 ----------------------------------------
export const makeNav = () => {
  let frag = createDocumentFragment();
  let ulElement = createElement('ul', {
    id: 'pal-main-nav-list'
  });
  let liHome = createElement('li');
  let buttonHome = createElement('button', {
    id: 'pal-nav-home',
    'aria-pressed': 'false'
  });
  let anchorHome = createElement('a', {
    href: '#',
    onfocus: 'this.blur();',
    textContent: 'ホーム'
  });
  let liEvent = createElement('li');
  let buttonEvent = createElement('button', {
    id: 'pal-nav-event',
    'aria-pressed': 'false'
  });
  let anchorEvent = createElement('a', {
    href: '#event',
    onfocus: 'this.blur();',
    textContent: 'イベント'
  });
  let liCalendar = createElement('li');
  let buttonCalendar = createElement('button', {
    id: 'pal-nav-calendar',
    'aria-pressed': 'false'
  });
  let anchorCalendar = createElement('a', {
    href: '#calendar',
    onfocus: 'this.blur();',
    textContent: 'カレンダー'
  });

  let liChat = createElement('li');

  let buttonChat = createElement('button', {
    id: 'pal-nav-chat',
    'aria-pressed': 'false'
  });

  let anchorChat = createElement('a', {
    href: '/chat',
    onfocus: 'this.blur();',
    textContent: 'チャット'
  });

  // -----HTMLを組み立てる------------------------------------------
  appendByTreeArray([
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
  compose(
    appendChildCurried(topPage),
    emptyElement,
    getElementById
  )('pal-main');

  // pal-main-navの子要素を削除してから表示する --------------------
  compose(
    appendChildCurried(makeNav()),
    emptyElement,
    querySelector
  )('#pal-main-nav');

  return true;
};
//------ パブリックメソッド/initModule/終了 ------------------------
