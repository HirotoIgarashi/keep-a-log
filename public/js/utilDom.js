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
export const getTargetValue = (event) => {
  let theEvent = event || window.event;
  let target = theEvent.target || theEvent.srcElement;

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
  let txtInput  = getTargetValue(event);

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

export const getElementById = (id) => document.getElementById(id);

export const createTextNode = (text) => document.createTextNode(text);

export const getElementsByClassName =
  (className) => document.getElementsByClassName(className);

export const querySelector = (selector) => document.querySelector(selector);
export const querySelectorAll = (selector) => document.querySelectorAll(selector);

export const getValue = (element) => element.value;

export const setValue = (value) => {
  return (element) => element.setAttribute('value', value);
};

// パブリックメソッド/emptyElement/開始
// 目的: 引数のHTML要素の子要素をすべて削除する
// 引数:
//  * element  : HTML要素。この子要素をすべて削除する
// 戻り値: なし
// 例外発行: なし
//
export const emptyElement = (element) => {
  while (element && element.firstChild) {
    element.removeChild(element.firstChild);
  }
  return element;
};
// パブリックメソッド/emptyElement/終了

export const createDocumentFragment = () => document.createDocumentFragment();

export const createElement = (arg, option) => {
  if (typeof arg === 'string') {
    // 文字列が渡されたときの処理 ----------------------------------
    let element = document.createElement(arg);
    // elementの属性を設定する -------------------------------------
    if (option) {
      Object.keys(option).forEach((data) => {
        // textContentがあれば
        if (data === 'textContent') {
          element.textContent = option[data];
        }
        // innerHTMLがあれば
        else if (data === 'innerHTML') {
          element.innerHTML = option[data];
        }
        // valueがあれば
        else if (data === 'value') {
          element.value = option[data];
        }
        else {
          element.setAttribute(data, option[data])
        }
      })
    }
    return element;
  }
  else if (typeof arg === 'object') {

    console.log('createElementの古いバージョンが呼ばれました');

    let element = null;
    // オブジェクトが渡されたときの処理 ----------------------------
    // tagNameがあれば
    if (arg.tagName) {element = document.createElement(arg.tagName);}

    // idがあれば
    if (arg.id) {setAttribute(element, 'id', arg.id);}

    // classがあれば
    if (arg.class) {setAttribute(element, 'class', arg.class);}

    // typeがあれば
    if (arg.type) {setAttribute(element, 'type', arg.type)}

    // textContentがあれば
    if (arg.textContent) {element.textContent = arg.textContent}

    // innerHTMLがあれば
    if (arg.innerHTML) {element.innerHTML = arg.innerHTML}

    // valueがあれば
    if (arg.value) {element.value = arg.value}

    // forがあれば
    if (arg.for) {setAttribute(element, 'for', arg.for)}

    // hrefがあれば
    if (arg.href) {setAttribute(element, 'href', arg.href)}

    // onfocusがあれば
    if (arg.onfocus) {setAttribute(element, 'onfocus', arg.onfocus)}

    return element;
  }
  else {
    return null;
  }
};

export const createAnchor = (option) => (createElement('a', option));
export const createDt = (option) => (createElement('dt', option));
export const createDd = (option) => (createElement('dd', option));
export const createDl = (option) => (createElement('dl', option));
export const createDiv = (option) => (createElement('div', option));
export const createButton = (option) => (createElement('button', option));
export const createH1 = (option) => (createElement('h1', option));
export const createH2 = (option) => (createElement('h2', option));
export const createH3 = (option) => (createElement('h3', option));
export const createUl = (option) => (createElement('ul', option));
export const createLi = (option) => (createElement('li', option));
export const createNav = (option) => (createElement('nav', option));

export const innerHTML = (element, html) => {
  element.innerHTML = html;
  return element;
};

export const addClickEventListener = (func) => {
  return (element) => {
    element.addEventListener('click', func);
  };
};

export const setAttribute = (element, name, value) => {
  element.setAttribute(name, value);
  return element;
};

export const setAttributeCurried = (value) => {
  return (name) => {
    return (element) => {
      element.setAttribute(name, value);
      return element;
    };
  };
};

const autofocusTrue = (element) => {
  element.autofocus = true;
  return element;
};

const requiredTrue = (element) => {
  element.required = true;
  return element;
};

// 親ノードに子ノードを挿入する ------------------------------------
export const appendChild = ((frag, element) => {
  return frag.appendChild(element);
});

export const appendChildCurried = (element) => {
  return (frag) => {
    frag.appendChild(element)
  };
};

// 要素の前に要素を挿入する ----------------------------------------
export const insertBefore =
  ((source, destination) =>
   destination.insertBefore(source, destination.firstChild));

// ツリー構造を受取りツリー構造を返す ------------------------------
export const appendByTreeArray = (treeArray) => {
  let search = ((array) => {
    // 引数の配列の全ての要素の中に配列があったら1つ前の要素に
    // 関連付ける
    for (let i = 0; i < array.length; i = i + 1) {
      if (Array.isArray(array[i])) {
        array[i].forEach((data) => {
          if (!Array.isArray(data)) {
            array[i - 1].appendChild(data);
          }
        });
      }
    }

    array.forEach((data) => {
      // 再帰する場合: その要素が配列である場合
      if (Array.isArray(data)) {
        search(data);
      }
      // 再帰しない場合: その要素が配列ではないときはなにもしない
    });
    return array[0];
  });
  search(treeArray);
};

export const createLabelAndInput = (param) => {
  let labelElement = createElement('label', {
    'for': param.for,
    innerHTML: param.innerHTML
  });

  let inputElement = createElement('input', {
    'type': param.type,
    'name': param.name,
    'id': param.id,
    'placeholder': param.placeholder
  });
  if (param.autofocus) {
    autofocusTrue(inputElement);
  }
  if (param.required) {
    requiredTrue(inputElement);
  }

  return [labelElement, inputElement];
};

const callbackById =
  (id, callback) => callback(document.getElementById(id))

export const makeForm = (obj) => {
  let form = createElement('form');

  Object.keys(obj).forEach((key) => {
    if (key === 'eventId' || key === 'eventScheduleId') {
      // inputタグの設定 ---------------------------------------------
      let input = createElement('input');
      input.setAttribute('id', key);
      input.setAttribute('class', obj[key]['class']);
      form.appendChild(input);
    }
    else {
      let label = createElement('label');
      label.setAttribute('for', key);
      label.textContent = obj[key].labelText;
      form.appendChild(label);

      // inputタグの設定 ---------------------------------------------
      let input = createElement('input');
      input.setAttribute('id', key);
      // type属性の設定 ----------------------------------------------
      if (obj[key].type.name === 'String') {
        input.setAttribute('type', 'text');
      }
      else if (obj[key].type.name === 'Number') {
        input.setAttribute('type', 'number');
      }
      // min属性の設定 -----------------------------------------------
      if (obj[key].min) {
        input.setAttribute('min', obj[key].min);
      }
      // max属性の設定 -----------------------------------------------
      if (obj[key].max) {
        input.setAttribute('max', obj[key].max);
      }
      input.setAttribute('name', key);
      // placeholderの設定 -------------------------------------------
      if (obj[key].placeholder) {
        input.setAttribute('placeholder', obj[key].placeholder);
      }
      input.setAttribute('aria-describedby', key + '-tooltip');
      // required属性の設定 ------------------------------------------
      if (obj[key].required === true) {
        input.required = true;
      }
      form.appendChild(input);
      let div = createElement('div');
      div.setAttribute('roll', 'tooltip')
      div.setAttribute('id', key + '-tooltip');
      form.appendChild(div);
    }
  });

  return form;
};

export const getValueFromForm = (
  param, event, eventSchedule, eventParam, eventScheduleParam
) => {

  Object.keys(param).forEach((param) => {
    if (eventParam.includes(param)) {
      if (param === 'eventId') {
        let eventId = callbackById(param, data => data.value);
        if (eventId) {
          // 隠し属性のid値をセットする ----------------------------
          event._id = eventId;
        }
      }
      else {
        event[param] = callbackById(param, data => data.value);
      }
    }
    else if (eventScheduleParam.includes(param)) {
      if (param === 'eventScheduleId') {
        let eventScheduleId =
          callbackById(param, data => data.value);
        if (eventScheduleId) {
          // 隠し属性のid値をセットする ----------------------------
          eventSchedule._id = eventScheduleId;
        }
      }
      else {
        eventSchedule[param] =
          callbackById(param, data => data.value);
      }
    }
    else {
      console.log(
        'eventWeeklyParamとeventParamかeventScheduleParamが\
一致です'
      );
    }
  });
  return;
};
