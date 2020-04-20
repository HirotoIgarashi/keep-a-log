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

/*global pal util*/

pal.calendar = (() => {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    // format_calendar_date, // Dateオブジェクトを与えてYYYY年MM月DD日の文字列を求める
    format_iso_ext;       // Dateオブジェクトを与えてISO9601形式の文字列を求める
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/format_calendar_date/開始
  // Dateオブジェクトを与えてYYYY年MM月DD日の文字列を求める
  // format_calendar_date = function (date) {
  //   return date.toLocaleDateString();
  // };
  // ユーティリティメソッド/format_calendar_date/終了

  // ユーティリティメソッド/format_iso_ext/開始
  // Dateオブジェクトを与えてISO9601形式の文字列を求める
  format_iso_ext = function (date) {
    return date.toISOString();
  };
  // ユーティリティメソッド/format_iso_ext/終了
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  const onHashchange = (mainSection) => {
    const menu = pal.util_b.getTplContent('calendar-tmpl');
    const pattern = /^#calendar\/([0-9]+)\/([0-9]+)/;

    let now = util.date.getNowDate();
    let nowYear = util.date.getYear(now);
    let nowMonth = util.date.getMonth(now);
    let currentDate;
    let currentYear;
    let currentMonth;
    let previousDate;
    let previousYear;
    let previousMonth;
    let nextDate;
    let nextYear;
    let nextMonth;
    let menuElements;
    let menuMonthElements;
    let menuYearMonth;
    let menuPrevious;
    let menuNext;
    let currentHash;
    let beginingDate;
    let element;
    var
      calendar_date,
      calendar_list = [];

    // LocationHashを求める ------------------------------------------
    currentHash = pal.bom.getLocationHash();

    // 初期画面は現在の日付のカレンダーを表示する
    if ( currentHash === '#calendar' ) {
      // 今日の日付からyyyy/mmの形式でLocationHashをセットする
      currentHash += `/${nowYear}/${nowMonth}`;
      pal.bom.setLocationHash(currentHash);
    }

    // mainセクションの子要素をすべて削除する
    // mainセクションの子要素の削除は下位のモジュールにまかせる
    pal.util.emptyElement(mainSection);

    // メニューを表示する --------------------------------------------
    if (menu) {
      mainSection.appendChild(menu);
    }
    else {
      console.log('メニューのテンプレートが見つかりませんでした。');
    }

    // 現在のhashから年の値と月の値を取得する
    let matchString = currentHash.match(pattern);
    currentYear = matchString[1];
    currentMonth = matchString[2];

    // Dateオブジェクトを生成する
    currentDate = util.date.getDate(currentYear, currentMonth);

    // カレンダーメニューのDOM要素を取得する
    menuElements = document.querySelectorAll('#calendar-menu ul li');
    menuMonthElements = menuElements[0].firstElementChild;
    menuPrevious = menuElements[1].firstElementChild;
    menuYearMonth = menuElements[2].firstElementChild;
    menuNext = menuElements[3].firstElementChild;

    // 今月をクリックしたときのhrefの値を設定する --------------------
    util.dom.setAttribute(
      menuMonthElements,
      'href',
      `#calendar/${nowYear}/${nowMonth}`
    );

    // 先月をクリックしたときのhrefの値を設定する --------------------
    previousDate = util.date.getPrviousMonthDate(currentDate);
    previousYear = util.date.getYear(previousDate);
    previousMonth = util.date.getMonth(previousDate);

    util.dom.setAttribute(
      menuPrevious,
      'href',
      `#calendar/${previousYear}/${previousMonth}`
    );

    // yyyy年mm月の処理
    menuYearMonth.textContent = `${currentYear}年${currentMonth}月`;

    // 翌月をクリックしたときのhrefの値を設定する --------------------
    nextDate = util.date.getNextMonthDate(currentDate);
    nextYear = util.date.getYear(nextDate);
    nextMonth = util.date.getMonth(nextDate);

    util.dom.setAttribute(
      menuNext,
      'href',
      `#calendar/${nextYear}/${nextMonth}`
    );

    // カレンダーの表示 ----------------------------------------------
    // 週の初めの日を求める ------------------------------------------
    beginingDate = util.date.getBeginingOfTheWeek(currentDate);

    // カレンダー用のリストを作る。7 x 6 = 42コ
    for (let i = 0; i < 42; i = i + 1 ) {
      calendar_date = new Date(beginingDate.getTime() + (1000*60*60*24 * i));
      calendar_list.push(calendar_date);
    }

    // カレンダーのlist要素をループする
    element = document.querySelector( '#calendar-frame ul li');

    // 曜日を表示している行をとばす
    for (let i = 0; i < 7; i = i + 1 ) {
      element = element.nextElementSibling;
    }

    for (let i = 0; i < 42; i = i + 1) {
      element.textContent = calendar_list[i].getDate();
      element.setAttribute(
        'content',
        format_iso_ext(calendar_list[i]).split('T')[0]
      );
      if (currentDate.getMonth() === calendar_list[ i ].getMonth()) {
        element.setAttribute( 'class', 'current-month' );
      }
      element = element.nextElementSibling;
    }
    // }
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
  const initModule = (mainSection) => {

    // mainセクションの子要素をすべて削除する
    // mainセクションの子要素の削除は下位のモジュールにまかせる
    pal.util.emptyElement(mainSection);

    // hashの状態により表示を切り替える
    onHashchange(mainSection);

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    initModule    : initModule,
    onHashchange  : onHashchange
  };
  // --------------------- パブリックメソッド終了 --------------------
})();
