/*
 * pal.util_b.js
 * JavaScriptブラウザユーティリティ
 *
 * Michael S. Mikowskiがコンパイル
 * これはWebからひらめきを得て1998年から作成・更新を続けているルーチン。
 * MITライセンス
*/

'use strict';

pal.util_b = (() => {
  //------------------ モジュールスコープ変数開始 ------------------------------
  var
    configMap = {
      regex_encode_html   : /[&"'><]/g,
      regex_encode_noamp  : /["'><]/g,
      html_encode_map     : {
        '&' : '$#38',
        '"' : '$#34',
        "'" : '$#39',
        '>' : '$#62',
        '<' : '$#60',
      }
    },

    decodeHtml,
    encodeHtml,
    getEmSize,
    getTimestamp,
    getTplContent,
    getNowDateJp,
    getIsoExtFormat,
    createObjectLocal,
    updateObjectLocal,
    deleteObjectLocal,
    readObjectLocal,
    makeStringObject;

  configMap.encode_noamp_map = $.extend(
    {}, configMap.encode_noamp_map
  );

  delete configMap.encode_noamp_map['&'];
  //------------------ モジュールスコープ変数終了 ------------------------------

  //------------------ ユーティリティメソッド開始 ------------------------------
  // decodeHtml開始
  // HTMLエンティティをブラウザに適した方法でデコードする
  // http://stackoverflow.com/questions/1912501/\
  //  unescape-html-entitiles-in-javascriptを参照
  //
  decodeHtml = (str) => {
    return $('<div/>').html(str || '').text();
  };
  // decodeHtml終了

  // encodeHtml開始
  // これはhtlエンティティのための単一パスエンコーダであり、
  // 任意の数の文字に対応する
  //
  encodeHtml = (input_arg_str, exclude_amp) => {
    var
      input_str = String(input_arg_str),
      regex, lookup_map
      ;

    if ( exclude_amp ) {
      lookup_map = configMap.encode_noamp_map;
      regex = configMap.regex_encode_noamp;
    }
    else {
      lookup_map = configMap.html_encode_map;
      regex = configMap.regex_encode_html;
    }
    return input_str.replace(regex,
      // function ( match, name ) {
      // jslintがエラーとなるためnameを削除する。
      (match) => {
        return lookup_map[ match ] || '';
      }
    );
  };
  // encodeHtml終了

  // getEmSize開始
  // emのサイズをピクセルで返す
  //
  getEmSize = (elem) => {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  // getEmSize終了

  // getTimestamp開始
  // 目的: 現在日時のDate.parseの値を文字列で返す。
  getTimestamp = () => {
    var
      now_date,
      now_parse;

      now_date = new Date();

      now_parse = Date.parse( now_date.toString() ).toString();

      return now_parse;
  };
  // getTimestamp終了

  // getNowDateJp/開始
  // 目的: 2017年5月21日 日曜日 21:50:45の形式で文字列を生成する
  // 必須引数: IDの値
  // オプション引数: なし
  // 設定:
  // 戻り値: 引数のIDの値のコンテンツ
  // 例外発行: なし
  getNowDateJp = (option) => {
    var
      day_jp = {
        0 : '日曜日',
        1 : '月曜日',
        2 : '火曜日',
        3 : '水曜日',
        4 : '木曜日',
        5 : '金曜日',
        6 : '土曜日'
      },
      now = new Date(),
      now_jp = '';

    if ( option === undefined ) {
      // 2017年5月21日 日曜日 21:50:45の形式で文字列を生成する
      now_jp = (
        now.getFullYear() + '年' +
        (now.getMonth() + 1) + '月' +
        now.getDate() + '日 ' +
        day_jp[now.getDay()] + ' ' +
        now.toLocaleTimeString()
      );
    }
    else if (option === 'date and day') {
      now_jp = (
        now.getFullYear() + '年' +
        (now.getMonth() + 1) + '月' +
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
  getIsoExtFormat = (date_object) => {

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
  createObjectLocal = (local_storage_key, list, callback) => {
    var
      // key,
      i,
      save_array = [],
      save_object;

    for ( i = 0; i < list.length; i += 1 ) {

      save_object = makeStringObject( list[ i ] );

      save_array.push( save_object );
    }

    // localStorageにリストを追加/上書きする
    window.localStorage
      .setItem( local_storage_key, JSON.stringify( save_array ) );

    if ( callback ) {
      callback( list );
    }

  };
  // ユーティリティメソッド/createObjectLocal/終了

  // ユーティリティメソッド/updateObjectLocal/開始
  updateObjectLocal = () => {
    console.log( 'updateObjectLocalが呼ばれました' );
  };
  // ユーティリティメソッド/updateObjectLocal/終了

  // ユーティリティメソッド/deleteObjectLocal/開始
  deleteObjectLocal = () => {
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
  readObjectLocal = (local_storage_key) => {
    let item;

    // localStorageからaction-listの値を読み込む
    item = window.localStorage.getItem( local_storage_key );

    return JSON.parse( item );

  };
  // ユーティリティメソッド/readObjectLocal/終了

  // ユーティリティメソッド/makeStringObject/開始
  makeStringObject = (object) => {
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
  //------------------ ユーティリティメソッド終了 ------------------------------

  //------------------ パブリックメソッド開始 ----------------------------------
  return {
    decodeHtml          : decodeHtml,
    encodeHtml          : encodeHtml,
    getEmSize           : getEmSize,
    getTimestamp        : getTimestamp,
    getTplContent       : getTplContent,
    getNowDateJp        : getNowDateJp,
    getIsoExtFormat     : getIsoExtFormat,
    createObjectLocal   : createObjectLocal,
    updateObjectLocal   : updateObjectLocal,
    deleteObjectLocal   : deleteObjectLocal,
    readObjectLocal     : readObjectLocal,
    makeStringObject    : makeStringObject
  };
  //------------------ パブリックメソッド終了 ----------------------------------
})();
