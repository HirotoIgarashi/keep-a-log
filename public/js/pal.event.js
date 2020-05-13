'use strict';

/*
 * pal.event.js
 * イベント用のモジュール
*/
/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/
/*global pal util io*/

pal.event = (() => {
  //--------------------- モジュールスコープ変数開始 -----------------
  // クライアントサイドでsocket.ioを初期化
  const socket = io();
  let eventArray;
  let eventScheduleArray;

  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  // _idをキーとしてオブジェクトを探す処理 ---------------------------
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

  // idとコールバック関数を引数とする。idをキーとしてHTML要素内の
  // id="id"の要素を取得して、その要素にコールバック関数を適用する
  const callbackById =
    (id, callback) => callback(document.getElementById(id))

  const callbackByQuerySelector =
    (selector, callback) => callback(document.querySelector(selector))

  // hashが変更されときの処理 ----------------------------------------
  const setButtonPressed = ((element) => {
    // #pal-event-nav以下の全てのボタンのaria-pressed属性の値を
    // falseにする
    let liEventNav =
      document.querySelectorAll('#pal-event-nav li button');
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
    let currentDay =
      document.querySelector('#pal-event-read h2')
        .getAttribute('data-day');

    // 曜日のinputを取得した曜日に設定する
    let inputDatElement = document.querySelector('#inputDay');
    inputDatElement.setAttribute('data-day', currentDay);
    inputDatElement.setAttribute('value', currentDay);

    // .secondColumn以下の要素を削除する
    let secondColumn = document.querySelector('.secondColumn ul');
    pal.util.emptyElement(secondColumn)

    // 取得した曜日の予定をサーバーから取得する ----------------------
    // contentsの部分/開始 -------------------------------------------
    socket.emit('eventSchedule search', {repeatFrequency: 'P1W'});
    // 曜日ごとの処理終了 --------------------------------------------
  };
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  const makeStructure = () => {
    let frag = util.dom.createFragment();
    // #pal-eventの作成 ----------------------------------------------
    let divEvent = util.dom.createElement({
      tagName: 'div', id: 'pal-event'
    });
    // -----divCreateタグの作成 --------------------------------------
    let divCreate = util.dom.createElement({
      tagName: 'div', id: 'pal-event-create'
    });
    // -----divReadタグの作成 ----------------------------------------
    let divReadAll = util.dom.createElement({
      tagName: 'div', id: 'pal-event-read'
    });
    // 画面下部のコントロールエリアの表示 ----------------------------
    let divEventControl = util.dom.createElement({
      tagName: 'div', id: 'pal-event-control'
    });
    // 戻るボタンの表示 ----------------------------------------------
    let buttonBack = util.dom.createElement({
      tagName: 'button',
      type: 'button',
      id: 'pal-event-back',
      innerHTML: '戻る'
    });
    buttonBack.addEventListener('click', onClickBack);

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

  const makeEventCreate = () => {
    let frag = util.dom.createFragment();

    // pal-event-createの内容開始 ------------------------------------
    let h1Create = util.dom.createElement({
      tagName: 'h1', textContent: '年間予定の作成'
    });

    // フォームを生成 ------------------------------------------------
    let form = util.dom.createElement('form');

    // inputタグを生成 -----------------------------------------------
    // -----年のlabelとinput -----------------------------------------
    let inputYear = util.dom.createLabelAndInput({
      'for': 'inputYear',
      'innerHTML': '年',
      'type': 'text',
      'name': 'year',
      'id': 'inputYear',
      'placeholder': '西暦で入力します'
    });
    // -----月のlabelとinput -----------------------------------------
    let inputMonth = util.dom.createLabelAndInput({
      'for': 'inputMonth',
      'innerHTML': '月(必須)',
      'type': 'text',
      'name': 'month',
      'id': 'inputMonth',
      'placeholder': '1から12までの数値を入力します'
    });
    // -----日のlabelとinput -----------------------------------------
    let inputDate = util.dom.createLabelAndInput({
      'for': 'inputDate',
      'innerHTML': '日(必須)',
      'type': 'text',
      'name': 'date',
      'id': 'inputDate',
      'placeholder': '1から31までの数値を入力します'
    });

    let divCheckbox = util.dom.createElement('div');
    // -----パスワードを表示するcheckboxとlabelを生成 ----------------
    let checkbox = util.dom.createElement({
      tagName: 'input', type: 'checkbox', id: 'repeatEveryYear'
    });
    let checkboxLabel = util.dom.createElement({
      tagName: 'label',
      for: 'repeatEveryYear',
      textContent: '毎年繰り返す'
    });
    // -----イベントの名前のlabelとinput -----------------------------
    let inputName = util.dom.createLabelAndInput({
      'for': 'inputName',
      'innerHTML': '名前(必須)',
      'type': 'text',
      'name': 'name',
      'id': 'inputName',
      'placeholder': '予定の名前を入力します'
    });
    // -----イベントの説明のlabelとinput -----------------------------
    let inputDescription = util.dom.createLabelAndInput({
      'for': 'inputDescription',
      'innerHTML': '説明',
      'type': 'text',
      'name': 'description',
      'id': 'inputDescription',
      'placeholder': '予定の説明を入力します'
    });
    // ボタンを生成 --------------------------------------------------
    let button = util.dom.createElement({
      tagName: 'button',
      type: 'button',
      id: 'registEvent',
      textContent: '保存'
    });
    // HTMLを組み立てる-----------------------------------------------
    let treeArray = [
      frag, [
        h1Create,
        form, [
          inputYear[0],
          inputYear[1],
          inputMonth[0],
          inputMonth[1],
          inputDate[0],
          inputDate[1],
          divCheckbox,[ checkbox, checkboxLabel ],
          inputName[0],
          inputName[1],
          inputDescription[0],
          inputDescription[1],
          button
        ]
      ]
    ];
    // ツリー構造を作る ----------------------------------------------
    util.dom.appendByTreeArray(treeArray);

    return frag;
  };

  const makeEventCreateByNanyoubi = () => {
    let frag = util.dom.createFragment();

    // pal-event-createの内容開始 ------------------------------------
    let h1Create = util.dom.createElement({
      tagName: 'h1',
      textContent: '第何何曜日を指定して年間予定を作成します'
    });

    // フォームを生成 ------------------------------------------------
    let form = util.dom.createElement('form');

    // inputタグを生成 -----------------------------------------------
    // -----年のlabelとinput -----------------------------------------
    let inputYear = util.dom.createLabelAndInput({
      'for': 'inputYear',
      'innerHTML': '年: 何年から施行されたかを入力します',
      'type': 'text',
      'name': 'year',
      'id': 'inputYear',
      'placeholder': '西暦で入力します'
    });
    // -----月のlabelとinput -----------------------------------------
    let inputMonth = util.dom.createLabelAndInput({
      'for': 'inputMonth',
      'innerHTML': '月(必須)',
      'type': 'text',
      'name': 'month',
      'id': 'inputMonth',
      'placeholder': '1から12までの数値を入力します'
    });

    // -----何番目のlabelとinput -------------------------------------

    // -----曜日のlabelとinput ---------------------------------------
    let inputWhatNumber = util.dom.createLabelAndInput({
      'for': 'inputWhatNumber',
      'innerHTML': '第何(必須)',
      'type': 'text',
      'name': 'whatNumber',
      'id': 'inputWhatNumber',
      'placeholder': '1から5までの数字を入力します'
    });

    // -----曜日のlabelとinput ---------------------------------------
    let inputDay = util.dom.createLabelAndInput({
      'for': 'inputDay',
      'innerHTML': '曜日(必須)',
      'type': 'text',
      'name': 'day',
      'id': 'inputDay',
      'placeholder': 'MondayからSundayまでのテキストを入力します'
    });

    let divCheckbox = util.dom.createElement('div');
    // -----パスワードを表示するcheckboxとlabelを生成 ----------------
    let checkbox = util.dom.createElement({
      tagName: 'input', type: 'checkbox', id: 'repeatEveryYear'
    });

    let checkboxLabel = util.dom.createElement({
      tagName: 'label',
      for: 'repeatEveryYear',
      textContent: '毎年繰り返す'
    });

    // -----イベントの名前のlabelとinput -----------------------------
    let inputName = util.dom.createLabelAndInput({
      'for': 'inputName',
      'innerHTML': '名前(必須)',
      'type': 'text',
      'name': 'name',
      'id': 'inputName',
      'placeholder': '予定の名前を入力します'
    });

    // -----イベントの説明のlabelとinput -----------------------------
    let inputDescription = util.dom.createLabelAndInput({
      'for': 'inputDescription',
      'innerHTML': '説明',
      'type': 'text',
      'name': 'description',
      'id': 'inputDescription',
      'placeholder': '予定の説明を入力します'
    });

    // ボタンを生成 --------------------------------------------------
    let button = util.dom.createElement({
      tagName: 'button',
      type: 'button',
      id: 'createEvent',
      textContent: '保存'
    });

    // HTMLを組み立てる-----------------------------------------------
    let treeArray = [
      frag, [
        h1Create,
        form, [
          inputYear[0],
          inputYear[1],
          inputMonth[0],
          inputMonth[1],
          inputWhatNumber[0],
          inputWhatNumber[1],
          inputDay[0],
          inputDay[1],
          divCheckbox, [ checkbox, checkboxLabel ],
          inputName[0],
          inputName[1],
          inputDescription[0],
          inputDescription[1],
          button
        ]
      ]
    ];
    // ツリー構造を作る ----------------------------------------------
    util.dom.appendByTreeArray(treeArray);

    return frag;
  };

  const makeEventReadAll = () => {
    let frag = util.dom.createFragment();

    let h1Read = util.dom.createElement({
      tagName: 'h1', textContent: '年間予定のリスト'
    });

    let ulEventList = util.dom.createElement({
      tagName: 'ul', id: 'pal-event-list'
    });

    // HTMLを組み立てる-----------------------------------------------
    let treeArray = [
      frag, [h1Read, ulEventList]
    ];
    // ツリー構造を作る ----------------------------------------------
    util.dom.appendByTreeArray(treeArray);

    return frag;
  };

  const makeDeletePage = (id) => {
    let frag = util.dom.createFragment();

    // -----divCreateタグの作成開始 ----------------------------------
    let divDelete = util.dom.createElement({
      tagName: 'div', id: 'pal-event-delete'
    });
    let h1Delete = util.dom.createElement({
      tagName: 'h1', textContent: 'このイベントを削除します'
    });
    let targetEvent = util.dom.createElement({
      tagName:'div', textContent: id
    });
    // -----agreeボタンを生成 ----------------------------------------
    let agreeButton = util.dom.createElement({
      tagName: 'button',
      type: 'button',
      id: 'agree',
      textContent: 'はい'
    });
    agreeButton.addEventListener('click', onClickAgree);

    // -----cancelボタンを生成 ---------------------------------------
    let cancelButton = util.dom.createElement({
      tagName: 'button',
      type: 'button',
      id: 'cancel',
      textContent: 'キャンセル'
    });
    cancelButton.addEventListener('click', onClickCancel);

    // HTMLを組み立てる-----------------------------------------------
    let treeArray = [
      frag, [
        divDelete, [h1Delete, targetEvent, agreeButton, cancelButton]
      ]
    ];
    // ツリー構造を作る ----------------------------------------------
    util.dom.appendByTreeArray(treeArray);
    return frag;
  };

  // イベントリストの要素を作成する ----------------------------------
  const makeEventListElement = (array, element) => {
    array.forEach((event) => {

      console.log(event);

      let li = util.dom.createElement('li');
      // 2020の部分は修正する必要あり
      li.setAttribute(
        'data-date',
        `2020-\
${event.eventSchedule.byMonth}-\
${event.eventSchedule.byMonthDay}`
      );

      const h3 = util.dom.createElement({
        tagName: 'h3',
        innerHTML: event.name
      });
      const dl = util.dom.createElement({
        tagName: 'dl'
      });

      // 隠し属性で_idを設定しておく ---------------------------------
      const dtId = util.dom.createElement({
        tagName: 'dt', textContent: '_id'
      });
      dtId.setAttribute('class', 'visuallyhidden');
      const ddId = util.dom.createElement({
        tagName: 'dd',
        textContent: event._id
      });
      ddId.setAttribute('class', 'visuallyhidden');

      // 日付を表示する ----------------------------------------------
      const dtDate = util.dom.createElement({
        tagName: 'dt', textContent: '日付:'
      });
      const ddDate = util.dom.createElement({
        tagName: 'dd',
        textContent:
          `${event.eventSchedule.byMonth}月${event.eventSchedule.byMonthDay}日`
      });

      let readButton = util.dom.createElement({
        tagName: 'button',
        type: 'button',
        value: `#event/read/${event._id}`,
        textContent: '表示'
      });
      readButton.addEventListener('click', onClickReadButton);

      let editButton = util.dom.createElement({
        tagName: 'button', type: 'button', textContent: '編集'
      });

      let deleteButton = util.dom.createElement({
        tagName: 'button',
        type: 'button',
        value: `#event/delete/${event._id}`,
        textContent: '削除'
      });
      deleteButton.addEventListener('click', onClickDeleteButton);

      // HTMLを組み立てる---------------------------------------------
      let treeArray = [
        element, [
          li, [
            h3,
            dl, [
              dtId, ddId,
              dtDate, ddDate,
              readButton,
              editButton,
              deleteButton
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
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'
    ];
    const hhmmArray = gethhmmArray();

    let dayIndex = 1;

    let frag = util.dom.createFragment();

    let h1WeeklySchedule = util.dom.createElement({
      tagName: 'h1', textContent: '週間予定'
    });

    // 曜日を切り替える部分/開始 -------------------------------------
    let navWeeklySchedule = util.dom.createElement('nav');

    let spanDay = util.dom.createElement({
      tagName: 'h2',
      innerHTML: `${dayArray[dayIndex]}曜日の予定`
    });
    // 初期値は月曜日
    spanDay.setAttribute('data-day', dayEnglishArray[1]);

    let previousButton = util.dom.createElement({
      tagName: 'button', type: 'button', innerHTML: '<'
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

    let nextButton = util.dom.createElement({
      tagName: 'button', type: 'button', innerHTML: '>'
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
    let divHhMm = util.dom.createElement({
      tagName: 'div',
      class: 'firstColumn'
    });
    hhmmArray.forEach((data) => {
      let divRow = util.dom.createElement({
        tagName: 'div', textContent: data
      });
      divRow.setAttribute('data-date', data);
      util.dom.appendByTreeArray([divHhMm, [divRow]]);
    });
    // hh:mmの部分/終了 ----------------------------------------------

    let divContent = util.dom.createElement({
      tagName: 'div',
      class: 'secondColumn'
    });
    let ulElement = util.dom.createElement({
      tagName: 'ul', id: 'pal-event-read-ul'
    });

    // HTMLを組み立てる-----------------------------------------------
    let treeArray = [
      frag, [
        h1WeeklySchedule,
        navWeeklySchedule, [previousButton, spanDay, nextButton],
        divHhMm,
        divContent, [ulElement]
      ]
    ];
    // ツリー構造を作る --------------------------------------------
    util.dom.appendByTreeArray(treeArray);

    return frag;
  };

  const makeEventCreateWeekly = () => {
    let frag = util.dom.createFragment();

    let h1WeeklySchedule = util.dom.createElement({
      tagName: 'h1', textContent: '予定を登録します'
    });

    let form = util.dom.createElement('form');
    form.setAttribute('autocomplete', 'on');

    // -----イベントの曜日のlabelとinput -----------------------------
    let inputDay = util.dom.createLabelAndInput({
      'for': 'inputDay',
      'innerHTML': '曜日(必須)',
      'type': 'text',
      'name': 'day',
      'id': 'inputDay',
      'placeholder': '曜日を入力します'
    });
    inputDay[1].setAttribute('list', 'days');
    // 初期値は月曜日 ------------------------------------------------
    inputDay[1].setAttribute('value', 'Monday');

    let datalist = util.dom.createElement({
      tagName: 'datalist',
      id: 'days'
    });
    let optionMonday = util.dom.createElement({
      tagName: 'option', value: 'Monday' });
    let optionTuesday = util.dom.createElement({
      tagName: 'option', value: 'Tuesday' });
    let optionWednesday = util.dom.createElement({
      tagName: 'option', value: 'Wednesday' });
    let optionThursday = util.dom.createElement({
      tagName: 'option', value: 'Thursday' });
    let optionFriday = util.dom.createElement({
      tagName: 'option', value: 'Friday' });
    let optionSaturday = util.dom.createElement({
      tagName: 'option', value: 'Saturday' });
    let optionSunday = util.dom.createElement({
      tagName: 'option', value: 'Sunday' });

    util.dom.appendByTreeArray([
      datalist, [
        optionMonday, optionTuesday, optionWednesday, optionThursday,
        optionFriday, optionSaturday, optionSunday
      ]
    ]);
    // -----イベントの名前のlabelとinput -----------------------------
    let inputName = util.dom.createLabelAndInput({
      'for': 'inputName',
      'innerHTML': 'イベントの名前(必須)',
      'type': 'text',
      'name': 'name',
      'id': 'inputName',
      'placeholder': 'イベントの名前を入力します'
    });

    // -----イベントの開始時間のlabelとinput -------------------------
    let inputStartTime = util.dom.createLabelAndInput({
      'for': 'inputStartTime',
      'innerHTML': '開始時間',
      'type': 'text',
      'name': 'startTime',
      'id': 'inputStartTime',
      'placeholder': '開始時間を入力します'
    });
    inputStartTime[1].setAttribute('pattern', '\\d\\d:\\d\\d');

    // -----イベントの終了時間のlabelとinput -------------------------
    let inputEndTime = util.dom.createLabelAndInput({
      'for': 'inputEndTime',
      'innerHTML': '終了時間',
      'type': 'text',
      'name': 'endTime',
      'id': 'inputEndTime',
      'placeholder': '終了時間を入力します'
    });
    inputEndTime[1].setAttribute('pattern', '\\d\\d:\\d\\d');

    // ボタンを生成 --------------------------------------------------
    let button = util.dom.createElement({
      tagName: 'button',
      type: 'button',
      id: 'createEvent',
      textContent: '保存'
    });
    button.addEventListener('click', onClickEventCreateWeekly);

    // HTMLを組み立てる---------------------------------------------
    let treeArray = [
      frag, [
        h1WeeklySchedule,
        form, [
          inputDay[0], inputDay[1],
          datalist,
          inputName[0], inputName[1],
          inputStartTime[0], inputStartTime[1],
          inputEndTime[0], inputEndTime[1],
          button
        ]
      ]
    ];
    // ツリー構造を作る --------------------------------------------
    util.dom.appendByTreeArray(treeArray);

    return frag;
  };

  // 
  const makeNav = () => {
    let frag = util.dom.createFragment();

    let ulElement = util.dom.createElement({
      tagName: 'ul', id: 'pal-event-nav'
    });

    // 予定一覧ボタンの作成 ------------------------------------------
    let liEventList = util.dom.createElement('li');
    let buttonList = util.dom.createElement({
      tagName: 'button',
      id: 'pal-event-nav-list'
    });

    let anchorList = util.dom.createElement({
      tagName: 'a',
      href: '#event',
      onfocus: 'this.blur();',
      textContent: '予定一覧'
    });

    // 予定登録ボタン（曜日指定）の作成 --------------------------------
    let liEventDay = util.dom.createElement('li');
    let buttonDay = util.dom.createElement({
      tagName: 'button',
      id: 'pal-event-nav-byday'
    });

    let anchorDay = util.dom.createElement({
      tagName: 'a',
      href: '#event/create/dayly',
      onfocus: 'this.blur();',
      textContent: '予定登録(曜日指定)'
    });

    // 予定登録ボタン（日指定）の作成 --------------------------------
    let liEventByDate = util.dom.createElement('li');
    let buttonByDate = util.dom.createElement({
      tagName: 'button',
      id: 'pal-event-nav-yearly'
    });

    let anchorByDate = util.dom.createElement({
      tagName: 'a',
      href: '#event/create/yearly',
      onfocus: 'this.blur();',
      textContent: '予定登録(日指定)'
    });

    // 予定登録ボタン（第何何曜日指定）の作成 ------------------------
    let liEventByDay = util.dom.createElement('li');
    let buttonByDay = util.dom.createElement({
      tagName: 'button',
      id: 'pal-event-nav-dayoftheweek'
    });

    let anchorByDay = util.dom.createElement({
      tagName: 'a',
      href: '#event/create/dayOfTheWeek',
      onfocus: 'this.blur();',
      textContent: '予定登録(第何何曜日指定)'
    });

    // HTMLを組み立てる-----------------------------------------------
    util.dom.appendByTreeArray([
      frag, [
        ulElement, [
          liEventList, [
            buttonList, [ anchorList ] 
          ],
          liEventDay, [
            buttonDay, [ anchorDay ] 
          ],
          liEventByDate, [
            buttonByDate, [ anchorByDate ] 
          ],
          liEventByDay, [
            buttonByDay, [ anchorByDay ]
          ]
        ]
      ]
    ]);
    // -----HTMLを組み立てる------------------------------------------

    return frag;
  };

  const showEventReadAll = () => {
    // pal-event-read以下の要素を削除する ----------------------
    callbackById(
      'pal-event-read',
      data => pal.util.emptyElement(data)
    );
    // イベントリストを表示する ----------------------------------
    callbackById(
      'pal-event-read',
      data => util.dom.appendChild(data, makeEventReadAll())
    );
    // 全てのeventとeventScheduleを読み込む --------------------------
    socket.emit('eventSchedule readAll');
    socket.emit('event readAll');
  };
  // 週間予定を表示する ----------------------------------------------
  const showWeeklyEvent = (element) => {

    // 要素を追加する場所を探す --------------------------------------
    const divContent = document.querySelector('.secondColumn ul');
    // li要素を作成する ----------------------------------------------
    let liContentRow = util.dom.createElement({
      tagName: 'li'
    });
    liContentRow.setAttribute('data-date', element.eventSchedule.startTime);

    const h3 = util.dom.createElement({
      tagName: 'h3',
      innerHTML: element.name
    });

    const dl = util.dom.createElement({
      tagName: 'dl',
      innerHTML: `\
<dt class="visuallyhidden">_id:</dt><dd class="visuallyhidden">${element._id} </dd>\
<dt>曜日:</dt><dd>${element.eventSchedule.byDay} </dd>\
<dt>開始時間:</dt><dd>${element.eventSchedule.startTime} </dd>\
<dt>終了時間:</dt><dd>${element.eventSchedule.endTime}</dd>\
`
    });

    util.dom.appendByTreeArray([
      divContent, [
        liContentRow, [h3, dl]
      ]
    ]);

    // contentsの部分/終了 -------------------------------------
    let references =
      document.querySelectorAll('.firstColumn div[data-date]');

    // let left = window.pageXOffset + clientRect.left;
    // 基準になるポジションを設定して要素の場所を決定する ----
    references.forEach((data) => {
      let reference = data.getAttribute('data-date');
      let current = liContentRow.getAttribute('data-date');

      if (reference === current) {
        let clientRect = data.getBoundingClientRect();
        let top = window.pageYOffset + clientRect.top;
        let right = window.pageXOffset + clientRect.right;
        let bottom = window.pageYOffset + clientRect.bottom;

        liContentRow.style.position = 'absolute';
        liContentRow.style.marginLeft = '1em';
        liContentRow.style.left = right + 'px';
        liContentRow.style.top = (top + bottom) / 2 + 'px';
        liContentRow.style.width = '40em';

        // 要素の高さを設定する -----------------------------
        let difference =
          getDifferenceTime(
            element.eventSchedule.startTime,
            element.eventSchedule.endTime
          );
        liContentRow.style.height = `${(bottom - top) * difference}px`;
        return;
      }
    });
  };
  //--------------------- DOMメソッド終了 ----------------------------
  const setEventArray = (data) => {
    const eventList = callbackById('pal-event-list', (data) => data);

    // eventArray変数にサーバーからのデータをセットする --------------
    eventArray = data;

    let mergedList = mergeList(eventArray, eventScheduleArray);

    // let p1yArray = mergedList.filter((data) => {
    //   return data.eventSchedule.repeatFrequency !== 'P1W';
    // });

    let p1yArray = mergedList.filter(
      (data) => data.eventSchedule.repeatFrequency !== 'P1W'
    )

    // 全てのeventを読み込んだ結果を表示する -------------------------
    // pal-event-read以下の要素を削除する ----------------------------
    callbackById(
      'pal-event-list',
      (data) => pal.util.emptyElement(data)
    );
    makeEventListElement(p1yArray, eventList);
  };

  // --------------------- イベントハンドラ開始 ----------------------
  // onHashchange開始 ------------------------------------------------
  const onHashchange = () => {
    const currentHash = pal.bom.getLocationHash();
    const firstHash = currentHash.split('/')[0];
    const secondHash = currentHash.split('/')[1];
    const thirdHash = currentHash.split('/')[2];

    return [firstHash, secondHash, thirdHash];
  };
  // onHashchange終了 ------------------------------------------------

  // onClickRegistButton開始 -----------------------------------------
  const onClickRegistButton = (e) => {
    let eventMap = {};
    let eventSchedule = {};
    let whatNumber;
    let day;

    const repeatEveryYear =
      callbackById('repeatEveryYear', (data) => data);

    const year = callbackById('inputYear', data => data.value);
    const month = callbackById('inputMonth', data => data.value);
    const date = callbackById('inputDate', data => data.value);
    const name = callbackById('inputName', data => data.value);
    const description =
      callbackById('inputDescription', (data) => data.value);

    // 第何何曜日が指定されたときの処理 ------------------------------
    if (callbackById('inputWhatNumber', data => data)) {
      whatNumber =
        callbackById('inputWhatNumber', data => data.value);
    }
    if (callbackById('inputDay', data => data)) {
      day = callbackById('inputDay', data => data.value);
    }

    e.preventDefault();

    // eventScheduleを組み立てる 開始 --------------------------------
    eventSchedule.byMonth = month;
    eventSchedule.byMonthDay = date;

    if (year) {
      eventSchedule.startDate = `${year}-${month}-${date}`;
    }
    // 繰り返しがチェックされていたら
    if (repeatEveryYear.checked) {
      eventSchedule.repeatFrequency = 'P1Y';
    }
    // 第何何曜日が指定されたときの処理 ------------------------------
    if (whatNumber === undefined && day === undefined) {
      console.log('何曜日が指定されていません');
    }
    else {
      console.log('何曜日が指定されています');
    }
    // eventScheduleを組み立てる 終了 --------------------------------

    eventMap.name = name;
    eventMap.description = description;

    // eventMapにeventScheduleを設定する
    eventMap.eventSchedule = eventSchedule;

    socket.emit('event create', eventMap);
    // socket.emit('event update', eventMap);

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
    let eventMap = {};
    let eventSchedule = {};

    const year = callbackById('inputYear', data => data.value);
    const month = callbackById('inputMonth', data => data.value);
    const whatNumber =
      callbackById('inputWhatNumber', data => data.value);
    const day = callbackById('inputDay', data => data.value);
    const repeatEveryYear =
      callbackById('repeatEveryYear', data => data.value);
    const name = callbackById('inputName', data => data.value);
    const description =
      callbackById('inputDescription', data => data.value)

    e.preventDefault();

    // 第何何曜日の日付を取得する ------------------------------------
    let resultDay = util.date.getDateByWhatNumberDay({
      year: year, month: month, whatNumber: whatNumber, day: day
    });

    // eventScheduleを組み立てる 開始 --------------------------------
    eventSchedule.byMonth = month;
    eventSchedule.byMonthDay = resultDay.split('/')[2];

    if (year) {
      eventSchedule.startDate = `${year}-${month}-${day}`;
    }
    // 繰り返しがチェックされていたら
    if (repeatEveryYear.checked) {
      eventSchedule.repeatFrequency = 'P1Y';
    }
    if (whatNumber) {
      if (day) {
        eventSchedule.byDay = `${whatNumber}${day}`;
      }
    }
    // eventScheduleを組み立てる 終了 --------------------------------
    eventMap.name = name;
    eventMap.description = description;

    // eventMapにeventScheduleを設定する
    eventMap.eventSchedule = eventSchedule;

    socket.emit('event create', eventMap);
    // socket.emit('event read', eventMap);
    // socket.emit('event update', eventMap);
    // socket.emit('event delete', eventMap);

    socket.on('event create complete', () => {
      // 全てのeventを読み込む ---------------------------------------
      socket.emit('eventSchedule readAll');
      socket.emit('event readAll');
    });
    return false;
  };
  // onClickCreateButton終了 -----------------------------------------

  // onClickReadButton開始 -------------------------------------------
  const onClickReadButton =
    (event) => pal.bom.setLocationHash(event.target.value);

  // onClickDeleteButton開始 ------------------------------------------
  const onClickDeleteButton =
    (event) => pal.bom.setLocationHash(event.target.value);

  // onClickCancel開始 -----------------------------------------------
  const onClickCancel =
    () => pal.bom.setLocationHash('#event/create/yearly');

  // onClickAgree開始 ------------------------------------------------
  const onClickAgree = (event) => {
    // 削除するeventのidを取得する -----------------------------------
    let id = event.target.previousSibling.textContent;

    socket.emit('event delete', id);
  };

  const onClickEventCreateWeekly = (e) => {

    e.preventDefault();

    let event = {};
    let eventSchedule = {};

    // formから値を取得する ------------------------------------------
    const day = callbackById('inputDay', data => data.value);
    const name = callbackById('inputName', data => data.value);
    const startTime =
      callbackById('inputStartTime', data => data.value);
    const endTime =
      callbackById('inputEndTime', data => data.value);

    event.name = name;
    eventSchedule.byDay = day;
    eventSchedule.startTime = startTime;
    eventSchedule.endTime = endTime;
    eventSchedule.repeatFrequency = 'P1W';

    event.eventSchedule = eventSchedule;

    socket.emit('event createWeekly', event);

    // eventの処理/終了 ------------------------------------------------
    socket.on('event createWeekly complete', (data) => {
      showWeeklyEvent(data);
    });
  };

  const onClickBack = () => {
    history.back();
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
  socket.on('event read complete', (data) => {
    let eventPage =
      callbackById('pal-event-read',
                   data => {
                     pal.util.emptyElement(data);
                     return data; 
                   });
    eventPage.innerHTML = JSON.stringify(data);
  });
  // event delete complete -------------------------------------------
  socket.on(
    'event delete complete',
    () => pal.bom.setLocationHash('#event/create/yearly')
  );

  socket.on('event search complete', (data) => {
    // このページの曜日を取得する
    let currentDay =
      document.querySelector('#pal-event-read h2')
        .getAttribute('data-day');

    if (data.eventSchedule.byDay === currentDay) {
      showWeeklyEvent(data);
    }
  });

  socket.on('eventSchedule search complete', (array) => {
    array.forEach((data) => {
      socket.emit('event search', {eventSchedule:data._id});
    });
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
  const initModule = (mainSection) => {
    let hashArray = onHashchange(mainSection);
    let palMainNav;
    let listArray;
    let findElement;

    // mainセクションの子要素をすべて削除する --------------------
    pal.util.emptyElement(mainSection);
    // 骨組みを表示する ------------------------------------------
    mainSection.appendChild(makeStructure());

    // pal-main-navを表示する ------------------------------------
    palMainNav =
      callbackByQuerySelector('#pal-main-nav', data => data);
    callbackByQuerySelector('#pal-event-nav', (data) => {
      if (!data) {
        util.dom.insertBefore(pal.event.makeNav(), palMainNav);
      }
    });

    // hashの状態により表示を切り替える ------------------------------
    switch (hashArray[1]) {
      case 'create':
        if (hashArray[2] === 'yearly') {
          // pal-event-read以下の要素を削除してeventReadAllの値を
          // 表示する
          showEventReadAll();

          // pal-event-create以下の要素を削除する --------------------
          callbackById(
            'pal-event-create',
            data => pal.util.emptyElement(data)
          );
          // event-createフォームを表示する --------------------------
          callbackById(
            'pal-event-create',
            data => util.dom.appendChild(data, makeEventCreate())
          );
          // 全てのeventを読み込む -----------------------------------
          socket.emit('eventSchedule readAll');
          socket.emit('event readAll');

          callbackById(
            'registEvent',
            data => data.addEventListener('click', onClickRegistButton)
          );
          // 予定登録（日指定）を押されたようにする ------------------
          callbackById(
            'pal-event-nav-yearly',
            data => setButtonPressed(data))
        }
        else if (hashArray[2] === 'dayOfTheWeek') {
          // pal-event-read以下の要素を削除してeventReadAllの値を
          // 表示する
          showEventReadAll();

          // pal-event-create以下の要素を削除する --------------------
          callbackById(
            'pal-event-create',
            data => pal.util.emptyElement(data)
          );
          // フォームを表示する --------------------------------------
          callbackById(
            'pal-event-create',
            data => util.dom.appendChild(
              data, makeEventCreateByNanyoubi()
            )
          );
          // 全てのeventを読み込む -----------------------------------
          socket.emit('eventSchedule readAll');
          socket.emit('event readAll');

          callbackById(
            'createEvent',
            data => data.addEventListener('click', onClickCreateButton)
          );
          callbackById(
            'pal-event-nav-dayoftheweek',
            (data) => setButtonPressed(data)
          );
        }
        // 曜日ごとの処理
        else if (hashArray[2] === 'dayly') {
          // pal-event-read以下の要素を削除してフォームを表示する ----
          callbackById(
            'pal-event-read',
            data => {
              pal.util.emptyElement(data);
              util.dom.appendChild(data, makeWeeklySchedule());
            }
          );
          // pal-event-create以下の要素を削除してフォームを表示する --
          callbackById(
            'pal-event-create',
            data => {
              pal.util.emptyElement(data)+
              util.dom.appendChild( data, makeEventCreateWeekly());
            }
          );
          // ナビゲーションの予定登録（曜日指定)が押されたようにする
          callbackById(
            'pal-event-nav-byday',
            (data) => setButtonPressed(data)
          );

          // 曜日ごとの処理 ------------------------------------------
          procForEachDayOfTheWeek();

        }
        break;
      case 'read':
        socket.emit('event read', hashArray[2]);
        break;
      case 'delete':
        // 削除ボタンを押されたli要素の下に削除していいかの
        // 確認画面を表示する
        listArray = document.querySelectorAll('span.hidden');
        listArray.forEach((data) => {
          if (data.textContent === hashArray[2]) {
            findElement = data;
          }
        });
        findElement.parentNode.parentNode
          .insertBefore(
            makeDeletePage(hashArray[2]),
            findElement.parentNode.nextSibling
          );
        break;
      default:
        // 予定一覧を押されたようにする ------------------------------
        callbackById(
          'pal-event-nav-list',
          (data) => setButtonPressed(data)
        );
        // イベントリストを表示する ----------------------------------
        callbackById(
          'pal-event-read',
          data => util.dom.appendChild(data, makeEventReadAll())
        );
        // 全てのeventとeventScheduleを読み込む ----------------------
        socket.emit('eventSchedule readAll');
        socket.emit('event readAll');
        break;
    }

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    initModule: initModule,
    makeNav: makeNav,
    setButtonPressed: setButtonPressed
  };
  // --------------------- パブリックメソッド終了 --------------------
})();
