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
/*global pal */

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
    toggleElement,
    toggleTip,
    inputChangeCallback,
    getTargetValue,
    addEventListener,
    checkInputField,
    isNonEmpty,
    isInteger,
    isRange;

  // 実装予定の関数
  // getTargetValue       : eventを受け取り値を返す
  // removeEventListener  : フォームの送信をキャンセルする関数
  // isNumber             : 値が数字かチェックする
  // isAlphaNum           : 値が英数字かチェックする

  // 実装済の関数
  // checkInputField      : フォームのフィールドをチェックする
  // addEventListener     : イベントが発生したときの処理を追加する
  // isNonEmpty           : 空の値でないかチェックする
  //

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
  // setConfigMap = function ( arg_map ) {
  //   var
  //     input_map = arg_map.input_map,
  //     settable_map = arg_map.settable_map,
  //     config_map = arg_map.configMap,
  //     key_name, error;

  //   for ( key_name in input_map ) {
  //     if ( input_map.hasOwnProperty( key_name ) ) {
  //       if ( settable_map.hasOwnProperty( key_name ) ) {
  //         config_map[key_name] = input_map[key_name];
  //       }
  //       else {
  //         error = makeError( 'Bad Input', 
  //           'Setting config key |' + key_name + '| is not supported'
  //         );
  //         throw error;
  //       }
  //     }
  //   }
  // };
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

  // パブリックメソッド/toggleTip/開始
  // 目的: 第1引数のinput要素のフォーカス状態によって第2引数のtipの
  //        表示/非表示を切り替える
  // 引数:
  //  * input_element  : input要素
  //  * tip  : 表示/非表示を切り替えるtip
  // 戻り値: なし
  // 例外発行: なし
  //
  toggleTip = function ( input_element, tip ) {
    // 初期の状態ではtipを非表示にする
    tip.hidden = true;
    // input要素がフォーカスされたらtipを表示する
    input_element.addEventListener( 'focus', function () {
      tip.hidden = false;
    });

    // input要素のフォーカスが外れたらtipを非表示にする
    input_element.addEventListener( 'blur', function () {
      tip.hidden = true;
    });

  };
  // パブリックメソッド/toggleTip/終了

  // パブリックメソッド/inputChangeCallback/開始
  // 目的: 第1引数のinput要素の入力内容が変更されたら第2引数の
  //        コールバック関数を実行する
  // 引数:
  //  * input_element  : input要素
  //  * callback  : コールバック関数
  // 戻り値: なし
  // 例外発行: なし
  //
  inputChangeCallback = function ( input_element, callback ) {
    input_element.addEventListener( 'change', function() {
      callback();
    });
  };
  // パブリックメソッド/inputChangeCallback/終了

  // パブリックメソッド/getTargetValue/開始
  // 目的: イベントを引数として受け取りイベントが発生した要素の
  //        値を返す
  // 引数:
  //  * event  : イベント
  // 戻り値: input要素の値
  // 例外発行: なし
  //
  getTargetValue = function ( event ) {
    var
      theEvent  = event || window.event,
      target    = theEvent.target || theEvent.srcElement;

    return target.value;
  };
  // パブリックメソッド/getTargetValue/終了

  // パブリックメソッド/addEventListener/開始
  // 用例: pal.util.addEventLister( element, 'click', elementHandler );
  // 目的: DOMレベル2のイベントモデルとIEのイベントモデルに対応する
  // 引数:
  //  * eventObj      : イベントに対応したオブジェクト
  //  * event         : イベント
  //  * eventHandler  : 呼び出される関数 
  // 戻り値: なし
  // 例外発行: なし
  // 動作: DOMレベル2のイベントモデル(DOM Model)では、addEventListenerを
  //        使ってイベントハンドラを設定します。
  //        IEのイベントモデル(IE Model)ではattachEventを設定します。
  //
  addEventListener = function ( eventObj, event, eventHandler ) {
    if ( document.addEventListener ) {
      eventObj.addEventListener( event, eventHandler, false );
    }
    else if ( document.attachEvent ) {
      event = 'on' + event;
      eventObj.attachEvent( event, eventHandler );
    }
  };
  // パブリックメソッド/addEventListener/終了

  // パブリックメソッド/checkInputField/開始
  // 用例: pal.util.checkInputField( event, pal.util.isNonEmpty );
  // 目的: input要素の値をチェックする
  // 引数:
  //  * event     : イベント
  //  * checkFunc : チェックに利用する関数
  // 戻り値: 妥当であれば   : true
  //         妥当でなければ : false
  // 例外発行: なし
  //
  checkInputField = function ( event, checkFunc ) {
    var
      //theEvent  = event || window.event,
      //target    = theEvent.target || theEvent.srcElement,
      txtInput  = getTargetValue( event );

    return checkFunc( txtInput ); 
  };
  // パブリックメソッド/checkInputField/終了

  // パブリックメソッド/isRange/開始
  // 目的: 第1引数の値が第2引数と第3引数の間にあるかをチェックする
  // 引数:
  //  * value : チェック対象の値
  //  * min   : 下限値
  //  * max   : 上限値
  // 戻り値: 妥当であれば   : true
  //         妥当でなければ : false
  // 例外発行: なし
  //
  isRange = function ( value, min, max ) {
    var
      valueNumber;

    if ( typeof value === 'string' ) {
      valueNumber = Number( value );
    }
    else {
      valueNumber = value;
    }

    if ( min > valueNumber || valueNumber > max ) {
      return false;
    }
    return true;

  };
  // パブリックメソッド/isRange/終了

  // パブリックメソッド/isNonEmpty/開始
  // 目的: 空の値でないか検査
  isNonEmpty = function ( value ) {
    return value !== "";
  };
  // パブリックメソッド/isNonEmpty/終了

  // パブリックメソッド/isInteger/開始
  // 目的: 整数かどうかを検査する
  isInteger = function ( value ) {
    var
      valueNumber;

    // ポリフィル
    Number.isInteger = Number.isInteger || function( value ) {
      return typeof value === 'number' &&
        isFinite( value ) &&
        Math.floor( value ) === value;
    };

    if ( typeof value === 'string' ) {
      valueNumber = Number( value );
    }
    else {
      valueNumber = value;
    }

    return Number.isInteger( valueNumber );

  };
  // パブリックメソッド/isNonEmpty/終了

  return {
    makeError           : makeError,
    addChange           : addChange,
    setConfigMap        : setConfigMap,
    clearFormAll        : clearFormAll,
    emptyElementById    : emptyElementById,
    emptyElement        : emptyElement,
    showElement         : showElement,
    hideElement         : hideElement,
    toggleElement       : toggleElement,
    toggleTip           : toggleTip,
    inputChangeCallback : inputChangeCallback,
    getTargetValue      : getTargetValue,
    addEventListener    : addEventListener,
    checkInputField     : checkInputField,
    isRange             : isRange,
    isNonEmpty          : isNonEmpty,
    isInteger           : isInteger
  };
}());
