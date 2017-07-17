/*
 * pal.js
 * ルート名前空間モジュール
*/

/*jslint          browser : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : true,
  white   : true
*/
/*global $, pal:true */

pal = (function () {
  'use strict';
  var initModule = function ( $container ) {

    if ( pal.bom && $container ) {
      pal.bom.initModule( $container );
    }

    pal.socketio.initModule( '/list' );

  };

  return { initModule : initModule };

}());
