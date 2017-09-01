/*
 * crud.js - CRUD db機能を提供するモジュール
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
  loadSchema, checkSchema, // clearIsOnline,
  checkType,  constructObj, readObj,
  updateObj,  destroyObj,
  // MongoDBコネクションを取り込む
  MongoClient = require( 'mongodb' ).MongoClient,
  makeMongoId = require( 'mongodb' ).ObjectID,
  url         = "mongodb://localhost:27017/pal",
  fsHandle    = require( 'fs' ),
  JSV         = require( 'JSV' ).JSV,

  // URL(localhost)とポートを渡して、MongoDBサーバ接続オブジェクトを
  // 設定する
  // mongoServer = new mongodb.Server(
  //   'localhost',
  //   '27017'
  // ),
  // サーバ接続オブジェクトと一連のオブションを渡して、MongoDBデータベース
  // ハンドルを作成する。1.3.6のドライバでは、safe設定が非推奨になった。
  // { w : 1 }を設定するとMongoDBの単独サーバで同様の結果になる
  db,
  // dbHandle    = new mongodb.Db(
  //   'pal', mongoServer, { safe  : true }
  // ),
  validator   = JSV.createEnvironment(),

  objTypeMap  = {
    'user'    : {},
    'action'  : {}
  };

// --------------------- モジュールスコープ変数終了 ---------------

// --------------------- ユーティリティメソッド開始 ---------------
loadSchema = function ( schema_name, schema_path ) {
  // fs.readFile(path[,options],callback)
  fsHandle.readFile( schema_path, 'utf8', function ( err, data ) {

    if ( err ) {
      throw err;
    }

    objTypeMap[ schema_name ] = JSON.parse( data );

  });
};

checkSchema = function ( obj_type, obj_map, callback ) {
  var
    schema_map  = objTypeMap[ obj_type ],
    report_map  = validator.validate( obj_map, schema_map );

  callback( report_map.errors );
};
// --------------------- ユーティリティメソッド終了 ---------------

// --------------------- パブリックメソッド開始 -------------------
// オブジェクト型がこのモジュールでサポートされているかどうかを
// チェックするメソッドを追加する。
checkType     = function ( obj_type ) {
  if ( ! objTypeMap[ obj_type ] ) {
    return ({ error_msg : 'Object type "' + obj_type
      + '" is not supported.'
    });
  }
  return null;
};

constructObj  = function ( obj_type, obj_map, callback ) {
  var type_check_map  = checkType( obj_type );

  if ( type_check_map ) {
    callback( type_check_map );
    return;
  }

  checkSchema(
    obj_type, obj_map,
    function ( error_list ) {
      if ( error_list.length === 0 ) {

        db.collection( "action" ).insertOne( obj_map, function ( err, res ) {

          if ( err ) {
            throw err;
          }

          callback( res );
        });

      }
      else {
        callback({
          error_msg   : 'Input document not valid',
          error_list  : error_list
        });
      }
    }
  );
};

readObj = function ( obj_type, callback ) {
  var type_check_map  = checkType( obj_type );

  if ( type_check_map ) {
    callback( type_check_map );
    return;
  }

  db.collection( "action" ).find({}).toArray(
    function( err, result ) {
      console.log( 'find結果:' );
      console.log( result );
      if ( err ) {
        throw err;
      }
      callback( result );
    }
  );

  // db.collection(
  //   obj_type,
  //   function ( outer_error, collection ) {
  //     if ( outer_error ) {
  //       throw outer_error;
  //     }

      // function ( err, res ) {
      //   if ( err ) {
      //     throw err;
      //   }
      //   callback( res );
      // });

      // collection.find( find_map, fields_map ).toArray(
      //   function ( inner_error, result_map ) {
      //     if ( inner_error ) {
      //       throw inner_error;
      //     }

      //     callback( result_map );
      //   }
      // );

    // }
  // );

};

updateObj = function ( obj_type, object, options, callback ) {
  var
    type_check_map  = checkType( obj_type ),
    find_map = { _id: makeMongoId( object._id ) };

  console.log( object );

  if ( type_check_map ) {
    callback( type_check_map );
    return;
  }

  checkSchema(
    obj_type, object,
    function ( error_list ) {
      if ( error_list.length === 0 ) {

        // MongoIdに変換する
        object._id = makeMongoId( object._id );

        console.log( options );

        db.collection( "action" ).findOneAndReplace( find_map, object, options, function ( err, res ) {

          if ( err ) {
            throw err;
          }

          callback( res );
        });

      }
      else {
        callback({
          error_msg   : 'Input document not valid',
          error_list  : error_list
        });
      }

    }
  );
};

destroyObj    = function ( obj_type, object, callback ) {
  var
    type_check_map  = checkType( obj_type ),
    find_map = { _id: makeMongoId( object._id ) };

  if ( type_check_map ) {
    callback( type_check_map );
    return;
  }

  db.collection( "action" ).deleteOne( find_map, function ( err, res ) {
    if ( err ) {
      throw err;
    }

    callback( res );
  });

};

module.exports = {
  // makeMongoId : mongodb.ObjectID,
  checkType   : checkType,
  construct   : constructObj,
  read        : readObj,
  update      : updateObj,
  destroy     : destroyObj
};
// --------------------- パブリックメソッド終了 -------------------

// --------------------- モジュール初期化開始 -------------------
// データベース接続を開く。接続が完了したときに実行するコールバック
// 関数を追加する。
MongoClient.connect( url, function( err, database ) {
  if ( err ) {
    throw err;
  }

  db = database;
  console.log( '** Connected to MongoDb **' );
});
// dbHandle.open( function () {
//   console.log( '** Connected to MongoDb **' );
//   // clearIsOnline();
// });

// スキーマをメモリ(objTypeMap)にロードする
(function() {
  var schema_name, schema_path;

  for ( schema_name in objTypeMap ) {
    if ( objTypeMap.hasOwnProperty( schema_name ) ) {
      schema_path = __dirname + '/' + schema_name + '.json';
      loadSchema( schema_name, schema_path );
    }
  }
}());
// --------------------- モジュール初期化終了 -------------------
