'use strict;'

/*global util */
// domを操作するユーティリティ ---------------------------------------

util.dom = (() => {
  const helloWorld = () => 'hello world!';

  const createFragment = () => document.createDocumentFragment();

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

  // 親ノードに子ノードを挿入する ------------------------------------
  const appendChild = ((frag, element) => frag.appendChild(element));

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
    // 親ノードに子ノードを挿入する ----------------------------------
    appendChild: appendChild,
    // 要素の前に要素を挿入する ----------------------------------------
    insertBefore: insertBefore,
    // ツリー構造を受取りツリー構造を返す ----------------------------
    appendByTreeArray: appendByTreeArray,
    createLabelAndInput: createLabelAndInput
  };
})();
