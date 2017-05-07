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
  path = require( 'path' ),
  crud = require( './crud' ),
  configRoutes;

//------ モジュールスコープ変数終了 -----------

//------ パブリックメソッド開始 ---------------
configRoutes = function ( app, server ) {

  app.get('/', function( request, response ) {
    var
      options = { root      : path.join( __dirname, '../public' ),
                  dotfiles  : 'deny',
                  headers   : { 'x-timestamp': Date.now(), 'x-sent': true }
      };

    console.log( path.join( __dirname, '../public' ) );

    response.sendFile(
      'pal.html',
      options,
      function ( error ) {
        if ( error ) {
          console.log( error );
          response.status( error.status ).end();
        }
        else {
          console.log( 'Send:', 'pal.html' );
        }
      }
    );

  });

  app.all(
    '/:object/*?',
    function( request, response, next ) {
      response.contentType( 'json' );
      next();
    }
  );

  app.post(
    '/session/create',
    function( request, response ) {
      var
        email = request.body.email,
        password = request.body.password,
        find_map = { 'email'  : request.body.email };

      // 開発用に全てのリクエストに200を返す
      request.session.user = { email: email };
      response.status( 200 );
      response.end();

      // console.log ( find_map );
      // crud.read(
      //   'user',
      //   find_map,
      //   {},
      //   function( map_list ) {
      //     // console.log( map_list );
      //     if ( map_list.length !== 0 ) {
      //       // request.session.user = { email  : email };
      //       response.send( map_list );
      //     }
      //     else {
      //       // status Unauthorizedを返す
      //       response.status( 401 );
      //       response.end();
      //     }
      //   }
      // );
    }
  );

};

module.exports = { configRoutes: configRoutes };
