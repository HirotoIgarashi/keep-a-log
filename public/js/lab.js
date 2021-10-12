/*
 * lab.js
 * 実験用のモジュール
*/

'use strict';

import {
  getTplContent, toggleElement, showElement, hideElement,
  emptyElement, getElementById
} from "./utilDom.js";

// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/lab/開始
// 目的: モジュールを初期化する
// 引数:
//  * $container この機能が使うjQuery要素
// 戻り値: true
// 例外発行: なし
//
export const lab = () => {
  let mainSection;
  let helloWorld  = getTplContent('lab');

  // mainセクションを取得する
  mainSection = getElementById( 'pal-main' );
  // mainセクションの子要素をすべて削除する
  emptyElement( mainSection );
  // document fragmentを追加する
  mainSection.appendChild(helloWorld);

  toggleElement(
    'pal-lab-play',
    'pal-lab-pause',
    showElement.bind(this, 'pal-lab-form'),
    hideElement.bind(this, 'pal-lab-form')
  );
  return true;
};
// パブリックメソッド/initModule/終了
