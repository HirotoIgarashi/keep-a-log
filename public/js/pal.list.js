/*
 * pal.list.js
 * カスタムオブジェクトをリスト表示する機能
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
    make_anchor_element,
    action_object,
    action_object_list,
    onBlurInput,
    onChangeObject,
    onHashchange,
    onClickTarget,
    save_object_remote,
    sync_object_and_dom,
    sync_number_of_data,
    setJqueryMap, configModule, initModule,
    list_ui,
    current_node;

    // UIの状態遷移
    list_ui = {
      state       : undefined,
      states      : {
        start_state : {
          initialize  : function ( target ) {
            this.target = target;
          },
          enter       : function () {
            return false;
          },
          execute     : function () {
            return false;
          },
          load        : function () {
            // list_formステートに遷移する
            this.target.changeState( this.target.states.list_form );
          },
          exit        : function () {
            return false;
          }
        },
        list_form   : {
          initialize  : function ( target ) {
            this.target = target;
          },
          enter       : function () {
            var
              new_anchor,
              new_target,
              property,
              i = 0,
              action_list,
              object_local = {},
              $container,
              detail_anchor,
              // テンプレートからlist-pageを読み込む
              list_page  = pal.util_b.getTplContent( 'list-page' );

            setJqueryMap();
            $container = jqueryMap.$container;

            jqueryMap.$container.html( list_page );

            jqueryMap.$cancel       = $container.find( '#cancel' );
            jqueryMap.$create       = $container.find( '#done' );
            jqueryMap.$status       = $container.find( '#status' );
            jqueryMap.$target       = $container.find( '#target' );

            // action object listの生成/開始 ----------------------------
            // action objectリストを初期化する
            action_object_list = [];

            // localStorageからプロパティ名action-listの値を読み込む
            action_list = pal.util_b.readObjectLocal( 'action-list' );

            if ( action_list ) {
              for ( i = 0; i < action_list.length; i += 1 ) {
                // action_list[i]はaction object
                // propertyはプロパティ
                for ( property in action_list[i] ) {

                  if ( typeof action_list[i][property] === 'string' ) {
                    object_local[property] = action_list[i][property];
                  }

                }

                action_object = pal.schema.makeAction( object_local );

                // リストに追加する
                action_object_list.push( action_object );
              }
            }
            // action object listの生成/終了 ----------------------------
 
            // change関数を追加する
            pal.util.addChange( action_object_list );

            // action_objectが変更されたときのコールバック関数
            // onChangeObjectをセットする
            // onChangeObjectから呼ばれるsync_object_and_domの中で
            // DOMに追加する
            action_object_list.change( onChangeObject );

            // changeイベントを発生させる
            action_object_list.change();

            detail_anchor = document.getElementById( 'target' );

            detail_anchor.addEventListener( "click", onClickTarget, false );
            // <a href="#list/new">new</a>を作成する
            new_anchor = make_anchor_element( '#list/new', '新規作成' );

            new_target = document.getElementById( "new-anchor" );
            new_target.appendChild( new_anchor );

          },
          execute : function () {
            return false;
          },
          show_create_form  : function () {
            this.target.changeState( this.target.states.create_form );
          },
          show_detail_form  : function () {
            this.target.changeState( this.target.states.detail_form );
          },
          exit  : function () {
            // 新規作成のアンカーを削除する
            pal.util.removeElementById( 'new-anchor' );
          }
        },
        create_form    : {
          initialize  : function ( target ) {
            this.target = target;
          },
          enter       : function () {
            // 目的:
            // 必須引数:
            // オプション引数:
            // 設定:
            //  * action_object : Actionオブジェクトの生成
            //  * jqueryMap.$form       : 表示する
            // 戻り値:
            // 例外発行: なし
            // Actionオブジェクトを生成する
            var
              form_fragment,
              action_wrapper,
              action_fragment,
              form_wrapper,
              new_cancel,
              new_create;

            // action objectを生成する
            action_object = pal.schema.makeAction({});

            // キャンセル、生成アンカーを生成する
            action_wrapper = document.getElementById( 'new-action-wrapper' );
            action_fragment = document.createDocumentFragment();

            new_cancel = make_anchor_element( '#list/cancel', 'キャンセル' );
            new_create = make_anchor_element( '#list/create', '作成の確認' );

            action_fragment.appendChild( new_cancel );
            action_fragment.appendChild( new_create );

            action_wrapper.appendChild( action_fragment );

            // formを生成する
            form_wrapper = document.getElementById( 'new-form-wrapper' );

            // form要素を取得する。event_listenerにonBlurInputをセットする
            form_fragment = action_object.makeFormElement( onBlurInput );
            form_wrapper.appendChild( form_fragment );
          },
          execute     : function () {
            return false;
          },
          cancel_create  : function () {
            // 目的: フォームでキャンセルがクリックされた場合にフォームの
            //        値をクリアする
            // 必須引数: なし
            // オプション引数: なし
            // 設定:
            //  * jqueryMap.$form       : フォームを隠す
            // 戻り値:
            // 例外発行: なし
            // formの値をすべてクリアする
            pal.util.clearFormAll();

            // locationを#listに戻す
            pal.bom.setLocationHash( '#list/list' );

            this.target.changeState( this.target.states.list_form );
          },
          confirm_create  : function () {
            // 目的: createボタンがクリックされたときにリストに
            //       Actionオブジェクトの内容を追加する。0.9秒待つ。
            // 必須引数: なし
            // オプション引数: なし
            // 設定:
            //  * jqueryMap.$form       : フォームを隠し、内容をクリアする
            //  * jqueryMap.$targe      : Actionオブジェクトを表示するul要素に
            //                            追加する
            //  * jqueryMap.$status     : 件数を表示するdiv要素
            //  * action_object_list    : Actionオブジェクトを格納しているリストに
            //                            要素を追加する
            //  * _local_id             : _local_idプロパティにtimestampをセットする
            // 戻り値: なし
            // 例外発行: なし

            // _local_idプロパティにtime stampをセットする
            action_object._local_id = pal.util_b.getTimestamp();

            // action_object_listに追加する
            action_object_list.push( action_object );

            // chageイベントを発生させる
            action_object_list.change();

            setTimeout(
              function () {
                if ( action_object.name !== '' ) {
                  // formの値をすべてクリアする
                  pal.util.clearFormAll();
                }
              },
            800);

            this.target.changeState( this.target.states.list_form );
          },
          exit        : function () {
            return false;
          }
        },
        detail_form : {
          initialize  : function ( target ) {
            this.target = target;
          },
          enter       : function () {
            // fragment
            //  |- cancel_anchor
            //  |- edit_anchor
            //  |- delete_anchor
            //
            var
              i,
              crud_fragment,
              message_wrapper,
              message_element,
              detail_fragment,
              cancel_anchor,
              edit_anchor,
              delete_anchor,
              detail_anchor;

            // .action-wrapper自体を削除する
            current_node.removeChild( current_node.lastElementChild );

            // crud_wrapperの中身を生成する
            crud_fragment = document.createDocumentFragment();

            // local_idが一致するオブジェクトを探して
            // action_objectにセットする
            for ( i = 0; i < action_object_list.length; i += 1 ) {
              if ( action_object_list[i]._local_id === current_node.dataset.localId ) {
                action_object = action_object_list[i];
              }
            }

            cancel_anchor = make_anchor_element( '#list/cancel-detail', 'キャンセル' );

            edit_anchor = make_anchor_element( '#list/edit', '編集' );

            delete_anchor = make_anchor_element( '#list/delete', '削除' );

            crud_fragment.appendChild( cancel_anchor );
            crud_fragment.appendChild( edit_anchor );
            crud_fragment.appendChild( delete_anchor );

            // message_wrapperを生成する
            message_wrapper = document.createDocumentFragment();

            message_element = document.createElement( 'div' );
            message_element.setAttribute( 'class', 'message-wrapper' );

            message_element.textContent = '編集するには上の編集、削除するには上の削除をクリックしてください';

            message_wrapper.appendChild( message_element );

            // detail_formを生成する
            detail_fragment = action_object.makeDetailElement();

            // crud_wrapperの中身を追加する
            current_node.firstElementChild.appendChild( crud_fragment );

            // message_wrapperの中身を追加する
            current_node.appendChild( message_wrapper );

            // Action Objectの中身を追加する
            current_node.appendChild( detail_fragment );

            // eventListerを削除する
            detail_anchor = document.getElementById( 'target' );
            detail_anchor.removeEventListener( "click", onClickTarget, false );
          },
          execute     : function () {
            return false;
          },
          cancel_detail : function () {
            this.target.changeState( this.target.states.list_form );
          },
          show_update_form   : function () {
            this.target.changeState( this.target.states.update_form );
          },
          show_delete_form : function () {
            this.target.changeState( this.target.states.delete_form );
          },
          exit        : function () {
            var
              message_wrapper,
              i;

            // .crud-wrapperの中身を削除する
            pal.util.removeElement( current_node.firstElementChild );

            // .message_wrapperの中身を削除する
            message_wrapper = document.getElementsByClassName( 'message-wrapper' );
            for ( i = 0; i < message_wrapper.length; i += 1 ) {
              message_wrapper[i].textContent = '';
            }

            // .action-wrapper自体を削除する
            current_node.removeChild( current_node.lastElementChild );
          }
        },
        update_form   : {
          initialize  : function ( target ) {
            this.target = target;
          },
          enter       : function () {
            // 目的: オブジェクトを更新するフォームを作成・表示する
            // 必須引数:
            // オプション引数:
            // 設定:
            //  * action_object : Actionオブジェクトの生成
            // 戻り値:
            // 例外発行: なし
            // Actionオブジェクトを生成する
            var
              action_fragment,
              form_fragment,
              cancel_update,
              confirm_update,
              property;

            // キャンセル、アップデートアンカーを生成する
            action_fragment = document.createDocumentFragment();
            cancel_update = make_anchor_element( '#list/cancel-update', 'キャンセル' );
            confirm_update = make_anchor_element( '#list/confirm-update', '更新の確認' );
            action_fragment.appendChild( cancel_update );
            action_fragment.appendChild( confirm_update );

            // crud_wrapperの中身を追加する
            current_node.firstElementChild.appendChild( action_fragment );

            // formを生成する
            // form要素を取得する。event_listenerにonBlurInputをセットする
            form_fragment = action_object.makeFormElement( onBlurInput );

            // formを表示する
            current_node.appendChild( form_fragment );
          },
          execute     : function () {
            console.log( 'update_form execute' );
          },
          cancel_update : function () {
            console.log( 'update_form cancel_update' );
            this.target.changeState( this.target.states.detail_form );
          },
          confirm_update : function () {
            console.log( 'update_form confirm_update' );
            this.target.changeState( this.target.states.list_form );
          },
          exit        : function () {
            // crud-wrapperの中身を削除する
            pal.util.removeElement( current_node.firstElementChild );
            pal.util.removeElement( current_node.lastElementChild );
          }
        },
        delete_form   : {
          initialize      : function ( target ) {
            this.target = target;
          },
          enter           : function () {
            // fragment
            //  |- delete_cancel_anchor
            //  |- delete_confirm_anchor
            //
            var
              i,
              crud_fragment,
              message_wrapper,
              message_element,
              detail_fragment,
              cancel_anchor,
              confirm_anchor,
              detail_anchor;

            // .action-wrapper自体を削除する
            current_node.removeChild( current_node.lastElementChild );

            // crud_wrapperの中身を生成する
            crud_fragment = document.createDocumentFragment();

            // local_idが一致するオブジェクトを探して
            // action_objectにセットする
            for ( i = 0; i < action_object_list.length; i += 1 ) {
              if ( action_object_list[i]._local_id === current_node.dataset.localId ) {
                action_object = action_object_list[i];
              }
            }

            cancel_anchor = make_anchor_element( '#list/cancel-delete', 'キャンセル' );

            confirm_anchor = make_anchor_element( '#list/confirm-delete', '削除の確認' );

            crud_fragment.appendChild( cancel_anchor );
            crud_fragment.appendChild( confirm_anchor );

            // message_wrapperを生成する
            message_wrapper = document.createDocumentFragment();

            message_element = document.createElement( 'div' );
            message_element.setAttribute( 'class', 'message-wrapper' );

            message_element.textContent = 'データを削除します。削除の確認をクリックしてください';

            message_wrapper.appendChild( message_element );

            // detail_formを生成する
            detail_fragment = action_object.makeDetailElement();

            // crud_wrapperの中身を追加する
            current_node.firstElementChild.appendChild( crud_fragment );

            // message_wrapperの中身を追加する
            current_node.appendChild( message_wrapper );

            // Action Objectの中身を追加する
            current_node.appendChild( detail_fragment );

            // eventListerを削除する
            detail_anchor = document.getElementById( 'target' );
            detail_anchor.removeEventListener( "click", onClickTarget, false );
          },
          execute         : function () {
            return false;
          },
          cancel_delete   : function () {
            this.target.changeState( this.target.states.detail_form );
          },
          confirm_delete  : function () {
            var
              i,
              find_flag = false,
              index;

            // local idで一致しているものを探す
            for ( i = 0; i < action_object_list.length; i += 1  ) {
              if ( action_object_list[i]._local_id === action_object._local_id ) {
                index = i;
                find_flag = true;
                break;
              }
            }

            if ( find_flag ) {
              action_object_list.splice( index, 1 );
            }

            // chageイベントを発生させる
            action_object_list.change();

            this.target.changeState( this.target.states.list_form );
          },
          exit            : function () {
            var
              message_wrapper,
              i;

            // .crud-wrapperの中身を削除する
            pal.util.removeElement( current_node.firstElementChild );
            // while ( current_node.firstElementChild.firstChild ) {
            //   current_node.firstElementChild.removeChild(
            //     current_node.firstElementChild.firstChild );
            // }

            // .message_wrapperの中身を削除する
            message_wrapper = document.getElementsByClassName( 'message-wrapper' );
            for ( i = 0; i < message_wrapper.length; i += 1 ) {
              message_wrapper[i].textContent = '';
            }

            // .action-wrapper自体を削除する
            current_node.removeChild( current_node.lastElementChild );
          }
        }
      },
      initialize  : function () {
        this.states.start_state.initialize( this );
        this.states.list_form.initialize( this );
        this.states.create_form.initialize( this );
        this.states.update_form.initialize( this );
        this.states.detail_form.initialize( this );
        this.states.delete_form.initialize( this );
        // 初期状態をセットする
        this.state = this.states.start_state;
      },
      load            : function () { this.state.load(); },
      show_create_form  : function () { this.state.show_create_form(); },
      cancel_create     : function () { this.state.cancel_create(); },
      confirm_create    : function () { this.state.confirm_create(); },
      show_detail_form  : function () { this.state.show_detail_form(); },
      cancel_detail     : function () { this.state.cancel_detail(); },
      show_update_form  : function () { this.state.show_update_form(); },
      show_delete_form  : function () { this.state.show_delete_form(); },
      cancel_update     : function () { this.state.cancel_update(); },
      confirm_update    : function () { this.state.confirm_update(); },
      cancel_delete     : function () { this.state.cancel_delete(); },
      confirm_delete    : function () { this.state.confirm_delete(); },
      changeState : function ( state ) {
        if ( this.state !== state ) {
          this.state.exit();
          this.state = state;
          this.state.enter();
          this.state.execute();
        }
      }
    };

  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------

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
  sync_object_and_dom = function ( element, action_list ) {
    var
      i,
      fragment;

    for ( i = 0; i < action_list.length; i += 1 ) {
      fragment = action_list[i].makeMicrodataElement();
      element.prepend( fragment );
    }

    // DOMツリーの中にlocal idがあるかどうかで新規か変更かを判定する処理を
    // 追加する

    // ここまで

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

  // DOMメソッド/make_anchor_element/開始
  make_anchor_element = function ( href, text ) {
    var
      element;

    element = document.createElement( 'a' );
    element.setAttribute( 'href', href );
    element.textContent = text; 

    return element;
  };
  // DOMメソッド/make_anchor_element/終了
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- DOMイベントリスナー開始 -------------------
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
        list_ui.show_create_form();
        break;
      case '#list/cancel':
        list_ui.cancel_create();
        break;
      case '#list/create':
        list_ui.confirm_create();
        break;
      case '#list/detail':
        list_ui.show_detail_form();
        break;
      case '#list/cancel-detail':
        list_ui.cancel_detail();
        break;
      case '#list/edit':
        list_ui.show_update_form();
        break;
      case '#list/delete':
        list_ui.show_delete_form();
        break;
      case '#list/cancel-delete':
        list_ui.cancel_delete();
        break;
      case '#list/confirm-delete':
        list_ui.confirm_delete();
        break;
      case '#list/cancel-update':
        list_ui.cancel_update();
        break;
      case '#list/confirm-update':
        list_ui.confirm_update();
        break;
      default:
        break;
    }
  };
  // DOMイベントリスナー/onHashchange/終了 -----------------------------

  // DOMイベントリスナー/onClickTarget/開始 -----------------------------
  onClickTarget = function ( event ) {

    current_node = event.target;

    // nodeのclassがgになるまで親要素をたどる
    while ( current_node.getAttribute( 'class' ) !== 'g' ) {
      current_node = current_node.parentNode;
    }

    // locationを#list/detailにする
    pal.bom.setLocationHash( '#list/detail' );

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

    // サーバのMongoDBを更新する
    save_object_remote( action_object );

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

    stateMap.$container = $container;

    // State Patternを初期化する
    list_ui.initialize();
    // 最初の画面を描画する
    list_ui.load();


    // URIのハッシュ変更イベントを処理する。
    // これはすべての機能モジュールを設定して初期化した後に行う。
    // そうしないと、トリガーイベントを処理できる状態になっていない。
    // トリガーイベントはアンカーがロード状態と見なせることを
    // 保証するために使う
    //
    if ( window.hasOwnProperty("onhashchange") ) {
      window.addEventListener( "hashchange", onHashchange, false );
    }
    else {
      alert("このブラウザはhashchangeイベントをサポートしていません");
    }

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
