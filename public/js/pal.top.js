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
    let ulElement = util.dom.createElement({
        tagName: 'ul',
        id: 'pal-main-nav-list'
    });
    let liHome = util.dom.createElement('li');
    let buttonHome = util.dom.createElement({
      tagName: 'button',
      id: 'pal-nav-home'
    });
    buttonHome.setAttribute('aria-pressed', 'false');
    let anchorHome = util.dom.createElement({
      tagName:'a',
      href: '#',
      onfocus: 'this.blur();',
      textContent: 'ホーム' 
    });
    let liPlan = util.dom.createElement('li');
    let buttonPlan = util.dom.createElement({
      tagName: 'button',
      id: 'pal-nav-event'
    });
    buttonPlan.setAttribute('aria-pressed', 'false');
    let anchorPlan = util.dom.createElement({
      tagName:'a',
      href: '#event',
      onfocus: 'this.blur();',
      textContent: 'イベント'
    });
    let liCalendar = util.dom.createElement('li');
    let buttonCalendar = util.dom.createElement({
      tagName: 'button',
      id: 'pal-nav-calendar'
    });
    buttonCalendar.setAttribute('aria-pressed', 'false');
    let anchorCalendar = util.dom.createElement({
      tagName:'a',
      href: '#calendar',
      onfocus: 'this.blur();',
      textContent: 'カレンダー'
    });


    let liChat = util.dom.createElement('li');

    let buttonChat = util.dom.createElement({
      tagName: 'button',
      id: 'pal-nav-chat'
    });
    buttonChat.setAttribute('aria-pressed', 'false');

    let anchorChat = util.dom.createElement({
        tagName:'a',
        href: '/chat',
        onfocus: 'this.blur();',
        textContent: 'チャット'
    });

    // -----HTMLを組み立てる------------------------------------------
    util.dom.appendByTreeArray([
      frag, [
        ulElement, [
          liHome, [buttonHome, [anchorHome]],
          liPlan, [buttonPlan, [anchorPlan]],
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
