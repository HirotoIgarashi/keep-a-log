/*
 * utilDom.js
 *
*/

// パブリックコンストラクタ/makeError/開始
// 目的: エラーオブジェクトを作成する便利なラッパー
// 引数:
//  * name_text - エラー名
//  * msg_text  - 長いエラーメッセージ
//  * data      - エラーオブジェクトに付加するオプションのデータ
// 戻り値: 新たに作成されたエラーオブジェクト
// 例外発行: なし
//
export const makeError = (name_text, msg_text, data) => {
  let error = new Error();

  error.name = name_text;
  error.message = msg_text;

  if (data) { error.data = data; }
  return error;
};
// パブリックコンストラクタ/makeError/終了

// ユーティリティメソッド/addChange/開始
export const addChange = (ob) => {
  ob.change = (callback) => {
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
      for (let i = 0; i < this._change.length; i++ ) {
        this._change[i].apply( this );
      }
    }
  };
};
// ユーティリティメソッド/addChange/終了

// パブリックメソッド/clearFormAll/開始
// 目的: Form要素の値をすべてクリアする
// 引数: なし
// 戻り値: なし
// 例外発行: なし
//
export const clearFormAll = () => {
  for (let i = 0; i < document.forms.length; i += 1 ) {
    clearForm( document.forms[i] );
  }
};
// パブリックメソッド/clearFormAll/終了
const clearForm = (form) => {
  for (let i = 0; i < form.elements.length; i += 1 ) {
    clearElement( form.elements[i] );
  }
};

const clearElement = (element) => {
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
//  * elementId  : idの値
// 戻り値: なし
// 例外発行: なし
//
export const emptyElementById = (elementId) => {
  // 新規作成のアンカーを削除する
  let element = document.getElementById(elementId);
  while (element && element.firstChild) {
    element.removeChild(element.firstChild);
  }
};
// パブリックメソッド/emptyElementById/終了

// パブリックメソッド/showElement/開始
// 目的: HTML要素id値を引数を受け取りhidden="true"の状態を見えるように
//      する。
// 引数:
//  * elementId  : 見えるようにするHTML要素のid値
// 戻り値: なし
// 例外発行: なし
//
export const showElement = (elementId, showCallback) => {
  // 要素の取得
  let element  = document.getElementById(elementId);

  // 要素を表示する
  element.hidden = false;

  // 要素を表示する WAI
  element.setAttribute('aria-pressed', 'false');

  if (showCallback) {
    console.log('showCallback');
    showCallback();
  }
  return;
};
// パブリックメソッド/showElement/終了

// パブリックメソッド/hideElement/開始
// 目的: HTML要素id値を引数を受け取りhidden="true"の状態にする
//      する。
// 引数:
//  * elementId  : 隠すHTML要素のid値
// 戻り値: なし
// 例外発行: なし
//
export const hideElement = (elementId, hideCallback) => {
  // 要素の取得
  let element  = document.getElementById(elementId);
  // 要素を表示する
  element.hidden = true;
  // 要素を表示する WAI
  element.setAttribute('aria-pressed', 'true');

  if (hideCallback) {
    console.log('hide_callback');
    hideCallback();
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
export const toggleElement = (before_id, after_id, show_callback, hide_callback) => {
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
  after_element.addEventListener('click', () => {
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
export const toggleTip = (input_element, tip) => {
  // 初期の状態ではtipを非表示にする
  tip.hidden = true;
  // input要素がフォーカスされたらtipを表示する
  input_element.addEventListener('focus', () => {
    tip.hidden = false;
  });

  // input要素のフォーカスが外れたらtipを非表示にする
  input_element.addEventListener('blur', () => {
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
export const inputChangeCallback = (input_element, callback) => {
  input_element.addEventListener( 'change', () => {
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
const getTargetValue = (event) => {
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
export const addEventListener = (eventObj, event, eventHandler) => {
  if (document.addEventListener) {
    eventObj.addEventListener(event, eventHandler, false);
  }
  else if (document.attachEvent) {
    event = 'on' + event;
    eventObj.attachEvent(event, eventHandler);
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
export const checkInputField = (event, checkFunc) => {
  var
    //theEvent  = event || window.event,
    //target    = theEvent.target || theEvent.srcElement,
    txtInput  = getTargetValue( event );

  return checkFunc( txtInput );
};
// パブリックメソッド/checkInputField/終了

// getTplContent/開始
// 目的: テンプレートからコンテンツを取得して返す。
// 必須引数: IDの値
// オプション引数: なし
// 設定:
// 戻り値: 引数のIDの値のコンテンツ
// 例外発行: なし
export const getTplContent = (templateId) => {
  let content;
  let tpl = document.getElementById( templateId );

  if (tpl) {
    content = tpl.content.cloneNode(true);
  }
  return content;
};
// getTplContent/終了
