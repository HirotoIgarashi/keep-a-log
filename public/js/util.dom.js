'use strict;'

let util;
if (!util) {
  util = {};
}

util.dom = (() => {
  const helloWorld = () => {
    return 'hello world!';
  };

  const createFragment = () => {
    return document.createDocumentFragment();
  };

  const createElement = (tagName) => {
    return document.createElement(tagName);
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
