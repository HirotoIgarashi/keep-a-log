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
      signup_title          : 'IDとパスワードを登録します。',
      menu_retracted_title  : 'クリックしてメニューを開きます',
      menu_extended_title   : 'クリックしてメニューを閉じます'
    },
    stateMap = {
      $container        : null,
      is_menu_retracted : true
    },
    // menuMap = [
    //   {
    //     title           : 'メニュー1',
    //     class_property  : 'pal-dom-menu-item-one'
    //   },
    //   {
    //     title           : 'メニュー2',
    //     class_property  : 'pal-dom-menu-item-two'
    //   },
    //   {
    //     title           : 'シンプルなリスト',
    //     class_property  : 'pal-dom-menu-item-three'
    //   }
    // ],
    jqueryMap = {},

    supportsTemplate,
    setJqueryMap,
    // makeList,
    readSession,
    onClickTop,
    onClickLogin, onClickLogout, onClickSignup, onClickMenu,
    onReceiveSession,
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

  // ユーティリティメソッド/makeList/開始
  // makeList = function ( item_list ) {
  //   var
  //     i, html = '';

  //   html += '<ul style="list-style-type:none">';

  //   for ( i = 0; i < menuMap.length; i++ ) {
  //     html += '<li class="' + item_list[i].class_property + '">' + item_list[i].title + '</li>';
  //   }

  //   html += '</ul>';

  //   return html;
  // };
  // ユーティリティメソッド/makeList/終了
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
      $signup     : $container.find( '.pal-dom-header-signup' ),
      $menu       : $container.find( '.pal-dom-header-menu' ),
      $section    : $container.find( '.pal-dom-section' ),
      $menu_list  : $container.find( '.pal-dom-menu-list' )
    };
  };
  // DOMメソッド/setJqueryMap/終了

  // DOMメソッド/toggleMenu/開始
  // 概要:
  // 用例:
  // 目的: メニューの開閉
  // 引数:
  //  * do_extend - trueの場合、メニューを開く。falseの場合は閉じる
  // 設定:
  // 動作:
  // 戻り値: boolean
  //  * true  - メニューの開閉を行った
  //  * false - メニューの開閉を行わなかった
  // 例外発行:
  // toggleMenu = function ( do_extend ) {
  //   if ( do_extend ) {
  //     jqueryMap.$menu_list.css({display:'block'});
  //     stateMap.is_menu_retracted = false;
  //   }
  //   else {
  //     jqueryMap.$menu_list.css({display:'none'});
  //     stateMap.is_menu_retracted = true;
  //   }
  //   return true;
  // };
  // DOMメソッド/toggleMenu/終了

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
    var current_location_hash;

    current_location_hash = pal.bom.getLocationHash();

    switch ( current_location_hash ) {
      case '':
        // サーバにSessionがあるかチェックしてメニューをコントロールする
        readSession();
        // console.log( 'hashが空白になりました。' );
        pal.top.initModule( jqueryMap.$section );
        break;
      case '#login':
        pal.login.initModule( jqueryMap.$section );
        break;
      case '#logout':
        pal.logout.initModule( jqueryMap.$section );
        break;
      case '#signup':
        console.log( '#signupがクリックされました' );
        //pal.signup.initModule();
        break;
      case '#menu':
        pal.menu.initModule( jqueryMap.$section );
        break;
      case '#list':
        pal.list.initModule( jqueryMap.$section );
        break;
      default:
        break;
    }
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

  onClickSignup = function ( /* event */ ) {
    pal.bom.setLocationHash( 'signup' );
  };
  
  onClickMenu = function ( /* event */ ) {
    pal.bom.setLocationHash( 'menu' );
  };

  onReceiveSession = function () {
    var
      response_map;

    if ( request && request.readyState === 4 ) {
      response_map = JSON.parse( request.responseText);

      if (request.status === 200 ) {
        jqueryMap.$logout.show();
        jqueryMap.$login.hide();
        jqueryMap.$signup.hide();
        jqueryMap.$user_info.text( response_map.email );
      }
      else {
        jqueryMap.$logout.hide();
        jqueryMap.$login.show();
        jqueryMap.$signup.show();
        jqueryMap.$user_info.text( response_map.email );
      }

    }
  };
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
    var mainPage = document.querySelector( '#main-page' ).content;
        // menu_html = makeList( menuMap );

    // HTMLをロードし、jQueryコレクションをマッピングする
    stateMap.$container = $container;

    // templateタグが利用可能であればtemplate#main-pageを描画する
    if ( supportsTemplate() ) {
      $container.html( mainPage );
    }
    else {
      console.log( 'templateは利用できません。' );
    }

    setJqueryMap();

    // 機能モジュールを設定して初期化する/開始
    pal.top.initModule( jqueryMap.$section );
    // 機能モジュールを設定して初期化する/終了

    // // メニューにアイテムを追加する。
    // jqueryMap.$menu_list
    //   .html( menu_html );

    // // メニューのアイテムをjqueryMapに追加する。
    // jqueryMap.$menu_item1 = jqueryMap.$container.find( '.pal-dom-item-one' );
    // jqueryMap.$menu_item2 = jqueryMap.$container.find( '.pal-dom-item-two' );
    // jqueryMap.$menu_item3 = jqueryMap.$container.find( '.pal-dom-item-three' );

    // クリックハンドラをバインドする
    // ヘッダーのトップ
    jqueryMap.$top
      .click( onClickTop );

    // ヘッダーのログアウト
    jqueryMap.$logout
      .attr( 'title', configMap.logout_title )
      .click( onClickLogout );

    // ヘッダーのログイン
    jqueryMap.$login
      .attr( 'title', configMap.login_title )
      .click( onClickLogin );

    // ヘッダーのサインアップ
    jqueryMap.$signup
      .attr( 'title', configMap.signup_title )
      .click( onClickSignup );

    // ヘッダーのメニュー
    jqueryMap.$menu
      .attr( 'title', configMap.menu_retracted_title )
      .click( onClickMenu );

    setInterval(
      function () {
        jqueryMap.$date_info.html( pal.util_b.getNowJp() );
      },
      1000
    );
    // io.connect().on( 'message',
    //   function ( count ) {
    //     jqueryMap.$date_info.html( count );
    //   }
    // );

  };
  // パブリックメソッド/initModule/終了

  return {
    initModule  : initModule,
    setSection  : setSection
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
