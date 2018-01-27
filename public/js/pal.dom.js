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
/*global $, pal */

pal.dom = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      logout_title          : 'ログアウトします。',
      login_title           : 'IDとパスワードでログインします。',
      register_title        : 'IDとパスワードを登録します。',
      menu_retracted_title  : 'クリックしてメニューを開きます',
      menu_extended_title   : 'クリックしてメニューを閉じます'
    },
    stateMap = {
      $container        : null,
      is_menu_retracted : true
    },
    jqueryMap = {},
    supportsTemplate,
    setJqueryMap,
    readSession,
    onClickTop,
    onClickLogin, onClickLogout, onClickRegister,
    onReceiveSession,
    toggle_menu,
    // onResize,
    setSection,
    request,  // XMLHttpRequest
    initModule;
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
  supportsTemplate = function () {
    var
      template  = document.createElement('template');

    return template.content !== undefined;
  };
  // ユーティリティメソッド/supportsTemplate/終了

  // ユーティリティメソッド/readSession/開始
  readSession = function () {
    var
      requestType = 'GET',
      url = '/session/read';

    // AjaxによりGETする
    request = pal.util_b.sendXmlHttpRequest(
      requestType,
      url,
      true,
      onReceiveSession
    );
  };
  // ユーティリティメソッド/readSession/終了

  // ユーティリティメソッド/toggle_menu/開始
  toggle_menu = function () {
    // メニューの表示非表示を切り替える
    var
      site_button,
      site_menu,
      expanded;

    // ボタンとメニューのノードを取得
    site_button = document.querySelector( '.pal-dom-header-menu' );
    site_menu = document.querySelector( '[aria-label="サイト"]' );

    expanded = site_button.getAttribute( 'aria-expanded' ) === 'true';

    site_button.setAttribute( 'aria-expanded', String(!expanded) );
    site_menu.hidden = expanded;
  };
  // ユーティリティメソッド/toggle_menu/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  // DOMメソッド/setJqueryMap/開始
  setJqueryMap = function () {
    var
      $container = stateMap.$container;

    jqueryMap = {
      $container  : $container,
      $top        : $container.find( '.pal-dom-header-title' ),
      $user_info  : $container.find( '#pal-dom-user-info' ),
      $date_info  : $container.find( '#pal-dom-date-info' ),
      $logout     : $container.find( '.pal-dom-header-logout' ),
      $login      : $container.find( '.pal-dom-header-login' ),
      $register   : $container.find( '.pal-dom-header-register' ),
      $menu       : $container.find( '.pal-dom-header-menu' ),
      $main       : $container.find( '#pal-main' ),
      $menu_list  : $container.find( '.pal-dom-menu-list' )
    };
  };
  // DOMメソッド/setJqueryMap/終了

  // DOMメソッド/setSection/開始
  // 目的: URLのハッシュが変更されたら呼ばれる。ハッシュの値を取得して対応するモジュールを初期化する。
  // 必須引数: なし
  // オプション引数: なし
  // 設定:
  //  * current_location_hash: カレントのハッシュの値を格納する。
  // 戻り値: なし
  // 例外発行: なし
  // 
  setSection = function () {
    var
      main_section,
      current_location_hash;

    current_location_hash = pal.bom.getLocationHash();

    // mainセクションを取得する
    main_section = document.getElementById( 'pal-main' );

    // mainセクションの子要素をすべて削除する
    pal.util.emptyElement( main_section );

    if ( current_location_hash.match( /#login/ ) ) {
      pal.login.initModule( jqueryMap.$main );
    }
    else if ( current_location_hash.match( /#logout/ ) ) {
      pal.logout.initModule( jqueryMap.$main );
    }
    else if ( current_location_hash.match( /#register/ ) ) {
      pal.register.initModule();
    }
    else if ( current_location_hash.match( /#menu/ ) ) {
      pal.menu.initModule( jqueryMap.$main );
    }
    else if ( current_location_hash.match( /#browser_information/ ) ) {
      pal.browserInformation.initModule( jqueryMap.$main );
    }
    else if ( current_location_hash.match( /#list/ ) ) {
      pal.list.initModule( jqueryMap.$main );
    }
    else if ( current_location_hash.match( /#lab/ ) ) {
      pal.lab.initModule( jqueryMap.$main );
    }
    else if ( current_location_hash.match( /#regist_schedule/ ) ) {
      pal.registSchedule.onHashchange( main_section );
    }
    else {
      readSession();
      pal.top.initModule( jqueryMap.$main );
    }

    // switch ( current_location_hash ) {
    //   case '':
    //     // サーバにSessionがあるかチェックしてメニューをコントロールする
    //     readSession();
    //     pal.top.initModule( jqueryMap.$main );
    //     break;
    //   case '#login':
    //     pal.login.initModule( jqueryMap.$main );
    //     break;
    //   case '#logout':
    //     pal.logout.initModule( jqueryMap.$main );
    //     break;
    //   case '#register':
    //     pal.register.initModule();
    //     break;
    //   case '#menu':
    //     pal.menu.initModule( jqueryMap.$main );
    //     break;
    //   case '#browser_information':
    //     pal.browserInformation.initModule( jqueryMap.$main );
    //     break;
    //   case '#list':
    //     pal.list.initModule( jqueryMap.$main );
    //     break;
    //   case '#lab':
    //     pal.lab.initModule( jqueryMap.$main );
    //     break;
    //     // case '#weekly_schedule':
    //   case /^#weekly_schedule/.test( current_location_hash ):
    //     pal.weeklySchedule.initModule( main_section );
    //     break;
    //   default:
    //     break;
    // }
  };
  // DOMメソッド/setSection/終了
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  onClickTop = function ( /* event */ ) {
    pal.bom.setLocationHash( '' );
  };

  onClickLogout = function ( /* event */ ) {
    pal.bom.setLocationHash( 'logout' );
  };

  onClickLogin = function ( /* event */ ) {
    pal.bom.setLocationHash( 'login' );
  };

  onClickRegister = function ( /* event */ ) {
    pal.bom.setLocationHash( 'register' );
  };
  

  onReceiveSession = function () {
    var
      response_map;

    if ( request && request.readyState === 4 ) {
      response_map = JSON.parse( request.responseText);

      if (request.status === 200 ) {
        jqueryMap.$logout.show();
        jqueryMap.$login.hide();
        jqueryMap.$register.hide();
        jqueryMap.$user_info.text( response_map.email );
      }
      else {
        jqueryMap.$logout.hide();
        jqueryMap.$login.show();
        jqueryMap.$register.show();
        jqueryMap.$user_info.text( response_map.email );
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
  initModule = function ( $container ) {
    var
      i,
      site_button,
      site_button_rect,
      site_menu,
      menu_ahchor,
      // pal_main,
      mainPage = document.querySelector( '#main-page' ).content;

    // HTMLをロードし、jQueryコレクションをマッピングする
    stateMap.$container = $container;

    // templateタグが利用可能であればtemplate#main-pageを描画する
    if ( supportsTemplate() ) {
      $container.html( mainPage );
    }
    else {
      console.log( 'templateは利用できません。' );
    }

    // ウィンドウのサイズが変更されたときのイベント
    // window.addEventListener( 'resize', onResize );

    setJqueryMap();

    // 機能モジュールを設定して初期化する/開始
    pal.top.initModule( jqueryMap.$main );
    // 機能モジュールを設定して初期化する/終了

    // クリックハンドラをバインドする
    // ヘッダーのトップ
    jqueryMap.$top
      .click( onClickTop );

    // ヘッダーのログアウト
    jqueryMap.$logout
      .attr( 'title', configMap.logout_title )
      .click( onClickLogout );

    // ヘッダーのログイン要素
    jqueryMap.$login
      .attr( 'title', configMap.login_title )
      .click( onClickLogin );

    // ヘッダーのサインアップ要素
    jqueryMap.$register
      .attr( 'title', configMap.register_title )
      .click( onClickRegister );

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

    // site_button.addEventListener( 'click', function () {
    //   // メニューの表示非表示を切り替える
    //   var expanded = this.getAttribute( 'aria-expanded' ) === 'true';

    //   this.setAttribute( 'aria-expanded', String(!expanded) );
    //   site_menu.hidden = expanded;

    // });

    site_button.addEventListener( 'click', toggle_menu, false );

    // メニューのaタグを取得
    menu_ahchor = document.querySelectorAll( '#pal-nav-menu a' );

    for ( i = 0; i < menu_ahchor.length; i = i + 1 ) {
      menu_ahchor[ i ].addEventListener( 'click', toggle_menu, false );
    }

    // フッターに日時を表示する(初回)
    jqueryMap.$date_info.html( pal.util_b.getNowDateJp() );

    // フッターに日時を表示する(次回以降)
    setInterval(
      function () {
        jqueryMap.$date_info.html( pal.util_b.getNowDateJp() );
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
}());
