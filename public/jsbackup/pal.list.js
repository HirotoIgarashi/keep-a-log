/*
 * pal.list.js
 * カスタムオブジェクトをリスト表示する機能
*/

pal.list = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    stateMap = { $container : null },
    make_anchor_element,
    action_object,
    previous_object = {},
    object_array,
    onBlurInput,
    onChangeObject,
    onHashchange,
    onClickTarget,
    sync_object_and_dom,
    sync_number_of_data,
    configModule, initModule,
    current_node,
    onObjectCreate,
    // onObjectRead,
    onObjectUpdate,
    onObjectDelete,
    object_create,
    object_read,
    object_update,
    object_delete,

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
            var
              i,
              main_section,
              // テンプレートからlist-pageを読み込む
              // idの値が以下のものを含む
              // status,
              // new-anchor,
              // new-action-wrapper,
              // new-form-wrapper,
              // target
              list_page  = pal.util_b.getTplContent( 'list-page' );

            this.target = target;

            // mainセクションを取得する
            main_section = document.getElementById( 'pal-main' );

            // mainセクションの子要素をすべて削除する
            util.dom.emptyElement( main_section );

            // document fragmentを追加する
            main_section.appendChild( list_page );

            // localStorageからaction objectリストを読み込む
            object_array = pal.array.readObjectArray();

            // changeイベントを発生させる
            // targetにaction objectが描画される
            for ( i = 0; i < object_array.length; i += 1 ) {

              if ( object_array[i]._id === undefined ) {
                action_object = object_array[i];
                onObjectCreate();
              }

              pal.util.addChange( object_array[i] );
              object_array[i].change( onChangeObject );
              object_array[i].change();
            }

            // コールバックはobject_read
            pal.socketio.readObjectList( object_read );

          },
          enter : function () {
            var
              new_button,
              cancel_button,
              upload_button,
              detail_anchor;

            // 件数を表示する
            sync_number_of_data( document.getElementById( 'status' ), object_array);

            detail_anchor = document.getElementById( 'target' );

            // targetにclickイベントを登録する
            detail_anchor.addEventListener( 'click', onClickTarget, false );
            // 新規作成ボタンの初期状態: 表示
            new_button = document.getElementById( 'pal-list-new' );
            new_button.setAttribute( 'class', '' );

            // キャンセルボタンの初期状態: 非表示
            cancel_button = document.getElementById( 'pal-list-new-cancel' );
            cancel_button.setAttribute( 'class', 'hidden' );

            // アップロードボタン
            upload_button = document.getElementById( 'pal-list-new-upload' );

            // 新規作成ボタンが押されたら、
            // ・ 新規作成ボタンを非表示にする
            // ・ キャンセルボタンを表示する
            // ・ アップロードボタンを表示する
            // ・ ロケーションハッシュを'#list/new'にする
            new_button.addEventListener( 'click', function () {
              this.setAttribute( 'class', 'hidden' );
              cancel_button.setAttribute( 'class', '' );
              upload_button.setAttribute( 'class', '' );
              pal.bom.setLocationHash( '#list/new');
            });

            // キャンセルボタンが押されたら、
            // ・ キャンセル作成ボタンを非表示にする
            // ・ 新規作成ボタンを表示する
            // ・ アップロードボタンを非表示にする
            // ・ ロケーションハッシュを'#list'にする
            cancel_button.addEventListener( 'click', function () {
              this.setAttribute( 'class', 'hidden' );
              new_button.setAttribute( 'class', '' );
              upload_button.setAttribute( 'class', 'hidden' );
              pal.bom.setLocationHash( '#list');
            });

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
            var
              new_button;

            // 新規作成ボタン: 非表示
            new_button = document.getElementById( 'pal-list-new' );
            new_button.setAttribute( 'class', 'hidden' );
            return false;
          }
        },
        create_form : {
          initialize  : function ( target ) {
            this.target = target;
          },
          enter : function () {
            // 目的: 生成フォームを表示する
            // 必須引数:
            // オプション引数:
            // 設定:
            //  * action_object : Actionオブジェクトの生成
            //  * new-action-wrapper  : create画面の操作
            //  * new-form-wrapper    : create画面のフォーム
            // 戻り値:
            // 例外発行: なし
            // Actionオブジェクトを生成する
            var
              form_fragment,
              form_wrapper,
              upload_button;

            // action objectを生成する
            action_object = pal.schema.makeAction({});
            // action_objectが変更されたときのコールバック関数
            // onChangeObjectをセットする
            // onChangeObjectから呼ばれるsync_object_and_domの中で
            // DOMに追加する
            action_object.change( onChangeObject );

            // formを生成する
            form_wrapper = document.getElementById( 'new-form-wrapper' );

            // form要素を取得する。event_listenerにonBlurInputをセットする
            form_fragment = action_object.makeFormElement( onBlurInput );
            form_wrapper.appendChild( form_fragment );

            // アップロードボタン
            upload_button = document.getElementById( 'pal-list-new-upload' );
            // アップロードボタンが押されたら、
            // ・ 新規作成ボタンを表示する
            // ・ キャンセルボタンを非表示にする
            // ・ アップロードボタンを非表示にする
            // ・ アップロード処理を実行する
            // ・ ロケーションハッシュを'#list'にする
            upload_button.addEventListener( 'click', function () {
              this.setAttribute( 'class', 'hidden' );
              list_ui.confirm_create();
              pal.bom.setLocationHash( '#list');
            });

          },
          execute : function () {
            return false;
          },
          confirm_create  : function () {
            // 目的: createボタンがクリックされたときにリストに
            //       Actionオブジェクトの内容を追加する。0.8秒待つ。
            // 必須引数: なし
            // オプション引数: なし
            // 設定:
            //  * object_array    : Actionオブジェクトを格納している
            //                      リストに要素を追加する
            //  * _local_id       : _local_idプロパティにtimestampを
            //                      セットする
            // 戻り値: なし
            // 例外発行: なし

            // _local_idプロパティにtime stampをセットする
            action_object._local_id = pal.util_b.getTimestamp();

            // object_arrayに追加する
            object_array.createObject( action_object, onObjectCreate );
            // object_arrayを更新する
            object_array = pal.array.readObjectArray();

            // chageイベントを発生させる
            action_object.change();

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
          exit  : function () {
            // 目的: フォームでキャンセルがクリックされた場合にフォームの
            //       値をクリアする
            // 必須引数: なし
            // オプション引数: なし
            // 設定:
            //  * jqueryMap.$form       : フォームを隠す
            // 戻り値:
            // 例外発行: なし
            // formの値をすべてクリアする
            pal.util.clearFormAll();

            // 削除する
            pal.util.emptyElementById( 'new-action-wrapper' );
            pal.util.emptyElementById( 'new-form-wrapper' );
            return false;
          }
        },
        detail_form : {
          initialize  : function ( target ) {
            this.target = target;
          },
          enter : function () {
            var
              i,
              detail_fragment,
              detail_anchor,
              message_wrapper,
              message_element,
              cancel_anchor,
              edit_anchor,
              crud_fragment,
              delete_anchor;

            // fragment
            //  |- cancel_anchor
            //  |- edit_anchor
            //  |- delete_anchor
            //

            // crud_wrapperの中身を生成する
            crud_fragment = document.createDocumentFragment();

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

            // .action-wrapper自体を削除する
            current_node.removeChild( current_node.lastElementChild );

            // local_idが一致するオブジェクトを探して
            // action_objectにセットする
            for ( i = 0; i < object_array.length; i += 1 ) {
              if ( object_array[i]._local_id === current_node.dataset.localId ) {
                action_object = object_array[i];
              }
            }

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
            // detail_formをキャンセルしたときの処理
            current_node.parentNode.replaceChild(
              action_object.makeMicrodataElement(),
              current_node
            );
            this.target.changeState( this.target.states.list_form );
          },
          show_update_form   : function () {
            this.target.changeState( this.target.states.update_form );
          },
          show_delete_form : function () {
            this.target.changeState( this.target.states.delete_form );
          },
          exit        : function () {
            // crud-wrapperの中身を削除する
            pal.util.emptyElement( current_node.firstElementChild );
            // message-wrapperの中身を削除する
            pal.util.emptyElement( current_node.firstElementChild.nextElementSibling );
            // detail-wrapperの中身を削除する
            pal.util.emptyElement( current_node.lastElementChild );
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
              confirm_update;

            // action_objectのバックアップをとる。キャンセルしたときに
            // もとに戻す
            Object.assign( previous_object, action_object );

            // キャンセル、アップデートアンカーを生成する
            action_fragment = document.createDocumentFragment();
            cancel_update = make_anchor_element(
              '#list/cancel-update', 'キャンセル'
            );
            confirm_update = make_anchor_element(
              '#list/confirm-update', '更新の確認'
            );
            action_fragment.appendChild( cancel_update );
            action_fragment.appendChild( confirm_update );

            // crud_wrapperの中身を追加する
            current_node.firstElementChild.appendChild( action_fragment );

            // message_wrapperの中身を追加する
            current_node.firstElementChild.nextElementSibling.textContent = '編集を中止するにはキャンセル、編集が終了したら更新の確認をクリックしてください。';

            // formを生成する
            // form要素を取得する。event_linstenerにonBlurInputをセットする
            form_fragment = action_object.makeFormElement( onBlurInput );
            // formを表示する
            current_node.appendChild( form_fragment );
          },
          execute     : function () {
            return false;
          },
          cancel_update : function () {
            // action_objectをバックアップから元に戻す
            Object.assign( action_object, previous_object );

            this.target.changeState( this.target.states.detail_form );
          },
          confirm_update : function () {

            object_array.updateObject( action_object, onObjectUpdate );

            // object_arrayを更新する
            object_array = pal.array.readObjectArray();

            // chageイベントを発生させる
            action_object.change();

            this.target.changeState( this.target.states.list_form );
          },
          exit        : function () {
            // update_formから抜けるときの処理
            // action_objectのバックアップを初期化する
            previous_object = {};

            // crud-wrapperの中身を削除する
            pal.util.emptyElement( current_node.firstElementChild );
            // message-wrapperの中身を削除する
            pal.util.emptyElement( current_node.firstElementChild.nextElementSibling );
            // detail-wrapperの中身を削除する
            pal.util.emptyElement( current_node.lastElementChild );
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
              crud_fragment,
              detail_fragment,
              cancel_anchor,
              confirm_anchor,
              detail_anchor;

            // crud_wrapperの中身を生成する
            crud_fragment = document.createDocumentFragment();

            cancel_anchor = make_anchor_element(
              '#list/cancel-delete', 'キャンセル'
            );
            confirm_anchor = make_anchor_element(
              '#list/confirm-delete', '削除の確認'
            );
            crud_fragment.appendChild( cancel_anchor );
            crud_fragment.appendChild( confirm_anchor );

            // detail_formを生成する
            detail_fragment = action_object.makeDetailElement();

            // カレントノードにcrud_wrapperの中身を追加する
            current_node.firstElementChild.appendChild( crud_fragment );

            // message_wrapperの中身を追加する
            current_node
              .firstElementChild
              .nextElementSibling
              .textContent = 'データを削除します。削除の確認をクリックしてください';

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

            // nameプロパティを削除する
            delete action_object.name;

            // object_arrayから削除する。onObjectDeleteはコールバック
            object_array.deleteObject( action_object, onObjectDelete );

            // object_arrayを更新する
            object_array = pal.array.readObjectArray();

            // chageイベントを発生させる
            action_object.change();

            this.target.changeState( this.target.states.list_form );
          },
          exit            : function () {
            // .crud-wrapperの中身を削除する
            pal.util.emptyElement( current_node.firstElementChild );
            // message-wrapperの中身を削除する
            pal.util.emptyElement( current_node.firstElementChild.nextElementSibling );
            // .action-wrapper自体を削除する
            current_node.removeChild( current_node.lastElementChild );
            return false;
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
      load              : function () { this.state.load(); },
      show_create_form  : function () { this.state.show_create_form(); },
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

  // ユーティリティメソッド/sync_object_and_dom/開始
  // 目的: DOM要素を受け取りObjectの値と同期させる
  //  * object  : 変更されたObject
  //              create, update, deleteのタイミングで呼ばれる
  // 必須引数:
  // オプション引数:
  // 設定:
  //  create  : DOM要素に_local_idがなければprependする
  //  update  : DOM要素に_local_idがありnameプロパティが存在したら
  //            書き換える
  //  delete  : DOM要素に_local_idがありnameプロパティが存在しなければ
  //            削除する
  // 戻り値:
  // 例外発行: なし
  sync_object_and_dom = function ( action_object ) {
    var
      target_node,
      item_nodes,
      i,
      find_flag = false,
      find_index,
      fragment;

    target_node = document.getElementById( 'target' );

    if ( target_node ) {
      item_nodes = target_node.children;

      for ( i = 0; i < item_nodes.length; i += 1 ) {
        if ( item_nodes[i].dataset.localId === action_object._local_id ) {
          find_flag = true;
          find_index = i;
        }
      }

      // 見つかった
      if ( find_flag ) {

        // 更新の処理
        if ( action_object.name ) {
          item_nodes[ find_index ].parentNode.replaceChild(
            action_object.makeMicrodataElement(),
            item_nodes[ find_index ]
          );
        }
        // 削除の処理
        else {
          item_nodes[ find_index ].parentNode.removeChild( item_nodes[ find_index ] );
        }

      }
      // 見つからなかった 追加の処理
      else {
        fragment = action_object.makeMicrodataElement();
        target_node.insertBefore( fragment, target_node.childNodes[0] );
      }
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

    if ( element.text ) {
      element.text( 'データ件数は' + object.length + '件です。' );
    }
    else {
      element.textContent = 'データ件数は' + object.length + '件です。';
    }

  };
  // ユーティリティメソッド/sync_number_of_data/終了

  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  // DOMメソッド/make_anchor_element/開始
  make_anchor_element = function ( href, text ) {
    var
      // button,
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

  };
  // DOMイベントリスナー/onBlurInput/終了 -----------------------------

  // DOMイベントリスナー/onHashchange/開始 -----------------------------
  onHashchange = function ( main_section ) {
    switch ( location.hash ) {
      case '#list':
        initModule( main_section );
        break;
      case '#list/new':
        list_ui.show_create_form();
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

    // class=gの外側がクリックされたときの処理
    if ( current_node.getAttribute( 'id' ) === 'target' ) {
      return true;
    }
    // nodeのclassがgになるまで親要素をたどる
    while ( current_node.getAttribute( 'class' ) !== 'g' ) {
      current_node = current_node.parentNode;
    }

    // locationを#list/detailにする
    pal.bom.setLocationHash( '#list/detail' );

    return true;

  };
  // DOMイベントリスナー/onClickTarget/終了 -----------------------------
  // --------------------- DOMイベントリスナー終了 --------------------

  // ------------------ カスタムイベントリスナー開始 ------------------
  onChangeObject = function () {

    // DOM要素のリストに要素を追加する
    sync_object_and_dom( this );

    // 件数を表示する
    sync_number_of_data( document.getElementById( 'status' ), object_array);

  };
  // ------------------ カスタムイベントリスナー終了 ------------------

  // ------------------ メッセージリスナー開始 ------------------
  object_create = function ( data ) {
    var
      create_data;

    if ( data[0].result.n === 1 ) {

      create_data = data[0].ops;
      // action objectを生成する
      action_object = pal.schema.makeAction( create_data );
      // action_objectが変更されたときのコールバック関数
      // onChangeObjectをセットする
      // onChangeObjectから呼ばれるsync_object_and_domの中で
      // DOMに追加する
      action_object.change( onChangeObject );

      // object_arrayに追加する
      object_array.updateObject( action_object );
      // object_arrayを更新する
      object_array = pal.array.readObjectArray();

      action_object.change();
    }
    else {
      console.log( 'createに失敗しました' );
    }
  };

  object_read = function( data ) {
    var
      i;

    for ( i = 0; i < data[0].length; i += 1 ) {
      // action objectを生成する
      action_object = pal.schema.makeAction( data[0][i] );
      // action_objectが変更されたときのコールバック関数
      // onChangeObjectをセットする
      // onChangeObjectから呼ばれるsync_object_and_domの中で
      // DOMに追加する
      action_object.change( onChangeObject );

      object_array.updateObject( action_object );

      action_object.change();
    }
  };

  object_update = function ( data ) {

    if ( data[0].lastErrorObject.n === 1 ) {
      // action objectを生成する
      action_object = pal.schema.makeAction( data[0].value );
      // action_objectが変更されたときのコールバック関数
      // onChangeObjectをセットする
      // onChangeObjectから呼ばれるsync_object_and_domの中で
      // DOMに追加する
      action_object.change( onChangeObject );

      object_array.updateObject( action_object );

      // object_arrayを更新する
      object_array = pal.array.readObjectArray();

      // chageイベントを発生させる
      action_object.change();
    }
    else {
      console.log( 'updateに失敗しました' );
    }
  };

  object_delete = function ( data ) {
    var
      target_node,
      item_nodes,
      i,
      find_flag = false,
      _id = data[0].ops._id;

    if ( data[0].result.n === 1 ) {
      // サーバ側で削除が成功したときの処理
      // local_idがDOM上に存在するときは処理を行うが
      // DOM上に存在しないときは処理を行わない。
      //

      target_node = document.getElementById( 'target' );

      if ( target_node ) {
        item_nodes = target_node.children;

        for ( i = 0; i < item_nodes.length; i += 1 ) {
          if ( item_nodes[i].dataset.id === _id ) {
            find_flag = true;
          }
        }

        // 見つかった
        if ( find_flag ) {
          // action objectを生成する
          action_object = pal.schema.makeAction( data[0].ops );
          // action_objectが変更されたときのコールバック関数onChangeObjectを
          // セットする
          // onChangeObjectから呼ばれるsync_object_and_domの中で
          // DOMに追加する
          action_object.change( onChangeObject );

          // object_arrayから削除する
          object_array.deleteObject( action_object );

          // object_arrayを更新する
          object_array = pal.array.readObjectArray();

          // chageイベントを発生させる
          action_object.change();
        }
      }
    }
    else {
      console.log( 'deleteに失敗しました' );
    }

  };
  // ------------------ メッセージリスナー終了 ------------------

  // ------------------ コールバック処理開始 --------------------
  onObjectCreate = function() {
    var
      send_data;

    send_data = pal.util_b.makeStringObject( action_object );

    pal.socketio.createObject( send_data, object_create );
  };

  onObjectUpdate = function() {
    var
      send_data;

    send_data = pal.util_b.makeStringObject( action_object );

    if ( send_data._id ) {
      pal.socketio.updateObject( send_data, object_update );
    }
    else {
      pal.socketio.createObject( send_data, object_create );
    }

  };

  onObjectDelete = function() {
    var
      send_data;

    send_data = pal.util_b.makeStringObject( action_object );

    pal.socketio.deleteObject( send_data, object_delete );
  };
  // ------------------ コールバック処理終了 --------------------

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
      event_map;

    stateMap.$container = $container;

    // custom_arrayの初期化 localStorageから読み込む
    pal.array.initModule();

    // Socket.IOオブジェクトsioを生成する
    event_map = {
      'objectcreate'  : object_create,
      'objectread'    : object_read,
      'objectupdate'  : object_update,
      'objectdelete'  : object_delete
    };

    pal.socketio.initModule( '/list', event_map );

    // State Patternを初期化して最初の画面を表示する
    list_ui.initialize();
    list_ui.load();

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    configModule  : configModule,
    initModule    : initModule,
    onHashchange  : onHashchange
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
