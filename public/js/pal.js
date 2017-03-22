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

pal = (function ( ){
  'use strict';
  var initModule = function ( $container ) {
    // spa.data.initModule();
    // spa.model.initModule();

    if ( pal.shell && $container ) {
      pal.shell.initModule( $container );
    }
  };

  return { initModule : initModule };

}());
