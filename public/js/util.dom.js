'use strict;'

/*global util */
// domを操作するユーティリティ ---------------------------------------

util.dom = (() => {
  const helloWorld = () => {
    return 'hello world!';
  };

  const createFragment = () => {
    return document.createDocumentFragment();
  };

  const createElement = (arg) => {
    if (typeof arg === 'string') {
      // 文字列が渡されたときの処理 ----------------------------------
      return document.createElement(arg);
    }
    else if (typeof arg === 'object') {
      let element = null;
      // オブジェクトが渡されたときの処理 ----------------------------
      // tagNameがあれば
      if (arg.tagName) {element = document.createElement(arg.tagName);}

      // idがあれば
      if (arg.id) {setAttribute(element, 'id', arg.id);}

      // innerHTMLがあれば
      if (arg.innerHTML) {element.innerHTML = arg.innerHTML}

      // typeがあれば
      if (arg.type) {setAttribute(element, 'type', arg.type)}

      // forがあれば
      if (arg.for) {setAttribute(element, 'for', arg.for)}

      return element;
    }
    else {
      return null;
    }
  };

  const innerHTML = (element, html) => {
    element.innerHTML = html;

    return element;
  };

  const setAttribute = (element, name, value) => {
    element.setAttribute(name, value);

    return element;
  };

  const autofocusTrue = (element) => {
    element.autofocus = true;
    return element;
  };

  const requiredTrue = (element) => {
    element.required = true;
    return element;
  };

  const appendChild = ((frag, element) => {
    return frag.appendChild(element);
  });

  const createLabelAndInput = (param) => {
    let labelElement = createElement('label');
    setAttribute(labelElement, 'for', param.for);
    innerHTML(labelElement, param.innerHTML);

    let inputElement = createElement('input');
    setAttribute(inputElement, 'type', param.type);
    setAttribute(inputElement, 'name', param.name);
    setAttribute(inputElement, 'id', param.id);
    setAttribute(inputElement, 'placeholder', param.placeholder);
    if (param.autofocus) {
      autofocusTrue(inputElement);
    }
    if (param.required) {
      requiredTrue(inputElement);
    }

    return [labelElement, inputElement];
  };

  // 関数をエクスポートする ------------------------------------------
  return {
    helloWorld: helloWorld,
    createFragment: createFragment,
    createElement: createElement,
    innerHTML: innerHTML,
    setAttribute: setAttribute,
    autofocusTrue: autofocusTrue,
    appendChild: appendChild,
    createLabelAndInput: createLabelAndInput
  };
})();
