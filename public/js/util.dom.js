'use strict;'

/*global util */
// domを操作するユーティリティ ---------------------------------------

util.dom = (() => {
  const helloWorld = () => 'hello world!';

  const getElementById = (id) => document.getElementById(id);

  const querySelector = (selector) => document.querySelector(selector);

  const getValue = (element) => element.value;

  const setValue = (value) => {
    return (element) => element.setAttribute('value', value);
  };

  // パブリックメソッド/emptyElement/開始
  // 目的: 引数のHTML要素の子要素をすべて削除する
  // 引数:
  //  * element  : HTML要素。この子要素をすべて削除する
  // 戻り値: なし
  // 例外発行: なし
  //
  const emptyElement = (element) => {
    while (element && element.firstChild) {
      element.removeChild(element.firstChild);
    }
    return element;
  };
  // パブリックメソッド/emptyElement/終了

  const createFragment = () => document.createDocumentFragment();

  const createElement = (arg, option) => {
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

  const createDt = (option) => (createElement('dt', option));
  const createDd = (option) => (createElement('dd', option));

  const innerHTML = (element, html) => {
    element.innerHTML = html;
    return element;
  };

  const addClickEventListener = (func) => {
    return (element) => {
      element.addEventListener('click', func);
    };
  };

  const setAttribute = (element, name, value) => {
    element.setAttribute(name, value);
    return element;
  };

  const setAttributeCurried = (value) => {
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
  // const appendChild = ((frag, element) => frag.appendChild(element));
  const appendChild = ((frag, element) => {
    return frag.appendChild(element);
  });

  const appendChildCurried = (element) => {
    return (frag) => {
      frag.appendChild(element)
    };
  };

  // 要素の前に要素を挿入する ----------------------------------------
  const insertBefore =
    ((source, destination) =>
     destination.insertBefore(source, destination.firstChild));

  // ツリー構造を受取りツリー構造を返す ------------------------------
  const appendByTreeArray = (treeArray) => {
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

  const createLabelAndInput = (param) => {
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

  const makeForm = (obj) => {
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

  const getValueFromForm = (
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
不一致です'
        );
      }
    });

    return;
  };

  // 関数をエクスポートする ------------------------------------------
  return {
    helloWorld: helloWorld,
    getElementById  : getElementById,
    querySelector   : querySelector,
    getValue        : getValue,
    setValue        : setValue,
    emptyElement    : emptyElement,
    createFragment  : createFragment,
    createElement   : createElement,
    createDt        : createDt,
    createDd        : createDd,
    innerHTML       : innerHTML,
    addClickEventListener : addClickEventListener,
    setAttribute        : setAttribute,
    setAttributeCurried : setAttributeCurried,
    autofocusTrue: autofocusTrue,
    // 親ノードに子ノードを挿入する ----------------------------------
    appendChild         : appendChild,
    appendChildCurried  : appendChildCurried,
    // 要素の前に要素を挿入する ----------------------------------------
    insertBefore        : insertBefore,
    // ツリー構造を受取りツリー構造を返す ----------------------------
    appendByTreeArray: appendByTreeArray,
    createLabelAndInput: createLabelAndInput,
    callbackById: callbackById,
    makeForm: makeForm,
    getValueFromForm: getValueFromForm
  };
})();
