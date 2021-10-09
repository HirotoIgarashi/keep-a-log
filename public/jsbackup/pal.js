'use strict';
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

const pal = (() => {
  const initModule = (id) => {
    console.log(id);
    let content = document.getElementById(id);
    console.log(content);

    if ( pal.bom && content) {
      pal.bom.initModule(content);
    }

  };

  return { initModule : initModule };
})();
