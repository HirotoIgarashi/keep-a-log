/*
 * pal.registSchedule.js
 * 週間時間割用のモジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global pal */

pal.registSchedule = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    onHashchange,
    configModule, initModule;
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/example_method/開始
  // 目的:
  // 必須引数:
  //  * do_extend(プール値) trueはスライダーを拡大し、falseは格納する。
  // オプション引数:
  //  * callback(関数) アニメーションの完了後に実行される。
  // 設定:
  //  * chat_extend_time, chat_retract_time
  //  * chat_extend_height
  // 戻り値: boolean
  //  * true: スライダーアニメーションが動作した。
  //  * false: スライダーアニメーションが動作していない。
  // 例外発行: なし
  // example_method = function () {
  //   var example;
  //   return example;
  // };
  // ユーティリティメソッド/example_method/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  onHashchange = function ( main_section ) {
    var
      current_hash = pal.bom.getLocationHash(),
      schedule_main,
      menu              = pal.util_b.getTplContent( 'schedule-registration' ),
      dayly             = pal.util_b.getTplContent( 'schedule-registration-dayly' ),
      weekly            = pal.util_b.getTplContent( 'schedule-registration-weekly' ),
      monthly_by_date   = pal.util_b.getTplContent( 'schedule-registration-monthly-by-date' ),
      monthly_by_order  = pal.util_b.getTplContent( 'schedule-registration-monthly-by-order' ),
      current_page,
      anchor_list,
      i,
      select_button,
      select_menu;

    // mainセクションの子要素をすべて削除する
    // mainセクションの子要素の削除は下位のモジュールにまかせる
    pal.util.emptyElement( main_section );

    // メニューを表示する
    main_section.appendChild( menu );

    // ボタンとメニューのノードを取得
    select_button = document.querySelector( '#schedule-registration-menu button' );
    select_menu = select_button.nextElementSibling;

    // 初期の(メニューが閉じているときの)状態と設定
    select_button.setAttribute( 'aria-expanded', 'false' );
    select_button.hidden = false;
    select_menu.hidden = true;

    select_button.addEventListener( 'click', function () {

      // メニューの表示/非表示を切り替える
      var
        expanded = this.getAttribute( 'aria-expanded' ) === 'true',
        // button,
        expand_svg,
        contract_svg;

      this.setAttribute( 'aria-expanded', String(!expanded) );
      select_menu.hidden = expanded;

      // button = document.querySelector( '#schedule-registration-menu button' );
      expand_svg = document.querySelector( '#expand-button' );
      contract_svg = document.querySelector( '#contract-button' );

      if ( expanded ) {
        expand_svg.setAttribute( 'display', 'inline' );
        contract_svg.setAttribute( 'display', 'none' );
      }
      else {
        expand_svg.setAttribute( 'display', 'none' );
        contract_svg.setAttribute( 'display', 'inline' );
      }

    }, false );


    // // 現在のページを取得する
    current_page = document.querySelector( '#schedule-registration-menu li a.current-page' );

    current_page.setAttribute( 'class', '' );

    // current_hashからcurrent-pageを設定する
    // anchor_listを取得する
    anchor_list = document.querySelectorAll( '#schedule-registration-menu li a' );

    // 初期ロードのときのcurrent_hashは'#regist_schedule'になっているので
    if ( current_hash === '#regist_schedule') {

      anchor_list[ 0 ].setAttribute( 'class', 'current-page' );
    }
    // anchor_listからcurrent_hashに一致するものにcurrent-pageをセットする
    else {

      for ( i = 0; i < anchor_list.length; i = i + 1 ) {
        if ( anchor_list[ i ].getAttribute( 'href' ) === current_hash ) {
          anchor_list[ i ].setAttribute( 'class', 'current-page' );
        }
      }

    }

    // LocationHashの値により登録フォームを表示する
    schedule_main = document.querySelector( '#schedule-main' );

    if ( current_hash === '#regist_schedule' || current_hash === '#regist_schedule/dayly' ) {
      schedule_main.appendChild( dayly );
    }
    else if ( current_hash === '#regist_schedule/weekly' ) {
      schedule_main.appendChild( weekly );
    }
    else if ( current_hash === '#regist_schedule/monthly/bydate' ) {
      schedule_main.appendChild( monthly_by_date );
    }
    else if ( current_hash === '#regist_schedule/monthly/byorder' ) {
      schedule_main.appendChild( monthly_by_order );
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
  configModule = function ( input_map ) {
    pal.butil.setConfigMap({
      input_map     : input_map,
      settable_map  : configMap.settable_map,
      config_map    : configMap
    });
    return true;
  };
  // パブリックメソッド/configModule/終了

  // パブリックメソッド/initModule/開始
  // 目的: モジュールを初期化する
  // 引数:
  //  * $container この機能が使うjQuery要素
  // 戻り値: true
  // 例外発行: なし
  //
  initModule = function ( main_section ) {

    // mainセクションの子要素をすべて削除する
    // mainセクションの子要素の削除は下位のモジュールにまかせる
    console.log( main_section );

    pal.util.emptyElement( main_section );

    // hashの状態により表示を切り替える
    onHashchange( main_section );

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    configModule  : configModule,
    initModule    : initModule,
    onHashchange  : onHashchange
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
