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
export const getTplContent = (templateId) => {
  let content;
  let tpl = document.getElementById(templateId);

  if (document.getElementById(templateId)) {
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
      (now.getMonth() + 1) + '月' +
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
export const getIsoExtFormat = (dateObject) => {
  const pad = (number) => {
    if ( number < 10 ) {
      return '0' + number;
    }
    return number;
  }
  // YYYY-MM-DDThh:mmの文字列を生成する(:ssは不要)

  return dateObject.getFullYear() +
    '-' + pad(dateObject.getMonth() + 1) +
    '-' + pad(dateObject.getDate()) +
    'T' + pad(dateObject.getHours()) +
    ':' + pad(dateObject.getMinutes())
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
export const createObjectLocal = (localStorageKey, list, callback) => {
  let saveArray = [];
  let saveObject;

  for (let i = 0; i < list.length; i += 1) {
    saveObject = makeStringObject(list[i]);
    saveArray.push(saveObject);
  }

  // localStorageにリストを追加/上書きする
  window.localStorage
    .setItem(localStorageKey, JSON.stringify(saveArray));

  if (callback) {
    callback(list);
  }
};
// ユーティリティメソッド/createObjectLocal/終了

// ユーティリティメソッド/updateObjectLocal/開始
export const updateObjectLocal = () => {
  console.log('updateObjectLocalが呼ばれました');
};
// ユーティリティメソッド/updateObjectLocal/終了

// ユーティリティメソッド/deleteObjectLocal/開始
export const deleteObjectLocal = () => {
  console.log('deleteObjectLocalが呼ばれました');
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
export const readObjectLocal = (localStorageKey) => {
  let item;

  // localStorageからaction-listの値を読み込む
  item = window.localStorage.getItem(localStorageKey);

  return JSON.parse(item);
};
// ユーティリティメソッド/readObjectLocal/終了

// ユーティリティメソッド/makeStringObject/開始
export const makeStringObject = (object) => {
  let key;
  let stringObject = {};

  for (key in object) {
    if (typeof object[key] === 'string' && object[key]) {
      stringObject[key] = object[key];
    }
  }
  return stringObject;
};
// ユーティリティメソッド/makeStringObject/終了

// JavaScriptのcore機能のユーティリティ ------------------------------

// エラーを出力する
const fail = (thing) => { throw new Error(thing) };

  // 警告を出力する
const warn = (thing) => console.log(["警告:", thing].join(''));

// 情報を出力する
const note = (thing) => console.log(["情報:", thing].join(''));

// 関数合成 --------------------------------------------------------
// const compose = (f, g) => {
//   return (arg) => {
//     return f(g(arg));
//   }
// };
export const compose = (...fs) => x => fs.reduceRight((acc, f) => f(acc), x);

// 関数を引数にとり2段階までカリー化を行う
const curry2 = (fun) => {
  return (secondArg) => {
    return (firstArg) => fun(firstArg, secondArg);
  }
};
// notコンビネータ -------------------------------------------------
const not = (predicate) => {
  return (arg) => {
    return ! predicate(arg);
  };
};
// プレディケート(predicate)関数開始 -------------------------------
// 常に真偽値(trueもしくはfalse)を返す関数

// isFunction ------------------------------------------------------
// 関数であればtrue、そうでなければfalseを返す
const isFunction = (fn) => {
  return Object.prototype.toString.call(fn) === "[object Function]";
};

// 配列であればtrue、そうでなければfalseを返す
const isArray = (data) => Array.isArray(data);

// 文字列であればtrue、そうでなければfalseを返す
const isString = (data) => {
  if (typeof data === 'string') {
    return true;
  }
  else {
    return false;
  }
};

// パブリックメソッド/isInteger/開始
// 目的: 整数かどうかを検査する
// 引数が例えば'1'のように文字列であってもtrueを返す
export const isInteger = (value) => {
  let valueNumber;
  // ポリフィル
  Number.isInteger = Number.isInteger || function( value ) {
    return typeof value === 'number' &&
      isFinite( value ) &&
      Math.floor( value ) === value;
  };
  if ( typeof value === 'string' ) {
    valueNumber = Number(value);
  }
  else {
    valueNumber = value;
  }
  return Number.isInteger(valueNumber);
};

// インデックス指定可能であればtrue、そうでなければfalseを返す
const isIndexed = (data) => isArray(data) || isString(data);

// パブリックメソッド/isNonEmpty/開始
// 目的: 空の値でないか検査
export const isNonEmpty = (value) => {
  return value !== "";
};
// パブリックメソッド/isNonEmpty/終了

// パブリックメソッド/isRange/開始
// 目的: 第1引数の値が第2引数と第3引数の間にあるかをチェックする
// 引数:
//  * value : チェック対象の値
//  * min   : 下限値
//  * max   : 上限値
// 戻り値: 妥当であれば   : true
//         妥当でなければ : false
// 例外発行: なし
//
export const isRange = (value, min, max) => {
  let valueNumber;
  if ( typeof value === 'string' ) {
    valueNumber = Number( value );
  }
  else {
    valueNumber = value;
  }
  if ( min > valueNumber || valueNumber > max ) {
    return false;
  }
  return true;
};
// パブリックメソッド/isRange/終了

const isEven = (n) => (n%2) === 0;

const isOdd = not(isEven);

// existy:何かの存在の有無を判定する関数
const existy = (x) => x != null;

// truthy: 与えられた値がtrueとみなされるかを判定する
const truthy = (x) => (x !== false) && existy(x);

// <=演算子の単純なスキン
const lessOrEqual = (x, y) => x <= y;
// プレディケート(predicate)関数終了 -------------------------------

// コンパレータ(comparator)関数開始 --------------------------------
const compareLessThanOrEqual = (x, y) => {
  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
};

const comparator = (pred) => {
  return (x, y) => {
    if (truthy(pred(x, y))) {
      return -1;
    }
    else if (truthy(pred(y, x))) {
      return 1;
    }
    else {
      return 0;
    }
  };
};
// コンパレータ(comparator)関数終了 --------------------------------
// <=演算子の単純なスキン
const compareNumbers = (x, y) => x - y;

// underscoreの_.result関数の書き換え
// valueが関数の名前だった場合、その関数を利用してその結果を
// 返します。そうでない場合、それを返します。 デフォルトの値が
// 与えられていて、そのプロパティが存在しないもしくはundefinedだった
// 場合は、デフォルトの値を返します。defaultValueが関数なら、
// それを返します
const executeFunctionInObject = (object, property, fallback) => {
  let value = object == null ? void 0 : object[property];
  if (value === void 0) {
    value = fallback;
  }
  return isFunction(value) ? value.call(object) : value;
};

// ある条件がtrueの場合のみアクションを実行し、それ以外の場合は
// undefinedもしくはnullを返す
const doWhen = (cond, action) => {
  if (truthy(cond)) {
    return action();
  }
  else {
    return undefined;
  }
};

const executeIfHasFunction = (target, name) => {
  return doWhen(existy(target[name]), () => {
    var result = executeFunctionInObject(target, name);
    console.log(['結果は', result].join(''));
    return result;
  });
};

// インデックス指定可能なデータ型を持ったデータから、有効な --------
// インデックスで指定される要素を返す
const nth = (data, index) => {
  if (!isInteger(index)) {
    fail('インデックスは整数である必要があります');
  }
  if (!isIndexed(data)) {
    fail(
      'インデックス指定可能ではないデータ型はサポートされていません'
    );
  }
  if ((index < 0) || (index > data.length -1)) {
    fail(
      '指定されたインデックスは範囲外です'
    );
  }
  return data[index];
};

// 2番目の要素を返す関数 -------------------------------------------
const second = (array) => nth(array, 1);
