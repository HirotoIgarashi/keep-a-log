/*
 * pal.login.js
 * login機能
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global $, pal */

pal.login = (function () {
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
    onRecieveLogin,
    setJqueryMap, configModule, initModule,
    onClickLogin;
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
      $container  : $container,
      $login      : $container.find( '.pal-dom-header-login' )
    };
  };
  // DOMメソッド/setJqueryMap/終了
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  onClickLogin = function ( event ) {
    var
      requestType = 'POST',
      url = 'session/create',
      form_data_map = {};

    event.preventDefault();

    form_data_map.email     = $( '#email' ).val();
    form_data_map.password  = $( '#password' ).val();

    // XMLHttpRequestによる送信
    request = pal.util_b.sendXmlHttpRequest(
      requestType,
      url,
      true,
      onRecieveLogin,
      JSON.stringify( form_data_map )
    );

  };

  // Loginの結果の処理
  onRecieveLogin = function () {
    var
      message_area = document.getElementById('pal-login-message-area');

    if ( request && request.readyState === 4 ) {
      if ( request.status === 200 ) {
        console.log( 'AjaxPOSTの処理結果を確認します。' );

        console.log( request );

        message_area.removeAttribute( 'hidden' );
        message_area.textContent = 'ログインしました。ステータス: ' + request.status;

        setTimeout( function () {
          message_area.setAttribute( 'hidden', 'hidden' );
          pal.bom.setLocationHash( '' );
        }, 5000);
      }
      else {
        message_area.removeAttribute( 'hidden' );
        switch ( request.status ) {
          case '401':
            message_area.textContent = 'E-mailアドレスかパスワードが不正です。ステータス: ' + request.status;
            break;
          case '500':
            message_area.textContent = 'サーバエラーが発生しました。ステータス: ' + request.status;
            break;
          default:
            message_area.textContent = 'エラーが発生しました。ステータス: ' + request.status;
        }

        setTimeout( function () {
          message_area.setAttribute( 'hidden', 'hidden' );
        }, 5000);

      }
    }
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
    var
      loginPage = pal.util_b.getTplContent( 'login' );

    stateMap.$container = $container;

    setJqueryMap();

    // jqueryMap.$container.html( '<h1>Hello World!</h1>' );
    jqueryMap.$container.html( loginPage );

    jqueryMap.$login = $container.find( '.pal-login-button' );
    jqueryMap.$login.click( onClickLogin );

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
