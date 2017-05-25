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
    onClickNew, onClickCancel, onClickCreate,
    action_object,
    name_element,
    onBlurInput,
    onChangeObject,
    save_object_remote,
    sync_object_and_dom,
    sync_number_of_data,
    setJqueryMap, configModule, initModule,
    addChange;

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

  // ユーティリティメソッド/save_object_remote/開始
  // 目的: オブジェクトを受け取りWebSocketにより、リモートに保存する。
  // 必須引数:
  //  *object   : オブジェクト
  // オプション引数:
  // * callback : コールバック関数
  // 設定:
  // 戻り値:
  // 例外発行: なし
  // example_method = function () {
  //   var example;
  //   return example;
  // };
  save_object_remote = function ( object ) {

    console.log( 'save_object_remoteが呼び出されました' );
    console.log( object );

  };
  // ユーティリティメソッド/save_object_remote/終了

  // ユーティリティメソッド/sync_object_and_dom/開始
  // 目的: DOM要素を受け取りObjectの値と同期させる
  //  * element  : 同期させるDOM要素
  //  * object  : 元になるObject
  // 必須引数:
  // オプション引数:
  // 設定:
  // 戻り値:
  // 例外発行: なし
  sync_object_and_dom = function ( element, object ) {
    var
      i;

    console.log( 'sync_object_and_domが呼ばれました。' );

    for ( i = 0; i < object.length; i++ ) {
      element.prepend( '<li>name: ' + object[i].name + '</li>' );
    }

  };
  // ユーティリティメソッド/sync_object_and_dom/終了

  // ユーティリティメソッド/sync_number_of_data/開始
  // 目的: DOM要素を受け取りObjectの値と同期させる
  //  * element : 同期させるDOM要素
  //  * object  : 元になるObject
  // 必須引数:
  // オプション引数:
  // 設定:
  // 戻り値:
  // 例外発行: なし
  sync_number_of_data = function ( element, object ) {
    console.log( 'sync_number_of_dataが呼ばれました。' );
    element.text( 'データ件数は' + object.length + '件です。' );
  };
  // ユーティリティメソッド/sync_number_of_data/終了
  addChange = function ( ob ) {
    var i;

    ob.change = function ( callback ) {
      if ( callback ) {
        if ( !this._change ) {
          this._change = [];
        }
        this._change.push( callback );
      }
      else {
        if ( !this._change ) {
          return;
        }
        for ( i = 0; i < this._change.length; i++ ) {
          this._change[i].apply( this );
        }
      }
    };
  };
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
  //  * action_object : Actionオブジェクトの生成
  //  * jqueryMap.$form       : 表示する
  //  * jqueryMap.$new_button : クリック出来なくする。 
  // 戻り値:
  // 例外発行: なし
  onClickNew = function () {

    // Actionオブジェクトを生成する
    action_object = pal.schema.makeAction({
    });

    // change関数を追加する
    addChange( action_object );

    // action_objectが変更されたときのコールバック関数をセットする
    action_object.change( onChangeObject );

    jqueryMap.$form.show();
    jqueryMap.$new_button.prop( "disabled", true );
  };
  // イベントリスナー/onClickNew/終了 --------------------------------

  // イベントリスナー/onClickCancel/開始 --------------------------------
  // 目的: フォームでキャンセルがクリックされた場合にフォームを隠し、
  //       newボタンをクリック可能にする
  // 必須引数: なし
  // オプション引数: なし
  // 設定:
  //  * jqueryMap.$form       : フォームを隠す
  //  * jqueryMap.$new_button : ボタンを使用可能にする
  // 戻り値:
  // 例外発行: なし
  onClickCancel = function () {
    jqueryMap.$form.hide();
    jqueryMap.$new_button.prop( "disabled", false );
  };
  // イベントリスナー/onClickCancel/終了 --------------------------------

  // イベントリスナー/onClickCreate/開始 --------------------------------
  // 目的: 完了(Done)ボタンがクリックされたときにリストに
  //       Actionオブジェクトの内容を追加する。0.9秒待つ。
  // 必須引数: なし
  // オプション引数: なし
  // 設定:
  //  * jqueryMap.$form       : フォームを隠し、内容をクリアする
  //  * jqueryMap.$new_button : newボタンをdisabledにする
  //  * jqueryMap.$targe      : Actionオブジェクトを表示するul要素に
  //                            追加する
  //  * jqueryMap.$status     : 件数を表示するdiv要素
  //  * action_list           : Actionオブジェクトを格納しているリストに
  //                            要素を追加する
  // 戻り値: なし
  // 例外発行: なし
  onClickCreate = function () {

    setTimeout(
      function () {
        if ( action_object.name !== '' ) {
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
          jqueryMap.$new_button.prop( "disabled", false );

          // changeイベントを発生させる
          action_object.change();

        }

      },
    800);
  };
  // イベントリスナー/onClickCreate/終了 --------------------------------

  // イベントリスナー/onBlurInput/開始 --------------------------------
  // 目的: フォーカスが外れた時に入力された値を取得して
  //       Actionオブジェクトにセットする。
  //       input要素にname属性があることが前提。
  // 必須引数: なし
  // オプション引数: なし
  // 設定:
  //  * action_object: Actionオブジェクトのうち、input要素の
  //                           name属性に一致するプロパティの値
  // 戻り値: なし
  // 例外発行: なし
  onBlurInput = function () {

    action_object[ this.name ] = this.value;

  };
  // イベントリスナー/onBlurInput/終了 --------------------------------
  onChangeObject = function () {
    console.log( '変更されました', this );

    // オブジェクトをlocalStorageに保存する。コールバックとして
    // DOMを更新する関数をセットする。
    pal.util_b.createObjectLocal(
      'action-list',
      this
    );

    // リストに要素を追加する
    sync_object_and_dom(
      jqueryMap.$target,
      pal.util_b.readObjectLocal( 'action-list' )
    );

    // 件数を表示する
    sync_number_of_data(
      jqueryMap.$status,
      pal.util_b.readObjectLocal( 'action-list' )
    );

    // サーバのMongoDBを更新する
    save_object_remote( action_object );

  };
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
    var
      // i = 0,
      list_page  = pal.util_b.getTplContent( 'list-page' );

    stateMap.$container = $container;
    setJqueryMap();

    jqueryMap.$container.html( list_page );

    jqueryMap.$new_button = $container.find( '.pal-list-new' );
    jqueryMap.$form       = $container.find( '.pal-list-new-form' );
    jqueryMap.$cancel     = $container.find( '.pal-list-cancel' );
    jqueryMap.$create     = $container.find( '.pal-list-create' );
    jqueryMap.$status     = $container.find( '#status' );
    jqueryMap.$target     = $container.find( '#target' );

    // localStorageからaction-listの値を読み込む
    action_list = pal.util_b.readObjectLocal( 'action-list' );

    if ( action_list ) {

      // ObjectをDOM要素の変換する
      sync_object_and_dom(
        jqueryMap.$target,
        action_list
      );

      // データの件数を取得して表示する。
      sync_number_of_data(
        jqueryMap.$status,
        action_list
      );

    }

    // イベントリスナーを追加する
    jqueryMap.$new_button.click( onClickNew );
    jqueryMap.$cancel.click( onClickCancel );
    jqueryMap.$create.click( onClickCreate );

    name_element = document.getElementById( "pal-list-name" );

    // nameフィールドにイベントリスナーを追加する
    name_element.addEventListener( 'blur', onBlurInput, true );

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
