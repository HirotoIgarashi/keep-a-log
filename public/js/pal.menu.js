/*
 * pal.top.js
 * TOPページを表示する機能
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global pal */

pal.menu = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    stateMap = { $container : null },
    jqueryMap = {},
    onClickSimpleList,
    onClickBrowserInformation,
    onClickLab,
    setJqueryMap, configModule, initModule;
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/example_method/開始
  // 目的:
  // 必須引数:
  // オプション引数:
  // 設定:
  // 戻り値:
  // 例外発行: なし
  // example_method = function () {
  //   var example;
  //   return example;
  // };
  // ユーティリティメソッド/example_method/終了
  //--------------------- ユーティリティメソッド終了 -----------------

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
    pal.bom.setLocationHash( 'list' );
  };

  onClickBrowserInformation = function ( /* event */  ) {
    pal.bom.setLocationHash( 'browser_information' );
  };

  onClickLab = function ( /* event */  ) {
    pal.bom.setLocationHash( 'lab' );
  };
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
  initModule = function ( $container ) {
    var menu_page  = pal.util_b.getTplContent( 'pal-menu' );

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
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    configModule  : configModule,
    initModule    : initModule
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
