/*
 * array.js
 * オブジェクトを格納するリストのモジュール
*/

'use strict';

import {readObjectLocal, createObjectLocal} from "./utilCore.js";

let custom_array = [];

custom_array.createObject = function (object, callback) {
  custom_array.push( object );
  // オブジェクトをlocalStorageに保存する。
  createObjectLocal( 'action-list', custom_array );
  callback();
};

const readObject = function (map) {
  console.log( map );
  return custom_array;
};

custom_array.updateObject = function ( object, callback ) {
  // 目的: objectを受け取りcustom_arrayで_local_idで一致するものを探す
  //       一致したら置換する
  //       一致しなかったら追加する
  var
    i,
    find_flag = false,
    index;

  // local idで一致しているものを探す
  for ( i = 0; i < custom_array.length; i += 1  ) {
    if ( custom_array[i]._local_id === object._local_id ) {
      index = i;
      find_flag = true;
    }
  }

  if ( find_flag ) {
    // 更新する処理
    custom_array.splice( index, 1, object );
  }
  else {
    // 追加する処理
    custom_array.push( object );
  }

  // オブジェクトをlocalStorageに保存する。
  pal.util_b.createObjectLocal( 'action-list', custom_array );

  if ( callback ) {
    callback();
  }
};

custom_array.deleteObject = function ( object, callback ) {
  var
    i,
    find_flag = false,
    index;

  // local idで一致しているものを探す
  for ( i = 0; i < custom_array.length; i += 1  ) {
    if ( custom_array[i]._local_id === object._local_id ) {
      index = i;
      find_flag = true;
    }
  }

  if ( find_flag ) {
    custom_array.splice( index, 1 );
  }

  // オブジェクトをlocalStorageに保存する。
  createObjectLocal( 'action-list', custom_array );

  if ( callback ) {
    callback();
  }
};

const readObjectArray = function () {
  return custom_array;
};

export const array = function () {
  var
    work_object = {},
    action_object,
    property;

  // custom_arrayの初期化
  // createObjectArrayなどのメソッドも削除されるため
  // custom_array = []; は使わない
  custom_array.length = 0;

  // custom_arrayの生成/開始 ----------------------------
  // localStorageからプロパティ名action-listの値を読み込む
  let work_list = readObjectLocal('action-list');
  if (work_list) {
    for (let i = 0; i < work_list.length; i += 1 ) {
      // work_objectを初期化する
      work_object = {};
      // action_list[i]はaction object
      // propertyはプロパティ
      for (property in work_list[i]) {
        if ( typeof work_list[i][property] === 'string' ) {
          work_object[property] = work_list[i][property];
        }
      }

      action_object = pal.schema.makeAction( work_object );

      // リストに追加する
      custom_array.push( action_object );
    }
  }

  // custom_arrayの生成/終了 ----------------------------
  return false;
};
