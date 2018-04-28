/*
 * pal.calendar.js
 * カレンダー用のモジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global $, pal */

pal.calendar = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    format_calendar_date, // Dateオブジェクトを与えてYYYY年MM月DD日の文字列を求める
    format_iso_ext,       // Dateオブジェクトを与えてISO9601形式の文字列を求める
    get_today_date,       // 今日のDateオブジェクトを求める
    get_this_month,       // Dateオブジェクトを与えて、その月のDateオブジェクトを求める
    get_next_month,       // ある月のDateオブジェクトを与えて翌月のDateオブジェクトを求める
    get_previous_month,   // ある月のDateオブジェクトを与えて先月のDateオブジェクトを求める
    get_day_of_the_week,  // ある日付を与えてその日の曜日を求める
    get_begining_of_the_week, // ある日付を与えての週の始まり(月曜日)を返す
    make_date_object,            // yyyy/mmを与えてDateオブジェクトを返す
    onHashchange,
    initModule;
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

  // ユーティリティメソッド/format_calendar_date/開始
  // Dateオブジェクトを与えてYYYY年MM月DD日の文字列を求める
  format_calendar_date = function ( date ) {
    return date.toLocaleDateString();
  };
  // ユーティリティメソッド/format_calendar_date/終了

  // ユーティリティメソッド/format_iso_ext/開始
  // Dateオブジェクトを与えてISO9601形式の文字列を求める
  format_iso_ext = function ( date ) {
    return date.toISOString();
  };
  // ユーティリティメソッド/format_iso_ext/終了

  // ユーティリティメソッド/get_today_date/開始
  // 今日のDateオブジェクトを求める
  get_today_date = function () {
    return new Date();
  };
  // ユーティリティメソッド/get_today_date/終了

  // ユーティリティメソッド/get_this_month/開始
  // Dateオブジェクトを与えて、その月のDateオブジェクトを求める
  get_this_month = function ( date ) {
    return date;
  };
  // ユーティリティメソッド/get_this_month/終了

  // ユーティリティメソッド/get_next_month/開始
  // ある月のDateオブジェクトを与えて翌月のDateオブジェクトを求める
  get_next_month = function ( date ) {
    var
      next_month;

    next_month = new Date( date.getFullYear(), date.getMonth() + 1 );

    return next_month;
  };
  // ユーティリティメソッド/get_next_month/終了

  // ユーティリティメソッド/get_previous_month/開始
  // ある月のDateオブジェクトを与えて先月のDateオブジェクトを求める
  get_previous_month = function ( date ) {
    var
      previous_month;

    previous_month = new Date( date.getFullYear(), date.getMonth() - 1 );

    return previous_month;
  };
  // ユーティリティメソッド/get_previous_month/終了

  // ユーティリティメソッド/get_day_of_the_week/開始
  // ある日付を与えてその日の曜日を求める
  get_day_of_the_week = function ( date ) {
    return date.getDay();
  };
  // ユーティリティメソッド/get_day_of_the_week/終了

  // ユーティリティメソッド/make_date_object/開始
  make_date_object = function ( yyyymm ) {
    var
      date_list;

    date_list = yyyymm.split( '/' );

    return new Date( date_list[ 0 ], parseInt( date_list[ 1 ], 10 ) - 1 );
  };
  // ユーティリティメソッド/make_date_object/終了

  // ユーティリティメソッド/get_begining_of_the_week/開始
  // ある日付を与えての週の始まり(月曜日)を返す
  get_begining_of_the_week = function ( date ) {
    var
      day_of_week,
      begining_date;

    // 引数をbegining_dateにコピーする
    begining_date = new Date( date.getTime() );
    // 曜日を求める
    day_of_week = get_day_of_the_week( begining_date );

    // 月曜日を求める
    if ( day_of_week === 0 ) {
      begining_date.setDate( begining_date.getDate() - 6 );
    }
    else {
      begining_date.setDate( begining_date.getDate() - day_of_week + 1 );
    }

    return begining_date;
  };
  // ユーティリティメソッド/get_begining_of_the_week/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  onHashchange = function ( main_section ) {
    var
      now,
      this_month,
      current_location_hash,
      current_date,
      menu  = pal.util_b.getTplContent( 'calendar-tmpl' ),
      pattern = /^#calendar\/([\/0-9]+)/,
      date_yyyymm,
      date_yyyymm_list,
      date_yyyy,
      date_mm,
      yyyymm_element,
      this_month_element,
      previous_month_element,
      previous_month_object,
      next_month_element,
      next_month_object,
      calendar_menu_list,
      begining_date,
      i,
      calendar_date,
      calendar_list = [],
      element;              // カレンダーのlist要素

    // LocationHashを求める
    current_location_hash = pal.bom.getLocationHash();

    if ( current_location_hash === '#calendar' ) {
      // 今日の日付からyyyy/mmの形式でLocationHashをセットする
      now = get_today_date();
      current_location_hash += '/' + now.getFullYear() + '/' + ( now.getMonth() + 1 );
      pal.bom.setLocationHash( current_location_hash );
    }

    // mainセクションの子要素をすべて削除する
    // mainセクションの子要素の削除は下位のモジュールにまかせる
    pal.util.emptyElement( main_section );

    // メニューを表示する
    if ( menu ) {
      main_section.appendChild( menu );
    }
    else {
      console.log( 'メニューのテンプレートが見つかりませんでした。' );
    }


    // LocationHashの'#calendar/'以降の文字列を求めて
    // ・yyyy年mm月を表示する
    // ・今月のhrefの値を設定する
    date_yyyymm = current_location_hash.match( pattern );

    if ( date_yyyymm.length === 2 ) {
      // リストに分割する
      date_yyyymm_list = date_yyyymm[ 1 ].split( '/' );
      date_yyyy = date_yyyymm_list[ 0 ];
      date_mm =  date_yyyymm_list[ 1 ];

      // Dateオブジェクトを生成する
      current_date = make_date_object( date_yyyymm[ 1 ] );

      yyyymm_element = document.querySelector( '#calendar-menu ul li span' );

      calendar_menu_list = document.querySelectorAll( '#calendar-menu ul li');
      this_month_element      = calendar_menu_list[ 0 ].firstElementChild;
      previous_month_element  = calendar_menu_list[ 1 ].firstElementChild;
      yyyymm_element          = calendar_menu_list[ 2 ].firstElementChild;
      next_month_element      = calendar_menu_list[ 3 ].firstElementChild;

      // 今月のhrefの処理
      now = get_today_date();

      this_month = get_this_month( now );

      this_month_element.setAttribute(
        'href',
        '#calendar/' + this_month.getFullYear() + '/' + ( this_month.getMonth() + 1 ) );

      // 先月のhrefの処理
      previous_month_object = get_previous_month( current_date );
      previous_month_element.setAttribute(
        'href',
        '#calendar/'
        + previous_month_object.getFullYear()
        + '/'
        + ( previous_month_object.getMonth() + 1 ) );

      // yyyy年mm月の処理
      yyyymm_element.textContent = date_yyyy + '年' + date_mm + '月';

      // 翌月のhrefの処理
      next_month_object = get_next_month( current_date );
      next_month_element.setAttribute(
        'href',
        '#calendar/'
        + next_month_object.getFullYear()
        + '/'
        + ( next_month_object.getMonth() + 1 ) );

      // カレンダーの表示
      // 週の初めの日を求める
      begining_date = get_begining_of_the_week( current_date );

      // カレンダー用のリストを作る。7 x 6 = 42コ
      for ( i = 0; i < 42; i = i + 1 ) {
        calendar_date = new Date( begining_date.getTime() + ( 1000*60*60*24 * i ) );
        calendar_list.push( calendar_date );
      }

      // カレンダーのlist要素をループする
      element = document.querySelector( '#calendar-frame ul li');
      // 曜日を表示している行をとばす
      for ( i = 0; i < 7; i = i + 1 ) {
        element = element.nextElementSibling;
      }
      for ( i = 0; i < 42; i = i + 1 ) {
        element.textContent = calendar_list[ i ].getDate();
        element.setAttribute(
          'content',
          format_iso_ext( calendar_list[ i ] ).split( 'T' )[ 0 ]
        );
        if ( current_date.getMonth() === calendar_list[ i ].getMonth() ) {
          element.setAttribute( 'class', 'current-month' );
        }
        element = element.nextElementSibling;
      }

    }

    return true;
  };
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- パブリックメソッド開始 --------------------
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
    pal.util.emptyElement( main_section );

    // hashの状態により表示を切り替える
    onHashchange( main_section );

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    initModule    : initModule,
    onHashchange  : onHashchange
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
