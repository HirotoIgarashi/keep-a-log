/*
 * routes.js
 * ルーティングを提供するモジュール
 */

/*jslint          node    : true, continue  : true,
  devel   : true, indent  : 2,    maxerr    : 50,
  newcap  : true, nomen   : true, plusplus  : true,
  regexp  : true, sloppy  : true, vars      : false,
  white   : true, unparam : true
*/

/*global */
//------ モジュールスコープ変数開始 -----------
'use strict';
var
  path    = require( 'path' ),
  fs      = require( 'fs' ),
  // crud    = require( './crud' ),
  action  = require( './action' ),
  configRoutes;

//------ モジュールスコープ変数終了 -----------

//------ パブリックメソッド開始 ---------------
configRoutes = function ( app, server ) {

  app.get('/markdown_image/:image_name', (request, response) => {
    var
      headers,
      file_path;

    file_path = 'markdown_image/' + request.params.image_name;
    console.log( file_path + 'が呼ばれました' );

    fs.exists( file_path, (exists) => {
      if (exists) {
        fs.readFile(file_path, (err, data) => {
          // ここでコンテンツ配信とエラーハンドリングを行う
          if (err) {
            // エラーハンドリング
            response.writeHead( 500 );
            response.end( 'Server Error!' );
            return;
          }
          headers = { 'Content-Type': 'image/png' };
          console.log( 'headers:' );
          console.log( headers );
          response.writeHead( 200, headers );
          response.end( data );
        });
        return;
      }
      response.status( 404 );
      response.end( 'コンテンツが見つかりません' );
    });


  });

  app.all( '/:object/*?', (request, response, next) => {
      response.contentType( 'json' );
      next();
    }
  );

  action.connect(server);

};

module.exports = { configRoutes: configRoutes };
