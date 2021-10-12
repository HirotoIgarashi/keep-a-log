/*
 * browserInformation.js
 * ブラウザ情報を表示する
*/

'use strict';

import {
  emptyElement, createDocumentFragment, createElement, createTextNode,
  getElementById
} from "./utilDom.js";

// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/browserInformation/開始
// 目的: モジュールを初期化する
// 引数:
//  * $container この機能が使うjQuery要素
// 戻り値: true
// 例外発行: なし
//
export const browserInformation = ( /*$container*/ ) => {
  var
    content_row,
    content_row_text;
  let navi_array = [
      { text  : "userAgent", func  : navigator.userAgent },
      { text  : "appName", func  : navigator.appName },
      { text  : "appCodeName", func  : navigator.appCodeName },
      { text  : "appVersion", func  : navigator.appVersion },
      { text  : "appMinorVersion", func  : navigator.appMinorVersion },
      { text  : "platform", func  : navigator.platform },
      { text  : "cookieEnabled", func  : navigator.cookieEnabled },
      { text  : "onLine", func  : navigator.onLine },
      { text  : "userLanguage", func  : navigator.userLanguage }
    ],
    screen_array = [
      { text  : "availTop", func  : screen.availTop },
      { text  : "availLeft", func  : screen.availLeft },
      { text  : "availWidth", func  : screen.availWidth },
      { text  : "availHeight", func  : screen.availHeight },
      { text  : "colorDepth", func  : screen.colorDepth },
      { text  : "pixelDepth", func  : screen.pixelDepth }
    ];

  let frag = createDocumentFragment();
  let head_one = createElement( "h1" );
  let head_one_text = createTextNode( "screenオブジェクト" );
  head_one.appendChild( head_one_text );

  frag.appendChild(head_one);

  // screen_arrayの中身を表示
  for (let i = 0; i < screen_array.length; i += 1 ) {
     content_row = createElement( "p" );
     content_row_text = createTextNode(
      screen_array[i].text + ": " + screen_array[i].func
    );
    content_row.appendChild( content_row_text );
    frag.appendChild(content_row);
  }

  head_one = createElement('h1');
  head_one_text = createTextNode('navigatorオブジェクト:');
  head_one.appendChild( head_one_text );

  frag.appendChild( head_one );

  // navi_arrayの中身を表示
  for (let i = 0; i < navi_array.length; i += 1 ) {
    content_row = createElement( "p" );
    content_row_text = createTextNode(
      navi_array[i].text + ": " + navi_array[i].func
    );
    content_row.appendChild( content_row_text );
    frag.appendChild( content_row );
  }

  // DRP値の表示
  content_row = createElement( "p" );
  content_row_text = createTextNode( "DPR値:" + window.devicePixelRatio );
  content_row.appendChild( content_row_text );
  frag.appendChild( content_row );

  // Viewportの値の表示
  content_row = createElement( "p" );
  content_row_text = createTextNode(
    "Viewportの幅:" + window.innerWidth + " Viewportの高さ:" + window.innerHeight
  );
  content_row.appendChild( content_row_text );
  frag.appendChild( content_row );

  // mainセクションを取得する
  let mainSection = getElementById( 'pal-main' );

  // mainセクションの子要素をすべて削除する
  emptyElement( mainSection );

  // document fragmentを追加する
  mainSection.appendChild( frag );

  return true;
};
// パブリックメソッド/initModule/終了
