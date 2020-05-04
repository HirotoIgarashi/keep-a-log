/*
 * pal.top.js
 * TOPページを表示する機能
*/

/*global pal util*/

pal.top = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  // DOMメソッド/makeNav/開始 ----------------------------------------
  const makeNav = () => {
    let frag = util.dom.createFragment();

    let ulElement = util.dom.createElement(
      {
        tagName: 'ul',
        id: 'pal-main-nav-list'
      }
    );

    let liHome = util.dom.createElement('li');
    let buttonHome = util.dom.createElement('button');

    let anchorHome = util.dom.createElement(
      {
        tagName:'a',
        href: '#',
        onfocus: 'this.blur();',
        innerHTML: 'ホーム'
      }
    );

    util.dom.appendChild(buttonHome, anchorHome);
    util.dom.appendChild(liHome, buttonHome);

    let liPlan = util.dom.createElement('li');
    let buttonPlan = util.dom.createElement('button');

    let anchorPlan = util.dom.createElement(
      {
        tagName:'a',
        href: '#plan',
        onfocus: 'this.blur();',
        innerHTML: 'プラン'
      }
    );

    util.dom.appendChild(buttonPlan, anchorPlan);
    util.dom.appendChild(liPlan, buttonPlan);

    let liCalendar = util.dom.createElement('li');
    let buttonCalendar = util.dom.createElement('button');

    let anchorCalendar = util.dom.createElement(
      {
        tagName:'a',
        href: '#calendar',
        onfocus: 'this.blur();',
        innerHTML: 'カレンダー'
      }
    );

    util.dom.appendChild(buttonCalendar, anchorCalendar);
    util.dom.appendChild(liCalendar, buttonCalendar);

    let liChat = util.dom.createElement('li');
    let buttonChat = util.dom.createElement('button');

    let anchorChat = util.dom.createElement(
      {
        tagName:'a',
        href: '/chat',
        onfocus: 'this.blur();',
        innerHTML: 'チャット'
      }
    );

    util.dom.appendChild(buttonChat, anchorChat);
    util.dom.appendChild(liChat, buttonChat);

    // -----HTMLを組み立てる------------------------------------------
    // ulタグの組み立て/開始 ------------------------------------------
    util.dom.appendChild(ulElement, liHome);
    util.dom.appendChild(ulElement, liPlan);
    util.dom.appendChild(ulElement, liCalendar);
    util.dom.appendChild(ulElement, liChat);
    // ulタグの組み立て/終了 ------------------------------------------

    util.dom.appendChild(frag, ulElement);

    return frag;
  };
  // DOMメソッド/makeNav/終了 ----------------------------------------
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- パブリックメソッド開始 --------------------

  //------ パブリックメソッド/initModule/開始 ------------------------
  // 目的: モジュールを初期化する
  // 引数:
  //  なし
  // 戻り値: true
  // 例外発行: なし
  //
  const initModule = function () {
    const main_section = document.getElementById( 'pal-main' );
    const top_page = pal.util_b.getTplContent( 'top-page' );

    //----- mainセクションの子要素をすべて削除する -------------------
    pal.util.emptyElement( main_section );

    //----- topページを表示する --------------------------------------
    main_section.appendChild(top_page);

    // pal-main-navの子要素を削除してから表示する --------------------
    let palMainNav = document.querySelector('#pal-main-nav');

    pal.util.emptyElement(palMainNav);

    util.dom.appendChild(
      document.querySelector('#pal-main-nav'),
      makeNav()
    );

    return true;
  };
  //------ パブリックメソッド/initModule/終了 ------------------------

  // パブリックメソッドを返す
  return {
    initModule    : initModule
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
