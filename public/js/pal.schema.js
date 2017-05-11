/*
 * pal.top.js
 * TOPページを表示する機能
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
    configMap = {
      settable_map  : { color_name: true },
      color_name    : 'blue'
    },
    counter = 0,
    stateMap = { $container : null },
    jqueryMap = {},
    onClickNew, onClickCancel, onClickCreate,
    setJqueryMap, configModule, initModule,
    objectCreate,
    extendObject,
    sayHello, sayText, makeMammal,
    catPrototype, makeCat, garfieldCat;
  
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

  // 継承を設定するユーティリティ関数
  // Object.create()を継承するための特定のブラウザに依存しないメソッド
  // 新しいjsエンジン(v1.8.5+)はネイティブにサポートする
  objectCreate = function ( arg ) {
    if ( ! arg ) {
      return {};
    }
    function obj() { return undefined; }
    obj.prototype = arg;
    return new obj();
  };
  
  Object.create = Object.create || objectCreate;
  
  // オブジェクトを拡張するためのユーティリティ関数
  extendObject = function ( orig_obj, ext_obj ) {
    var key_name;
  
    for ( key_name in ext_obj ) {
      if ( ext_obj.hasOwnProperty( key_name ) ) {
        orig_obj[ key_name ] = ext_obj[ key_name ];
      }
    }
  };
  
  // オブジェクトメソッド
  sayHello = function () {
    console.log( this.hello_text + ' says ' + this.name );
  };
  
  sayText = function ( text ) {
    console.warn( this.name + ' says ' + text );
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
  
  // catインスタンス
  garfieldCat = makeCat({
    name        : 'Garfield',
    weight_lbs  : 8.6
  });
  
  // catインスタンス呼び出し
  garfieldCat.say_hello();
  garfieldCat.say_text( 'Purr...' );

  //--------------------- ユーティリティメソッド終了 -----------------

  //--------------------- DOMメソッド開始 ----------------------------
  // DOMメソッド/setJqueryMap/開始
  setJqueryMap = function () {
    var $container = stateMap.$container;

    jqueryMap = { $container  : $container };
  };
  // DOMメソッド/setJqueryMap/終了
  //--------------------- DOMメソッド終了 ----------------------------

  // --------------------- イベントハンドラ開始 ----------------------
  // 例: onClickButton = function ( event ) {};
  onClickNew = function () {
    console.log( 'newがクリックされました' );
    jqueryMap.$form.show();
    jqueryMap.$new.prop( "disabled", true );
  };
  onClickCancel = function () {
    console.log( 'cancelがクリックされました' );
    jqueryMap.$form.hide();
    jqueryMap.$new.prop( "disabled", false );
  };
  onClickCreate = function () {
    console.log( 'createがクリックされました' );
    counter = counter + 1;
    setTimeout(
      function () {
        jqueryMap.$form.hide();
        jqueryMap.$new.prop( "disabled", false );
        jqueryMap.$target.prepend( '<li>add data ' + counter + '</li>' );
      },
    1000);
  };
  // --------------------- イベントハンドラ終了 ----------------------

  // --------------------- パブリックメソッド開始 --------------------
  // パブリックメソッド/configModule/開始
  // 目的: 許可されたキーの構成を調整する
  // 引数: 設定可能なキーバリューマップ
  //  * color_name  - 使用する色
  // 設定:
  //  * configMap.settable_map 許可されたキーを宣言する
  // 戻り値: true
  // 例外発行: なし
  //
  configModule = function ( input_map ) {
    pal.butil.setConfigMap({
      input_map     : input_map,
      settable_map  : configMap.settable_map,
      config_map    : configMap
    });
    return true;
  };
  // パブリックメソッド/configModule/終了

  // パブリックメソッド/initModule/開始
  // 目的: モジュールを初期化する
  // 引数:
  //  * $container この機能が使うjQuery要素
  // 戻り値: true
  // 例外発行: なし
  //
  initModule = function ( $container ) {
    var top_page  = pal.util_b.getTplContent( 'list-page' );

    stateMap.$container = $container;
    setJqueryMap();

    jqueryMap.$container.html( top_page );

    jqueryMap.$new    = $container.find( '.pal-list-new' );
    jqueryMap.$form   = $container.find( '.pal-list-new-form' );
    jqueryMap.$cancel = $container.find( '.pal-list-cancel' );
    jqueryMap.$create = $container.find( '.pal-list-create' );
    jqueryMap.$status = $container.find( '#status' );
    jqueryMap.$target = $container.find( '#target' );

    // 最初にデータの件数を取得して表示する。
    jqueryMap.$status.text( 'データ件数は0件です。' );

    jqueryMap.$new.click( onClickNew );
    jqueryMap.$cancel.click( onClickCancel );
    jqueryMap.$create.click( onClickCreate );

    return true;
  };
  // パブリックメソッド/initModule/終了

  // パブリックメソッドを返す
  return {
    configModule  : configModule,
    initModule    : initModule
  };
  // --------------------- パブリックメソッド終了 --------------------
}());
