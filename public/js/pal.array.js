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
    readObjectList;
    // createObject,
    // readObject,
    // updateObject,
    // deleteObject;

  custom_array = [];

  custom_array.createObject = function ( object, callback ) {
    console.log( object );
    callback();
  };

  readObject = function ( map ) {
    console.log( map );
    return custom_array;
  };

  custom_array.updateObject = function ( object, callback ) {
    console.log( object );
    callback();
  };

  custom_array.deleteObject = function ( object, callback ) {
    console.log( object );
    callback();
  };

  readObjectList = function () {
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
    readObjectList  : readObjectList
    // createObject  : createObject,
    // readObject    : readObject,
    // updateObject  : updateObject,
    // deleteObject  : deleteObject
  }; 
}());
