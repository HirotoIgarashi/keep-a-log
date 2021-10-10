//  utilCore.js
'use strict';

export const getTimestamp = () => {
  let now_date;
  now_date = new Date();
  return Date.parse(now_date.toString()).toString();
};
// getTimestamp終了

// getTplContent/開始
// 目的: テンプレートからコンテンツを取得して返す。
// 必須引数: IDの値
// オプション引数: なし
// 設定:
// 戻り値: 引数のIDの値のコンテンツ
// 例外発行: なし
export const getTplContent = (template_id) => {
  let content;

  let tpl = document.getElementById(template_id);
  if (document.getElementById(template_id)) {
    content = tpl.content.cloneNode( true );
  }

  return content;
};
// getTplContent/終了

// getNowDateJp/開始
// 目的: 2017年5月21日 日曜日 21:50:45の形式で文字列を生成する
// 必須引数: IDの値
// オプション引数: なし
// 設定:
// 戻り値: 引数のIDの値のコンテンツ
// 例外発行: なし
export const getNowDateJp = (option) => {
  let day_jp = {
    0 : '日曜日',
    1 : '月曜日',
    2 : '火曜日',
    3 : '水曜日',
    4 : '木曜日',
    5 : '金曜日',
    6 : '土曜日'
  };
  let now = new Date();
  let now_jp = '';

  if (option === undefined) {
    // 2017年5月21日 日曜日 21:50:45の形式で文字列を生成する
    now_jp = (
      now.getFullYear() + '年' +
      ( now.getMonth() + 1 ) + '月' +
      now.getDate() + '日 ' +
      day_jp[now.getDay()] + ' ' +
      now.toLocaleTimeString()
    );
  }
  else if (option === 'date and day') {
    now_jp = (
      now.getFullYear() + '年' +
      ( now.getMonth() + 1 ) + '月' +
      now.getDate() + '日 ' +
      day_jp[now.getDay()]
    );
  }
  return now_jp;
};
// getNowDateJp/終了

// getIsoExtFormat/開始
// 目的: ISO9601の拡張形式に変換して返す
//       schema.orgで使用するので秒以下は不要
//       YYYY-MM-DDThh:mm
// 必須引数: Dateオブジェクト
// オプション引数: なし
// 設定:
// 戻り値: ISO9601形式の文字列
// 例外発行: なし
export const getIsoExtFormat = (date_object) => {
  const pad = (number) => {
    if ( number < 10 ) {
      return '0' + number;
    }
    return number;
  }
  // YYYY-MM-DDThh:mmの文字列を生成する(:ssは不要)

  return date_object.getFullYear() +
    '-' + pad( date_object.getMonth() + 1 ) +
    '-' + pad( date_object.getDate() ) +
    'T' + pad( date_object.getHours() ) +
    ':' + pad( date_object.getMinutes() )
    ;
};
// getIsoExtFormat/終了

// ユーティリティメソッド/createObjectLocal/開始
// 目的: オブジェクトとlocalStorageのkeyを受け取りObjectを保存する。
//       保存するときはリスト形式にする
// 必須引数:
//  * local_storage_key : 取得するlocalStorageのkey
//  * object            : オブジェクト
// オプション引数:
// * callback : コールバック関数
// 設定:
// 戻り値:
// 例外発行: なし
export const createObjectLocal = (local_storage_key, list, callback) => {
  let i;
  let save_array = [];
  let save_object;

  for (i = 0; i < list.length; i += 1) {
    save_object = makeStringObject(list[i]);
    save_array.push(save_object);
  }

  // localStorageにリストを追加/上書きする
  window.localStorage
    .setItem(local_storage_key, JSON.stringify(save_array));

  if (callback) {
    callback(list);
  }
};
// ユーティリティメソッド/createObjectLocal/終了

// ユーティリティメソッド/updateObjectLocal/開始
export const updateObjectLocal = () => {
  console.log( 'updateObjectLocalが呼ばれました' );
};
// ユーティリティメソッド/updateObjectLocal/終了

// ユーティリティメソッド/deleteObjectLocal/開始
export const deleteObjectLocal = () => {
  console.log( 'deleteObjectLocalが呼ばれました' );
};
// ユーティリティメソッド/deleteObjectLocal/終了

// ユーティリティメソッド/readObjectLocal/開始
// 目的: localStorageのkeyを受け取りlocalStorageの値を返す。
// 必須引数:
//  * local_storage_key  : 取得するlocalStorageのkey
// オプション引数:なし
// 設定:
// 戻り値: keyの値
// 例外発行: なし
export const readObjectLocal = (local_storage_key) => {
  let item;

  // localStorageからaction-listの値を読み込む
  item = window.localStorage.getItem( local_storage_key );

  return JSON.parse(item);

};
// ユーティリティメソッド/readObjectLocal/終了

// ユーティリティメソッド/makeStringObject/開始
export const makeStringObject = (object) => {
  let key;
  let string_object = {};

  for ( key in object ) {
    if ( typeof object[ key ] === 'string' && object[ key ] ) {
      string_object[ key ] = object[ key ];
    }
  }

  return string_object;
};
// ユーティリティメソッド/makeStringObject/終了

// init_send_request開始
export const initSendRequest = (
  request,
  requestType,
  url,
  async,
  responseHandle,
  requestData) => {

  try {
    // HTTPレスポンスを処理するための関数を指定します。
    request.onreadystatechange = responseHandle;
    request.open( requestType, url, async );

    if ( requestType.toLowerCase() === "post" ) {
      // POSTの場合はContent-Headerが必要です。
      request.setRequestHeader( 'Content-Type', 'application/json' );
      request.send(requestData);
      console.log('Ajaxリクエストを実行しました');
    }
    else {
      request.send(null);
    }
  }
  catch ( errv ) {
    alert(  'サーバーに接続できません。' +
          'しばらくたってからやり直して下さい。\n' +
          'エラーの詳細: ' + errv.message );
  }
};
// init_send_request終了

// sendXmlHttpRequest開始
// 目的: ブラウザごとに適切なXMLHttpRequestオブジェクトを生成して
//       サーバに送信します。
// 必須引数:
//  * requestType     : HTTPリクエストの形式。GETかPOSTを指定します
//  * url             : リクエスト先のURL
//  * async           : 非同期呼び出しを行うか否かを指定します
//  * responseHandle  : レスポンスを処理する関数
//  * arguments[4]    : 5番目の引数はPOSTリクエストによって送信される
//                      文字列を表します
// オプション引数: なし
// 設定:
//  * xmlhttp
// 戻り値: なし
// 例外発行: なし
//
export const sendXmlHttpRequest = (requestType, url, async, responseHandle, sendData) => {
  let request = null;

  if ( window.XMLHttpRequest ) {
    // Mozillaベースのブラウザの場合
    request = new XMLHttpRequest();
  }
  else if ( window.ActiveXObject ) {
    // Internet Explorerの場合
    request = new ActiveXObject( "Msxml2.XMLHTTP" );
    if ( !request ) {
      request = new ActiveXObject( "Miforsoft.XMLHTTP" );
    }
  }

  // XMLHttpRequestオブジェクトが正しく生成された場合のみ、以降の処理に
  // 進みます。
  if (request) {

    if (requestType.toLowerCase() !== 'post') {
      initSendRequest( request, requestType, url, async, responseHandle );
    }
    else {
      // POSTの場合、5番目の引数で指定された値を送信します。
      if (sendData !== null && sendData.length > 0) {
        initSendRequest( request, requestType, url, async, responseHandle, sendData );
      }
    }
    return request;
  }
  alert( 'このブラウザはAjaxに対応していません。' );
  return false;
};
// sendXmlHttpRequest終了
//------------------ ユーティリティメソッド終了 ------------------------------
