/*
 * schema.js
 * スキーマを生成して返す機能
*/

'use strict';

import { addChange } from "./utilDom.js";

//--------------------- モジュールスコープ変数開始 -----------------
var
  objectCreate,
  extendObject,
  makeFormElement,
  makeMicrodataElement,
  makeDetailElement,
  makeThing,
  actionPrototype,
  date_type_list = [ 'startTime', 'endTime' ],
  ja_trans = {
    name            : 'タイトル',
    alternate_name  : '別名',
    description     : '説明',
    image           : 'イメージ',
    startTime       : '開始日時',
    endTime         : '終了日時',
    location        : '場所'
  };
//--------------------- モジュールスコープ変数終了 -----------------

//--------------------- ユーティリティメソッド開始 -----------------
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

  function obj() {
    return undefined;
  }

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
    if ( Object.prototype.hasOwnProperty.call(ext_obj, key_name) ) {
      orig_obj[ key_name ] = ext_obj[ key_name ];
    }
  }

};

// オブジェクトメソッド
// makeFormElement/開始
// 目的: カスタムオブジェクトからform要素を生成する
//       thisはアクションオブジェクト
//
//       form_fragment
//        |- form_element
//          |- label_element
//          |- input_element
//
// 必須引数:
//  * event_listener  : input要素のイベントリスナー
// オプション引数: なし
// 設定:
// 戻り値:
//  * form_fragment  : 生成したHTML要素
// 例外発行: なし
//
makeFormElement = function ( event_listener ) {
  var
    prop_names,
    form_fragment,
    form_element,
    label_element,
    input_element,
    i;

  // プロパティの値を取得し、マップを生成する
  prop_names = Object.getOwnPropertyNames( Object.getPrototypeOf( this ) );

  // フラグメントのルートを生成
  form_fragment = document.createDocumentFragment();

  // form要素を追加
  form_element =  document.createElement( 'form' );
  form_element.setAttribute( 'class', 'pal-list-form' );

  // マップの値からlabel要素とinput要素を生成
  for ( i = 0; i < prop_names.length; i += 1 ) {

    // プロパティ値がfunctionだったら何もしない
    if ( typeof this[prop_names[i]] !== 'function' ) {
      // label要素を生成する
      label_element = document.createElement( 'label' );

      if ( ja_trans[ prop_names[i] ] ) {
        label_element.textContent = ja_trans[ prop_names[i] ] + ': ';
      }
      else {
        label_element.textContent = prop_names[i] + ': ';
      }

      label_element.setAttribute( 'class', 'pal-list-label' );

      // フォームにlabel要素を追加する
      form_element.appendChild( label_element );

      // input要素を生成する
      input_element = document.createElement( 'input' );
      input_element.setAttribute( 'name', prop_names[i] );
      input_element.setAttribute( 'class', 'pal-list-input' );

      // 値をセットする
      input_element.value = this[prop_names[i]];

      // プロバティの値のタイプがDateだったら'datetime-local'をセットする
      if ( date_type_list.indexOf( prop_names[i] ) >= 0 ) {
        input_element.setAttribute( 'type', 'datetime-local' );

      }
      else {
        input_element.setAttribute( 'type', 'text' );
      }

      // nameフィールドにイベントリスナーを追加する
      input_element.addEventListener( 'blur', event_listener, false );

      // フォームにinput要素を追加する
      form_element.appendChild( input_element );
    }
  }

  // フラグメントのルートに追加する
  form_fragment.appendChild( form_element );

  return form_fragment;
};
// makeFormElement/終了

// makeMicrodataElement/開始
// 目的: カスタムオブジェクトからHTML要素を生成する
//       thisはオブジェクト本体
// 必須引数: なし
// オプション引数: なし
// 設定:
// 戻り値:
//  * fragment  : 生成したHTML要素
// 例外発行: なし
makeMicrodataElement = function () {
  var
    i,
    prop_names,
    prop_element,
    list_wrapper,
    crud_wrapper,
    schema_wrapper,
    fragment;

  fragment = document.createDocumentFragment();

  // プロパティの値を取得し、リストを生成する
  prop_names = Object.getOwnPropertyNames( Object.getPrototypeOf( this ) );

  // listを入れるwrapperを生成する
  list_wrapper = document.createElement( 'div' );
  list_wrapper.setAttribute( 'class', 'g' );
  list_wrapper.setAttribute( 'data-local-id', this._local_id );
  list_wrapper.setAttribute( 'data-id', this._id );

  // crudを入れるwrappperを生成する
  crud_wrapper = document.createElement( 'div' );
  crud_wrapper.setAttribute( 'class', 'crud-wrapper' );

  // schemaを入れるwrapperを生成する
  schema_wrapper = document.createElement( 'div' );
  schema_wrapper.setAttribute( 'itemscope', '' );
  schema_wrapper.setAttribute( 'class', 'action-wrapper' );
  schema_wrapper.setAttribute( 'itemtype', 'http://schema.org/Action' );

  // プロパティの値をセットする
  for ( i = 0; i < prop_names.length; i += 1 ) {

    // プロパティ値がfunctionだったらスキップする
    if ( typeof this[prop_names[i]] !== 'function' ) {

      // プロパティが名前のときは改行する
      if ( prop_names[i] === 'name' ) {
        prop_element = document.createElement( 'div' );
      }
      else {
        prop_element = document.createElement( 'span' );
      }

      // itempropをセットする
      prop_element.setAttribute( 'itemprop', prop_names[i] );

      // startTimeやendTimeの場合の処理
      if ( this[ prop_names[i] ] !== '' && date_type_list.indexOf( prop_names[i] ) >= 0 ) {
        prop_element.setAttribute( 'content', this[ prop_names[i] ] );

        if ( ja_trans[ prop_names[i] ] ) {
          prop_element.textContent = ja_trans[ prop_names[ i ] ] + ': ' + this[ prop_names[i] ];
        }
        else {
          prop_element.textContent = prop_names[ i ] + ': ' + this[ prop_names[i] ];
        }

      }
      // startTimeやendTime以外の場合の処理
      else {
        prop_element.textContent = this[ prop_names[i] ];
      }

    }

    schema_wrapper.appendChild( prop_element );
  }

  list_wrapper.appendChild( crud_wrapper );
  list_wrapper.appendChild( schema_wrapper );

  fragment.appendChild( list_wrapper );

  return fragment;
};
// makeMicrodataElement/終了

// makeDetailElement/開始
makeDetailElement = function () {
  var
    fragment,
    prop_names,
    i,
    div_element,
    prop_element;

  fragment = document.createDocumentFragment();

  // 全体を入れるwrpperを生成する
  div_element = document.createElement( 'div' );
  div_element.setAttribute( 'class', 'detail-wrapper' );

  // プロパティの値を取得し、リストを生成する
  prop_names = Object.getOwnPropertyNames( Object.getPrototypeOf( this ) );
  for ( i = 0; i < prop_names.length; i += 1 ) {
    // プロパティ値がfunctionだったらスキップする
    if ( typeof this[prop_names[i]] !== 'function' ) {
      prop_element = document.createElement( 'div' );

      if ( ja_trans[ prop_names[i] ] ) {
        prop_element.textContent = ja_trans[ prop_names[ i ] ] + ': ' + this[ prop_names[i] ];
      }
      else {
        prop_element.textContent  = prop_names[ i ] + ': ' + this[ prop_names[i] ];
      }

      div_element.appendChild( prop_element );
    }
  }

  fragment.appendChild( div_element ) ;

  return fragment;
};
// makeDetailElement/終了

// makeThingコンストラクタ
makeThing = function( arg_map ) {
  var thing = {
    name                  : '',
    alternate_name        : '',
    description           : '',
    url                   : '',
    image                 : '',
    makeFormElement       : makeFormElement,
    makeMicrodataElement  : makeMicrodataElement,
    makeDetailElement     : makeDetailElement
  };

  extendObject( thing, arg_map );

  return thing;
};

// makeThingコンストラクタを使ってactionプロトタイプを作成する
actionPrototype = makeThing({
  startTime : '',
  endTime   : '',
  location  : ''
});

// actionコンストラクタ
export const makeAction = function ( arg_map ) {
  let action = Object.create( actionPrototype );

  extendObject( action, arg_map );

  // actionオブジェクトにchange関数を追加する
  addChange(action);

  return action;
};
//--------------------- ユーティリティメソッド終了 -----------------

//--------------------- DOMメソッド開始 ----------------------------
//--------------------- DOMメソッド終了 ----------------------------

// --------------------- イベントハンドラ開始 ----------------------
// 例: onClickButton = function ( event ) {};
// --------------------- イベントハンドラ終了 ----------------------

// パブリックメソッド/initModule/開始
// 目的: モジュールを初期化する
// 引数: なし
// 戻り値: true
// 例外発行: なし
//
export const initModule = function () {

  return true;

};
// パブリックメソッド/initModule/終了
