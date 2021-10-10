/*
 * browserInformation.js
 * ブラウザ情報を表示する
*/

'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
var
  configMap = {
    settable_map  : { color_name: true },
    color_name    : 'blue'
  };
//--------------------- モジュールスコープ変数終了 -----------------

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
const configModule = function ( input_map ) {
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
export const browserInformation = ( /*$container*/ ) => {
  var
    main_section,
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

  frag = document.createDocumentFragment();

  head_one = document.createElement( "h1" );
  head_one_text = document.createTextNode( "screenオブジェクト" );
  head_one.appendChild( head_one_text );

  frag.appendChild( head_one );

  // screen_arrayの中身を表示
  for (let i = 0; i < screen_array.length; i += 1 ) {
     content_row = document.createElement( "p" );
     content_row_text = document.createTextNode(
      screen_array[i].text + ": " + screen_array[i].func
    );
    content_row.appendChild( content_row_text );
    frag.appendChild( content_row );
  }

  head_one = document.createElement( "h1" );
  head_one_text = document.createTextNode( "navigatorオブジェクト:" );
  head_one.appendChild( head_one_text );

  frag.appendChild( head_one );

  // navi_arrayの中身を表示
  for (let i = 0; i < navi_array.length; i += 1 ) {
    content_row = document.createElement( "p" );
    content_row_text = document.createTextNode(
      navi_array[i].text + ": " + navi_array[i].func
    );
    content_row.appendChild( content_row_text );
    frag.appendChild( content_row );
  }

  // DRP値の表示
  content_row = document.createElement( "p" );
  content_row_text = document.createTextNode( "DPR値:" + window.devicePixelRatio );
  content_row.appendChild( content_row_text );
  frag.appendChild( content_row );

  // Viewportの値の表示
  content_row = document.createElement( "p" );
  content_row_text = document.createTextNode( "Viewportの幅:" + window.innerWidth + " Viewportの高さ:" + window.innerHeight );
  content_row.appendChild( content_row_text );
  frag.appendChild( content_row );

  // mainセクションを取得する
  main_section = document.getElementById( 'pal-main' );

  // mainセクションの子要素をすべて削除する
  util.dom.emptyElement( main_section );

  // document fragmentを追加する
  main_section.appendChild( frag );

  return true;
};
// パブリックメソッド/initModule/終了
