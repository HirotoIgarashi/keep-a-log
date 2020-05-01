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
    let divEvent =
      util.dom.createElement({tagName: 'div', id: 'pal-event'});
    // -----divCreateタグの作成 --------------------------------------
    let divCreate =
      util.dom.createElement({tagName: 'div', id: 'pal-event-create'});
    // -----divReadタグの作成 ----------------------------------------
    let divReadAll =
      util.dom.createElement({tagName: 'div', id: 'pal-event-read'});

    // 画面下部のコントロールエリアの表示 ----------------------------
    let divEventControl =
      util.dom.createElement({tagName: 'div', id: 'pal-event-control'});

    // 戻るボタンの表示 ----------------------------------------------
    let buttonBack = util.dom.createElement(
      {tagName: 'button', id: 'pal-event-back', innerHTML: '戻る'}
    );
    buttonBack.addEventListener('click', onClickBack);

    // HTMLを組み立てる-----------------------------------------------
    util.dom.appendChild(divEvent, divCreate);
    util.dom.appendChild(divEvent, divReadAll);
    util.dom.appendChild(divEventControl, buttonBack);
    util.dom.appendChild(frag, divEvent);
    util.dom.appendChild(frag, divEventControl);

    return frag;
  };

  const makeEventCreate = () => {
    let frag = util.dom.createFragment();

    // pal-event-createの内容開始 ------------------------------------
    let h1Create = util.dom.createElement(
      {tagName: 'h1', innerHTML: '年間予定の作成'}
    );

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
    let checkbox = util.dom.createElement(
      {tagName: 'input', type: 'checkbox', id: 'repeatEveryYear'}
    );

    let checkboxLabel =
      util.dom.createElement(
        {
          tagName: 'label',
          for: 'repeatEveryYear',
          innerHTML: '毎年繰り返す'
        }
      );

    util.dom.appendChild(divCheckbox, checkbox);
    util.dom.appendChild(divCheckbox, checkboxLabel);

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

    util.dom.appendChild(form, inputYear[0]);
    util.dom.appendChild(form, inputYear[1]);
    util.dom.appendChild(form, inputMonth[0]);
    util.dom.appendChild(form, inputMonth[1]);
    util.dom.appendChild(form, inputDate[0]);
    util.dom.appendChild(form, inputDate[1]);
    util.dom.appendChild(form, divCheckbox);
    util.dom.appendChild(form, inputName[0]);
    util.dom.appendChild(form, inputName[1]);
    util.dom.appendChild(form, inputDescription[0]);
    util.dom.appendChild(form, inputDescription[1]);

    // ボタンを生成 --------------------------------------------------
    let button = util.dom.createElement(
      { tagName: 'button',
        type: 'submit',
        id: 'registEvent',
        innerHTML: '保存'
      }
    );

    // HTMLを組み立てる-----------------------------------------------
    util.dom.appendChild(form, button);

    util.dom.appendChild(frag, h1Create);
    util.dom.appendChild(frag, form);
    // -----divCreateタグの作成終了 ----------------------------------
    // pal-event-createの内容終了 ------------------------------------

    return frag;
  };

  const makeEventRead = () => {
    let frag = util.dom.createFragment();

    let h1Read =
      util.dom.createElement(
        {tagName: 'h1', innerHTML: '年間予定のリスト'}
      );
    let ulEventList =
      util.dom.createElement(
        {tagName: 'ul', id: 'pal-event-list'}
      );

    util.dom.appendChild(frag, h1Read);
    util.dom.appendChild(frag, ulEventList);

    return frag;
  };

  const makeDeletePage = (id) => {
    let frag = util.dom.createFragment();
    // -----divCreateタグの作成開始 ----------------------------------
    let divDelete = util.dom.createElement('div');
    util.dom.setAttribute(divDelete, 'id', 'pal-event-delete');

    let h1Delete = util.dom.createElement('h1');
    util.dom.innerHTML(h1Delete, 'このイベントを削除します');

    let targetEvent = util.dom.createElement('div');
    targetEvent.textContent = id;

    // -----agreeボタンを生成 ---------------------------------------------
    let agreeButton = util.dom.createElement('button');
    util.dom.setAttribute(agreeButton, 'id', 'agree');
    util.dom.innerHTML(agreeButton, 'はい');
    agreeButton.addEventListener('click', onClickAgree);

    // -----cancelボタンを生成 ---------------------------------------------
    let cancelButton = util.dom.createElement('button');
    util.dom.setAttribute(cancelButton, 'id', 'cancel');
    util.dom.innerHTML(cancelButton, 'キャンセル');
    cancelButton.addEventListener('click', onClickCancel);

    util.dom.appendChild(divDelete, h1Delete);
    util.dom.appendChild(divDelete, targetEvent);
    util.dom.appendChild(divDelete, agreeButton);
    util.dom.appendChild(divDelete, cancelButton);

    util.dom.appendChild(frag, divDelete);
    return frag;
  };

  const makeEventListElement = (array, element) => {
    array.forEach((event) => {

      let li = util.dom.createElement('li');

      let spanId = util.dom.createElement('span');
      util.dom.setAttribute(spanId, 'class', 'hidden');
      util.dom.innerHTML(spanId, event._id);

      let spanByMonth = util.dom.createElement('span');
      spanByMonth.style.display = 'inline-block';
      spanByMonth.style.textAlign = 'right';
      spanByMonth.style.width = '2.5em';
      util.dom.innerHTML(spanByMonth, `${event.eventSchedule.byMonth}月`);

      let spanByMonthDay = util.dom.createElement('span');
      spanByMonthDay.style.display = 'inline-block';
      spanByMonthDay.style.textAlign = 'right';
      spanByMonthDay.style.width = '2.5em';
      util.dom.innerHTML(spanByMonthDay, `${event.eventSchedule.byMonthDay}日`);

      let spanName = util.dom.createElement('span');
      spanName.style.display = 'inline-block';
      spanName.style.textAlign = 'left';
      spanName.style.width = '15em';
      spanName.style.marginLeft = '0.5em';
      util.dom.innerHTML(spanName, `${event.name}`);

      let editButton = util.dom.createElement('button');
      editButton.textContent = '編集';

      let deleteButton = util.dom.createElement('button')
      util.dom.setAttribute(deleteButton, 'value', `#event/delete/${event._id}`);
      deleteButton.textContent = '削除';
      deleteButton.addEventListener('click', onClickDeletButton);

      util.dom.appendChild(li, spanId);
      util.dom.appendChild(li, spanByMonth);
      util.dom.appendChild(li, spanByMonthDay);
      util.dom.appendChild(li, spanName);
      util.dom.appendChild(li, editButton);
      util.dom.appendChild(li, deleteButton);
      util.dom.appendChild(element, li)
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
      document.getElementById('repeatEveryYear');
    const year = document.getElementById('inputYear').value;
    const month = document.getElementById('inputMonth').value;
    const date = document.getElementById('inputDate').value;

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
  };
  // onClickRegistButton終了 -----------------------------------------

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
    // pal.bom.setLocationHash('#event/create/yearly');
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
    (data) => eventScheduleArray = data);

  socket.on(
    'event delete complete',
    () => pal.bom.setLocationHash('#event/create/yearly'));
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
        else if (hashArray[2] === 'dayofweek') {
          // mainセクションの子要素をすべて削除する ------------------
          pal.util.emptyElement(mainSection);

          // 骨組みを表示する ----------------------------------------
          mainSection.appendChild(makeStructure());

          // イベントリストを表示する --------------------------------
          let eventRead = document.getElementById('pal-event-read');
          util.dom.appendChild(eventRead, makeEventRead());

          // 全てのeventを読み込む -----------------------------------
          socket.emit('eventSchedule readAll');
          socket.emit('event readAll');

          // let registButton = document.getElementById('registEvent');
          // registButton.addEventListener('click', onClickRegistButton);
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
