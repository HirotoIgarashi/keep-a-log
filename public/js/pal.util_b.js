/*
 * pal.util_b.js
 * JavaScriptブラウザユーティリティ
 *
 * Michael S. Mikowskiがコンパイル
 * これはWebからひらめきを得て1998年から作成・更新を続けているルーチン。
 * MITライセンス
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : true,
  white   : true
*/
/*global $, pal, getComputedStyle, ActiveXObject */

pal.util_b = (function () {
  'use strict';
  //------------------ モジュールスコープ変数開始 ---------------------
  var
    configMap = {
      regex_encode_html   : /[&"'><]/g,
      regex_encode_noamp  : /["'><]/g,
      html_encode_map     : {
        '&' : '$#38',
        '"' : '$#34',
        "'" : '$#39',
        '>' : '$#62',
        '<' : '$#60',
      }
    },

    decodeHtml,
    encodeHtml,
    getEmSize,
    getXmlHttp, getTplContent;

  configMap.encode_noamp_map = $.extend(
    {}, configMap.encode_noamp_map
  );
  delete configMap.encode_noamp_map['&'];
  //------------------ モジュールスコープ変数終了 ---------------------

  //------------------ ユーティリティメソッド開始 ---------------------
  // decodeHtml開始
  // HTMLエンティティをブラウザに適した方法でデコードする
  // http://stackoverflow.com/questions/1912501/\
  //  unescape-html-entitiles-in-javascriptを参照
  //
  decodeHtml = function ( str ) {
    return $('<div/>').html(str || '').text();
  };
  // decodeHtml終了

  // encodeHtml開始
  // これはhtlエンティティのための単一パスエンコーダであり、
  // 任意の数の文字に対応する
  //
  encodeHtml = function ( input_arg_str, exclude_amp ) {
    var
      input_str = String( input_arg_str ),
      regex, lookup_map
      ;

    if ( exclude_amp ) {
      lookup_map = configMap.encode_noamp_map;
      regex = configMap.regex_encode_noamp;
    }
    else {
      lookup_map = configMap.html_encode_map;
      regex = configMap.regex_encode_html;
    }
    return input_str.replace(regex,
      // function ( match, name ) {
      // jslintがエラーとなるためnameを削除する。
      function ( match ) {
        return lookup_map[ match ] || '';
      }
    );
  };
  // encodeHtml終了

  // getEmSize開始
  // emのサイズをピクセルで返す
  //
  getEmSize = function ( elem ) {
    return Number(
      getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
    );
  };
  // getEmSize終了

  // getTplContent開始
  // 目的: テンプレートからコンテンツを取得して返す。
  // 必須引数: IDの値
  // オプション引数: なし
  // 設定:
  // 戻り値: 引数のIDの値のコンテンツ
  // 例外発行: なし
  getTplContent = function ( template_id ) {
    var tpl,
        content;

    tpl = document.getElementById( template_id );
    content = tpl.content.cloneNode( true );

    return content;
  };
  // getTplContent終了

  // getXmlHttp開始
  getXmlHttp = function () {
    var xmlhttp = null;

    if ( window.XMLHttpRequest ) {
      xmlhttp = new XMLHttpRequest();
    }
    else if ( window.ActiveXObject ) {
      xmlhttp = new ActiveXObject( "Miforsoft.XMLHTTP" );
    }

    return xmlhttp;

  };
  // getXmlHttp終了
  //------------------ ユーティリティメソッド終了 ---------------------

  //------------------ パブリックメソッド開始 -------------------------
  return {
    decodeHtml    : decodeHtml,
    encodeHtml    : encodeHtml,
    getEmSize     : getEmSize,
    getTplContent : getTplContent,
    getXmlHttp    : getXmlHttp
  };
  //------------------ パブリックメソッド終了 -------------------------
}());
