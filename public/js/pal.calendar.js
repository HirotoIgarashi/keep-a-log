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
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  const makeCalendar = () => {
    let frag = util.dom.createFragment();
    // h1タグの作成
    let h1Tag = util.dom.createElement('h1');
    util.dom.innerHTML(h1Tag, 'カレンダー');
    // navタグの作成
    let navTag = util.dom.createElement('nav');
    util.dom.setAttribute(navTag, 'id', 'calendar-menu');
    let ulTag = util.dom.createElement('ul');

    let liToday = util.dom.createElement('li');
    let anchorToday = util.dom.createElement('a');
    util.dom.innerHTML(anchorToday, '今月');
    util.dom.appendChild(liToday, anchorToday);

    let liPre = util.dom.createElement('li');
    let anchorPre = util.dom.createElement('a');
    util.dom.setAttribute(anchorPre, 'href', '#calendar/previous-month');
    util.dom.innerHTML(anchorPre, '<先月');
    util.dom.appendChild(liPre, anchorPre);

    let liMonth = util.dom.createElement('li');
    let spanBlank = util.dom.createElement('span');
    util.dom.appendChild(liMonth, spanBlank);

    let liNext = util.dom.createElement('li');
    let anchorNext = util.dom.createElement('a');
    util.dom.setAttribute(anchorNext, 'href', '#calendar/next-month');
    util.dom.innerHTML(anchorNext, '翌月>');
    util.dom.appendChild(liNext, anchorNext);

    util.dom.appendChild(ulTag, liToday);
    util.dom.appendChild(ulTag, liPre);
    util.dom.appendChild(ulTag, liMonth);
    util.dom.appendChild(ulTag, liNext);

    util.dom.appendChild(navTag, ulTag);

    // calendar用navタグの作成
    const dayArray = ['月','火','水','木','金','土','日'];
    let navCalendar = util.dom.createElement('nav');
    util.dom.setAttribute(navCalendar, 'id', 'calendar-frame');
    let ulCalendar =  util.dom.createElement('ul');

    for (let i = 0; i < 42; i = i +1) {
      let liDate = util.dom.createElement('li');
      // liタグにspanタグとulタグ追加する ----------------------------
      let spanTag = util.dom.createElement('span');
      let ulTag = util.dom.createElement('ul');
      util.dom.appendChild(liDate, spanTag);
      util.dom.appendChild(liDate, ulTag);

      // 曜日の設定 --------------------------------------------------
      if (i < 7) {
        let spanTags = liDate.getElementsByTagName('span');
        util.dom.setAttribute(liDate, 'class', 'column-title');
        util.dom.innerHTML(spanTags[0], dayArray[i]);
      }

      util.dom.appendChild(ulCalendar, liDate);
    }

    util.dom.appendChild(navCalendar, ulCalendar);

    // navタグの作成 -------------------------------------------------
    let navElement = util.dom.createElement('nav');
    util.dom.setAttribute(navElement, 'id', 'calendar-nav');
    let ulElement = util.dom.createElement('ul');

    let liEvent = util.dom.createElement('li');
    let buttonEvent = util.dom.createElement('button');
    let anchorEvent = util.dom.createElement('a');
    util.dom.setAttribute(anchorEvent, 'href', '#event/yearly/create');
    util.dom.setAttribute(anchorEvent, 'onfocus', 'this.blur();');
    util.dom.innerHTML(anchorEvent, '毎年の予定');
    util.dom.appendChild(buttonEvent, anchorEvent);
    util.dom.appendChild(liEvent, buttonEvent);

    // -----HTMLを組み立てる------------------------------------------
    // ulタグの組み立て/開始 ------------------------------------------
    util.dom.appendChild(ulElement, liEvent);
    // ulタグの組み立て/終了 ------------------------------------------
    //
    util.dom.appendChild(navElement, ulElement);

    // -----HTMLを組み立てる------------------------------------------
    util.dom.appendChild(frag, h1Tag);
    util.dom.appendChild(frag, navTag);
    util.dom.appendChild(frag, navCalendar);
    util.dom.appendChild(frag, navElement);

    return frag;
  };
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  const onHashchange = (mainSection) => {
    // const menu = pal.util_b.getTplContent('calendar-tmpl');
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
    let liElement;
    let calendarDate;
    let calendarList = [];

    // LocationHashを求める ------------------------------------------
    currentHash = pal.bom.getLocationHash();

    // 初期画面は現在の日付のカレンダーを表示する
    if ( currentHash === '#calendar' ) {
      // 今日の日付からyyyy/mmの形式でLocationHashをセットする
      currentHash += `/${nowYear}/${nowMonth}`;
      pal.bom.setLocationHash(currentHash);
      return;
    }

    // mainセクションの子要素をすべて削除する ------------------------
    pal.util.emptyElement(mainSection);

    // カレンダーを表示する --------------------------------------------
    mainSection.appendChild(makeCalendar());

    // 現在のhashから年の値と月の値を取得する
    let matchString = currentHash.match(pattern);
    currentYear = matchString[1];
    currentMonth = matchString[2];

    // Dateオブジェクトを生成する
    currentDate = util.date.getDate(currentYear, currentMonth);

    // カレンダーメニューのDOM要素を取得する -------------------------
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
      // 1日後の日付を取得する
      calendarDate = util.date.getDaysLater(beginingDate, i);
      calendarList.push(calendarDate);
    }

    // カレンダーのlist要素をループする
    liElement = document.querySelector('#calendar-frame ul li');

    // 曜日を表示している行をとばす
    for (let i = 0; i < 7; i = i + 1 ) {
      liElement = liElement.nextElementSibling;
    }

    for (let i = 0; i < 35; i = i + 1) {
      let currentCalenderList = calendarList[i];
      let spanTags = liElement.getElementsByTagName('span');

      spanTags[0].textContent = currentCalenderList.getDate();

      let currentCalenderListString = util.date.getYMDString(currentCalenderList);

      let nowDateString = util.date.getYMDString(now);

      util.dom.setAttribute(
        liElement,
        'content',
        currentCalenderListString
      );

      // 今月かどうか ------------------------------------------------
      if (util.date.getMonth(currentCalenderList) ===
          util.date.getMonth(currentDate)) {
        // 今日だったらclass属性の値にcurrent-monthとtodayを加える
        if (currentCalenderListString === nowDateString) {
          util.dom.setAttribute(
            liElement,
            'class',
            'current-month today'
          );
        }
        else {
          util.dom.setAttribute(
            liElement,
            'class',
            'current-month'
          );
        }
      }
      liElement = liElement.nextElementSibling;
    }
    // }
    return;
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
    // mainセクションの子要素をすべて削除する ------------------------
    pal.util.emptyElement(mainSection);

    // hashの状態により表示を切り替える ------------------------------
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
