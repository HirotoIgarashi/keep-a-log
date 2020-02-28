/*
 * pal.logout.js
 * logout機能
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global pal */

pal.logout = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    stateMap = { $container : null },
    jqueryMap = {},
    request = null,
    onReceiveLogout,
    setJqueryMap, configModule, initModule,
    onClickAgree, onClickCancel;
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

    jqueryMap = {
      $container  : $container
    };
  };
  // DOMメソッド/setJqueryMap/終了
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  onClickAgree = function ( event ) {
    var
      requestType = 'GET',
      url = '/session/delete';

    event.preventDefault();

    // XMLHttpRequestによる送信
    request = pal.util_b.sendXmlHttpRequest(
      requestType,
      url,
      true,
      onReceiveLogout
    );

  };

  // Loginの結果の処理
  onReceiveLogout = function () {
    if ( request && request.readyState === 4 ) {
      if ( request.status === 200 ) {
        jqueryMap.$message_area.textContent = 'ログアウトしました。ステータス: ' + request.status;

        setTimeout( function () {
          pal.bom.setLocationHash( '' );
        }, 2000);
      }
      else {
        switch ( request.status ) {
          case '404':
            jqueryMap.$message_area.textContent = 'URLが存在しません。ステータス: ' + request.status;
            break;
          case '401':
            jqueryMap.$message_area.textContent = 'エラーが発生しました。ステータス: ' + request.status;
            break;
          case '500':
            jqueryMap.$message_area.textContent = 'サーバエラーが発生しました。ステータス: ' + request.status;
            break;
          default:
            jqueryMap.$message_area.textContent = 'エラーが発生しました。ステータス: ' + request.status;
        }
      }
    }
  };

  // キャンセルボタンクリックされたときの処理/開始
  onClickCancel = function () {
    pal.bom.setLocationHash( '' );
  };
  // キャンセルボタンクリックされたときの処理/終了
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
  initModule = function ( content ) {
    var
      main_section = document.getElementById( 'pal-main' ),
      loginPage = pal.util_b.getTplContent( 'logout' );

    stateMap.$container = content;

    setJqueryMap();

    // mainセクションの子要素をすべて削除する
    pal.util.emptyElement( main_section );

    // jqueryMap.$container.html( loginPage );
    jqueryMap.$container.appendChild( loginPage );

    jqueryMap.$agree        = document.getElementById('agree');
    jqueryMap.$cancel       = document.getElementById('cancel');
    jqueryMap.$message_area = document.getElementById('message-area');

    // jqueryMap.$agree.click( onClickAgree );
    jqueryMap.$agree.addEventListener('click', onClickAgree );
    jqueryMap.$cancel.addEventListener('click', onClickCancel );

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
