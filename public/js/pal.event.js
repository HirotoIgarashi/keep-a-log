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
  // idをキーとしてオブジェクトを探す処理 ----------------------------
  const searchById = ((id, array) => {
    let result = null;

    array.forEach((data) => {
      if (id === data._id) {
        result = data;
      }
    });

    return result;
  });

  // リストをマージする処理 ------------------------------------------
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
        divEvent, [
          divCreate,
          divReadAll
        ],
        divEventControl, [
          buttonBack
        ]
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
      innerHTML: '保存'
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
          divCheckbox,[
            checkbox,
            checkboxLabel
          ],
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
          divCheckbox, [
            checkbox, checkboxLabel
          ],
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

  const makeEventRead = () => {
    let frag = util.dom.createFragment();

    let h1Read = util.dom.createElement({
      tagName: 'h1', textContent: '年間予定のリスト'
    });

    let ulEventList = util.dom.createElement({
      tagName: 'ul', id: 'pal-event-list'
    });

    // HTMLを組み立てる-----------------------------------------------
    let treeArray = [
      frag, [
        h1Read,
        ulEventList
      ]
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
        divDelete, [
          h1Delete,
          targetEvent,
          agreeButton,
          cancelButton
        ]
      ]
    ];
    // ツリー構造を作る ----------------------------------------------
    util.dom.appendByTreeArray(treeArray);

    return frag;
  };

  const makeEventListElement = (array, element) => {
    array.forEach((event) => {

      let li = util.dom.createElement('li');

      let spanId = util.dom.createElement({
        tagName: 'span', class: 'hidden', textContent: event._id
      });

      let spanByMonth = util.dom.createElement({
        tagName: 'span',
        textContent: `${event.eventSchedule.byMonth}月`
      });
      spanByMonth.style.display = 'inline-block';
      spanByMonth.style.textAlign = 'right';
      spanByMonth.style.width = '2.5em';

      let spanByMonthDay = util.dom.createElement({
        tagName: 'span',
        textContent: `${event.eventSchedule.byMonthDay}日`
      });
      spanByMonthDay.style.display = 'inline-block';
      spanByMonthDay.style.textAlign = 'right';
      spanByMonthDay.style.width = '2.5em';

      let spanName = util.dom.createElement({
        tagName: 'span', textContent: `${event.name}`
      });
      spanName.style.display = 'inline-block';
      spanName.style.textAlign = 'left';
      spanName.style.width = '15em';
      spanName.style.marginLeft = '0.5em';

      let editButton = util.dom.createElement({
        tagName: 'button', type: 'button', textContent: '編集'
      });

      let deleteButton = util.dom.createElement({
        tagName: 'button',
        type: 'button',
        value: `#event/delete/${event._id}`,
        textContent: '削除'
      });
      deleteButton.addEventListener('click', onClickDeletButton);

      // HTMLを組み立てる---------------------------------------------
      let treeArray = [
        element, [
          li, [
            spanId,
            spanByMonth,
            spanByMonthDay,
            spanName,
            editButton,
            deleteButton
          ]
        ]
      ];
      // ツリー構造を作る --------------------------------------------
      util.dom.appendByTreeArray(treeArray);

    });
  };
  //--------------------- DOMメソッド終了 ----------------------------
  const setEventArray = (data) => {
    // eventArray変数にサーバーからのデータをセットする --------------
    eventArray = data;

    let mergedList = mergeList(eventArray, eventScheduleArray);

    // 全てのeventを読み込んだ結果を表示する -------------------------
    let palEventList = document.getElementById('pal-event-list');

    // pal-event-read以下の要素を削除する ----------------------------
    pal.util.emptyElement(palEventList);

    // socket.emit('eventSchedule readAll');

    makeEventListElement(mergedList, palEventList);
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

    const repeatEveryYear =
      document.getElementById( 'repeatEveryYear');

    const year = document.getElementById( 'inputYear').value;
    const month = document.getElementById( 'inputMonth').value;
    const date = document.getElementById( 'inputDate').value;
    const name = document.getElementById('inputName').value;
    const description =
      document.getElementById('inputDescription').value;

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
      // 全てのeventを読み込む -----------------------------------
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

    const year = document.getElementById('inputYear').value;
    const month = document.getElementById('inputMonth').value;
    const whatNumber =
      document.getElementById('inputWhatNumber').value;
    const day = document.getElementById('inputDay').value;
    const repeatEveryYear =
      document.getElementById('repeatEveryYear');
    const name = document.getElementById('inputName').value;
    const description =
      document.getElementById('inputDescription').value;

    e.preventDefault();

    // 第何何曜日の日付を取得する ------------------------------------
    let resultDay = util.date.getDateByWhatNumberDay({
      year: year, month: month, whatNumber: whatNumber, day: day
    });
    console.log(resultDay);

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

  // onClickDeletButton開始 ------------------------------------------
  const onClickDeletButton =
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

  const onClickBack = () => {
    history.back();
  };
  // --------------------- イベントハンドラ終了 ----------------------

  // ----- webSocket処理開始 -----------------------------------------
  // 全てのイベントを読み込んだ後の処理 ------------------------------
  socket.on('event readAll complete', setEventArray);
  socket.on(
    'eventSchedule readAll complete',
    (data) => eventScheduleArray = data
  );
  socket.on(
    'event delete complete',
    () => pal.bom.setLocationHash('#event/create/yearly')
  );
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
    let palEventList = document.getElementById('pal-event-list');
    // hashの状態により表示を切り替える ------------------------------
    let hashArray = onHashchange(mainSection);

    switch (hashArray[1]) {
      case 'create':
        if (hashArray[2] === 'yearly') {
          // mainセクションの子要素をすべて削除する ------------------
          pal.util.emptyElement(mainSection);

          // 骨組みを表示する ----------------------------------------
          mainSection.appendChild(makeStructure());

          // フォームを表示する --------------------------------------
          let eventCreate =
            document.getElementById('pal-event-create');
          util.dom.appendChild(eventCreate, makeEventCreate());

          // イベントリストを表示する --------------------------------
          let eventRead = document.getElementById('pal-event-read');
          util.dom.appendChild(eventRead, makeEventRead());

          // 全てのeventを読み込む -----------------------------------
          socket.emit('eventSchedule readAll');
          socket.emit('event readAll');

          let registButton = document.getElementById('registEvent');
          registButton.addEventListener('click', onClickRegistButton);
        }
        else if (hashArray[2] === 'dayOfTheWeek') {
          // mainセクションの子要素をすべて削除する ------------------
          pal.util.emptyElement(mainSection);

          // 骨組みを表示する ----------------------------------------
          mainSection.appendChild(makeStructure());

          // フォームを表示する --------------------------------------
          let eventCreate =
            document.getElementById('pal-event-create');
          util.dom.appendChild(
            eventCreate, makeEventCreateByNanyoubi()
          );

          // イベントリストを表示する --------------------------------
          let eventRead = document.getElementById('pal-event-read');
          util.dom.appendChild(eventRead, makeEventRead());

          // 全てのeventを読み込む -----------------------------------
          socket.emit('eventSchedule readAll');
          socket.emit('event readAll');

          let createButton = document.getElementById('createEvent');
          createButton.addEventListener(
            'click', onClickCreateButton
          );
        }
        break;
      case 'delete':
        palEventList.parentNode.insertBefore(
          makeDeletePage(hashArray[2]),
          palEventList
        );
        break;
      default:
        break;
    }

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    initModule: initModule
  };
  // --------------------- パブリックメソッド終了 --------------------
})();
