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

/*global $, pal */

pal.list = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    stateMap = { $container : null },
    jqueryMap = {},
    action_list = [],
    onClickNew, onClickCancel, onClickDone,
    current_action_object, breakfastAction,
    garfieldCat,
    name_element,
    onFocusname, onBlurname,
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

  // --------------------- イベントリスナー開始 ----------------------
  // イベントリスナー/onClickNew/開始 --------------------------------
  // 目的:
  // 必須引数:
  // オプション引数:
  // 設定:
  //  * current_action_object : Actionオブジェクト
  // 戻り値:
  // 例外発行: なし
  onClickNew = function () {

    console.log( 'newがクリックされました' );

    // Actionオブジェクトを生成する
    current_action_object = pal.schema.makeAction({
    });

    console.log( current_action_object );

    jqueryMap.$form.show();
    jqueryMap.$new.prop( "disabled", true );
  };
  // イベントリスナー/onClickNew/終了 --------------------------------

  // イベントリスナー/onClickCancel/開始 --------------------------------
  // 目的: フォームでキャンセルがクリックされた場合にフォームを隠し、
  //       newボタンをクリック可能にする
  // 必須引数: なし
  // オプション引数: なし
  // 設定:
  //  * jqueryMap.$form : 隠す
  //  * jqueryMap.$new  : 使用可能にする
  // 戻り値:
  // 例外発行: なし
  onClickCancel = function () {
    jqueryMap.$form.hide();
    jqueryMap.$new.prop( "disabled", false );
  };
  // イベントリスナー/onClickCancel/終了 --------------------------------

  // イベントリスナー/onClickDone/開始 --------------------------------
  // 目的: 完了(Done)ボタンがクリックされたときにリストに
  //       Actionオブジェクトの内容を追加する。0.9秒待つ。
  // 必須引数: なし
  // オプション引数: なし
  // 設定:
  //  * jqueryMap.$form   : フォームを隠し、内容をクリアする
  //  * jqueryMap.$new    : newボタンをdisabledにする
  //  * jqueryMap.$targe  : Actionオブジェクトを表示するul要素に追加する
  //  * jqueryMap.$status : 件数を表示するdiv要素
  //  * action_list       : Actionオブジェクトを格納しているリストに
  //                        要素を追加する
  // 戻り値: なし
  // 例外発行: なし
  onClickDone = function () {

    setTimeout(
      function () {
        if ( current_action_object.name !== '' ) {
          // フォームを隠す
          jqueryMap.$form.hide();

          // formの値をすべてクリアする
          jqueryMap.$form
            .find("textarea, :text, select")
            .val("")
            .end()
            .find(":checked")
            .prop("checked", false);

          // newボタンを使用可能にする
          jqueryMap.$new.prop( "disabled", false );

          // 件数を表示する
          jqueryMap.$target
            .prepend( '<li>name: ' + current_action_object.name + '</li>' );

          // リストに要素を追加する
          action_list.push( current_action_object );

          // 件数を表示する
          jqueryMap.$status
            .text( 'データ件数は' + action_list.length + '件です。' );

          console.log( action_list );
          console.log( JSON.stringify(action_list) );
          window.localStorage
            .setItem( 'action-list', JSON.stringify( action_list ) );
        }

      },
    800);
  };
  // イベントリスナー/onClickDone/終了 --------------------------------

  // イベントリスナー/onFocusname/開始 --------------------------------
  // 目的:
  // 必須引数:
  // オプション引数:
  // 設定:
  // 戻り値:
  // 例外発行: なし
  onFocusname = function ( event ) {
    console.log( event );
    console.log( 'フォーカスを取得しました。' );
  };
  // イベントリスナー/onFocusname/終了 --------------------------------

  // イベントリスナー/onBlurname/開始 --------------------------------
  // 目的:
  // 必須引数:
  // オプション引数:
  // 設定:
  // 戻り値:
  // 例外発行: なし
  onBlurname = function () {
    console.log( event );
    console.log( this.value );
    current_action_object.name = this.value;
    console.log( current_action_object );
    console.log( 'フォーカスを失いました。' );
  };
  // イベントリスナー/onBlurname/終了 --------------------------------
  // --------------------- イベントリスナー終了 ----------------------

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
    var list_page  = pal.util_b.getTplContent( 'list-page' );

    stateMap.$container = $container;
    setJqueryMap();

    jqueryMap.$container.html( list_page );

    jqueryMap.$new    = $container.find( '.pal-list-new' );
    jqueryMap.$form   = $container.find( '.pal-list-new-form' );
    jqueryMap.$cancel = $container.find( '.pal-list-cancel' );
    jqueryMap.$create = $container.find( '.pal-list-create' );
    jqueryMap.$status = $container.find( '#status' );
    jqueryMap.$target = $container.find( '#target' );

    // 最初にデータの件数を取得して表示する。
    jqueryMap.$status.text( 'データ件数は' + action_list.length + '件です。' );

    jqueryMap.$new.click( onClickNew );
    jqueryMap.$cancel.click( onClickCancel );
    jqueryMap.$create.click( onClickDone );

    name_element = document.getElementById( "pal-list-name" );
    console.log( name_element );

    // nameフィールドにイベントリスナーを追加する
    name_element.addEventListener( 'focus', onFocusname, true );
    name_element.addEventListener( 'blur', onBlurname, true );

    breakfastAction = pal.schema.makeAction({
      name        : '朝食'
    });

    breakfastAction.log_name();

    garfieldCat = pal.schema.makeCat({
      name        : 'Garfield',
      weight_lbs  : 8.6
    });
    // catインスタンス呼び出し
    garfieldCat.say_hello();
    garfieldCat.say_text( 'Purr...' );

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
