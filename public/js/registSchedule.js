/*
 * registSchedule.js
 * 週間時間割用のモジュール
*/

'use strict';

import { getLocationHash } from "./controlDom.js";
import {
  getTplContent, emptyElement, querySelector,
  querySelectorAll
} from "./utilDom.js";

//--------------------- モジュールスコープ変数開始 -----------------
// var
//   configMap = {
//     settable_map  : { color_name: true },
//     color_name    : 'blue'
//   };
//--------------------- モジュールスコープ変数終了 -----------------

// --------------------- イベントハンドラ開始 ----------------------
// 例: onClickButton = function ( event ) {};
const onHashchange = ( main_section ) => {
  var
    current_hash = getLocationHash(),
    schedule_main,
    menu              = getTplContent( 'schedule-registration' ),
    dayly             = getTplContent( 'schedule-registration-dayly' ),
    current_page,
    anchor_list,
    select_button,
    select_menu;

  // mainセクションの子要素をすべて削除する
  // mainセクションの子要素の削除は下位のモジュールにまかせる
  emptyElement( main_section );

  // メニューを表示する
  main_section.appendChild( menu );

  // ボタンとメニューのノードを取得
  select_button = querySelector( '#schedule-registration-menu button' );
  select_menu = select_button.nextElementSibling;

  // 初期の(メニューが閉じているときの)状態と設定
  select_button.setAttribute( 'aria-expanded', 'false' );
  select_button.hidden = false;
  select_menu.hidden = true;

  select_button.addEventListener( 'click', function () {
    // メニューの表示/非表示を切り替える
    var
      expanded = this.getAttribute( 'aria-expanded' ) === 'true',
      expand_svg,
      contract_svg;

    this.setAttribute( 'aria-expanded', String(!expanded) );
    select_menu.hidden = expanded;

    expand_svg = querySelector( '#expand-button' );
    contract_svg = querySelector( '#contract-button' );

    if (expanded) {
      expand_svg.setAttribute( 'display', 'inline' );
      contract_svg.setAttribute( 'display', 'none' );
    }
    else {
      expand_svg.setAttribute( 'display', 'none' );
      contract_svg.setAttribute( 'display', 'inline' );
    }
  }, false );

  // 現在のページを取得する
  current_page = querySelector( '#schedule-registration-menu li a.current-page' );

  current_page.setAttribute( 'class', '' );

  // current_hashからcurrent-pageを設定する
  // anchor_listを取得する
  anchor_list = querySelectorAll( '#schedule-registration-menu li a' );

  // 初期ロードのときのcurrent_hashは'#regist_schedule'になっているので
  if (current_hash === '#regist_schedule') {
    anchor_list[ 0 ].setAttribute( 'class', 'current-page' );
  }
  // anchor_listからcurrent_hashに一致するものにcurrent-pageをセットする
  else {
    for (let i = 0; i < anchor_list.length; i = i + 1 ) {
      if ( anchor_list[ i ].getAttribute( 'href' ) === current_hash ) {
        anchor_list[ i ].setAttribute( 'class', 'current-page' );
      }
    }
  }

  // LocationHashの値により登録フォームを表示する
  schedule_main = querySelector( '#schedule-main' );

  if (current_hash === '#regist_schedule' ||
      current_hash === '#regist_schedule/dayly') {
    schedule_main.appendChild( dayly );
  }

  return true;
};
// --------------------- イベントハンドラ終了 ----------------------

// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/configModule/開始
// 目的: 許可されたキーの構成を調整する
// 引数: 設定可能なキーバリューマップ
//  * color_name  - 使用する色
// 設定:
//  * configMap.settable_map 許可されたキーを宣言する
// 戻り値: true
// 例外発行: なし
//
// const configModule = function ( input_map ) {
//   pal.butil.setConfigMap({
//     input_map     : input_map,
//     settable_map  : configMap.settable_map,
//     config_map    : configMap
//   });
//   return true;
// };
// パブリックメソッド/configModule/終了

// パブリックメソッド/initModule/開始
// 目的: モジュールを初期化する
// 引数:
//  * $container この機能が使うjQuery要素
// 戻り値: true
// 例外発行: なし
//
export const registSchedule = (mainSection) => {
  // mainセクションの子要素をすべて削除する
  // mainセクションの子要素の削除は下位のモジュールにまかせる
  emptyElement(mainSection);

  // hashの状態により表示を切り替える
  onHashchange(mainSection);

  return true;
};
// パブリックメソッド/initModule/終了
