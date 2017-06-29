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

    // io設定開始
    io
      .of( '/list' )
      .on( 'connection', function ( socket ) {

        // /createobject/メッセージハンドラ開始
        // 概要: actionオブジェクトのリストを返す
        // 引数: 
        // 動作:
        //
        socket.on( 'createobject', function () {
          console.log( 'createobjectが呼ばれました' );
        });
        // /createobject/メッセージハンドラ終了

        // /readobject/メッセージハンドラ開始
        // 概要: actionオブジェクトのリストを返す
        // 引数: 
        // 動作:
        //
        socket.on( 'readobject', function ( action_map ) {
          console.log( 'readobjectが呼ばれました' );
        });
        // /readobject/メッセージハンドラ終了

        // /updateobject/メッセージハンドラ開始
        // 概要: actionオブジェクトのリストを返す
        // 引数: 
        // 動作:
        //
        socket.on( 'updateobject', function () {
          console.log( 'updateobjectが呼ばれました' );
        });
        // /updateobject/メッセージハンドラ終了

        // /deleteobject/メッセージハンドラ開始
        // 概要: actionオブジェクトのリストを返す
        // 引数: 
        // 動作:
        //
        socket.on( 'deleteobject', function () {
          console.log( 'deleteobjectが呼ばれました' );
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
