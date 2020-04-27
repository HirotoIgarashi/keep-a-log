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

/*global pal util*/

pal.event = (() => {
  //--------------------- モジュールスコープ変数開始 -----------------
  // クライアントサイドでsocket.ioを初期化
  const socket = io();

  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  const makeEventCreateForm = () => {
    let frag = util.dom.createFragment();

    // -----divタグの作成 --------------------------------------------
    let div = util.dom.createElement('div');
    util.dom.setAttribute(div, 'class', 'data-form');

    let h1 = util.dom.createElement('h1');
    util.dom.innerHTML(
      h1,
      '年間の予定'
    );
    util.dom.appendChild(div, h1);

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
    let checkbox = util.dom.createElement('input');
    util.dom.setAttribute(checkbox, 'type', 'checkbox');
    util.dom.setAttribute(checkbox, 'id', 'repeatEveryYear');
    let checkboxLabel = util.dom.createElement('label');
    util.dom.setAttribute(checkboxLabel, 'for', 'repeatEveryYear');
    util.dom.innerHTML(checkboxLabel, '毎年繰り返す');

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
    let button = util.dom.createElement('button');
    util.dom.setAttribute(button, 'type', 'submit');
    util.dom.setAttribute(button, 'id', 'registEvent');
    util.dom.innerHTML(button, '保存');

    // HTMLを組み立てる-----------------------------------------------
    util.dom.appendChild(form, button);

    util.dom.appendChild(div, h1);
    util.dom.appendChild(div, form);

    util.dom.appendChild(frag, div);
    return frag;
  };
  //--------------------- DOMメソッド終了 ----------------------------

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
  const onClickRegistButton = (event) => {
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

    event.preventDefault();

    // eventScheduleを組み立てる 開始 --------------------------------
    eventSchedule.byMonth = month;
    eventSchedule.bymonthDay = date;

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

    console.log(eventMap);

  };
  // onClickRegistButton開始 -----------------------------------------
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
    // hashの状態により表示を切り替える ------------------------------
    let hashArray = onHashchange(mainSection);

    switch (hashArray[2]) {
      case 'create':
        if (hashArray[1] === 'yearly') {
          // mainセクションの子要素をすべて削除する ------------------------
          pal.util.emptyElement(mainSection);
          mainSection.appendChild(makeEventCreateForm());
        }
        break;
      default:
        break;
    }

    let registButton = document.getElementById('registEvent');
    registButton.addEventListener('click', onClickRegistButton);

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    initModule: initModule
  };
  // --------------------- パブリックメソッド終了 --------------------
})();
