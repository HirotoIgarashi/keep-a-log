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
/*global $, io, pal */

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
  createObject = function ( object, callback ) {

    console.log( object );

    stateMap.sio.on( 'objectcreate', callback );
    stateMap.sio.emit( 'createobject', JSON.stringify( object ) );

  };
  // メソッド/createObject/終了

  // メソッド/readObject/開始
  readObject = function ( remote_id, callback ) {
    console.log( remote_id );

    stateMap.sio.on( 'objectread', callback );
    stateMap.sio.emit( 'readobject', JSON.stringify( remote_id ) );

  };
  // メソッド/readObject/終了

  // メソッド/updateObject/開始
  updateObject = function ( object, callback ) {

    stateMap.sio.on( 'objectupdate', callback );
    stateMap.sio.emit( 'updateobject', JSON.stringify( object ) );

  };
  // メソッド/updateObject/終了

  // メソッド/deleteObject/開始
  deleteObject = function ( remote_id, callback ) {
    console.log( remote_id );

    stateMap.sio.on( 'objectdelete', callback );
    stateMap.sio.emit( 'deleteobject', JSON.stringify( remote_id ) );

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
  readObjectList = function ( callback ) {

    console.log( 'readObjectListが呼ばれました' );

    stateMap.sio.on( 'objectread', callback );
    stateMap.sio.emit( 'readobject', JSON.stringify( { test : 'test' } ) );

  };
  // メソッド/readObjectList/終了

  initModule = function ( namespace ) {

    getSio( namespace );

    return false;
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
