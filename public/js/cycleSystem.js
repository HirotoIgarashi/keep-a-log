/*
 * cycleSystem.js
 * サイクルシステム用のモジュール
*/
'use strict';
import { getTplContent } from "./utilCore.js";
//--------------------- モジュールスコープ変数開始 -----------------
var
  // initTab,
  initDailyTab;
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- ユーティリティメソッド開始 -----------------

//--------------------- DOMメソッド開始 ----------------------------
const initTab = function () {
  var
    tabbed,
    tablist,
    tabs,
    panels,
    switchTab;

  // 関連する要素とコレクションを取得する
  tabbed  = document.querySelector('.tabbed');
  tablist = tabbed.querySelector('ul');
  tabs    = tablist.querySelectorAll('a');
  panels  = tabbed.querySelectorAll('[id^="section"]');

  // ユーティリティメソッド/switchTab/開始
  // タブ切り替え機能
  switchTab = function switchTab( oldTab, newTab ) {
    var
      index,
      oldIndex;

    // 新しいタブをフォーカスする
    newTab.focus();

    // ユーザがアクティブなタブをフォーカス可能にする(Tabキー)
    newTab.removeAttribute( 'tabindex' );

    // 選択した状態を設定する
    newTab.setAttribute( 'aria-selected', 'true' );
    oldTab.removeAttribute( 'aria-selected' );
    oldTab.setAttribute( 'tabindex', '-1' );

    // 新しいタブと古いタブのインデックスを取得して正しいものを見つける
    // タブパネルを表示したり隠したりする
    index = Array.prototype.indexOf.call( tabs, newTab );
    oldIndex = Array.prototype.indexOf.call( tabs, oldTab );

    panels[ oldIndex ].hidden = true;
    panels[ index ].hidden = false;

  };
  // ユーティリティメソッド/switchTab/終了

  // タブリストの役割を.tabbedコンテナの最初の<ul>に追加します
  tablist.setAttribute( 'role', 'tablist' );

  // セマンティクスを追加すると、各タブのユーザのフォーカスが外れる
  Array.prototype.forEach.call( tabs, function ( tab, i ) {
    tab.setAttribute( 'role', 'tab' );
    tab.setAttribute( 'id', 'tab' + ( i + 1 ) );
    tab.setAttribute( 'tabindex', '-1' );
    tab.parentNode.setAttribute( 'role', 'presentation' );

    // マウスユーザのタブのクリックを処理する
    tab.addEventListener( 'click', function ( e ) {
      var
        currentTab;
        // dir;

      e.preventDefault();
      currentTab = tablist.querySelector( '[aria-selected]' );
      if ( e.currentTarget !== currentTab ) {
        switchTab( currentTab, e.currentTarget );
      }
    });

    // キーボードユーザ用のキーダウンイベントの処理
    tab.addEventListener( 'keydown', function ( e ) {
      var
        index,
        dir;
      // タブノードリスト内の現在のタブのインデックスを取得する
      index = Array.prototype.indexOf.call( tabs, e.currentTarget );

      // ユーザがどちらのキーを押しているかを調べ、必要に応じて
      // 新しいタブのインデックスを計算する
      // キーボート入力コード:
      // 37 : 左矢印
      // 39 : 右矢印
      // 40 : 下矢印
      dir = e.which === 37 ? index - 1 : e.which === 39 ? index + 1 : e.which === 40 ? 'down' : null;

      if ( dir !== null ) {
        e.preventDefault();
        // 下向きのキーが押されている場合は、開いているパネルに
        // フォーカスを移動し、そうでない場合は隣接するタブに
        // 切り替えます
        // 下のif文は三項演算子の書き換えです
        if ( dir === 'down' ) {
          panels[ i ].focus();
        }
        else if ( tabs[ dir ] ){
          switchTab( e.currentTarget, tabs[ dir ] );
        }
       }
    });
  });

  // タブパネルのセマンティクスを追加してそれらをすべて非表示にする
  Array.prototype.forEach.call( panels, function ( panel, i ) {
    // https://inclusive-components.design/tabbed-interfaces/を
    // 参考にして書いたコード
    // 元のコードでは変数idを利用しているが利用していないので削除している
    // var
    //   id;

    panel.setAttribute( 'role', 'tabpanel' );
    panel.setAttribute( 'tabindex', '-1' );
    // id = panel.getAttribute( 'id' );
    panel.setAttribute( 'aria-labelledby', tabs[ i ].id );
    panel.hidden = true;
  });

  // 最初に最初のタブをアクティブにして、最初のタブパネルを表示します
  tabs[ 0 ].removeAttribute( 'tabindex' );
  tabs[ 0 ].setAttribute( 'aria-selected', 'true' );
  panels[ 0 ].hidden = false;
};

initDailyTab = function () {
  var
    current_date,
    add_button,
    cancel_button,
    add_form,
    submit_button,
    title,
    title_alert,
    start_hour_alert,
    start_minute_alert,
    required_hour_alert,
    required_minute_alert,
    start_hour,
    start_minute,
    required_hour,
    required_minute,
    complete_status,
    title_tip,
    start_time_hour_tip,
    start_time_minute_tip,
    require_time_hour_tip,
    require_time_minute_tip,
    complete_status_tip,
    checkTitle,
    checkStartTimeHour,
    checkStartTimeMinute,
    checkRequiredTimeHour,
    checkRequiredTimeMinute;

  // 関連する要素とコレクションを取得する
  current_date = document.getElementById( 'pal-cyclesystem-current-date' );
  current_date.textContent = pal.util_b.getNowDateJp( 'date and day' );

  // デイリータブパネル初期設定
  // 関連する要素とコレクションを取得する
  add_button = document.getElementById( 'pal-task-add' );
  cancel_button = document.getElementById( 'pal-task-add-cancel' );
  add_form = document.getElementById( 'pal-task-add-form' );
  submit_button = document.getElementById( 'task-add-button' );
  // start_time = document.getElementById( 'start-time' );
  // required_time = document.getElementById( 'required-time' );
  title_alert = document.getElementById( 'title-alert' );
  start_hour_alert = document.getElementById( 'start-hour-alert' );
  start_minute_alert = document.getElementById( 'start-minute-alert' );
  required_hour_alert = document.getElementById( 'required-hour-alert' );
  required_minute_alert = document.getElementById( 'required-minute-alert' );
  title               = document.getElementById( 'title' );
  start_hour          = document.getElementById( 'start-time-hour' );
  start_minute        = document.getElementById( 'start-time-minute' );
  required_hour       = document.getElementById( 'required-time-hour' );
  required_minute     = document.getElementById( 'required-time-minute' );
  title_tip           = document.getElementById( 'title-tip' );
  start_time_hour_tip     = document.getElementById( 'start-time-hour-tip' );
  start_time_minute_tip   = document.getElementById( 'start-time-minute-tip' );
  require_time_hour_tip   = document.getElementById( 'required-time-hour-tip' );
  require_time_minute_tip = document.getElementById( 'required-time-minute-tip' );
  complete_status     = document.getElementById( 'complete-status' );
  complete_status_tip = document.getElementById( 'complete-status-tip' );

  // 初期の設定。
  // キャンセルボタンとフォームを隠す
  add_button.setAttribute( 'aria-pressed', 'false' );
  cancel_button.hidden = true;
  cancel_button.setAttribute( 'aria-pressed', 'true' );
  add_form.hidden = true;
  submit_button.setAttribute( 'aria-pressed', 'false' );

  // tipの表示/非表示を切り替える
  pal.util.toggleTip( title, title_tip );
  pal.util.toggleTip( start_hour, start_time_hour_tip );
  pal.util.toggleTip( start_minute, start_time_minute_tip );
  pal.util.toggleTip( required_hour, require_time_hour_tip );
  pal.util.toggleTip( required_minute, require_time_minute_tip );
  // pal.util.toggleTip( priority, priority_tip );
  pal.util.toggleTip( complete_status, complete_status_tip );

  // titleが空かチェックする
  checkTitle = function ( event ) {
    if ( pal.util.checkInputField( event, pal.util.isNonEmpty ) ) {
      // 空でないとき
      title_alert.hidden = true;
      title.setAttribute( 'aria-invalid', 'false' );
    }
    else {
      // 空のとき
      title_alert.hidden = false;
      title.setAttribute( 'aria-invalid', 'true' );
    }
  };

  // input要素に入力値の妥当性チェック処理を追加する
  pal.util.addEventListener( title, 'blur', checkTitle );
  // 開始時間の時が整数かつ0から23までかをチェックする
  checkStartTimeHour = function( event ) {
    var
      min = 0,
      max = 23,
      inputValue = pal.util.getTargetValue( event );

    if (pal.util.isInteger(inputValue) &&
      pal.util.isRange(inputValue, min, max)) {
      // 整数でかつ0から23の間の数値だったらアラートを表示しない
      start_hour_alert.hidden = true;
      start_hour.setAttribute( 'aria-invalid', 'false' );
    }
    else {
      start_hour_alert.hidden = false;
      start_hour.setAttribute( 'aria-invalid', 'true' );
    }
  };

  // 開始時間の時の値をチェックするイベントハンドラーを追加する。
  pal.util.addEventListener( start_hour, 'input', checkStartTimeHour );

  // 開始時間の分が整数かつ0から59までかをチェックする
  checkStartTimeMinute = function( event ) {
    var
      min = 0,
      max = 59,
      inputValue = pal.util.getTargetValue( event );

    if ( pal.util.isInteger( inputValue ) &&
      pal.util.isRange( inputValue, min, max )) {
      // 整数でかつ0から23の間の数値だったらアラートを表示しない
      start_minute_alert.hidden = true;
      start_minute.setAttribute( 'aria-invalid', 'false' );
    }
    else {
      start_minute_alert.hidden = false;
      start_minute.setAttribute( 'aria-invalid', 'true' );
    }
  };

  // 開始時間の分の値をチェックするイベントハンドラーを追加する。
  pal.util.addEventListener( start_minute, 'input', checkStartTimeMinute );

  // 所要時間の時が整数かをチェックする
  checkRequiredTimeHour = function( event ) {
    var
      min = 0,
      max = 59,
      inputValue = pal.util.getTargetValue( event );

    if ( pal.util.isInteger( inputValue ) &&
      pal.util.isRange( inputValue, min, max )) {
      // 整数でかつ0から23の間の数値だったらアラートを表示しない
      required_hour_alert.hidden = true;
      required_hour.setAttribute( 'aria-invalid', 'false' );
    }
    else {
      required_hour_alert.hidden = false;
      required_hour.setAttribute( 'aria-invalid', 'true' );
    }
  };

  // 所要時間の時の値をチェックするイベントハンドラーを追加する。
  pal.util.addEventListener( required_hour, 'input', checkRequiredTimeHour );

  // 所要時間の分が整数かつ0から59までかをチェックする
  checkRequiredTimeMinute = function( event ) {
    var
      min = 0,
      max = 59,
      inputValue = pal.util.getTargetValue( event );

    if ( pal.util.isInteger( inputValue ) &&
      pal.util.isRange( inputValue, min, max )) {
      // 整数でかつ0から23の間の数値だったらアラートを表示しない
      required_minute_alert.hidden = true;
      required_minute.setAttribute( 'aria-invalid', 'false' );
    }
    else {
      required_minute_alert.hidden = false;
      required_minute.setAttribute( 'aria-invalid', 'true' );
    }
  };

  // 所要時間の分の値をチェックするイベントハンドラーを追加する。
  pal.util.addEventListener( required_minute, 'input', checkRequiredTimeMinute );

  // 新規作成ボタンが押されたときの処理
  // ・ 新規作成ボタンを隠す
  // ・ キャンセルボタンを表示する
  // ・ フォームを表示する
  // ・ INPUT要素の初期値を設定する
  add_button.addEventListener( 'click', function () {
    this.hidden     = true;
    this.setAttribute( 'aria-pressed', 'true' );
    cancel_button.hidden  = false;
    cancel_button.setAttribute( 'aria-pressed', 'false' );
    add_form.hidden       = false;
    // role="alert"を非表示にする
    title.focus();
    title_alert.hidden = true;
    start_hour_alert.hidden = true;
    start_minute_alert.hidden = true;
    required_hour_alert.hidden = true;
    required_minute_alert.hidden = true;
    // INPUT要素の初期値を設定する
    // daily-start-time.value = '09:00';
    // daily-required-time.value = '1:00';
  });

  // キャンセルボタンが押されたときの処理
  // ・ 新規作成ボタンを表示する
  // ・ キャンセルボタンを隠す
  // ・ formの値をすべてクリアする
  // ・ フォームを隠す
  cancel_button.addEventListener( 'click', function () {
    add_button.hidden = false;
    add_button.setAttribute( 'aria-pressed', 'false' );
    this.hidden = true;
    this.setAttribute( 'aria-pressed', 'true' );

    // formの値をすべてクリアする
    pal.util.clearFormAll();

    add_form.hidden = true;
  });

  // 登録ボタンが押されたときの処理
  // ・ 必須項目のチェック
  // ・ 入力値の妥当性チェック
  // ・ 入力値でObjectの作成
  // ・ LocalStorageからObjectのリストを読み込む
  // ・ Objectのリストに生成されたObjectを追加する
  // ・ ObjectのリストをLocalStorageに書き込む
  // ・ 新規作成ボタンを表示する
  // ・ キャンセルボタンを隠す
  // ・ formの値をすべてクリアする
  // ・ フォームを隠す
  submit_button.addEventListener( 'click', function () {
    // 必須項目のチェック

    // 入力値の妥当性チェック

    // 入力値でObjectの作成
    // LocalStorageからObjectのリストを読み込む
    // Objectのリストに生成されたObjectを追加する
    // ObjectのリストをLocalStorageに書き込む

    // 新規作成ボタンを表示する
    add_button.hidden = false;
    add_button.setAttribute( 'aria-pressed', 'false' );

    // キャンセルボタンを隠す
    cancel_button.hidden = true;
    cancel_button.setAttribute( 'aria-pressed', 'true' );

    // formの値をすべてクリアする
    pal.util.clearFormAll();
    this.setAttribute( 'aria-pressed', 'true' );
    // フォームを隠す
    add_form.hidden = true;
  });
};
  //--------------------- DOMメソッド終了 ----------------------------

export const cycleSystem = (mainSection) => {
  let menu = getTplContent('cycle-system-tmpl');

  // mainセクションの子要素をすべて削除する
  util.dom.emptyElement( mainSection );

  // メニューを表示する
  if ( menu ) {
    mainSection.appendChild( menu );
  }
  else {
    console.log( 'メニューのテンプレートが見つかりませんでした。' );
  }
  // Tabの設定
  initTab();
  // タブパネルごとの設定
  // デイリーのタブパネル
  initDailyTab();

  // カレンダーのタブパネル

  // 目標のリストのタブパネル

  return true;
};
