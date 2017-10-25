/*
 * pal.browserInformation.js
 * ブラウザ情報を表示する
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global $, pal */

pal.browserInformation = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    // stateMap = { $container : null },
    // jqueryMap = {},

    // setJqueryMap,
    configModule, initModule;
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/example_method/開始
  // 目的:
  // 必須引数:
  //  * do_extend(プール値) trueはスライダーを拡大し、falseは格納する。
  // オプション引数:
  //  * callback(関数) アニメーションの完了後に実行される。
  // 設定:
  //  * chat_extend_time, chat_retract_time
  //  * chat_extend_height
  // 戻り値: boolean
  //  * true: スライダーアニメーションが動作した。
  //  * false: スライダーアニメーションが動作していない。
  // 例外発行: なし
  // example_method = function () {
  //   var example;
  //   return example;
  // };
  // ユーティリティメソッド/example_method/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  // DOMメソッド/setJqueryMap/開始
  // setJqueryMap = function () {
  //   var $container = stateMap.$container;

  //   jqueryMap = { $container  : $container };
  // };
  // DOMメソッド/setJqueryMap/終了
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- パブリックメソッド開始 --------------------
  // パブリックメソッド/configModule/開始
  // 目的: 許可されたキーの構成を調整する
  // 引数: 設定可能なキーバリューマップ
  //  * color_name  - 使用する色
  // 設定:
  //  * configMap.settable_map 許可されたキーを宣言する
  // 戻り値: true
  // 例外発行: なし
  //
  configModule = function ( input_map ) {
    pal.butil.setConfigMap({
      input_map     : input_map,
      settable_map  : configMap.settable_map,
      config_map    : configMap
    });
    return true;
  };
  // パブリックメソッド/configModule/終了

  // パブリックメソッド/initModule/開始
  // 目的: モジュールを初期化する
  // 引数:
  //  * $container この機能が使うjQuery要素
  // 戻り値: true
  // 例外発行: なし
  //
  initModule = function ( /*$container*/ ) {
    var
      i,
      main_section,
      main_section_children,
      head_one,
      head_one_text,
      content_row,
      content_row_text,
      frag,
      navi_array = [
        {
          text  : "userAgent",
          func  : navigator.userAgent
        },
        {
          text  : "appName",
          func  : navigator.appName
        },
        {
          text  : "appCodeName",
          func  : navigator.appCodeName
        },
        {
          text  : "appVersion",
          func  : navigator.appVersion
        },
        {
          text  : "appMinorVersion",
          func  : navigator.appMinorVersion
        },
        {
          text  : "platform",
          func  : navigator.platform
        },
        {
          text  : "cookieEnabled",
          func  : navigator.cookieEnabled
        },
        {
          text  : "onLine",
          func  : navigator.onLine
        },
        {
          text  : "userLanguage",
          func  : navigator.userLanguage
        }
      ],
      screen_array = [
        {
          text  : "availTop",
          func  : screen.availTop
        },
        {
          text  : "availLeft",
          func  : screen.availLeft
        },
        {
          text  : "availWidth",
          func  : screen.availWidth
        },
        {
          text  : "availHeight",
          func  : screen.availHeight
        },
        {
          text  : "colorDepth",
          func  : screen.colorDepth
        },
        {
          text  : "pixelDepth",
          func  : screen.pixelDepth
        }
      ];

    main_section = document.getElementById( "pal-main" );

    frag = document.createDocumentFragment();

    head_one = document.createElement( "h1" );
    head_one_text = document.createTextNode( "navigatorオブジェクト:" );
    head_one.appendChild( head_one_text );

    frag.appendChild( head_one );

    // navi_arrayの中身を表示
    for ( i = 0; i < navi_array.length; i += 1 ) {
      content_row = document.createElement( "p" );
      content_row_text = document.createTextNode(
        navi_array[i].text + ": " + navi_array[i].func
      );
      content_row.appendChild( content_row_text );
      frag.appendChild( content_row );
    }

    head_one = document.createElement( "h1" );
    head_one_text = document.createTextNode( "screenオブジェクト" );
    head_one.appendChild( head_one_text );

    frag.appendChild( head_one );

    // screen_arrayの中身を表示
    for ( i = 0; i < screen_array.length; i += 1 ) {
      content_row = document.createElement( "p" );
      content_row_text = document.createTextNode(
        screen_array[i].text + ": " + screen_array[i].func
      );
      content_row.appendChild( content_row_text );
      frag.appendChild( content_row );
    }

    console.log( window.location.href );
    console.log( window.location.pathname );

    main_section_children = main_section.children;

    // #mainの子要素をすべて削除する
    for ( i = 0; i < main_section_children.length; i += 1 ) {
      main_section.removeChild( main_section_children[ i ] );
    }

    // document fragmentを追加する
    main_section.appendChild( frag );

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    configModule  : configModule,
    initModule    : initModule
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
