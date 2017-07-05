/*
 * pal.array.js
 * オブジェクトを格納するリストのモジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : true,
  white   : true
*/
/*global $, pal */

pal.array = (function () {
  'use strict';
  var
    initModule,
    custom_array,
    readObject,
    readObjectArray;
    // createObject,
    // readObject,
    // updateObject,
    // deleteObject;

  custom_array = [];

  custom_array.createObject = function ( object, callback ) {

    custom_array.push( object );

    // オブジェクトをlocalStorageに保存する。
    pal.util_b.createObjectLocal( 'action-list', custom_array );

    callback();
  };

  readObject = function ( map ) {

    console.log( map );

    return custom_array;
  };

  custom_array.updateObject = function ( object, callback ) {
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
      custom_array.splice( index, 1, object );
    }

    // オブジェクトをlocalStorageに保存する。
    pal.util_b.createObjectLocal( 'action-list', custom_array );

    callback();
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
    pal.util_b.createObjectLocal( 'action-list', custom_array );

    callback();
  };

  readObjectArray = function () {
    return custom_array;
  };

  initModule = function () {
    var
      work_list,
      work_object = {},
      action_object,
      i,
      property;

    // custom_arrayの生成/開始 ----------------------------
    // localStorageからプロパティ名action-listの値を読み込む
    work_list = pal.util_b.readObjectLocal( 'action-list' );

    if ( work_list ) {
      for ( i = 0; i < work_list.length; i += 1 ) {
        // action_list[i]はaction object
        // propertyはプロパティ
        for ( property in work_list[i] ) {

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

  return {
    initModule      : initModule,
    readObject      : readObject,
    readObjectArray : readObjectArray
    // createObject  : createObject,
    // readObject    : readObject,
    // updateObject  : updateObject,
    // deleteObject  : deleteObject
  }; 
}());
