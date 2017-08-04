/*
 * action.js - actionオブジェクトのメッセージングを提供するモジュール
*/

/*jslint          node    : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/
/*global */

// --------------------- モジュールスコープ変数開始 ---------------
'use strict';
var
  actionObject,
  socket  = require( 'socket.io'  ),
  crud    = require( './crud'     ),

  makeMongoId = crud.makeMongoId;
// --------------------- モジュールスコープ変数終了 ---------------

// --------------------- ユーティリティメソッド開始 ---------------

// --------------------- ユーティリティメソッド終了 ---------------

// --------------------- パブリックメソッド開始 -------------------
actionObject = {

  connect : function ( server ) {
    var io  = socket.listen( server );

    console.log( 'connect処理を開始します' );

    // io設定開始
    io
      // namespaceの設定
      .of( '/list' )
      .on( 'connection', function ( socket ) {

        // /createobject/メッセージハンドラ開始
        // 概要: actionオブジェクトのリストを返す
        // 引数: 
        // 動作:
        //
        socket.on( 'createobject', function ( object ) {
          var
            parse_data,
            send_data = {};

          console.log( 'createobjectが呼ばれました' );

          parse_data = JSON.parse( object );

          crud.construct(
            'action',
            parse_data,
            function ( result_map ) {
              send_data.ops = result_map.ops[0];
              send_data.result = result_map.result;

              socket.emit( 'objectcreate', send_data );
              socket.broadcast.emit( 'objectcreate', send_data );
            }
          );

        });
        // /createobject/メッセージハンドラ終了

        // /readobject/メッセージハンドラ開始
        // 概要: actionオブジェクトのリストを返す
        // 引数: 
        // 動作:
        //
        socket.on( 'readobject', function ( action_map ) {
          console.log( 'readobjectが呼ばれました' );
          crud.read(
            'action',
            function ( result_map ) {
              socket.emit( 'objectread', result_map );
            }
          );
        });
        // /readobject/メッセージハンドラ終了

        // /updateobject/メッセージハンドラ開始
        // 概要: actionオブジェクトのリストを返す
        // 引数: 
        // 動作:
        //
        socket.on( 'updateobject', function ( object ) {
          var
            parse_data,
            send_data = {},
            options;

          console.log( 'updateobjectが呼ばれました' );

          parse_data = JSON.parse( object );

          console.log( parse_data );
          // 変更後のデータを取得するためには
          // MongoDBのマニュアルにはreturnNewDocumentで指定すると
          // 記述されているが正しくはreturnOriginalをfalseにする
          // options = { upsert: true, returnNewDocument : true };
          options = { upsert: true, returnOriginal : false };

          crud.update(
            'action',
            parse_data,
            options,
            function ( result_map ) {
              console.log( result_map );
              send_data.lastErrorObject = result_map.lastErrorObject;
              send_data.value = result_map.value;
              send_data.ok = result_map.ok;

              socket.emit( 'objectupdate', send_data );
              socket.broadcast.emit( 'objectupdate', send_data );
              // if ( result_map.result.n === 1 ) {
              //   socket.emit( 'objectupdate', parse_data );
              //   socket.broadcast.emit( 'objectupdate', parse_data );
              // }
              // else {
              //   socket.emit( 'objectupdate', result_map );
              //   socket.broadcast.emit( 'objectupdate', result_map );
              // }
            }
          );

        });
        // /updateobject/メッセージハンドラ終了

        // /deleteobject/メッセージハンドラ開始
        // 概要: actionオブジェクトのリストを返す
        // 引数: 
        // 動作:
        //
        socket.on( 'deleteobject', function ( object ) {
          var
            parse_data,
            send_data = {};

          console.log( 'deleteobjectが呼ばれました' );

          parse_data = JSON.parse( object );

          crud.destroy(
            'action',
            parse_data,
            function ( result_map ) {
              send_data.ops = parse_data;
              send_data.result = result_map.result;

              socket.emit( 'objectdelete', send_data );
              socket.broadcast.emit( 'objectdelete', send_data );
            }
          );

        });
        // /deleteobject/メッセージハンドラ終了

      }
    );
    // io設定終了
    return io;
  }

};

module.exports  = actionObject;
// --------------------- パブリックメソッド終了 -------------------

// --------------------- モジュール初期化開始 -------------------

// --------------------- モジュール初期化終了 -------------------
