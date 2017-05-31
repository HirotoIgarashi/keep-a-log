/*
 * pal.schema.js
 * スキーマを生成して返す機能
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true
*/

/*global $, pal */

pal.schema = (function () {
  'use strict';
  //--------------------- モジュールスコープ変数開始 -----------------
  var
    configModule, initModule,
    addChange,
    objectCreate,
    extendObject,
    sayHello,sayText,
    logName,
    makeThing,
    actionPrototype, makeAction,
    makeMammal,
    catPrototype, makeCat;
  
  //--------------------- モジュールスコープ変数終了 -----------------

  //--------------------- ユーティリティメソッド開始 -----------------
  // ユーティリティメソッド/example_method/開始
  // 目的:
  // 必須引数:
  // オプション引数:
  // 設定:
  // 戻り値:
  // 例外発行: なし
  // example_method = function () {
  //   var example;
  //   return example;
  // };
  // ユーティリティメソッド/example_method/終了

  // ユーティリティメソッド/addChange/開始
  addChange = function ( ob ) {
    var i;

    ob.change = function ( callback ) {
      if ( callback ) {
        if ( !this._change ) {
          this._change = [];
        }
        this._change.push( callback );
      }
      else {
        if ( !this._change ) {
          return;
        }
        for ( i = 0; i < this._change.length; i++ ) {
          this._change[i].apply( this );
        }
      }
    };
  };
  // ユーティリティメソッド/addChange/終了

  // ユーティリティメソッド/objectCreate/開始
  // 目的:  継承を設定するユーティリティ関数
  //        Object.create()を継承するためのブラウザに依存しないメソッド
  //        新しいjsエンジン(v1.8.5+)はネイティブにサポートする
  // 必須引数:
  // オプション引数:
  //  arg: オブジェクトの定義
  // 設定:
  // 戻り値: オブジェクト
  // 例外発行: なし
  objectCreate = function ( arg ) {
    if ( ! arg ) {
      return {};
    }
    function obj() { return undefined; }
    obj.prototype = arg;
    return new obj();
  };
  // ユーティリティメソッド/objectCreate/終了
  
  Object.create = Object.create || objectCreate;
  
  // 目的: オブジェクトを拡張するためのユーティリティ関数
  // 必須引数:
  // オプション引数:
  //  * orig_obj  : オリジナルのオブジェクト
  //  * ext_obj   : 拡張するオブジェクト
  // 設定:
  // 戻り値: なし
  // 例外発行: なし
  extendObject = function ( orig_obj, ext_obj ) {
    var key_name;
  
    for ( key_name in ext_obj ) {
      if ( ext_obj.hasOwnProperty( key_name ) ) {
        orig_obj[ key_name ] = ext_obj[ key_name ];
      }
    }
  };
  
  // オブジェクトメソッド
  logName = function () {
    console.log( 'name:' + this.name );
  };
  sayHello = function () {
    console.log( this.hello_text + ' says ' + this.name );
  };
  
  sayText = function ( text ) {
    console.warn( this.name + ' says ' + text );
  };
  
  // makeThingコンストラクタ
  makeThing = function( arg_map ) {
    var thing = {
      name            : '',
      alternate_name  : '',
      url             : '',
      image           : '',
      log_name        : logName
    };

    extendObject( thing, arg_map );

    return thing;
  };

  // makeThingコンストラクタを使ってactionプロトタイプを作成する
  actionPrototype = makeThing({
    start_time  : '',
    end_time    : '',
    location    : ''
  });

  // actionコンストラクタ
  makeAction = function ( arg_map ) {
    var action = Object.create( actionPrototype );

    extendObject( action, arg_map );
  
    // actionオブジェクトにchange関数を追加する
    addChange( action );

    return action;
  
  };
  // makeMammalコンストラクタ
  makeMammal = function( arg_map ) {
    var mammal = {
      is_warn_blooded : true,
      has_fur         : true,
      leg_count       : 4,
      has_live_birth  : true,
      hello_text      : 'grunt',
      name            : 'anonymous',
      say_hello       : sayHello,
      say_text        : sayText
    };
    extendObject( mammal, arg_map );
  
    return mammal;
  
  };
  
  // makeMammalコンストラクタを使ってcatプロトタイプを作成する
  catPrototype = makeMammal({
    has_whiskers  : true,
    hello_text    : 'meow'
  });
  
  // catコンストラクタ
  makeCat = function ( arg_map ) {
    var cat = Object.create( catPrototype );
    extendObject( cat, arg_map );
  
    return cat;
  
  };
  
  //--------------------- ユーティリティメソッド終了 -----------------
  //--------------------- DOMメソッド開始 ----------------------------
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- パブリックメソッド開始 --------------------
  // パブリックメソッド/configModule/開始
  // 目的: 許可されたキーの構成を調整する
  // 引数: 設定可能なキーバリューマップ
  //  * color_name  - 使用する色
  // 設定:
  // 戻り値: true
  // 例外発行: なし
  //
  configModule = function ( input_map ) {
    pal.butil.setConfigMap({
      input_map     : input_map
    });
    return true;
  };
  // パブリックメソッド/configModule/終了

  // パブリックメソッド/initModule/開始
  // 目的: モジュールを初期化する
  // 引数: なし
  // 戻り値: true
  // 例外発行: なし
  //
  initModule = function () {

    return true;

  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    configModule  : configModule,
    initModule    : initModule,
    makeCat       : makeCat,
    makeAction    : makeAction
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
