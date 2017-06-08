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
    onClickNew, onClickCancel, onClickCreate,
    action_object,
    action_object_list = [],
    // input_element,
    onBlurInput,
    onChangeObject,
    onHashchange,
    onClickTarget,
    save_object_remote,
    sync_object_and_dom,
    sync_number_of_data,
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
  save_object_remote = function ( /* object */ ) {

    // console.log( object );
    return undefined;

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
      fragment;

    fragment = object.make_element();

    element.prepend( fragment );

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

    element.text( 'データ件数は' + object.length + '件です。' );

  };
  // ユーティリティメソッド/sync_number_of_data/終了

  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  // DOMメソッド/setJqueryMap/開始
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = { $container  : $container };
  };
  // DOMメソッド/setJqueryMap/終了
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- DOMイベントリスナー開始 -------------------
  // DOMイベントリスナー/onClickNew/開始 -----------------------------
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
    action_object = pal.schema.makeAction({});

    // action_objectが変更されたときのコールバック関数をセットする
    action_object.change( onChangeObject );

    jqueryMap.$form.show();
    jqueryMap.$new_button.prop( "disabled", true );
  };
  // DOMイベントリスナー/onClickNew/終了 -----------------------------

  // DOMイベントリスナー/onClickCancel/開始 --------------------------
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
    // formの値をすべてクリアする
    pal.util.clearFormAll();

    jqueryMap.$form.hide();
    jqueryMap.$new_button.prop( "disabled", false );
  };
  // DOMイベントリスナー/onClickCancel/終了 ---------------------------

  // DOMイベントリスナー/onClickCreate/開始 ----------------------------
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
  //  * action_object_list    : Actionオブジェクトを格納しているリストに
  //                            要素を追加する
  //  * _local_id             : _local_idプロパティにtimestampをセットする
  // 戻り値: なし
  // 例外発行: なし
  onClickCreate = function () {
    console.log( 'createがクリックされました' );

    // _local_idプロパティにtime stampをセットする
    action_object._local_id = pal.util_b.getTimestamp();

    // changeイベントを発生させる
    action_object.change();

    // action_object_listに追加する
    action_object_list.push( action_object );

    setTimeout(
      function () {

        if ( action_object.name !== '' ) {
          // フォームを隠す
          jqueryMap.$form.hide();

          // formの値をすべてクリアする
          pal.util.clearFormAll();

          // newボタンを使用可能にする
          jqueryMap.$new_button.prop( "disabled", false );
        }

      },
    800);
  };
  // DOMイベントリスナー/onClickCreate/終了 ---------------------------

  // DOMイベントリスナー/onBlurInput/開始 -----------------------------
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
    // action_object.name = this.value;

  };
  // DOMイベントリスナー/onBlurInput/終了 -----------------------------

  // DOMイベントリスナー/onHashchange/開始 -----------------------------
  onHashchange = function ( /* event */ ) {
    switch ( location.hash ) {
      case '#list/new':
        onClickNew();
        break;
      case '#list/cancel':
        onClickCancel();
        break;
      case '#list/create':
        onClickCreate();
        break;
      default:
        break;
    }
  };
  // DOMイベントリスナー/onHashchange/終了 -----------------------------

  // DOMイベントリスナー/onClickTarget/開始 -----------------------------
  onClickTarget = function ( event ) {
    var
      current_node,
      fragment,
      edit_cancel_anchor,
      edit_anchor,
      delete_anchor;

    current_node = event.target;

    // nodeのclassがgになるまで親要素をたどる
    while ( current_node.getAttribute( 'class' ) !== 'g' ) {
      current_node = current_node.parentNode;
    }

    fragment = document.createDocumentFragment();

    edit_cancel_anchor = document.createElement( 'a' );
    edit_cancel_anchor.setAttribute( 'href', '#/list/edit-cancel' );
    edit_cancel_anchor.textContent = 'cancel';

    edit_anchor = document.createElement( 'a' );
    edit_anchor.setAttribute( 'href', '#/list/edit' );
    edit_anchor.textContent = 'edit';

    delete_anchor = document.createElement( 'a' );
    delete_anchor.setAttribute( 'href', '#/list/delete' );
    delete_anchor.textContent = 'delete';

    fragment.appendChild( edit_cancel_anchor );
    fragment.appendChild( edit_anchor );
    fragment.appendChild( delete_anchor );

    console.log( current_node.firstElementChild );
    current_node.firstElementChild.appendChild( fragment );

  };
  // DOMイベントリスナー/onClickTarget/終了 -----------------------------
  // --------------------- DOMイベントリスナー終了 --------------------

  // ------------------ カスタムイベントリスナー開始 ------------------
  onChangeObject = function () {

    // オブジェクトをlocalStorageに保存する。
    pal.util_b.createObjectLocal(
      'action-list',
      this
    );

    // DOM要素のリストに要素を追加する
    sync_object_and_dom(
      jqueryMap.$target,
      this
    );

    // 件数を表示する
    sync_number_of_data(
      jqueryMap.$status,
      pal.util_b.readObjectLocal( 'action-list' )
    );

    // サーバのMongoDBを更新する
    save_object_remote( action_object );

  };
  // ------------------ カスタムイベントリスナー終了 ------------------

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
  //       * localStorageからaction-listを読み込み、Action Objectを生成する
  // 引数:
  //  * $container この機能が使うjQuery要素
  // 戻り値: true
  // 例外発行: なし
  //
  initModule = function ( $container ) {
    var
      property,
      action_list,
      action_object_local = {},
      // form_content,
      form_fragment,
      tmp_action_object,
      target,
      i = 0,
      list_page  = pal.util_b.getTplContent( 'list-page' );

    stateMap.$container = $container;
    setJqueryMap();

    jqueryMap.$container.html( list_page );

    jqueryMap.$new_button   = $container.find( '#new' );
    jqueryMap.$form         = $container.find( '.pal-list-new-form' );
    jqueryMap.$form_content = $container.find( '#pal-list-form-content' );
    jqueryMap.$cancel       = $container.find( '#cancel' );
    jqueryMap.$create       = $container.find( '#done' );
    jqueryMap.$status       = $container.find( '#status' );
    jqueryMap.$target       = $container.find( '#target' );

    // action schemaを基にformを生成する
    // 生成結果は
    // <form class="pal-list-form">
    //  <label>名前:</label>
    //  <input id="pal-list-name" name="name" type="text">
    // </form>
    // となるように

    // action objectを生成する
    tmp_action_object = pal.schema.makeAction( action_object_local );

    // form要素を取得する。event_listenerにonBlurInputをセットする
    form_fragment = tmp_action_object.make_form_fragment( onBlurInput );

    // form contentに追加する
    jqueryMap.$form_content.html( form_fragment );


    // action objectを削除する -> deleteでオブジェクトは削除できません。
    // delete tmp_action_object;

    // localStorageからプロパティ名action-listの値を読み込む
    action_list = pal.util_b.readObjectLocal( 'action-list' );

    if ( action_list ) {

      for ( i = 0; i < action_list.length; i += 1 ) {
        // action_list[i]はaction object
        // propertyはプロパティ
        for ( property in action_list[i] ) {

          if ( typeof action_list[i][property] === 'string' ) {
            action_object_local[property] = action_list[i][property];
          }

        }

        action_object = pal.schema.makeAction( action_object_local );

        // action_objectが変更されたときのコールバック関数をセットする
        action_object.change( onChangeObject );

        // changeイベントを発生させる
        action_object.change();
      }

    }

    // form_content = document.getElementById( "pal-list-form-content" );

    // nameフィールドにイベントリスナーを追加する
    // form_content.addEventListener( 'blur', onBlurInput, true );

    // URIのハッシュ変更イベントを処理する。
    // これはすべての機能モジュールを設定して初期化した後に行う。
    // そうしないと、トリガーイベントを処理できる状態になっていない。
    // トリガーイベントはアンカーがロード状態と見なせることを保証するために使う
    //
    if ( window.hasOwnProperty("onhashchange") ) {
      window.addEventListener( "hashchange", onHashchange, false );
    }
    else {
      alert("このブラウザはhashchangeイベントをサポートしていません");
    }

    target = document.getElementById( 'target' );

    target.addEventListener( "click", onClickTarget, false );

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
