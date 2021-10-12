/*
 * calendar.js
 * カレンダー用のモジュール
*/

'use strict';

import {
  getDate, getNowDate, getMonth,
  getYear, getPrviousMonthDate, getNextMonthDate,
  getBeginingOfTheWeek, getDaysLater, getYMDString
} from "./utilDate.js";
import { setLocationHash, getLocationHash } from "./controlDom.js";
import {
  createDocumentFragment, createElement, appendByTreeArray,
  setAttribute, innerHTML, emptyElement,
  querySelector, querySelectorAll
} from "./utilDom.js";
import { setButtonPressed, makeNav } from "./event.js";

//--------------------- DOMメソッド開始 ----------------------------
const makeCalendar = () => {
  let frag = createDocumentFragment();
  // h1タグの作成
  let h1Tag = createElement('h1', { textContent: 'カレンダー' });
  // navタグの作成
  let navTag = createElement('nav', { id: 'calendar-menu' });
  // ulタグの作成
  let ulTag = createElement('ul');
  // liタグの作成
  let liToday = createElement('li');
  // anchorタグの作成
  let anchorToday =
    createElement('a', { textContent: '今月' });
  // liタグの作成
  let liPre = createElement('li');
  // anchorタグの作成
  let anchorPre = createElement(
    'a',
    { href: '#calendar/previous-month', innerHTML: '<先月' }
  );
  // liタグの作成
  let liMonth = createElement('li');
  // spanタグの作成
  let spanBlank = createElement('span');
  // liタグの作成
  let liNext = createElement('li');
  // anchorタグの作成
  let anchorNext = createElement(
    'a',
    { href: '#calendar/next-month', innerHTML: '翌月>' }
  );

  // HTMLを組み立てる-----------------------------------------------
  appendByTreeArray([
    navTag, [
      ulTag, [
        liToday, [ anchorToday ],
        liPre, [ anchorPre ],
        liMonth, [ spanBlank ],
        liNext, [ anchorNext ]
      ]
    ]
  ]);

  // calendar用navタグの作成
  const dayArray = ['月','火','水','木','金','土','日'];

  let navCalendar = createElement('nav', {
    id: 'calendar-frame'
  });

  let ulCalendar =  createElement('ul');

  for (let i = 0; i < 42; i = i +1) {
    let liDate = createElement('li');
    // liタグにspanタグとulタグ追加する ----------------------------
    let spanTag = createElement('span');
    let ulTag = createElement('ul');

    appendByTreeArray([ liDate, [spanTag, ulTag] ]);

    // 曜日の設定 --------------------------------------------------
    if (i < 7) {
      let spanTags = liDate.getElementsByTagName('span');
      setAttribute(liDate, 'class', 'column-title');
      innerHTML(spanTags[0], dayArray[i]);
    }

    appendByTreeArray([ ulCalendar, [liDate] ]);
  }

  // HTMLを組み立てる-----------------------------------------------
  appendByTreeArray([
    frag, [ h1Tag, navTag, navCalendar, [ ulCalendar ] ]
  ])
  // -----HTMLを組み立てる------------------------------------------
  return frag;
};
//--------------------- DOMメソッド終了 ----------------------------

// --------------------- イベントハンドラ開始 ----------------------
// 例: onClickButton = function ( event ) {};
export const onHashchange = (mainSection) => {
  // const menu = getTplContent('calendar-tmpl');
  const pattern = /^#calendar\/([0-9]+)\/([0-9]+)/;

  let now = getNowDate();
  let nowYear = getYear(now);
  let nowMonth = getMonth(now);
  let liElement;
  let calendarDate;
  let calendarList = [];

  // LocationHashを求める ------------------------------------------
  let currentHash = getLocationHash();

  // 初期画面は現在の日付のカレンダーを表示する
  if ( currentHash === '#calendar' ) {
    // 今日の日付からyyyy/mmの形式でLocationHashをセットする
    currentHash += `/${nowYear}/${nowMonth}`;
    setLocationHash(currentHash);
    return;
  }

  // mainセクションの子要素をすべて削除する ------------------------
  emptyElement(mainSection);

  // カレンダーを表示する ------------------------------------------
  mainSection.appendChild(makeCalendar());

  // pal-main-nav-calendarを表示する -------------------------------
  let palMainNav = querySelector('#pal-main-nav');
  if (!querySelector('#pal-event-nav')) {
    palMainNav.insertBefore(makeNav(), palMainNav.firstChild);
  }
  setButtonPressed();

  // 現在のhashから年の値と月の値を取得する
  let matchString = currentHash.match(pattern);
  let currentYear = matchString[1];
  let currentMonth = matchString[2];

  // Dateオブジェクトを生成する
  let currentDate = getDate(currentYear, currentMonth);

  // カレンダーメニューのDOM要素を取得する -------------------------
  let menuElements = querySelectorAll('#calendar-menu ul li');
  let menuMonthElements = menuElements[0].firstElementChild;
  let menuPrevious = menuElements[1].firstElementChild;
  let menuYearMonth = menuElements[2].firstElementChild;
  let menuNext = menuElements[3].firstElementChild;

  // 今月をクリックしたときのhrefの値を設定する --------------------
  setAttribute(
    menuMonthElements,
    'href',
    `#calendar/${nowYear}/${nowMonth}`
  );

  // 先月をクリックしたときのhrefの値を設定する --------------------
  let previousDate = getPrviousMonthDate(currentDate);
  let previousYear = getYear(previousDate);
  let previousMonth = getMonth(previousDate);

  setAttribute(
    menuPrevious,
    'href',
    `#calendar/${previousYear}/${previousMonth}`
  );

  // yyyy年mm月の処理
  menuYearMonth.textContent = `${currentYear}年${currentMonth}月`;

  // 翌月をクリックしたときのhrefの値を設定する --------------------
  let nextDate = getNextMonthDate(currentDate);
  let nextYear = getYear(nextDate);
  let nextMonth = getMonth(nextDate);

  setAttribute(
    menuNext,
    'href',
    `#calendar/${nextYear}/${nextMonth}`
  );

  // カレンダーの表示 ----------------------------------------------
  // 週の初めの日を求める ------------------------------------------
  let beginingDate = getBeginingOfTheWeek(currentDate);

  // カレンダー用のリストを作る。7 x 6 = 42コ
  for (let i = 0; i < 42; i = i + 1 ) {
    // 1日後の日付を取得する
    calendarDate = getDaysLater(beginingDate, i);
    calendarList.push(calendarDate);
  }

  // カレンダーのlist要素をループする
  liElement = querySelector('#calendar-frame ul li');

  // 曜日を表示している行をとばす
  for (let i = 0; i < 7; i = i + 1 ) {
    liElement = liElement.nextElementSibling;
  }

  for (let i = 0; i < 35; i = i + 1) {
    let currentCalenderList = calendarList[i];
    let spanTags = liElement.getElementsByTagName('span');

    spanTags[0].textContent = currentCalenderList.getDate();

    let currentCalenderListString = getYMDString(currentCalenderList);

    let nowDateString = getYMDString(now);

    setAttribute(
      liElement,
      'content',
      currentCalenderListString
    );

    // 今月かどうか ------------------------------------------------
    if (getMonth(currentCalenderList) ===
        getMonth(currentDate)) {
      // 今日だったらclass属性の値にcurrent-monthとtodayを加える
      if (currentCalenderListString === nowDateString) {
        setAttribute(
          liElement, 'class', 'current-month today'
        );
      }
      else {
        setAttribute(
          liElement, 'class', 'current-month'
        );
      }
    }
    liElement = liElement.nextElementSibling;
  }
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
export const initModule = (mainSection) => {
  // mainセクションの子要素をすべて削除する ------------------------
  emptyElement(mainSection);
  // hashの状態により表示を切り替える ------------------------------
  onHashchange(mainSection);
  return true;
};
// パブリックメソッド/initModule/終了
