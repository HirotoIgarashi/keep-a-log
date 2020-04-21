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
/*global pal:true */

// pal = (function () {
pal = (() => {
  'use strict';

  const initModule = (id) => {
    let content = document.getElementById(id);

    if ( pal.bom && content) {
      pal.bom.initModule(content);
    }

  };

  return { initModule : initModule };
})();
