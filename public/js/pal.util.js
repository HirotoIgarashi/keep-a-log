/*
 * pal.util.js
 * 汎用JavaScriptユーティリティ
 *
 * Michael S. Mikowski - mmikowski at gmail dot com
 * これらは、Webからひらめきを得て、
 * 1988年から作成、コンパイル、アップデートを行ってきたルーチン。
 *
 * MITライセンス
 *
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/
/*global $, pal */

pal.util = (function () {
  var
    makeError,
    setConfigMap,
    addChange,
    clearFormAll,
    clearForm,
    clearElement,
    emptyElementById,
    emptyElement,
    showElement,
    hideElement,
    toggleElement;

  // パブリックコンストラクタ/makeError/開始
  // 目的: エラーオブジェクトを作成する便利なラッパー
  // 引数:
  //  * name_text - エラー名
  //  * msg_text  - 長いエラーメッセージ
  //  * data      - エラーオブジェクトに付加するオプションのデータ
  // 戻り値: 新たに作成されたエラーオブジェクト
  // 例外発行: なし
  //
  makeError = function ( name_text, msg_text, data ) {
    var error = new Error();

    error.name = name_text;
    error.message = msg_text;

    if ( data ) { error.data = data; }

    return error;
  };
  // パブリックコンストラクタ/makeError/終了

  // ユーティリティメソッド/addChange/開始
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
  // ユーティリティメソッド/addChange/終了

  // パブリックメソッド/setConfigMap/開始
  // 目的: 機能モジュールで構成を行うための共通コード
  // 引数:
  //  * input_map     - 構成するキーバリューマップ
  //  * settable_map  - 構成できるキーのマップ
  //  * config_map    - 構成を適用するマップ
  // 戻り値: true
  // 例外発行: 入力キーが許可されていない場合は例外を発行する
  //
  setConfigMap = function ( arg_map ) {
    var
      input_map = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map = arg_map.configMap,
      key_name, error;

    for ( key_name in input_map ) {
      if ( input_map.hasOwnProperty( key_name ) ) {
        if ( settable_map.hasOwnProperty( key_name ) ) {
          config_map[key_name] = input_map[key_name];
        }
        else {
          error = makeError( 'Bad Input', 
            'Setting config key |' + key_name + '| is not supported'
          );
          throw error;
        }
      }
    }
  };
  // パブリックメソッド/setConfigMap/終了

  // パブリックメソッド/clearFormAll/開始
  // 目的: Form要素の値をすべてクリアする
  // 引数: なし
  // 戻り値: なし
  // 例外発行: なし
  //
  clearFormAll = function () {
    var
      i;

    for ( i = 0; i < document.forms.length; i += 1 ) {
      clearForm( document.forms[i] );
    }

  };
  // パブリックメソッド/clearFormAll/終了
  clearForm = function( form ) {
    var
      i;

    for ( i = 0; i < form.elements.length; i += 1 ) {
      clearElement( form.elements[i] );
    }
  };

  clearElement = function( element ) {
    switch( element.type ) {
      case 'hidden':
      case 'submit':
      case 'reset':
      case 'button':
      case 'image':
        return;
      case 'file':
        return;
      case 'text':
      case 'password':
      case 'textarea':
      case 'datetime-local':
        element.value = '';
        return;
      case 'checkbox':
      case 'radio':
        element.checked = false;
        return;
      case 'select-one':
      case 'select-multiple':
        element.selectedIndex = 0;
        return;
      default:
    }
  };

  // パブリックメソッド/emptyElementById/開始
  // 目的: 引数のid値を持つHTML要素の下位の要素をすべて削除する
  // 引数:
  //  * element_id  : idの値
  // 戻り値: なし
  // 例外発行: なし
  //
  emptyElementById = function ( element_id ) {
    var
      element;

    // 新規作成のアンカーを削除する
    element = document.getElementById( element_id );

    while ( element && element.firstChild ) {
      element.removeChild( element.firstChild );
    }
  };
  // パブリックメソッド/emptyElementById/終了

  // パブリックメソッド/emptyElement/開始
  // 目的: 引数のHTML要素の子要素をすべて削除する
  // 引数:
  //  * element  : HTML要素。この子要素をすべて削除する
  // 戻り値: なし
  // 例外発行: なし
  //
  emptyElement = function ( element ) {
    while ( element.firstChild ) {
      element.removeChild( element.firstChild );
    }
  };
  // パブリックメソッド/emptyElement/終了

  // パブリックメソッド/showElement/開始
  // 目的: HTML要素id値を引数を受け取りhidden="true"の状態を見えるように
  //      する。
  // 引数:
  //  * element_id  : 見えるようにするHTML要素のid値
  // 戻り値: なし
  // 例外発行: なし
  //
  showElement = function ( element_id, show_callback ) {
    var
      element;
    // 要素の取得
    element  = document.getElementById( element_id );

    // 要素を表示する
    element.hidden = false;

    // 要素を表示する WAI
    element.setAttribute( 'aria-pressed', 'false' );

    if ( show_callback ) {
      console.log( 'show_callback' );
      show_callback();
    }

    return;
  };
  // パブリックメソッド/showElement/終了

  // パブリックメソッド/hideElement/開始
  // 目的: HTML要素id値を引数を受け取りhidden="true"の状態にする
  //      する。
  // 引数:
  //  * element_id  : 隠すHTML要素のid値
  // 戻り値: なし
  // 例外発行: なし
  //
  hideElement = function ( element_id, hide_callback ) {
    var
      element;
    // 要素の取得
    element  = document.getElementById( element_id );

    // 要素を表示する
    element.hidden = true;

    // 要素を表示する WAI
    element.setAttribute( 'aria-pressed', 'true' );

    if ( hide_callback ) {
      console.log( 'hide_callback' );
      hide_callback();
    }

    return;
  };
  // パブリックメソッド/hideElement/終了

  // パブリックメソッド/toggleElement/開始
  // 目的: 引数のHTML要素の子要素をすべて削除する
  // 引数:
  //  * element  : HTML要素。この子要素をすべて削除する
  // 戻り値: なし
  // 例外発行: なし
  //
  toggleElement = function ( before_id, after_id, show_callback, hide_callback ) {
    var
      before_element,
      after_element;

    // 要素の取得
    before_element  = document.getElementById( before_id );
    after_element = document.getElementById( after_id );

    // 最初の要素の初期状態: 表示 この処理では何もしない
    // 2番目の要素の初期状態: 非表示
    hideElement( after_id );

    // 最初の要素が押されたら、
    // ・ 最初の要素を非表示にする
    // ・ 2番目の要素を表示する
    before_element.addEventListener( 'click', function () {
      hideElement( before_id );

      if ( show_callback ) {
        showElement( after_id, show_callback );
      }
      else {
        showElement( after_id );
      }
    });

    // 2番目の要素が押されたら、
    // ・ 2番目の要素を非表示にする
    // ・ 最初の要素を表示する
    after_element.addEventListener( 'click', function () {
      if ( hide_callback ) {
        hideElement( after_id, hide_callback );
      }
      else {
        hideElement( after_id );
      }

      showElement( before_id );
    });
  };
  // パブリックメソッド/toggleElement/終了

  return {
    makeError         : makeError,
    addChange         : addChange,
    setConfigMap      : setConfigMap,
    clearFormAll      : clearFormAll,
    emptyElementById  : emptyElementById,
    emptyElement      : emptyElement,
    showElement       : showElement,
    hideElement       : hideElement,
    toggleElement     : toggleElement
  };
}());
