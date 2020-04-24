'use strict';

/*
 * pal.dom.js
 * PALのDOM(Document Object Model)制御モジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/
/*global pal util*/

pal.dom = (() => {
  //--------------------- モジュールスコープ変数開始 -----------------
  const configMap = {
    logout_title          : 'ログアウトします。',
    login_title           : 'IDとパスワードでログインします。',
    register_title        : 'IDとパスワードを登録します。',
    menu_retracted_title  : 'クリックしてメニューを開きます',
    menu_extended_title   : 'クリックしてメニューを閉じます'
  };

  let request;  // XMLHttpRequest
  let elementMap = {};
  var
    stateMap = {
      $container        : null,
      is_menu_retracted : true
    };
    // onResize,
  //--------------------- モジュールスコープ変数終了 -----------------
  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/supportsTemplate/開始
  // <template>の機能を検知する
  // 概要:
  // 用例:
  // 目的:
  // 引数:
  // 動作: templateタグがcontentプロパティを持っていたらtrueを返す
  // 戻り値:
  //  * true  - templateタグを利用できる
  //  * false - templateタグを利用できない
  // 例外発行: なし
  const supportsTemplate = function () {
    var
      template  = document.createElement('template');

    return template.content !== undefined;
  };
  // ユーティリティメソッド/supportsTemplate/終了

  //----- ユーティリティメソッド/readSession/開始 --------------------
  const readSession = function () {
    const requestType = 'GET';
    const url = '/session/read';

    // AjaxによりGETする
    request = pal.util_b.sendXmlHttpRequest(
      requestType,
      url,
      true,
      onReceiveSession
    );
  };
  //----- ユーティリティメソッド/readSession/終了 --------------------

  // ユーティリティメソッド/toggle_menu/開始
  const toggle_menu = function () {
    // メニューの表示非表示を切り替える
    var
      site_button,
      site_menu,
      expanded;

    // ボタンとメニューのノードを取得 --------------------------------
    site_button = document.querySelector( '.pal-dom-header-menu' );
    site_menu = document.querySelector( '[aria-label="サイト"]' );

    expanded = site_button.getAttribute( 'aria-expanded' ) === 'true';

    site_button.setAttribute( 'aria-expanded', String(!expanded) );
    site_menu.hidden = expanded;
  };
  // ユーティリティメソッド/toggle_menu/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  // DOMメソッド/setElementMap/開始
  const setElementMap = () => {
    var
      content = stateMap.$container;

    elementMap = {
      $container  : content,
      $top        : content.getElementsByClassName('pal-dom-header-title'),
      $user_info  : document.getElementById('pal-dom-user-info'),
      $date_info  : document.getElementById( 'pal-dom-date-info' ),
      $logout     : content.getElementsByClassName('pal-dom-header-logout'),
      $login      : content.getElementsByClassName('pal-dom-header-login'),
      $register   : content.getElementsByClassName('pal-dom-header-register'),
      $menu       : content.getElementsByClassName('pal-dom-header-menu'),
      $main       : document.getElementById('pal-main'),
      $menu_list  : content.getElementsByClassName('pal-dom-menu-list')
    };
  };
  // DOMメソッド/setElementMap/終了

  // DOMメソッド/setSection/開始
  // 目的: URLのハッシュが変更されたら呼ばれる。ハッシュの値を取得して対応する
  // モジュールを初期化する。
  // 必須引数: なし
  // オプション引数: なし
  // 設定:
  //  * current_location_hash: カレントのハッシュの値を格納する。
  // 戻り値: なし
  // 例外発行: なし
  // 
  const setSection = () => {
    // mainセクションを取得する
    const main_section = document.getElementById('pal-main');

    let current_location_hash = pal.bom.getLocationHash();

    console.log(current_location_hash);

    // mainセクションの子要素をすべて削除する
    // mainセクションの子要素の削除は下位のモジュールにまかせる

    if (current_location_hash.match(/#login/)) {
      pal.login.initModule(main_section);
    }
    else if (current_location_hash.match(/#logout/)) {
      pal.logout.initModule(main_section);
    }
    else if (current_location_hash.match(/#register/)) {
      pal.register.initModule(main_section);
    }
    else if (current_location_hash.match(/#menu/)) {
      pal.menu.initModule(main_section);
    }
    else if (current_location_hash.match(/#browser_information/)) {
      pal.browserInformation.initModule(main_section);
    }
    else if (current_location_hash.match(/#list/)) {
      pal.list.onHashchange( main_section );
    }
    else if (current_location_hash.match(/#lab/)) {
      pal.lab.initModule(main_section);
    }
    else if (current_location_hash.match(/#regist_schedule/)) {
      pal.registSchedule.onHashchange(main_section);
    }
    else if (current_location_hash.match(/#calendar/)) {
      pal.calendar.onHashchange(main_section);
    }
    else if (current_location_hash.match(/#cycle_system/)) {
      pal.cycleSystem.initModule( main_section );
    }
    else {
      readSession();
      pal.top.initModule(main_section);
    }

  };
  // DOMメソッド/setSection/終了
  // DOMメソッド/makeFooter/開始 -------------------------------------
  const makeFooter = () => {
    let frag = util.dom.createFragment();
    // navタグの作成 -------------------------------------------------
    let navElement = util.dom.createElement('nav');
    let ulElement = util.dom.createElement('ul');

    let liHome = util.dom.createElement('li');
    let buttonHome = util.dom.createElement('button');
    let anchorHome = util.dom.createElement('a');
    util.dom.setAttribute(anchorHome, 'href', '#');
    util.dom.setAttribute(anchorHome, 'onfocus', 'this.blur();');
    util.dom.innerHTML(anchorHome, 'ホーム');
    util.dom.appendChild(buttonHome, anchorHome);
    util.dom.appendChild(liHome, buttonHome);

    let liPlan = util.dom.createElement('li');
    let buttonPlan = util.dom.createElement('button');
    let anchorPlan = util.dom.createElement('a');
    util.dom.setAttribute(anchorPlan, 'href', '#plan');
    util.dom.setAttribute(anchorPlan, 'onfocus', 'this.blur();');
    util.dom.innerHTML(anchorPlan, 'プラン');
    util.dom.appendChild(buttonPlan, anchorPlan);
    util.dom.appendChild(liPlan, buttonPlan);

    let liCalendar = util.dom.createElement('li');
    let buttonCalendar = util.dom.createElement('button');
    let anchorCalendar = util.dom.createElement('a');
    util.dom.setAttribute(anchorCalendar, 'href', '#calendar');
    util.dom.setAttribute(anchorCalendar, 'onfocus', 'this.blur();');
    util.dom.innerHTML(anchorCalendar, 'カレンダー');
    util.dom.appendChild(buttonCalendar, anchorCalendar);
    util.dom.appendChild(liCalendar, buttonCalendar);

    let liChat = util.dom.createElement('li');
    let buttonChat = util.dom.createElement('button');
    let anchorChat = util.dom.createElement('a');
    util.dom.setAttribute(anchorChat, 'href', '/chat');
    util.dom.setAttribute(anchorChat, 'onfocus', 'this.blur();');
    util.dom.innerHTML(anchorChat, 'チャット');
    util.dom.appendChild(buttonChat, anchorChat);
    util.dom.appendChild(liChat, buttonChat);

    let spanElement = util.dom.createElement('span');
    util.dom.setAttribute(spanElement, 'id', 'pal-dom-date-info');

    // -----HTMLを組み立てる------------------------------------------
    // ulタグの組み立て/開始 ------------------------------------------
    util.dom.appendChild(ulElement, liHome);
    util.dom.appendChild(ulElement, liPlan);
    util.dom.appendChild(ulElement, liCalendar);
    util.dom.appendChild(ulElement, liChat);
    // ulタグの組み立て/終了 ------------------------------------------
    util.dom.appendChild(navElement, ulElement);

    util.dom.appendChild(frag, navElement);
    util.dom.appendChild(frag, spanElement);

    return frag;
  };
  // DOMメソッド/makeFooter/終了 -------------------------------------
  //--------------------- DOMメソッド終了 ----------------------------
  // --------------------- イベントハンドラ開始 ----------------------
  const onClickTop = ( /* event */ ) => pal.bom.setLocationHash('');

  const onClickLogout = ( /* event */ ) =>
    pal.bom.setLocationHash('logout');

  const onClickLogin = ( /* event */ ) =>
    pal.bom.setLocationHash('login');

  const onClickRegister = ( /* event */ ) =>
    pal.bom.setLocationHash('register');

  const onReceiveSession = () => {
    if ( request && request.readyState === 4 ) {
      let response_map = JSON.parse(request.responseText);

      if (request.status === 200 ) {
        elementMap.$logout[0].style.visibility = 'visible';
        elementMap.$login[0].style.visibility = 'hidden';
        elementMap.$register[0].style.visibility = 'hidden';
        elementMap.$user_info.textContent =
          `${response_map.name.first} ${response_map.name.last}
としてログインしています`;
      }
      else {
        elementMap.$logout[0].style.visibility = 'hidden';
        elementMap.$login[0].style.visibility = 'visible';
        elementMap.$register[0].style.visibility = 'visible';
        elementMap.$user_info.textContent = response_map.email;
      }
    }
  };
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

  //   header  = document.getElementById( 'pal-header' );
  //   nav     = document.getElementById( 'pal-nav' );
  //   main    = document.getElementById( 'pal-main' );
  //   footer  = document.getElementById( 'pal-footer' );

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

  // --------------------- コールバック開始 --------------------
  // --------------------- コールバック終了 --------------------

  // --------------------- パブリックメソッド開始 --------------------
  // パブリックメソッド/initModule/開始
  // 用例: pal.dom.initModule( $('#app_div_id') );
  // 目的:
  // 引数:
  //  * $append_target (例: $('#app_div_id'))
  //  1つのDOMコンテナを表すjQueryコレクション
  // 動作:
  //  $containerにUIのシェルを含め、機能モジュールを構成して初期化する。
  //  シェルはURIアンカーやCookieの管理などのブラウザ全体に及ぶ問題を担当する。
  // 戻り値: なし
  // 例外発行: なし
  //
  const initModule = (content) => {
    const mainPage = document.querySelector('#main-page').content;
    var
      site_button,
      site_button_rect,
      site_menu,
      menu_ahchor;

    // HTMLをロードし、jQueryコレクションをマッピングする
    stateMap.$container = content;

    // templateタグが利用可能であればtemplate#main-pageを描画する-----
    if (supportsTemplate()) {
      content.appendChild(mainPage);
    }
    else {
      console.log( 'templateは利用できません。' );
    }

    // footerを表示する ----------------------------------------------
    util.dom.appendChild(
      document.querySelector('#pal-footer'),
      makeFooter()
    );

    // ウィンドウのサイズが変更されたときのイベント
    // window.addEventListener( 'resize', onResize );

    // DOM要素を取得する ---------------------------------------------
    setElementMap();

    // 機能モジュールを設定して初期化する/開始
    pal.top.initModule(mainPage);

    // 機能モジュールを設定して初期化する/終了

    // クリックハンドラをバインドする
    // ヘッダーのトップ
    elementMap.$top[0].addEventListener('click', onClickTop);

    // ヘッダーのログアウト
    elementMap.$logout[0].setAttribute('title', configMap.logout_title);
    elementMap.$logout[0].addEventListener('click', onClickLogout);

    // ヘッダーのログイン要素
    elementMap.$login[0].setAttribute('title', configMap.login_title);
    elementMap.$login[0].addEventListener('click', onClickLogin);

    // ヘッダーのサインアップ要素
    elementMap.$register[0].setAttribute('title', configMap.register_title);
    elementMap.$register[0].addEventListener('click', onClickRegister);

    // ボタンとメニューのノードを取得
    site_button = document.querySelector( '.pal-dom-header-menu' );
    site_menu = document.querySelector( '[aria-label="サイト"]' );

    // 初期の(メニューが閉じているときの)状態と設定
    site_button.setAttribute( 'aria-expanded', 'false' );
    site_button.hidden = false;
    site_menu.hidden = true;

    // サイトボタンの位置座標を取得してメニューの表示位置を指定する
    // サイトボタンのbottomをサイトメニューのtopに指定する
    site_button_rect = site_button.getBoundingClientRect();
    site_menu.style.top = site_button_rect.bottom + 'px';

    site_button.addEventListener( 'click', toggle_menu, false );

    // メニューのaタグを取得
    menu_ahchor = document.querySelectorAll( '#pal-nav-menu a' );

    for (let i = 0; i < menu_ahchor.length; i = i + 1 ) {
      menu_ahchor[ i ].addEventListener( 'click', toggle_menu, false );
    }

    //----- フッターに日時を表示する(初回) ---------------------------
    elementMap.$date_info.textContent = pal.util_b.getNowDateJp();

    //------ フッターに日時を表示する(次回以降) ----------------------
    setInterval(
      function () {
        elementMap.$date_info.textContent = pal.util_b.getNowDateJp();
      },
      1000
    );

  };
  // パブリックメソッド/initModule/終了

  return {
    initModule  : initModule,
    setSection  : setSection
  };
  // --------------------- パブリックメソッド終了 --------------------
})();
