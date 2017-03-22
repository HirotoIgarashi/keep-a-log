/*
 * pal.shell.js
 * PALのshellモジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/
/*global $, pal */

pal.shell = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      login_title           : 'IDとパスワードでログインします。',
      signup_title          : 'IDとパスワードを登録します。',
      menu_retracted_title  : 'クリックしてメニューを開きます',
      menu_extended_title   : 'クリックしてメニューを閉じます'
    },
    stateMap = {
      $container        : null,
      is_menu_retracted : true
    },
    menuMap = [
      {
        title           : 'メニュー1',
        class_property  : 'pal-shell-menu-item-one'
      },
      {
        title           : 'メニュー2',
        class_property  : 'pal-shell-menu-item-two'
      },
      {
        title           : 'シンプルなリスト',
        class_property  : 'pal-shell-menu-item-three'
      }
    ],
    jqueryMap = {},

    supportsTemplate,
    setJqueryMap,
    setHistory,
    makeList,
    toggleMenu,
    onClickLogin, onClickSignup, onClickMenu,
    initModule;
  //--------------------- モジュールスコープ変数終了 -----------------
  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/setHistory/開始
  setHistory = function( url ) {
    if ( window.history && window.history.pushState ) {
      // window.history.pushState( state, title, url );
      window.history.pushState( null, null, '#' + url );
    }
  };
  // ユーティリティメソッド/setHistory/終了
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
  makeList = function ( item_list ) {
    var
      i, html = '';

    html += '<ul style="list-style-type:none">';

    for ( i = 0; i < menuMap.length; i++ ) {
      html += '<li class="' + item_list[i].class_property + '">' + item_list[i].title + '</li>';
    }

    html += '</ul>';

    return html;
  };
  // ユーティリティメソッド/makeList/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  // DOMメソッド/setJqueryMap/開始
  setJqueryMap = function () {
    var
      $container = stateMap.$container;

    jqueryMap = {
      $container  : $container,
      $login      : $container.find( '.pal-shell-header-login' ),
      $signup     : $container.find( '.pal-shell-header-signup' ),
      $menu       : $container.find( '.pal-shell-header-menu' ),
      $section    : $container.find( '.pal-shell-section' ),
      $menu_list  : $container.find( '.pal-shell-menu-list' )
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
  toggleMenu = function ( do_extend ) {
    if ( do_extend ) {
      jqueryMap.$menu_list.css({display:'block'});
      stateMap.is_menu_retracted = false;
    }
    else {
      jqueryMap.$menu_list.css({display:'none'});
      stateMap.is_menu_retracted = true;
    }
    return true;
  };
  // DOMメソッド/toggleMenu/終了
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  onClickLogin = function ( /* event */ ) {
    setHistory( 'login' );

    return false;
  };

  onClickSignup = function ( /* event */ ) {
    setHistory( 'signup' );

    return false;
  };
  
  onClickMenu = function ( /* event */ ) {
    setHistory( 'menu' );
    toggleMenu( stateMap.is_menu_retracted );

    return false;
  };
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- コールバック開始 --------------------
  // --------------------- コールバック終了 --------------------

  // --------------------- パブリックメソッド開始 --------------------
  // パブリックメソッド/initModule/開始
  // 用例: pal.shell.initModule( $('#app_div_id') );
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
      mainPage  = document.querySelector( '#main-page' ).content,
      menu_html = makeList( menuMap );

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
    pal.module.initModule( jqueryMap.$section );
    // 機能モジュールを設定して初期化する/終了

    // メニューにアイテムを追加する。
    jqueryMap.$menu_list
      .html( menu_html );

    // メニューのアイテムをjqueryMapに追加する。
    jqueryMap.$menu_item1 = jqueryMap.$container.find( '.pal-shell-item-one' );
    jqueryMap.$menu_item2 = jqueryMap.$container.find( '.pal-shell-item-two' );
    jqueryMap.$menu_item3 = jqueryMap.$container.find( '.pal-shell-item-three' );
    console.log( jqueryMap );

    // クリックハンドラをバインドする
    jqueryMap.$login
      .attr( 'title', configMap.login_title )
      .click( onClickLogin );

    jqueryMap.$signup
      .attr( 'title', configMap.signup_title )
      .click( onClickSignup );

    jqueryMap.$menu
      .attr( 'title', configMap.menu_retracted_title )
      .click( onClickMenu );

  };
  // パブリックメソッド/initModule/終了

  return { initModule : initModule };
  // --------------------- パブリックメソッド終了 --------------------
}());
