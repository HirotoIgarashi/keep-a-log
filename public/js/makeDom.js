'use strict';

import { initDom, setSection } from "./controlDom.js";

// イベントハンドラ/onHashchange/開始
export const onHashchange = () => {
  setSection();
};
// イベントハンドラ/onHashchange/終了

export const makeDom = (id) => {
  // 与えられたidをDOMの中から探す
  let content = document.getElementById(id);
  console.log(content);

  if (content) {
    initDom( content );
    // URIのハッシュ変更イベントを処理する。
    // これはすべての機能モジュールを設定して初期化した後に行う。
    // そうしないと、トリガーイベントを処理できる状態になっていない。
    // トリガーイベントはアンカーがロード状態と見なせることを保証する
    // ために使う
    if (Object.prototype.hasOwnProperty.call(window, "onhashchange")) {
      window.addEventListener( "hashchange", onHashchange, false );
    }
  }
};
