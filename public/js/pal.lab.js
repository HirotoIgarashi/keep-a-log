/*
 * pal.lab.js
 * 実験用のモジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global $, pal */

pal.lab = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    stateMap = { $container : null },

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
  initModule = function ( $container ) {
    var
      main_section,
      helloWorld  = pal.util_b.getTplContent( 'lab' );

    stateMap.$container = $container;

    // mainセクションを取得する
    main_section = document.getElementById( 'pal-main' );

    // mainセクションの子要素をすべて削除する
    pal.util.emptyElement( main_section );

    // document fragmentを追加する
    main_section.appendChild( helloWorld );

    pal.util.toggleElement(
      'pal-lab-play',
      'pal-lab-pause',
      pal.util.showElement.bind( this, 'pal-lab-form' ),
      pal.util.hideElement.bind( this, 'pal-lab-form' )
    );

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
