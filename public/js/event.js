'use strict';
/*
 * event.js
 * イベント用のモジュール
*/
/*global pal util io*/

import { getLocationHash } from "./controlDom.js";

//--------------------- モジュールスコープ変数開始 -----------------
// クライアントサイドでsocket.ioを初期化
const socket = io();
let eventArray;
let eventScheduleArray;

// 週間予定のパラメータ --------------------------------------------
const eventWeeklyParam = {
  eventId: { "class": "visuallyhidden" },
  eventScheduleId: { "class": "visuallyhidden" },
  name: {
    type        : String, required    : true,
    labelText   : '予定の名前（必須）',
    placeholder : '予定の名前を入力します'
  },
  description: {
    type        : String,
    labelText   : '予定の説明',
    placeholder : '予定の説明を入力します'
  },
  // eventSchedule: {
  byDay: {
    type        : String,
    labelText   : '曜日（必須）', placeholder : '曜日を入力します'
  },
  startTime: {
    type        : String,
    labelText   : '開始時間（必須）',
    placeholder : '開始時間を入力します'
  },
  endTime: {
    type        : String,
    labelText   : '終了時間（必須）',
    placeholder : '終了時間を入力します'
  },
  repeatFrequency : { type: String, labelText: '繰り返し' }
};

// 年間予定のパラメータ --------------------------------------------
const eventYearlyParam = {
  eventId: { "class": "visuallyhidden" },
  eventScheduleId: { "class": "visuallyhidden" },
  name: {
    type        : String, required    : true,
    labelText   : '予定の名前（必須）',
    placeholder : '予定の名前を入力します'
  },
  description: {
    type        : String,
    labelText   : '予定の説明',
    placeholder : '予定の説明を入力します'
  },
  byMonth: {
    type        : Number,
    min : 1, max  : 12,
    labelText   : '月（必須）:',
    placeholder : '1から12までの数値を入力します'
  },
  byMonthDay: {
    type        : Number,
    min : 1, max  : 31,
    labelText   : '日（必須）:',
    placeholder : '1から31までの数値を入力します'
  },
  repeatFrequency : { type: String, labelText: '繰り返し' }
};
//--------------------- モジュールスコープ変数終了 -----------------

// 年間予定曜日指定のパラメータ ------------------------------------
const eventYearlyDayOfTheWeekParam = {
  eventId: { "class": "visuallyhidden" },
  eventScheduleId: { "class": "visuallyhidden" },
  name: {
    type        : String, required    : true,
    labelText   : '予定の名前（必須）',
    placeholder : '予定の名前を入力します'
  },
  description: {
    type      : String,
    labelText   : '予定の説明',
    placeholder : '予定の説明を入力します'
  },
  byMonth: {
    type        : Number, min : 1, max  : 12,
    labelText   : '月（必須）:',
    placeholder : '1から12までの数値を入力します'
  },
  byDay: {
    type        : String,
    labelText   : '曜日（必須）',
    placeholder : '曜日を入力します'
  },
  repeatFrequency : { type: String, labelText: '繰り返し' }
};
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- ユーティリティメソッド開始 -----------------
// _idをキーとしてArrayの中のオブジェクトを探す処理 ----------------
const searchById = ((id, array) => {
  let result = null;
  array.forEach((data) => {
    if (id === data._id) {
      result = data;
    }
  });
  return result;
});
// eventオブジェクトとeventScheduleオブジェクトをマージする処理 ----
const mergeList = ((event, eventSchedule) => {
  let mergedList = [];

  event.forEach((event) => {
    let mergedEvent = {}
    let eventScheduleId = event.eventSchedule;
    let matched = searchById(eventScheduleId, eventSchedule);

    mergedEvent = Object.assign({}, event);

    if (matched) {
      mergedEvent.eventSchedule = {};
      mergedEvent.eventSchedule = Object.assign({}, matched);
    }

    mergedList.push(mergedEvent);
  });
  return mergedList;
});

// hashが変更されときの処理 ----------------------------------------
export const setButtonPressed = ((element) => {
  // element以下の全てのボタンのaria-pressed属性の値をfalseにする
  let liEventNav =
    util.dom.querySelectorAll('#pal-event-nav li button');
  liEventNav.forEach((element) => {
    element.setAttribute('aria-pressed', 'false');
  });
  // 引数であるボタンのaria-pressed属性の値をtrueにする
  if (element) {
    element.setAttribute('aria-pressed', 'true');
  }
});

// 00:00から23:00までの文字列の配列を返す関数 ----------------------
const gethhmmArray = () => {
  let result = [];
  for (let i = 0; i < 24; i = i + 1) {
    result.push(`${new String(i).padStart(2, '0')}:00`);
  }
  return result;
};

// hh:mm形式のデータを2つ引数にとり減算を行う ----------------------
const getDifferenceTime = ((start, end) => {
  let result;
  let startHour = start.split(':')[0] * (1000 * 60 * 60);
  let startMinute = start.split(':')[1] * (1000 * 60);
  let endHour = end.split(':')[0] * (1000 * 60 * 60);
  let endMinute = end.split(':')[1] * (1000 * 60);
  let startTime = startHour + startMinute;
  let endTime = endHour + endMinute;
  result = (endTime - startTime) / (1000 * 60 * 60);

  return result;
});

const procForEachDayOfTheWeek = () => {
  // 曜日ごとの処理開始 --------------------------------------------
  // このページの曜日を取得する
  let currentDay = util.dom.querySelector('#pal-event-read h2')
    .getAttribute('data-day');

  // 曜日のinputを取得した曜日に設定する
  util.core.compose(
    util.dom.setAttributeCurried(currentDay)('data-day'),
    util.dom.setAttributeCurried(currentDay)('value'),
    util.dom.querySelector,
  )('#byDay');

  // .secondColumn以下の要素を削除する
  util.core.compose(
    util.dom.emptyElement,
    util.dom.querySelector
  )('.secondColumn ul');

  // 取得した曜日の予定をサーバーから取得する ----------------------
  socket.emit('eventSchedule search', {repeatFrequency: 'P1W'});
  // 曜日ごとの処理終了 --------------------------------------------
};

const getYearlyValueFromForm = () => {
  let event = {};
  let eventSchedule = {};

  const eventParam = ['eventId', 'name', 'description'];
  const eventScheduleParam = [
    'eventScheduleId',
    'byMonth',
    'byMonthDay',
    'byDay',
    'repeatFrequency'
  ];

  util.dom.getValueFromForm(
    eventYearlyParam,
    event,
    eventSchedule,
    eventParam,
    eventScheduleParam
  );
  // 毎週繰り返すのでP1Yを設定する ---------------------------------
  eventSchedule.repeatFrequency = 'P1Y';
  // eventオブジェクトとeventScheduleオブジェクトを関連付ける ------
  event.eventSchedule = eventSchedule;

  return event;
};

const getWeeklyValueFromForm = () => {
  let event = {};
  let eventSchedule = {};

  const eventParam = ['eventId', 'name', 'description'];
  const eventScheduleParam = [
    'eventScheduleId',
    'byDay',
    'startTime',
    'endTime',
    'repeatFrequency'
  ];

  util.dom.getValueFromForm(
    eventWeeklyParam,
    event,
    eventSchedule,
    eventParam,
    eventScheduleParam
  );
  // 毎週繰り返すのでP1Wを設定する ---------------------------------
  eventSchedule.repeatFrequency = 'P1W';
  // eventオブジェクトとeventScheduleオブジェクトを関連付ける ------
  event.eventSchedule = eventSchedule;

  return event;
};

const makeDlElement = (obj) => {
  // ToDo: repeatFrequencyの値によってreturnする内容を変える -------
  // repeatFrequencyの値はobj.eventSchedule.repeatFrequency
  const dl = util.dom.createDl();
  let h2 = util.dom.createH2({ textContent: obj.name });

  const dtName = util.dom.createDt({textContent: '予定の名前:'});

  const ddName = util.dom.createDd({});

  const dtDescription =
    util.dom.createDt({textContent: '予定の説明:'});

  const ddDescription = util.dom.createDd({
    textContent: obj.description
  });

  const dtByMonth = util.dom.createDt({textContent: '月:'});

  const ddByMonth = util.dom.createDd({
    textContent: obj.eventSchedule.byMonth
  });

  const dtByMonthDay = util.dom.createDt({ textContent: '日:' });

  const ddByMonthDay = util.dom.createDd({
    textContent: obj.eventSchedule.byMonthDay
  });

  const dtRepeatFrequency = util.dom.createDt({
    textContent: '繰り返し:'
  });

  const ddRepeatFrequency = util.dom.createDd({
    textContent: obj.eventSchedule.repeatFrequency
  });

  const dtByDay = util.dom.createDt({ textContent: '曜日:' });

  const ddByDay = util.dom.createDd({
    textContent: obj.eventSchedule.byDay
  });

  const dtStartTime = util.dom.createDt({
    textContent: '開始時間:'
  });

  const ddStartTime = util.dom.createDd({
    textContent: obj.eventSchedule.startTime
  });

  const dtEndTime = util.dom.createDt({ textContent: '終了時間:' });

  const ddEndTime = util.dom.createDd({
    textContent: obj.eventSchedule.endTime
  });

  const dtStartDate = util.dom.createDt({ textContent: '開始日:' });

  const ddStartDate = util.dom.createDd({
    textContent: obj.eventSchedule.startDate
  });

  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    dl, [
      dtName, ddName, [h2], dtDescription, ddDescription,
      dtByMonth, ddByMonth, dtByMonthDay, ddByMonthDay,
      dtRepeatFrequency, ddRepeatFrequency, dtByDay, ddByDay,
      dtStartTime, ddStartTime, dtEndTime, ddEndTime,
      dtStartDate, ddStartDate
    ]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);
  return dl;
};
//--------------------- ユーティリティメソッド終了 -----------------

//--------------------- DOMメソッド開始 ----------------------------
const makeStructure = () => {
  let frag = util.dom.createFragment();
  // #pal-eventの作成 ----------------------------------------------
  let divEvent = util.dom.createDiv({ id: 'pal-event' });
  // -----divCreateタグの作成 --------------------------------------
  let divCreate = util.dom.createDiv({ id: 'pal-event-create' });
  // -----divReadタグの作成 ----------------------------------------
  let divReadAll = util.dom.createDiv({ id: 'pal-event-read' });
  // 画面下部のコントロールエリアの表示 ----------------------------
  let divEventControl = util.dom.createDiv({
    id: 'pal-event-control'
  });
  // 戻るボタンの表示 ----------------------------------------------
  let buttonBack = util.dom.createButton({
    type: 'button', id: 'pal-event-back', innerHTML: '戻る'
  });
  util.dom.addClickEventListener(onClickCancel)(buttonBack);

  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [
      divEvent, [divReadAll, divCreate],
      divEventControl, [ buttonBack ]
    ]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);

  return frag;
};

const makeEventCreateYearly = () => {
  let frag = util.dom.createFragment();

  // pal-event-createの内容開始 ------------------------------------
  let h1Create = util.dom.createH1({
    textContent: '年間予定の作成'
  });
  // フォームを生成 ------------------------------------------------
  let form = util.dom.makeForm(eventYearlyParam);

  // 保存ボタンを生成 ----------------------------------------------
  let button = util.dom.createButton({
    type: 'button', id: 'registEvent', textContent: '保存'
  });
  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [ h1Create, form, button ]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);

  return frag;
};

// 年間予定（第何何曜日指定）のページを作成する --------------------
const makeEventCreateDayOfTheWeek = () => {
  let frag = util.dom.createFragment();
  // pal-event-createの内容開始 ------------------------------------
  let h1Create = util.dom.createH1({
    textContent: '第何何曜日を指定して年間予定を作成します'
  });
  // フォームを生成 ------------------------------------------------
  let form = util.dom.makeForm(eventYearlyDayOfTheWeekParam);
  // 保存ボタンを生成 ----------------------------------------------
  let button = util.dom.createButton({
    type: 'button', id: 'createEvent', textContent: '保存'
  });
  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [ h1Create, form, button ]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);
  return frag;
};

// 週間予定（曜日指定）のページを作成する --------------------------
const makeEventCreateWeekly = () => {
  let frag = util.dom.createFragment();
  let h1WeeklySchedule = util.dom.createH1({
    textContent: '週間予定を登録します'
  });

  // ToDo: 引数は配列で渡すようにする
  // 形式はmongooseのschema定義に従っているが、
  // labelTextとplaceholderのプロパティはこのプログラム独自の
  // ルールとなっている。それぞれがlabelタグのテキスト、
  // inputタグのplaceholderの値になる
  let form = util.dom.makeForm(eventWeeklyParam);

  // ボタンを生成 --------------------------------------------------
  let button = util.dom.createButton({
    type: 'button', id: 'createEvent', textContent: '保存'
  });
  util.dom.addClickEventListener(onClickEventCreateWeekly)(button);

  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [ h1WeeklySchedule, form, button]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);

  return frag;
};

const makeEventReadAll = () => {
  let now = new Date();
  let frag = util.dom.createFragment();
  let h1 = util.dom.createH1({textContent: '年間予定'});
  let h2 = util.dom.createH2({
    textContent: `${now.getFullYear()}年の予定`
  });

  let ulEventList = util.dom.createUl({ id: 'pal-event-list' });

  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [h1, h2, ulEventList]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);
  return frag;
};

const makeEventRead = (eventObject) => {
  let frag = util.dom.createFragment();
  // -----全体を含めるdivタグの作成 --------------------------------
  let div = util.dom.createDiv({ id: 'pal-event-read' });
  let h1 = util.dom.createH1({ textContent: 'イベントの詳細' });

  const dl = makeDlElement(eventObject);

    // 編集ボタンの設定
  let updateButton = util.dom.createButton({ type: 'button' });
  let updateAnchor = util.dom.createAnchor({
    href: `#event/update/${eventObject._id}`,
    textContent: '編集'
  });
  // 削除ボタンの設定
  let deleteButton = util.dom.createButton({ type: 'button' });
  let deleteAnchor = util.dom.createAnchor({
    href: `#event/delete/${eventObject._id}`,
    textContent: '削除'
  });
  // -----cancelボタンを生成 ---------------------------------------
  let cancelButton = util.dom.createButton({
    type: 'button', id: 'cancel', textContent: '戻る'
  });
  util.dom.addClickEventListener(onClickCancel)(cancelButton);
  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [
      div, [
        h1, dl,
        updateButton, [updateAnchor],
        deleteButton, [deleteAnchor],
        cancelButton
      ]
    ]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);
  return frag;
};

const makeEventUpdate = (event) => {
  let form;
  let frag = util.dom.createFragment();
  // -----全体を含めるdivタグの作成 --------------------------------
  let div = util.dom.createDiv({ id: 'pal-event-read' });
  let h1 = util.dom.createH1({
    textContent: 'イベント情報を編集します'
  });
  // formを表示する
  if (event.eventSchedule.repeatFrequency === 'P1Y') {
    // 曜日が第何何曜日指定かどうかを判定する
    // byDayに値が設定されていれば第何何曜日と判定する
    if (event.eventSchedule.byDay) {
      form = util.dom.makeForm(eventYearlyDayOfTheWeekParam);
    }
    else {
      form = util.dom.makeForm(eventYearlyParam);
    }
  }
  else if (event.eventSchedule.repeatFrequency === 'P1W') {
    form = util.dom.makeForm(eventWeeklyParam);
  }

  let saveButton = util.dom.createButton({
    type: 'button', id: 'createEvent', textContent: '保存'
  });

  if (event.eventSchedule.repeatFrequency === 'P1Y') {
    util.dom.addClickEventListener(
      onClickEventUpdateYearly
    )(saveButton);
  }
  else if (event.eventSchedule.repeatFrequency === 'P1W') {
    util.dom.addClickEventListener(
      onClickEventUpdateWeekly
    )(saveButton);
  }
  // -----cancelボタンを生成 ---------------------------------------
  let cancelButton = util.dom.createButton({
    type: 'button', id: 'cancel', textContent: 'キャンセル'
  });
  util.dom.addClickEventListener(onClickCancel)(cancelButton);
    // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [
      div, [ h1, form, saveButton, cancelButton ]
    ]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);
  return frag;
};

const makeEventDelete = (eventObject) => {
  let frag = util.dom.createFragment();
  // -----全体を含めるdivタグの作成 --------------------------------
  let div = util.dom.createDiv({ id: 'pal-event-delete' });
  let h1 = util.dom.createH1({
    textContent: 'このイベントを削除します'
  });
  const dl = makeDlElement(eventObject);
  // -----agreeボタンを生成 ----------------------------------------
  let agreeButton = util.dom.createButton({
    type: 'button', id: 'agree', textContent: 'はい'
  });
  util.dom.addClickEventListener(onClickAgree)(agreeButton);
  // -----cancelボタンを生成 ---------------------------------------
  let cancelButton = util.dom.createButton({
    type: 'button', id: 'cancel', textContent: 'キャンセル'
  });
  util.dom.addClickEventListener(onClickCancel)(cancelButton);
  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [
      div, [h1, dl, agreeButton, cancelButton]
    ]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);
  return frag;
};

// イベントリストの要素を作成する ----------------------------------
const makeEventYearlyList = (array, element) => {
  array.forEach((event) => {
    let li = util.dom.createLi({
    // 2020の部分は修正する必要あり
      'data-date':
      `2020-\
${event.eventSchedule.byMonth}-\
${event.eventSchedule.byMonthDay}`
    });
    const h3 = util.dom.createH3({innerHTML: event.name});
    const dl = util.dom.createDl();

    // 隠し属性で_idを設定しておく ---------------------------------
    const dtId = util.dom.createDt({
      textContent: '_id', class: 'visuallyhidden'
    });
    const ddId = util.dom.createDd({
      textContent: event._id, class: 'visuallyhidden'
    });

    // 日付を表示する ----------------------------------------------
    const dtDate = util.dom.createDt({ textContent: '日付:' });
    const ddDate = util.dom.createDd({
      textContent:
        `${event.eventSchedule.byMonth}月\
${event.eventSchedule.byMonthDay}日`
    });

    // 表示ボタンの設定
    let readButton = util.dom.createButton({ type: 'button' });
    let readAnchor = util.dom.createAnchor({
      href: `#event/read/${event._id}`, textContent: '表示'
    });
    // 編集ボタンの設定
    let updateButton = util.dom.createButton({ type: 'button' });
    let updateAnchor = util.dom.createAnchor({
      href: `#event/update/${event._id}`, textContent: '編集'
    });
    // 削除ボタンの設定
    let deleteButton = util.dom.createButton({ type: 'button' });
    let deleteAnchor = util.dom.createAnchor({
      href: `#event/delete/${event._id}`, textContent: '削除'
    });

    // HTMLを組み立てる---------------------------------------------
    let treeArray = [
      element, [
        li, [
          h3,
          dl, [
            dtId, ddId, dtDate, ddDate, readButton, [readAnchor],
            updateButton, [updateAnchor],
            deleteButton, [deleteAnchor]
          ]
        ]
      ]
    ];
    // ツリー構造を作る --------------------------------------------
    util.dom.appendByTreeArray(treeArray);
  });
};

const makeWeeklySchedule= () => {
  const dayArray = ['日', '月', '火', '水', '木', '金', '土'];
  const dayEnglishArray = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'
  ];
  const hhmmArray = gethhmmArray();

  let dayIndex = 1;

  let frag = util.dom.createFragment();

  let h1WeeklySchedule = util.dom.createH1({
    textContent: '週間予定'
  });

  // 曜日を切り替える部分/開始 -------------------------------------
  let navWeeklySchedule = util.dom.createNav();

  let spanDay = util.dom.createH2({
    innerHTML: `${dayArray[dayIndex]}曜日の予定`,
    // 初期値は月曜日
    'data-day': dayEnglishArray[1]
  });

  let previousButton = util.dom.createButton({
    type: 'button', innerHTML: '<'
  });

  previousButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (dayIndex === 0) {
      dayIndex = 6;
    }
    else {
      dayIndex = dayIndex - 1;
    }
    spanDay.innerHTML = `${dayArray[dayIndex]}曜日の予定`;
    spanDay.setAttribute('data-day', dayEnglishArray[dayIndex]);
    // 曜日ごとの処理 ----------------------------------------------
    procForEachDayOfTheWeek();
  });

  let nextButton = util.dom.createButton({
    type: 'button', innerHTML: '>'
  });
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (dayIndex === 6) {
      dayIndex = 0;
    }
    else {
      dayIndex = dayIndex + 1;
    }
    spanDay.innerHTML = `${dayArray[dayIndex]}曜日の予定`;
    spanDay.setAttribute('data-day', dayEnglishArray[dayIndex]);
    // 曜日ごとの処理 ----------------------------------------------
    procForEachDayOfTheWeek();
  });
  // 曜日を切り替える部分/終了 -------------------------------------

  // hh:mmの部分/開始 ----------------------------------------------
  let divHhMm = util.dom.createDiv({ class: 'firstColumn' });
  hhmmArray.forEach((data) => {
    let divRow = util.dom.createDiv({
      textContent: data, 'data-date': data
    });
    util.dom.appendByTreeArray([divHhMm, [divRow]]);
  });
  // hh:mmの部分/終了 ----------------------------------------------

  let divContent = util.dom.createDiv({ class: 'secondColumn' });
  let ulElement = util.dom.createUl({ id: 'pal-event-read-ul' });

  // HTMLを組み立てる-----------------------------------------------
  let treeArray = [
    frag, [
      navWeeklySchedule, [
        h1WeeklySchedule, previousButton, spanDay, nextButton
      ],
      divHhMm, divContent, [ulElement]
    ]
  ];
  // ツリー構造を作る ----------------------------------------------
  util.dom.appendByTreeArray(treeArray);

  return frag;
};

const makeNav = () => {
  let frag = util.dom.createFragment();

  let ulElement = util.dom.createUl({ id: 'pal-event-nav' });

  // 予定一覧ボタンの作成 ------------------------------------------
  let liEventList = util.dom.createLi();
  let buttonList = util.dom.createButton({
    id: 'pal-event-nav-list'
  });

  let anchorList = util.dom.createAnchor({
    href: '#event', onfocus: 'this.blur();', textContent: '予定一覧'
  });

  // 年間予定ボタン（曜日指定）の作成 ------------------------------
  let liEventDay = util.dom.createLi();
  let buttonDay = util.dom.createButton({
    id: 'pal-event-nav-byday'
  });

  let anchorDay = util.dom.createAnchor({
    href: '#event/create/weekly',
    onfocus: 'this.blur();',
    textContent: '週間予定(曜日指定)'
  });

  // 年間予定ボタン（日指定）の作成 --------------------------------
  let liEventByDate = util.dom.createLi();
  let buttonByDate = util.dom.createButton({
    id: 'pal-event-nav-yearly'
  });

  let anchorByDate = util.dom.createAnchor({
    href: '#event/create/yearly',
    onfocus: 'this.blur();',
    textContent: '年間予定(日指定)'
  });

  // 年間予定ボタン（第何何曜日指定）の作成 ------------------------
  let liEventByDay = util.dom.createLi();
  let buttonByDay = util.dom.createButton({
    id: 'pal-event-nav-dayoftheweek'
  });

  let anchorByDay = util.dom.createAnchor({
    href: '#event/create/dayOfTheWeek',
    onfocus: 'this.blur();',
    textContent: '年間予定(第何何曜日指定)'
  });

  // HTMLを組み立てる-----------------------------------------------
  util.dom.appendByTreeArray([
    frag, [
      ulElement, [
        liEventList, [ buttonList, [ anchorList ] ],
        liEventDay, [ buttonDay, [ anchorDay ] ],
        liEventByDate, [ buttonByDate, [ anchorByDate ] ],
        liEventByDay, [ buttonByDay, [ anchorByDay ] ]
      ]
    ]
  ]);
  return frag;
};

const showEventReadAll = () => {
  // pal-event-read以下の要素を削除してDOM要素を追加する -----------
  util.core.compose(
    util.dom.appendChildCurried(makeEventReadAll()),
    util.dom.emptyElement,
    util.dom.getElementById
  )('pal-event-read');

  // 全てのeventとeventScheduleを読み込む --------------------------
  socket.emit('eventSchedule readAll');
  socket.emit('event readAll');
};
// 週間予定を表示する ----------------------------------------------
const makeEventWeeklyList = (element) => {

  // 要素を追加する場所を探す --------------------------------------
  const divContent = util.dom.querySelector('.secondColumn ul');
  // li要素を作成する ----------------------------------------------
  let li = util.dom.createLi({
    'data-date': element.eventSchedule.startTime
  });

  const h3 = util.dom.createH3({ innerHTML: element.name });

  const dl = util.dom.createDl({
    innerHTML: `\
<dt class="visuallyhidden">_id:</dt><dd class="visuallyhidden">${element._id} </dd>\
<dt>曜日:</dt><dd>${element.eventSchedule.byDay} </dd>\
<dt>開始時間:</dt><dd>${element.eventSchedule.startTime} </dd>\
<dt>終了時間:</dt><dd>${element.eventSchedule.endTime}</dd>\
`
  });

  // 表示ボタンの設定
  let readButton = util.dom.createButton({ type: 'button' });
  let readAnchor = util.dom.createAnchor({
    href: `#event/read/${element._id}`, textContent: '表示'
  });
  // 編集ボタンの設定
  let updateButton = util.dom.createButton({ type: 'button' });
  let updateAnchor = util.dom.createAnchor({
    href: `#event/update/${element._id}`, textContent: '編集'
  });
  // 削除ボタンの設定
  let deleteButton = util.dom.createButton({ type: 'button' });
  let deleteAnchor = util.dom.createAnchor({
    href: `#event/delete/${element._id}`, textContent: '削除'
  });

  // HTMLを組み立てる-----------------------------------------------
  util.dom.appendByTreeArray([
    divContent, [
      li, [
        h3, dl, readButton, [readAnchor],
        updateButton, [updateAnchor], deleteButton, [deleteAnchor]
      ]
    ]
  ]);

  // contentsの部分/終了 -------------------------------------------
  let references =
    util.dom.querySelectorAll('.firstColumn div[data-date]');

  // 基準になるポジションを設定して要素の場所を決定する ------------
  references.forEach((data) => {
    let reference = data.getAttribute('data-date');
    let current = li.getAttribute('data-date');

    if (reference.split(':')[0] === current.split(':')[0]) {
      let clientRect = data.getBoundingClientRect();

      let top = window.pageYOffset + clientRect.top;
      let right = window.pageXOffset + clientRect.right;
      let bottom = window.pageYOffset + clientRect.bottom;

      li.style.position = 'absolute';
      li.style.marginLeft = '1em';
      li.style.left = right + 'px';
      // 左隣りの例えば12:00の中間点を計算し、例えば30分だったら
      // 0.5を掛けた値を加算する
      // 一時間分の高さ: bottom - top
      // 中間点: (top + bottom) / 2
      li.style.top =
        ((top + bottom)/2 +
          (bottom - top)*current.split(':')[1]/ 60) + 'px';
      li.style.width = '40em';

      // 要素の高さを設定する --------------------------------------
      let difference =
        getDifferenceTime(
          element.eventSchedule.startTime,
          element.eventSchedule.endTime
        );
      li.style.height = `${(bottom - top) * difference}px`;
      return;
    }
  });
};
//--------------------- DOMメソッド終了 ----------------------------
const setEventArray = (data) => {
  const eventList =
    util.core.compose(
      (data) => data,
      util.dom.getElementById
    )('pal-event-list');
  // eventArray変数にサーバーからのデータをセットする --------------
  eventArray = data;

  let mergedList = mergeList(eventArray, eventScheduleArray);

  let p1yArray = mergedList.filter(
    (data) => data.eventSchedule.repeatFrequency !== 'P1W'
  )

  // 全てのeventを読み込んだ結果を表示する -------------------------
  // pal-event-read以下の要素を削除する ----------------------------
  util.core.compose(
    util.dom.emptyElement,
    util.dom.getElementById
  )('pal-event-list');
  makeEventYearlyList(p1yArray, eventList);
};

// --------------------- イベントハンドラ開始 ----------------------
// onHashchange開始 ------------------------------------------------
const onHashchange = () => {
  const currentHash = getLocationHash();
  const firstHash = currentHash.split('/')[0];
  const secondHash = currentHash.split('/')[1];
  const thirdHash = currentHash.split('/')[2];

  return [firstHash, secondHash, thirdHash];
};
// onHashchange終了 ------------------------------------------------

// onClickRegistButton開始 -----------------------------------------
const onClickRegistButton = (e) => {

  e.preventDefault();

  // フォームから値を取得する
  let eventMap = getYearlyValueFromForm();

  socket.emit('event create', eventMap);
  socket.on('event create complete', () => {
    // 全てのeventを読み込む ---------------------------------------
    socket.emit('eventSchedule readAll');
    socket.emit('event readAll');
  });
  return false;
};
// onClickRegistButton終了 -----------------------------------------

// onClickCreateButton開始 -----------------------------------------
const onClickCreateButton = (e) => {

  e.preventDefault();

  let eventMap = {};
  let eventSchedule = {};

  let year = new Date().getFullYear();

  const name = util.core.compose(
    util.dom.getValue, util.dom.getElementById)('name');

  const description = util.core.compose(
    util.dom.getValue, util.dom.getElementById)('description');

  const month = util.core.compose(
    util.dom.getValue, util.dom.getElementById)('byMonth');

  const byDay = util.core.compose(
    util.dom.getValue, util.dom.getElementById)('byDay');

  const repeatFrequency = util.core.compose(
    util.dom.getValue, util.dom.getElementById)('repeatFrequency');

  let whatNumber = byDay[0];
  let day = byDay.slice(1, byDay.length);

  // 第何何曜日の日付を取得する ------------------------------------
  let resultDay = util.date.getDateByWhatNumberDay({
    year: year, month: month, whatNumber: whatNumber, day: day
  });

  // eventScheduleを組み立てる 開始 --------------------------------
  eventSchedule.byMonth = month;
  eventSchedule.byMonthDay = resultDay.split('/')[2];

  eventSchedule.repeatFrequency = repeatFrequency;
  eventSchedule.byDay = byDay;
  // eventScheduleを組み立てる 終了 --------------------------------

  eventMap.name = name;
  eventMap.description = description;

  // eventMapにeventScheduleを設定する
  eventMap.eventSchedule = eventSchedule;

  socket.emit('event create', eventMap);

  socket.on('event create complete', () => {
    // 全てのeventを読み込む ---------------------------------------
    socket.emit('eventSchedule readAll');
    socket.emit('event readAll');
  });
  return false;
};
// onClickCreateButton終了 -----------------------------------------

// onClickCancel開始 -----------------------------------------------
const onClickCancel = () => history.back()

// onClickAgree開始 ------------------------------------------------
const onClickAgree = (e) => {

  e.preventDefault();

  const currentHash = getLocationHash();
  let eventId = currentHash.split('/')[2];
  socket.emit('event delete', eventId);
};

const onClickEventCreateWeekly = (e) => {
  e.preventDefault();

  // フォームから値を取得する
  let event = getWeeklyValueFromForm();

  socket.emit('event createWeekly', event);
};
// 週間予定の更新処理
const onClickEventUpdateWeekly = (e) => {
  e.preventDefault();
  // フォームから値を取得する
  let event = getWeeklyValueFromForm();
  socket.emit('event update', event);
};
// 年間予定の更新処理
const onClickEventUpdateYearly = (e) => {
  e.preventDefault();

  // フォームから値を取得する
  let event = getYearlyValueFromForm();

  socket.emit('event update', event);
};
// --------------------- イベントハンドラ終了 ----------------------

// ----- webSocket処理開始 -----------------------------------------
// 全てのイベントを読み込んだ後の処理 ------------------------------

// eventScheduleの処理/開始 ----------------------------------------
// eventSchedule readAll complete ----------------------------------
socket.on(
  'eventSchedule readAll complete',
  (data) => eventScheduleArray = data
);
// eventScheduleの処理/終了 ----------------------------------------

// eventの処理/開始 ------------------------------------------------
// event readAll complete ------------------------------------------
socket.on('event readAll complete', setEventArray);

// event read complete ---------------------------------------------
socket.on('event read complete', (eventObject) => {
  const currentHash = getLocationHash();
  let crud = currentHash.split('/')[1]
  // socket.emit('event read')したときのロケーションハッシュにより
  // 処理を切り分ける
  switch (crud) {
    // 表示ボタンがクリックされたとき ------------------------------
    case 'read':
      util.core.compose(
        util.dom.appendChildCurried(makeEventRead(eventObject)),
        util.dom.getElementById
      )('pal-event-read');
      break;
      // 編集ボタンがクリックされたとき ------------------------------
    case 'update':
      // 編集フォームを表示する
      util.core.compose(
        util.dom.appendChildCurried(makeEventUpdate(eventObject)),
        util.dom.getElementById
      )('pal-event-read');

      if (eventObject.eventSchedule.repeatFrequency === 'P1W') {
        // ToDo: eventWeeklyParamを使うようにする ------------------
        // 隠し属性のid値に設定する
        util.core.compose(
          util.dom.setValue(eventObject._id),
          util.dom.getElementById
        )('eventId');
        // input要素に値をセットする
        util.core.compose(
          util.dom.setValue(eventObject.name),
          util.dom.getElementById
        )('name');
        util.core.compose(
          util.dom.setValue(eventObject.description),
          util.dom.getElementById
        )('description');
        // 隠し属性のid値に設定する
        util.core.compose(
          util.dom.setValue(eventObject.eventSchedule._id),
          util.dom.getElementById
        )('eventScheduleId');
        util.core.compose(
          util.dom.setValue(eventObject.eventSchedule.byDay),
          util.dom.getElementById
        )('byDay');
        util.core.compose(
          util.dom.setValue(eventObject.eventSchedule.startTime),
          util.dom.getElementById
        )('startTime');
        util.core.compose(
          util.dom.setValue(eventObject.eventSchedule.endTime),
          util.dom.getElementById
        )('endTime');
      }
      else if (eventObject.eventSchedule.repeatFrequency === 'P1Y') {
        if (eventObject.eventSchedule.byDay) {
          // 第何何曜日の処理
          // ToDo: eventWeeklyParamを使うようにする ------------------
          // 隠し属性のid値に設定する
          util.core.compose(
            util.dom.setValue(eventObject._id),
            util.dom.getElementById
          )('eventId');
          // input要素に値をセットする
          util.core.compose(
            util.dom.setValue(eventObject.name),
            util.dom.getElementById
          )('name');
          util.core.compose(
            util.dom.setValue(eventObject.description),
            util.dom.getElementById
          )('description');
          // 隠し属性のid値に設定する
          util.core.compose(
            util.dom.setValue(eventObject.eventSchedule._id),
            util.dom.getElementById
          )('eventScheduleId');
          util.core.compose(
            util.dom.setValue(eventObject.eventSchedule.byMonth),
            util.dom.getElementById
          )('byMonth');
          util.core.compose(
            util.dom.setValue(eventObject.eventSchedule.byDay),
            util.dom.getElementById
          )('byDay');
          util.core.compose(
            util.dom.setValue(
              eventObject.eventSchedule.repeatFrequency
            ),
            util.dom.getElementById
          )('repeatFrequency');
        }
        else {
          // 年間予定の処理
          // ToDo: eventWeeklyParamを使うようにする ------------------
          // 隠し属性のid値に設定する
          util.core.compose(
            util.dom.setValue(eventObject._id),
            util.dom.getElementById
          )('eventId');
          // input要素に値をセットする
          util.core.compose(
            util.dom.setValue(eventObject.name),
            util.dom.getElementById
          )('name');
          util.core.compose(
            util.dom.setValue(eventObject.description),
            util.dom.getElementById
          )('description');
          // 隠し属性のid値に設定する
          util.core.compose(
            util.dom.setValue(eventObject.eventSchedule._id),
            util.dom.getElementById
          )('eventScheduleId');
          util.core.compose(
            util.dom.setValue(eventObject.eventSchedule.byMonth),
            util.dom.getElementById
          )('byMonth');
          util.core.compose(
            util.dom.setValue(eventObject.eventSchedule.byMonthDay),
            util.dom.getElementById
          )('byMonthDay');
          util.core.compose(
            util.dom.setValue(
              eventObject.eventSchedule.repeatFrequency
            ),
            util.dom.getElementById
          )('repeatFrequency');
        }
      }
      break;
    // 削除ボタンがクリックされたとき ------------------------------
    case 'delete':
      util.core.compose(
        util.dom.appendChildCurried(makeEventDelete(eventObject)),
        util.dom.getElementById
      )('pal-event-read');
      break;
    default:
      console.log('ロケーションハッシュの処理に間違いがあります');
      break;
  }
});
// event update complete -------------------------------------------
socket.on(
  'event update complete',
  () => history.back()
);

// event delete complete -------------------------------------------
socket.on(
  'event delete complete',
  () => history.back()
);

socket.on('event search complete', (data) => {
  // このページの曜日を取得する
  let currentDay =
    util.dom.querySelector('#pal-event-read h2')
      .getAttribute('data-day');

  if (data.eventSchedule.byDay === currentDay) {
    makeEventWeeklyList(data);
  }
});

socket.on('eventSchedule search complete', (array) => {
  array.forEach((data) => {
    socket.emit('event search', {eventSchedule:data._id});
  });
});

socket.on('event createWeekly complete', (data) => {
  makeEventWeeklyList(data);
});
// ----- webSocket処理終了 -----------------------------------------

// --------------------- パブリックメソッド開始 --------------------
// パブリックメソッド/initModule/開始
// 目的: モジュールを初期化する
// 引数:
//  * $container この機能が使うjQuery要素
// 戻り値: true
// 例外発行: なし
//
export const event = (mainSection) => {
  let hashArray = onHashchange(mainSection);
  let crud = hashArray[1];
  let eventId = hashArray[2];

  // mainセクションの子要素をすべて削除して骨組みを表示する --------
  util.core.compose(
    util.dom.appendChildCurried(makeStructure()),
    util.dom.emptyElement
  )(mainSection);

  // ToDo: util.dom.insertBeforeを汎用的にして上に加える
  // pal-main-navを表示する ----------------------------------------
  let palMainNav = util.dom.querySelector('#pal-main-nav');
  let palEventNav = util.dom.querySelector('#pal-event-nav');

  if (!palEventNav) {
    util.dom.insertBefore(makeNav(), palMainNav);
  }

  // hashの状態により表示を切り替える ------------------------------
  switch (crud) {
    case 'create':
      if (hashArray[2] === 'yearly') {
        // pal-event-read以下の要素を削除してeventReadAllの値を
        // 表示する
        showEventReadAll();

        // pal-event-create以下の要素を削除してevent-create --------
        // フォームを表示する --------------------------------------
        util.core.compose(
          util.dom.appendChildCurried(makeEventCreateYearly()),
          util.dom.emptyElement,
          util.dom.getElementById
        )('pal-event-create');
        // 全てのeventを読み込む -----------------------------------
        socket.emit('eventSchedule readAll');
        socket.emit('event readAll');

        util.core.compose(
          util.dom.addClickEventListener(onClickRegistButton),
          util.dom.getElementById
        )('registEvent');
        // 年間予定（日指定）を押されたようにする ------------------
        util.core.compose(
          setButtonPressed,
          util.dom.getElementById
        )('pal-event-nav-yearly');
      }
      else if (hashArray[2] === 'dayOfTheWeek') {
        // pal-event-read以下の要素を削除してeventReadAllの値を
        // 表示する
        showEventReadAll();

        // pal-event-create以下の要素を削除してフォームを表示する --
        util.core.compose(
          util.dom.appendChildCurried(makeEventCreateDayOfTheWeek()),
          util.dom.emptyElement,
          util.dom.getElementById
        )('pal-event-create');
        // 全てのeventを読み込む -----------------------------------
        socket.emit('eventSchedule readAll');
        socket.emit('event readAll');

        util.core.compose(
          util.dom.addClickEventListener(onClickCreateButton),
          util.dom.getElementById
        )('createEvent');

        // ナビゲーションの年間予定（第何何曜日指定)が押された
        // ようにする
        util.core.compose(
          setButtonPressed,
          util.dom.getElementById
        )('pal-event-nav-dayoftheweek');
      }
      // 曜日ごとの処理
      else if (hashArray[2] === 'weekly') {
        // pal-event-read以下の要素を削除してフォームを表示する ----
        util.core.compose(
          util.dom.appendChildCurried(makeWeeklySchedule()),
          util.dom.emptyElement,
          util.dom.getElementById
        )('pal-event-read');
        // pal-event-create以下の要素を削除してフォームを表示する --
        util.core.compose(
          util.dom.appendChildCurried(makeEventCreateWeekly()),
          util.dom.emptyElement,
          util.dom.getElementById
        )('pal-event-create');
        // ナビゲーションの年間予定（曜日指定)が押されたようにする
        util.core.compose(
          setButtonPressed,
          util.dom.getElementById
        )('pal-event-nav-byday');

        // 曜日ごとの処理 ------------------------------------------
        procForEachDayOfTheWeek();
      }
      break;
    case 'read':
    case 'update':
    case 'delete':
      socket.emit('event read', eventId);
      break;
    default:
      // 予定一覧を押されたようにする ------------------------------
      util.core.compose(
        setButtonPressed,
        util.dom.getElementById
      )('pal-event-nav-list');
      // イベントリストを表示する ----------------------------------
      showEventReadAll();
      break;
  }

  return true;
};
// パブリックメソッド/initModule/終了
