'use strict';
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
/*global pal*/

pal.bom = (function () {
  //--------------------- モジュールスコープ変数開始 -----------------
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/setLocationHash/開始
  const setLocationHash = (hash) => {
    window.location.hash = hash;
  };
  // ユーティリティメソッド/setLocationHash/終了

  // ユーティリティメソッド/getLocationHash/開始
  const getLocationHash = () => {
    return window.location.hash;
  };
  // ユーティリティメソッド/getLocationHash/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // イベントハンドラ/onHashchange/開始
  const onHashchange = () => {
    pal.dom.setSection();
  };
  // イベントハンドラ/onHashchange/終了
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- コールバック開始 --------------------------
  // --------------------- コールバック終了 --------------------------

  // --------------------- パブリックメソッド開始 --------------------
  const initModule = (content) => {

    if ( pal.dom && content ) {
      pal.dom.initModule( content );
    }

    // URIのハッシュ変更イベントを処理する。
    // これはすべての機能モジュールを設定して初期化した後に行う。
    // そうしないと、トリガーイベントを処理できる状態になっていない。
    // トリガーイベントはアンカーがロード状態と見なせることを保証する
    // ために使う
    if (Object.prototype.hasOwnProperty.call(window, "onhashchange")) {
      window.addEventListener( "hashchange", onHashchange, false );
    }
  };
  // パブリックメソッド/initModule/終了

  return {
    initModule      : initModule,
    setLocationHash : setLocationHash,
    getLocationHash : getLocationHash
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
