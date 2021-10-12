/*
 * menu.js
*/

'use strict';

import { setLocationHash } from "./controlDom.js"
import { getTplContent } from "./utilDom.js"

//--------------------- モジュールスコープ変数開始 -----------------
var
  stateMap = { $container : null },
  jqueryMap = {},
  onClickSimpleList,
  onClickBrowserInformation,
  onClickLab,
  setJqueryMap;
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- DOMメソッド開始 ----------------------------
// DOMメソッド/setJqueryMap/開始
setJqueryMap = function () {
  var $container = stateMap.$container;

  jqueryMap = { $container  : $container };
};
// DOMメソッド/setJqueryMap/終了
//--------------------- DOMメソッド終了 ----------------------------

// --------------------- イベントハンドラ開始 ----------------------
// 例: onClickButton = function ( event ) {};
onClickSimpleList = function ( /* event */  ) {
  setLocationHash( 'list' );
};

onClickBrowserInformation = function ( /* event */  ) {
  setLocationHash( 'browser_information' );
};

onClickLab = function ( /* event */  ) {
  setLocationHash( 'lab' );
};
// --------------------- イベントハンドラ終了 ----------------------

// パブリックメソッド/menu/開始
// 目的: モジュールを初期化する
// 引数:
//  * $container この機能が使うjQuery要素
// 戻り値: true
// 例外発行: なし
//
export const menu = ($container) => {
  var menu_page  = getTplContent( 'pal-menu' );

  stateMap.$container = $container;
  setJqueryMap();

  jqueryMap.$container.html( menu_page );

  jqueryMap.$simple_list = $container.find( '#simple-list' );

  jqueryMap.$hierarchy_list = $container.find( '#hierarchy-list' );

  jqueryMap.$browser_information = $container.find( '#browser-information' );
  jqueryMap.$lab = $container.find( '#lab' );

  jqueryMap.$simple_list
    .click( onClickSimpleList );

  jqueryMap.$browser_information
    .click( onClickBrowserInformation );

  jqueryMap.$lab
    .click( onClickLab );

  return true;
};
  // パブリックメソッド/menu/終了
