/*
 * socketio.js
 * socket.ioモジュール
*/

'use strict';
var
  stateMap = { sio  : null },
  makeSio, getSio,
  createObject,
  readObject,
  updateObject,
  deleteObject,
  getRemoteId;

makeSio = function (namespace) {
  var socket = io.connect(namespace);

  return {
    emit  : function (event_name, data) {
      socket.emit( event_name, data );
    },
    on    : function (event_name, callback) {
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
export const readObjectList = function () {
  stateMap.sio.emit( 'readobject', JSON.stringify( {} ) );
};
// メソッド/readObjectList/終了

export const socketio = (namespace, event_map) => {
  getSio(namespace);
  // メッセージを受信したあとのコールバックを登録する
  for (let key in event_map) {
    if (Object.prototype.hasOwnProperty.call(event_map, key)) {
      stateMap.sio.on(key, event_map[key]);
    }
  }
};
