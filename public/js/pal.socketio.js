/*
 * pal.socketio.js
 * socket.ioモジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : true,
  white   : true
*/
/*global io, pal */

pal.socketio = (function () {
  'use strict';
  var
    stateMap = { sio  : null },
    makeSio, getSio, initModule,
    createObject,
    readObject,
    updateObject,
    deleteObject,
    getRemoteId,
    readObjectList;

  makeSio = function ( namespace ) {
    var socket = io.connect(  namespace );

    return {
      emit  : function ( event_name, data ) {
        socket.emit( event_name, data );
      },
      on    : function ( event_name, callback ) {
        socket.on( event_name, function () {
          callback( arguments );
        });
      }
    };
  };

  getSio = function ( namespace ) {
    if ( ! stateMap.sio ) { stateMap.sio = makeSio( namespace ); }
    return stateMap.sio;
  };

  // メソッド/createObject/開始
  createObject = function ( object ) {
    stateMap.sio.emit( 'createobject', JSON.stringify( object ) );
  };
  // メソッド/createObject/終了

  // メソッド/readObject/開始
  readObject = function ( object ) {
    stateMap.sio.emit( 'readobject', JSON.stringify( object ) );
  };
  // メソッド/readObject/終了

  // メソッド/updateObject/開始
  updateObject = function ( object ) {
    stateMap.sio.emit( 'updateobject', JSON.stringify( object ) );
  };
  // メソッド/updateObject/終了

  // メソッド/deleteObject/開始
  deleteObject = function ( object ) {
    stateMap.sio.emit( 'deleteobject', JSON.stringify( object ) );
  };
  // メソッド/deleteObject/終了

  // メソッド/getObjectRemoteId/開始
  getRemoteId = function ( key, value, callback ) {
    console.log( key, value );

    stateMap.sio.on( 'remoteidget', callback );
    stateMap.sio.emit( 'getremoteid', JSON.stringify( { key: value } ) );

  };
  // メソッド/getObjectRemoteId/終了

  // メソッド/readObjectList/開始
  readObjectList = function () {
    stateMap.sio.emit( 'readobject', JSON.stringify( {} ) );
  };
  // メソッド/readObjectList/終了

  initModule = function ( namespace, event_map ) {
    var
      key;

    getSio( namespace );

    // メッセージを受信したあとのコールバックを登録する
    for ( key in event_map ) {
      if ( Object.prototype.hasOwnProperty.call(event_map, key) ) {
        stateMap.sio.on( key, event_map[ key ] );
      }
    }

  };

  return {
    initModule      : initModule,
    createObject    : createObject,
    readObject      : readObject,
    updateObject    : updateObject,
    deleteObject    : deleteObject,
    getRemoteId     : getRemoteId,
    readObjectList  : readObjectList
  }; 
}());
