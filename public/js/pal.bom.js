/*
 * pal.shell.js
 * PALのBOM(Browser Object Model)コントロールモジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/
/*global $, pal */

pal.bom = (function () {
  'use strict';
  var
    initModule,
    setLocationHash,
    getLocationHash,
    onHashchange;
  //--------------------- モジュールスコープ変数開始 -----------------
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/setLocationHash/開始
  setLocationHash = function ( hash ) {
    window.location.hash = hash;
  };
  // ユーティリティメソッド/setLocationHash/終了

  // ユーティリティメソッド/getLocationHash/開始
  getLocationHash = function () {
    return window.location.hash;
  };
  // ユーティリティメソッド/getLocationHash/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // イベントハンドラ/onHashchange/開始
  onHashchange = function ( /* event */ ) {
    pal.dom.setSection();
  };
  // イベントハンドラ/onHashchange/終了
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- コールバック開始 --------------------
  // --------------------- コールバック終了 --------------------

  // --------------------- パブリックメソッド開始 --------------------
  initModule = function ( $container ) {

    if ( pal.dom && $container ) {
      pal.dom.initModule( $container );
    }

    // URIのハッシュ変更イベントを処理する。
    // これはすべての機能モジュールを設定して初期化した後に行う。
    // そうしないと、トリガーイベントを処理できる状態になっていない。
    // トリガーイベントはアンカーがロード状態と見なせることを保証するために使う
    //
    // window.addEventListener( "hashchange", onHashchange, false );
    // if ( window.hasOwnProperty("onhashchange") ) {
    //   alert("このブラウザはhashchangeイベントをサポートしています");
    // }
    $(window)
      .bind( 'hashchange', onHashchange )
      .trigger( 'hashchange' );

  };
  // パブリックメソッド/initModule/終了

  return {
    initModule      : initModule,
    setLocationHash : setLocationHash,
    getLocationHash : getLocationHash
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
